import { Preconsult } from "./types";

export const mockPreconsults: Preconsult[] = [
  {
    id: "1",
    patientName: "Aisha Khan",
    age: 29,
    summary: "Sore throat, mild fever, 2 days, no red flags.",
    details:
      "Mild odynophagia, afebrile at triage, no SOB, able to swallow fluids.",
    createdAt: "2025-11-14T03:10:21Z",
    urgency: "not_urgent",
    status: "new",
  },
  {
    id: "2",
    patientName: "Marco Silva",
    age: 47,
    summary: "Intermittent chest discomfort on exertion, started 1 week ago.",
    details:
      "Exertional substernal pressure, improves with rest, no diaphoresis now. Needs in-person assessment.",
    createdAt: "2025-11-14T01:10:21Z",
    urgency: "very_urgent",
    status: "new",
  },
  {
    id: "3",
    patientName: "Emily Tran",
    age: 18,
    summary: "Rash on arms after new detergent, itchy, started yesterday.",
    details:
      "Papular, pruritic rash without systemic symptoms. No fever, no mucosal involvement.",
    createdAt: "2025-11-13T21:10:21Z",
    urgency: "mildly_urgent",
    status: "new",
  },
  {
    id: "4",
    patientName: "Linda Park",
    age: 52,
    summary:
      "Low mood, fatigue, and poor sleep for the past month, worries about depression.",
    details:
      "Reports feeling down most days, low energy, difficulty concentrating. Denies suicidality. Past history of hypertension.",
    createdAt: "2025-11-13T19:45:21Z",
    urgency: "mildly_urgent",
    status: "new",
  },
  {
    id: "5",
    patientName: "Jamal Ahmed",
    age: 58,
    summary:
      "Increased thirst, frequent urination, and unintentional weight loss over 3 months, concerned about diabetes.",
    details:
      "Polyuria, polydipsia, nocturia x3, clothes fitting looser. No chest pain or SOB. Family history of type 2 diabetes.",
    createdAt: "2025-11-13T18:20:21Z",
    urgency: "mildly_urgent",
    status: "new",
  },
  {
    id: "6",
    patientName: "Jacob annoyance",
    age: 7,
    summary:
      "Fall while hiking during late summer, now with wrist pain and swelling suggesting a possible distal radius fracture.",
    details:
      "Slipped while hiking and landed on outstretched hand. Immediate wrist pain and swelling, reduced motion. No numbness or open wounds.",
    createdAt: "2025-11-13T17:10:21Z",
    urgency: "mildly_urgent",
    status: "new",
  },
];
