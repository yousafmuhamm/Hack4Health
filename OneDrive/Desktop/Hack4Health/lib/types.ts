// lib/types.ts

export type UrgencyLevel = 'low' | 'moderate' | 'high';

export type RecommendedCare =
  | 'er'
  | 'walk-in'
  | 'family-doctor'
  | 'virtual';

export interface SymptomInput {
  description: string;
  duration: string;
  severity: 'mild' | 'moderate' | 'severe';
  redFlags: {
    chestPain: boolean;
    breathingDifficulty: boolean;
    facialDroop: boolean;
    weakness: boolean;
    confusion: boolean;
  };
}

export interface TriageResult {
  urgency: UrgencyLevel;
  recommendedCare: RecommendedCare;
  explanation: string;
}

export interface Facility {
  id: string;
  name: string;
  type: 'ER' | 'Walk-In Clinic' | 'Family Practice' | 'Virtual Clinic';
  distanceKm: number;
  address: string;
  supportsCare: RecommendedCare[];
}

export interface Preconsult {
  id: string;
  patientName: string;
  age: number;
  symptoms: string;
  urgency: UrgencyLevel;
  recommendedCare: RecommendedCare;
  createdAt: string; // ISO date
  hasRedFlags: boolean;
}

export interface ScreeningTask {
  id: string;
  patientName: string;
  patientId: string;
  type:
    | 'Mammogram'
    | 'Bone Mineral Density'
    | 'INR / Anticoagulation'
    | 'Bloodwork'
    | 'Medication Refill';
  lastDone?: string; // ISO date
  dueDate: string; // ISO date
  status: 'due' | 'completed';
  notes?: string;
}
