import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { illnessToSpecialty } from "@/lib/specialtyMap";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Conversation from "@/models/Conversation.model"; // needed for daily tracking
import { isSameDay } from "date-fns";
import { checkGuestLimit } from "@/lib/guestLimit";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ⚡ Daily message cap
const MESSAGE_LIMIT = 3;


// ---------------- Doctor Matching ----------------
async function matchDoctors(symptoms: string[]) {
  const specialtiesNeeded = new Set<string>();

  symptoms.forEach((symptom) => {
    const normalized = symptom.toLowerCase().trim();

    if (illnessToSpecialty[normalized]) {
      illnessToSpecialty[normalized].forEach((spec) =>
        specialtiesNeeded.add(spec)
      );
    }

    Object.keys(illnessToSpecialty).forEach((key) => {
      if (normalized.includes(key) || key.includes(normalized)) {
        illnessToSpecialty[key].forEach((spec) => specialtiesNeeded.add(spec));
      }
    });
  });

  if (specialtiesNeeded.size === 0)
    specialtiesNeeded.add("General Practitioner");

  await connectDB();
  const doctors = await User.find({
    role: "DOCTOR",
    specialization: { $in: Array.from(specialtiesNeeded) },
  })
    .select("name specialization experience")
    .limit(10);

  return doctors
    .map((doc) => ({
      _id: doc._id.toString(),
      name: doc.name,
      specialty: doc.specialization,
      experience: doc.experience || "5 years",
    }))
    .slice(0, 3);
}

// ---------------- Symptom Extractor ----------------
function extractSymptoms(message: string): string[] {
  const symptoms: string[] = [];
  const lower = message.toLowerCase();
  const keywords = [
    "headache",
    "dizziness",
    "fever",
    "cough",
    "pain",
    "nausea",
    "fatigue",
    "weakness",
    "rash",
    "anxiety",
    "depression",
    "stress",
    "breathing",
    "chest",
    "stomach",
    "diarrhea",
    "vomiting",
    "dizzy",
    "migraine",
    "vertigo",
    "palpitations",
    "insomnia",
    "swelling",
    "purging",
  ];
  keywords.forEach((kw) => {
    if (lower.includes(kw)) symptoms.push(kw);
  });
  return symptoms;
}

// ---------------- Main POST Handler ----------------
export async function POST(req: Request) {
  try {
    const { message, isAuthenticated, conversationId, patientId } =
      await req.json();

    const ip = (req.headers.get("x-forwarded-for") || "unknown")
      .split(",")[0]
      .trim();

    // 🌐 Guest Mode: no DB, just answer
    if (!isAuthenticated) {
      const limit = checkGuestLimit(ip);

      if (!limit.allowed) {
        return NextResponse.json(
          {
            text: `⚠️ You’ve reached the free daily limit of messages. Please sign in for unlimited access.`,
          },
          { status: 200 }
        );
      }
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
You are a medical assistant AI. Your goal is to provide concise, easy-to-read medical guidance.
Analyze the user's message: "${message}".

Start with a brief, empathetic sentence.
Then, respond with the following sections using bullet points and short sentences:

- **Possible Causes**: Briefly list 3-5 common and possible causes.
- **Recommended Actions**: Provide 3-4 simple, actionable steps the user can take.
- **When to See a Doctor**: List 2-3 key red flags that warrant a professional consultation.
- **Specialist Needed**: Clearly state the type of doctor to consult.

Then, at the very end, output a JSON object: {"symptoms": ["symptom1", "symptom2"]}
Finally, include the disclaimer: > ⚠️ **Disclaimer:** This is for informational purposes only.
`;

      const result = await model.generateContent(prompt);
      let responseText = result.response.text();

      // Extract symptoms like before
      let extractedSymptoms: string[] = [];
      const jsonMatch = responseText.match(
        /\{[\s\S]*"symptoms":\s*\[[\s\S]*\][\s\S]*\}/
      );

      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          extractedSymptoms = parsed.symptoms || [];
          responseText = responseText.replace(jsonMatch[0], "").trim();
        } catch (e) {
          console.error("Failed to parse symptoms JSON:", e);
        }
      }

      if (extractedSymptoms.length === 0) {
        extractedSymptoms = extractSymptoms(message);
      }

      return NextResponse.json({
        text: responseText,
        doctors: [], // no doctor match for guests
        symptoms: extractedSymptoms,
        expectedDoctors: false,
      });
    }

    // 🛑 Require auth & conversation to enforce limits
    if (!isAuthenticated || !conversationId || !patientId) {
      return NextResponse.json(
        { error: "Authentication and conversation ID are required." },
        { status: 401 }
      );
    }

    await connectDB();

    // 1. Get conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found." },
        { status: 404 }
      );
    }

    // 2. Reset daily counter if new day
    const now = new Date();

    if (
      !conversation.lastMessageDate ||
      !isSameDay(conversation.lastMessageDate, now)
    ) {
      conversation.dailyMessageCount = 0;
    }



    // 3. Enforce limit
    if (conversation.dailyMessageCount >= MESSAGE_LIMIT) {
      return NextResponse.json(
        {
          text: "⚠️ You’ve reached your daily free message limit. Try again tomorrow",
        },
        { status: 200 }
      );
    }

    // ✅ Update usage
    conversation.dailyMessageCount += 1;
    conversation.lastMessageDate = now;
    await conversation.save();

    // 4. Generate AI response
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are a medical assistant AI. Your goal is to provide concise, easy-to-read medical guidance.
Analyze the user's message: "${message}".

Start with a brief, empathetic sentence.
Then, respond with the following sections using bullet points and short sentences:

- **Possible Causes**: Briefly list 3-5 common and possible causes.
- **Recommended Actions**: Provide 3-4 simple, actionable steps the user can take.
- **When to See a Doctor**: List 2-3 key red flags that warrant a professional consultation.
- **Specialist Needed**: Clearly state the type of doctor to consult.

Then, at the very end, output a JSON object: {"symptoms": ["symptom1", "symptom2"]}
Finally, include the disclaimer: > ⚠️ **Disclaimer:** This is for informational purposes only.
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // 5. Extract JSON with symptoms
    let extractedSymptoms: string[] = [];
    const jsonMatch = responseText.match(
      /\{[\s\S]*"symptoms":\s*\[[\s\S]*\][\s\S]*\}/
    );

    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        extractedSymptoms = parsed.symptoms || [];
        responseText = responseText.replace(jsonMatch[0], "").trim();
      } catch (e) {
        console.error("Failed to parse symptoms JSON:", e);
      }
    }

    if (extractedSymptoms.length === 0) {
      extractedSymptoms = extractSymptoms(message);
    }

    // 6. Doctor recommendations
    const doctors = isAuthenticated
      ? await matchDoctors(extractedSymptoms)
      : [];

    return NextResponse.json({
      text: responseText,
      doctors,
      symptoms: extractedSymptoms,
      expectedDoctors: isAuthenticated,
    });
  } catch (error) {
    console.error("Error in assistant API:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
