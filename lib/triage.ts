import { SymptomInput, TriageResult } from "./types";

export function getTriageResult(input: SymptomInput): TriageResult {
  const text = input.symptoms.toLowerCase();

  // simple demo rules — replace with real logic later
  if (input.redFlags) {
    return {
      urgency: "emergency",
      recommendedCare: "ER",
      summary:
        "Red flags reported. Seek emergency care immediately (call local EMS if necessary).",
    };
  }

  if (text.includes("chest pain") || (input.severity === "severe" && text.includes("pain"))) {
    return {
      urgency: "emergency",
      recommendedCare: "ER",
      summary:
        "Severe or chest-related symptoms. Go to the nearest emergency department.",
    };
  }

  if (input.severity === "moderate") {
    return {
      urgency: "urgent",
      recommendedCare: "Walk-in clinic",
      summary:
        "Your symptoms suggest timely in-person assessment is recommended (same day).",
    };
  }

  // default
  return {
    urgency: "routine",
    recommendedCare: "Family doctor",
    summary:
      "Your symptoms look non-urgent. Book with your family doctor or use virtual care.",
  };
}
