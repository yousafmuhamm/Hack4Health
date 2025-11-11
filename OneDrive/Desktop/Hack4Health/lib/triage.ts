// lib/triage.ts

import { SymptomInput, TriageResult, RecommendedCare } from './types';

export function getTriageResult(input: SymptomInput): TriageResult {
  const { severity, redFlags, description } = input;

  const hasMajorRedFlag =
    redFlags.chestPain ||
    redFlags.breathingDifficulty ||
    redFlags.facialDroop;

  const hasNeuroRedFlag = redFlags.weakness || redFlags.confusion;

  if (hasMajorRedFlag || hasNeuroRedFlag) {
    return {
      urgency: 'high',
      recommendedCare: 'er',
      explanation:
        'Your symptoms may suggest a serious condition. You should go to the emergency department immediately or call emergency services.',
    };
  }

  // Very rough keyword sample logic
  const desc = description.toLowerCase();
  let recommendedCare: RecommendedCare = 'walk-in';

  if (desc.includes('sore throat') || desc.includes('cough')) {
    recommendedCare = 'walk-in';
  } else if (desc.includes('medication') || desc.includes('refill')) {
    recommendedCare = 'family-doctor';
  } else if (desc.includes('mild') || desc.includes('check up')) {
    recommendedCare = 'virtual';
  }

  if (severity === 'severe') {
    recommendedCare = 'er';
  }

  let urgency: TriageResult['urgency'] = 'low';
  if (severity === 'moderate') urgency = 'moderate';
  if (severity === 'severe') urgency = 'high';

  return {
    urgency,
    recommendedCare,
    explanation:
      'Based on your description and answers, this issue does not appear immediately life-threatening, but should still be assessed by a clinician at the suggested level of care.',
  };
}
