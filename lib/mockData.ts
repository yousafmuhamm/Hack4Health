import { Preconsult } from "./types";

export const mockPreconsults: Preconsult[] = [
  {
    id: "pc_001",
    patientName: "Aisha Khan",
    age: 29,
    summary: "Sore throat, mild fever, 2 days, no red flags.",
    createdAt: new Date().toISOString(),
    priority: "low",
    details:
      "Mild odynophagia, afebrile at triage, no SOB, able to swallow fluids.",
  },
  {
    id: "pc_002",
    patientName: "Marco Silva",
    age: 47,
    summary: "Intermittent chest discomfort on exertion, started 1 week ago.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    priority: "high",
    details:
      "Exertional substernal pressure, improves with rest, no diaphoresis now. Needs urgent in-person assessment.",
  },
  {
    id: "pc_003",
    patientName: "Emily Tran",
    age: 18,
    summary: "Rash on arms after new detergent, itchy, started yesterday.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    priority: "medium",
    details:
      "Papular, pruritic rash without systemic symptoms. Consider topical treatment, avoid trigger.",
  },
];
