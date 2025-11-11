// app/patient/page.tsx
'use client';

import { useState } from 'react';
import PatientSymptomForm from '@/components/PatientSymptomForm';
import TriageResultCard from '@/components/TriageResultCard';
import LocationSection from '@/components/LocationSection';
import { SymptomInput, TriageResult } from '@/lib/types';
import { getTriageResult } from '@/lib/triage';

export default function PatientPage() {
  const [triageResult, setTriageResult] = useState<TriageResult | null>(
    null
  );
  const [hasShared, setHasShared] = useState(false);

  function handleSubmit(input: SymptomInput) {
    const result = getTriageResult(input);
    setTriageResult(result);
    setHasShared(false);
  }

  function handleShare() {
    setHasShared(true);
  }

  function handleDelete() {
    setTriageResult(null);
    setHasShared(false);
  }

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-50">
          Patient navigation & triage
        </h1>
        <p className="max-w-2xl text-sm text-slate-300">
          This tool helps you describe your symptoms, learn about
          possible urgency, and find the right level of care. It does
          <span className="font-semibold"> not</span> give a diagnosis,
          and it is not a substitute for emergency services.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="space-y-4">
          <PatientSymptomForm onSubmit={handleSubmit} />

          {triageResult && (
            <TriageResultCard
              result={triageResult}
              hasShared={hasShared}
              onShare={handleShare}
              onDelete={handleDelete}
            />
          )}
        </div>

        <div className="space-y-4">
          {triageResult && (
            <LocationSection
              recommendedCare={triageResult.recommendedCare}
            />
          )}
          <section className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-300">
            <h2 className="text-sm font-semibold text-slate-100">
              Health education (demo)
            </h2>
            <p>
              After triage, this space can show simple educational
              content about common symptoms, red flags, and when to seek
              urgent care, in clear language.
            </p>
            <ul className="list-disc pl-4">
              <li>
                Chest pain with shortness of breath or sweating is an
                emergency. Call local emergency services.
              </li>
              <li>
                Sudden facial droop, weakness, or trouble speaking may
                be a stroke and needs urgent care.
              </li>
              <li>
                Mild sore throat and low-grade fever are often safe to
                assess at a walk-in clinic or with virtual care.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
