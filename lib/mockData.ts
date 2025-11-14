// lib/mockData.ts
import { Preconsult } from "./types";

export const mockPreconsults: Preconsult[] = [
  {
    id: "1",
    patientName: "Aisha Khan",
    age: 29,
    summary: "Sore throat, mild fever, 2 days, no red flags.",
    details: "Mild odynophagia, afebrile at triage, no SOB, able to swallow fluids.",
    createdAt: "2025-11-14T03:10:21Z",
    urgency: "not_urgent",
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
  },
];
