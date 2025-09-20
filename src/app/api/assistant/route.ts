import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { illnessToSpecialty } from "@/lib/specialtyMap";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

//  Doctor matching from DB
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

  //  Fetch real doctors from DB
  await connectDB();
  const doctors = await User.find({
    role: "DOCTOR",
    specialization: { $in: Array.from(specialtiesNeeded) },
  })
    .select("name specialization experience")
    .limit(10);

  // ⚡ Return doctors with proper _id field
  return doctors
    .map((doc) => ({
      _id: doc._id.toString(),
      name: doc.name,
      specialty: doc.specialization,
      experience: doc.experience || "5 years",
    }))
    .slice(0, 3);
}

//  Fallback symptom extractor
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
    "purging", // Add this for your specific case
  ];
  keywords.forEach((kw) => {
    if (lower.includes(kw)) symptoms.push(kw);
  });
  return symptoms;
}

export async function POST(req: Request) {
  try {
    const { message, isAuthenticated, conversationId, patientId } =
      await req.json();

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

    //  Extract JSON with symptoms
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

    //  Doctor recommendations (only if logged in)
    const doctors = isAuthenticated
      ? await matchDoctors(extractedSymptoms)
      : [];

    //  Remove the duplicate message saving - ChatInterface already handles this
    // The prescription/appointment routes should use the original user message, not bot response

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
