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

// --- Preconsult + clinician workflow types ---

export type PreconsultStatus = "pending" | "accepted" | "deferred";

// keep this flexible for now – we normalize labels elsewhere
export type PreconsultUrgency = string;

export type Preconsult = {
  id: string;
  patientName: string;
  age: number | null;
  summary: string;
  details?: string;

  // Firestore timestamp stored as millis
  createdAt: number;

  // triage result / label from AI/patient flow
  urgency: PreconsultUrgency;

  // Clinician workflow
  status?: PreconsultStatus; // "pending" | "accepted" | "deferred"
  deferNote?: string; // clinician note sent to the patient when deferred
};

export type ScreeningTask = {
  id: string;
  title: string;
  status: "due" | "complete";
  // You can add more fields later if needed, e.g.:
  // description?: string;
  // dueDate?: string;
};
