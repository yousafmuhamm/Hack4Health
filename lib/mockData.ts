// lib/mockData.ts

import { Facility, Preconsult, ScreeningTask } from './types';

export const mockFacilities: Facility[] = [
  {
    id: 'fac-1',
    name: 'Downtown General Hospital ER',
    type: 'ER',
    distanceKm: 2.3,
    address: '123 Central Ave',
    supportsCare: ['er'],
  },
  {
    id: 'fac-2',
    name: 'City Walk-In Clinic',
    type: 'Walk-In Clinic',
    distanceKm: 3.1,
    address: '45 Maple Street',
    supportsCare: ['walk-in', 'family-doctor'],
  },
  {
    id: 'fac-3',
    name: 'Sunrise Family Practice',
    type: 'Family Practice',
    distanceKm: 4.5,
    address: '78 Oak Crescent',
    supportsCare: ['family-doctor'],
  },
  {
    id: 'fac-4',
    name: 'Virtual Care Connect',
    type: 'Virtual Clinic',
    distanceKm: 0.0,
    address: 'Online',
    supportsCare: ['virtual'],
  },
];

export const mockPreconsults: Preconsult[] = [
  {
    id: 'pc-1',
    patientName: 'Jane Doe',
    age: 52,
    symptoms: 'Chest tightness and shortness of breath for 30 minutes.',
    urgency: 'high',
    recommendedCare: 'er',
    createdAt: new Date().toISOString(),
    hasRedFlags: true,
  },
  {
    id: 'pc-2',
    patientName: 'Ali Khan',
    age: 34,
    symptoms: 'Sore throat and low-grade fever for 2 days.',
    urgency: 'low',
    recommendedCare: 'walk-in',
    createdAt: new Date().toISOString(),
    hasRedFlags: false,
  },
  {
    id: 'pc-3',
    patientName: 'Maria Lopez',
    age: 68,
    symptoms: 'Mild dizziness when standing, on blood thinner.',
    urgency: 'moderate',
    recommendedCare: 'family-doctor',
    createdAt: new Date().toISOString(),
    hasRedFlags: false,
  },
];

export const mockScreeningTasks: ScreeningTask[] = [
  {
    id: 'task-1',
    patientName: 'Jane Doe',
    patientId: 'P-1001',
    type: 'Mammogram',
    lastDone: '2024-10-01',
    dueDate: '2025-10-01',
    status: 'due',
    notes: 'Annual breast cancer screening.',
  },
  {
    id: 'task-2',
    patientName: 'Ali Khan',
    patientId: 'P-1002',
    type: 'INR / Anticoagulation',
    lastDone: '2025-10-20',
    dueDate: '2025-11-20',
    status: 'due',
    notes: 'On warfarin, monthly INR.',
  },
  {
    id: 'task-3',
    patientName: 'Maria Lopez',
    patientId: 'P-1003',
    type: 'Bone Mineral Density',
    lastDone: '2022-05-10',
    dueDate: '2027-05-10',
    status: 'due',
    notes: 'Osteoporosis risk.',
  },
  {
    id: 'task-4',
    patientName: 'John Smith',
    patientId: 'P-1004',
    type: 'Medication Refill',
    lastDone: '2025-11-01',
    dueDate: '2025-12-01',
    status: 'due',
    notes: 'Repeat blood pressure meds.',
  },
];
