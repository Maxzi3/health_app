import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { illnessToSpecialty } from "@/lib/specialtyMap";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ✅ Mock doctors database (replace later with real doctors collection)
const mockDoctors = [
  {
    id: 1,
    name: "Dr. Jane Doe",
    specialty: "Neurologist",
    rating: 4.9,
    experience: "8 years",
  },
  {
    id: 2,
    name: "Dr. Smith John",
    specialty: "General Practitioner",
    rating: 4.7,
    experience: "12 years",
  },
  {
    id: 3,
    name: "Dr. Rose Lee",
    specialty: "Psychologist",
    rating: 4.8,
    experience: "6 years",
  },
  {
    id: 4,
    name: "Dr. Fatima Musa",
    specialty: "Dermatologist",
    rating: 4.6,
    experience: "9 years",
  },
  {
    id: 5,
    name: "Dr. Ahmed Hassan",
    specialty: "Cardiologist",
    rating: 4.9,
    experience: "15 years",
  },
  {
    id: 6,
    name: "Dr. Sarah Chen",
    specialty: "ENT Specialist",
    rating: 4.7,
    experience: "10 years",
  },
  {
    id: 7,
    name: "Dr. Michael Brown",
    specialty: "Gastroenterologist",
    rating: 4.8,
    experience: "11 years",
  },
  {
    id: 8,
    name: "Dr. Emily White",
    specialty: "Psychiatrist",
    rating: 4.9,
    experience: "7 years",
  },
  {
    id: 9,
    name: "Dr. David Kim",
    specialty: "Pulmonologist",
    rating: 4.6,
    experience: "9 years",
  },
  {
    id: 10,
    name: "Dr. Lisa Johnson",
    specialty: "Internal Medicine",
    rating: 4.8,
    experience: "13 years",
  },
];

// ✅ Doctor matching
function matchDoctors(symptoms: string[]) {
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

  return mockDoctors
    .filter((doc) => specialtiesNeeded.has(doc.specialty))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
}

// ✅ Fallback symptom extractor
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
  ];
  keywords.forEach((kw) => {
    if (lower.includes(kw)) symptoms.push(kw);
  });
  return symptoms;
}

export async function POST(req: Request) {
  try {
    const { message, isAuthenticated } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
You are a medical assistant AI. Analyze the following user message:

"${message}"

Respond with:
1. **Possible Causes**
2. **Recommended Actions**
3. **When to See a Doctor**
4. **Type of Specialist Needed**

Then output JSON: {"symptoms": ["symptom1", "symptom2"]}
End with:
> ⚠️ **Disclaimer:** This is for informational purposes only.
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // ✅ Extract JSON with symptoms
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

    // ✅ Doctor recommendations (only if logged in)
    const doctors = isAuthenticated ? matchDoctors(extractedSymptoms) : [];

    return NextResponse.json({
      text: responseText,
      doctors,
      symptoms: extractedSymptoms,
    });
  } catch (error) {
    console.error("Error in assistant API:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
