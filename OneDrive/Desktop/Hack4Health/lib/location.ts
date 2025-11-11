// lib/location.ts

import { Facility, RecommendedCare } from './types';
import { mockFacilities } from './mockData';

export function getFacilitiesForCare(
  care: RecommendedCare
): Facility[] {
  return mockFacilities
    .filter((fac) => fac.supportsCare.includes(care))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}
