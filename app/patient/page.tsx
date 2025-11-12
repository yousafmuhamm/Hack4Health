"use client";

import { useState } from "react";
import { useAuth } from "react-oidc-context";
import Link from "next/link";
import ProfileMenu from "@/components/ProfileMenu";
import PatientSymptomForm from "@/components/PatientSymptomForm";
import TriageResultCard from "@/components/TriageResultCard";
import LocationSection from "@/components/LocationSection";
import MedicalHistoryCard from "@/components/MedicalHistoryCard";
import { SymptomInput, TriageResult } from "@/lib/types";
import { getTriageResult } from "@/lib/triage";

export default function PatientPage() {
  const auth = useAuth();
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [hasShared, setHasShared] = useState(false);

  function handleSubmit(input: SymptomInput) {
    const result = getTriageResult(input);
    setTriageResult(result);
    setHasShared(false);
  }

  function handleShare() { setHasShared(true); }
  function handleDelete() { setTriageResult(null); setHasShared(false); }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      {/* Header */}
      <header className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--brand-maroon)] text-white grid place-items-center font-bold">
            H
          </div>
          <span className="font-semibold">Patient portal</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-[var(--fg-muted)] hover:underline">
            Home
          </Link>
          {auth.isAuthenticated ? (
            <ProfileMenu />
          ) : (
            <button onClick={() => auth.signinRedirect()} className="btn btn-maroon">
              Sign in
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 pb-12 space-y-6">
        <section className="space-y-1">
          <h1 className="text-2xl font-semibold">Patient navigation & triage</h1>
          <p className="max-w-2xl text-sm text-[var(--fg-muted)]">
            Describe your symptoms, learn urgency, and find the right care.
            <span className="font-semibold"> This is not a diagnosis</span>.
          </p>
        </section>

        <div className="grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="space-y-4">
            <div className="card p-4">
              <PatientSymptomForm onSubmit={handleSubmit} />
            </div>

            {triageResult && (
              <div className="card p-4">
                <TriageResultCard
                  result={triageResult}
                  hasShared={hasShared}
                  onShare={handleShare}
                  onDelete={handleDelete}
                />
              </div>
            )}

            {/* Medical history (optional) */}
            <MedicalHistoryCard />
          </div>

          <div className="space-y-4">
            {triageResult && (
              <div className="card p-4">
                <LocationSection recommendedCare={triageResult.recommendedCare} />
              </div>
            )}

            <section className="card p-4 text-xs">
              <h2 className="text-sm font-semibold mb-1">Health education</h2>
              <p className="text-[var(--fg-muted)]">
                Use the “Health education” page to search by keyword and scroll
                through curated content.
              </p>
              <Link href="/education" className="inline-block mt-3 btn btn-outline-lavender text-[var(--fg)]">
                Open health education
              </Link>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
