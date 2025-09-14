import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { illnessToSpecialty } from "@/lib/specialtyMap";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ✅ Mock doctors database (replace with real DB later)
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

// ✅ Enhanced doctor matching with multiple symptom support
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function matchDoctors(symptoms: string[]): any[] {
  const specialtiesNeeded = new Set<string>();

  // Check each symptom against our mapping
  symptoms.forEach((symptom) => {
    const normalizedSymptom = symptom.toLowerCase().trim();

    // Direct match
    if (illnessToSpecialty[normalizedSymptom]) {
      illnessToSpecialty[normalizedSymptom].forEach((spec) =>
        specialtiesNeeded.add(spec)
      );
    }

    // Partial match (check if any key is contained in the symptom)
    Object.keys(illnessToSpecialty).forEach((key) => {
      if (normalizedSymptom.includes(key) || key.includes(normalizedSymptom)) {
        illnessToSpecialty[key].forEach((spec) => specialtiesNeeded.add(spec));
      }
    });
  });

  // If no matches found, add general practitioner
  if (specialtiesNeeded.size === 0) {
    specialtiesNeeded.add("General Practitioner");
  }

  // Filter doctors based on specialties
  const matchedDoctors = mockDoctors.filter((doc) =>
    specialtiesNeeded.has(doc.specialty)
  );

  // Sort by rating
  return matchedDoctors.sort((a, b) => b.rating - a.rating).slice(0, 3);
}

// ✅ Extract symptoms from user message
function extractSymptoms(message: string): string[] {
  const symptoms: string[] = [];
  const lowerMessage = message.toLowerCase();

  // Common symptom keywords to look for
  const symptomKeywords = [
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

  // Check for each keyword in the message
  symptomKeywords.forEach((keyword) => {
    if (lowerMessage.includes(keyword)) {
      symptoms.push(keyword);
    }
  });

  return symptoms;
}

export async function POST(req: Request) {
  try {
    const { message, isAuthenticated } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // ✅ Enhanced prompt for better symptom extraction
    const prompt = `
You are a medical assistant AI. Analyze the following user message about their health concerns.

User message: "${message}"

Provide a helpful response in markdown format with:
1. **Possible Causes** - List potential conditions
2. **Recommended Actions** - What they should do immediately
3. **When to See a Doctor** - Urgency level
4. **Type of Specialist Needed** - Which doctor to consult

Keep the response concise and helpful.

After your medical advice, on a new line, provide a JSON object with extracted symptoms:
{"symptoms": ["symptom1", "symptom2", ...]}

End with this disclaimer:
> ⚠️ **Disclaimer:** This is for informational purposes only. Consult a healthcare provider for proper diagnosis and treatment.
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // ✅ Extract symptoms from Gemini's response
    let extractedSymptoms: string[] = [];
    const jsonMatch = responseText.match(
      /\{[\s\S]*"symptoms":\s*\[[\s\S]*\][\s\S]*\}/
    );

    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        extractedSymptoms = parsed.symptoms || [];
        // Remove JSON from the display text
        responseText = responseText.replace(jsonMatch[0], "").trim();
      } catch (e) {
        console.error("Failed to parse symptoms JSON:", e);
      }
    }

    // ✅ If Gemini didn't extract symptoms, try to extract from user message
    if (extractedSymptoms.length === 0) {
      extractedSymptoms = extractSymptoms(message);
    }

    // ✅ Match doctors based on symptoms (only if authenticated)
    const doctors = isAuthenticated ? matchDoctors(extractedSymptoms) : [];

    console.log("Extracted symptoms:", extractedSymptoms);
    console.log("Matched doctors:", doctors);

    return NextResponse.json({
      text: responseText,
      doctors: doctors, // Send matched doctors
      symptoms: extractedSymptoms, // For debugging
    });
  } catch (error) {
    console.error("Error in assistant API:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
