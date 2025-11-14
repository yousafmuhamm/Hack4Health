export type Severity = "mild" | "moderate" | "severe";

export type SymptomInput = {
  age: number;
  symptoms: string;
  onset: string; // free text e.g. "2 days ago", "sudden"
  severity: Severity;
  redFlags?: boolean;
};

export type TriageResult = {
  urgency: "emergency" | "urgent" | "routine";
  recommendedCare: "ER" | "Walk-in clinic" | "Family doctor" | "Virtual care";
  summary: string;
};

export type PreconsultStatus = "new" | "accepted" | "deferred";
export type PreconsultUrgency = "not_urgent" | "mildly_urgent" | "very_urgent";

export type Preconsult = {
  id: string;
  patientName: string;
  age: number;
  summary: string;
  details?: string;
  createdAt: string;
  urgency: PreconsultUrgency; // triage result from AI/patient flow
};
