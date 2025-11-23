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
export type RecommendedCare = TriageResult["recommendedCare"];

export type Facility = {
  id: string;
  name: string;
  distanceKm: number;
  supportsCare: RecommendedCare[];
  address?: string;
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

  // New fields for clinician workflow
  status?: PreconsultStatus; // "new" | "accepted" | "deferred"
  deferNote?: string;        // clinician note sent to the patient when deferred
};

export type ScreeningTask = {
  id: string;
  title: string;
  status: "due" | "complete";
  // You can add more fields later if needed, e.g.:
  // description?: string;
  // dueDate?: string;
};

