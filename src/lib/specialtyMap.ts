export const illnessToSpecialty: Record<string, string[]> = {
  // Neurological
  headache: ["Neurologist", "General Practitioner"],
  migraine: ["Neurologist", "General Practitioner"],
  dizziness: ["Neurologist", "ENT Specialist", "General Practitioner"],
  chest: ["Cardiologist", "Pulmonologist", "General Practitioner"],
  rash: ["Dermatologist"],
  stomach: ["Gastroenterologist", "General Practitioner"],
  vomiting: ["Gastroenterologist", "General Practitioner"],
  insomnia: ["Psychologist", "Psychiatrist"],


  // General symptoms
  fever: ["General Practitioner", "Infectious Disease Specialist"],
  fatigue: ["General Practitioner", "Internal Medicine"],
  weakness: ["General Practitioner", "Neurologist"],

  // Cardiovascular
  chest_pain: ["Cardiologist", "Emergency Medicine"],
  palpitations: ["Cardiologist", "General Practitioner"],
  hypertension: ["Cardiologist", "Internal Medicine"],

  // Respiratory
  cough: ["Pulmonologist", "General Practitioner"],
  breathing_difficulty: ["Pulmonologist", "Emergency Medicine"],
  asthma: ["Pulmonologist", "Allergist"],

  // Dermatological
  skin_rash: ["Dermatologist", "Allergist"],
  acne: ["Dermatologist"],
  eczema: ["Dermatologist", "Allergist"],

  // Mental Health
  anxiety: ["Psychiatrist", "Psychologist"],
  depression: ["Psychiatrist", "Psychologist"],
  stress: ["Psychologist", "Psychiatrist"],

  // Digestive
  stomach_pain: ["Gastroenterologist", "General Practitioner"],
  nausea: ["Gastroenterologist", "General Practitioner"],
  diarrhea: ["Gastroenterologist", "Infectious Disease Specialist"],

  // Endocrine
  diabetes: ["Endocrinologist", "Internal Medicine"],
  thyroid: ["Endocrinologist"],

  // General fallback
  general: ["General Practitioner", "Internal Medicine"],
};
