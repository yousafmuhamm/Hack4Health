"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PatientSymptomForm from "@/components/PatientSymptomForm";
import TriageResultCard from "@/components/TriageResultCard";
import LocationSection from "@/components/LocationSection";
import { SymptomInput, TriageResult } from "@/lib/types";
import { getTriageResult } from "@/lib/triage";

// Shared AWS login helper
function buildLoginUrl(role: "patient" | "clinician") {
  const redirectUri =
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:3000/"
      : "https://example.com/"; 

  const state = JSON.stringify({ role });

  return (
    `https://us-west-2frgg6bipo.auth.us-west-2.amazoncognito.com/login?` +
    `client_id=4s6jh35ds200g1abjd19pqd9gv` +
    `&response_type=code&scope=email+openid+profile` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${encodeURIComponent(state)}`
  );
}

export default function PatientPage() {
  const router = useRouter();

  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [hasShared, setHasShared] = useState(false);

  // ROLE GUARD
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (!role || role !== "patient") {
      router.replace("/");
    }
  }, [router]);

  function handleSubmit(input: SymptomInput) {
    const result = getTriageResult(input);
    setTriageResult(result);
    setHasShared(false);
  }

  return (
    <div className="space-y-8">
      {/* Welcome hero */}
      <section className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Patient view
        </p>

        <h1 className="text-3xl md:text-4xl font-semibold text-slate-50">
          Welcome to a better healthcare.
        </h1>

        <p className="max-w-2xl text-sm text-slate-300">
          This patient portal is designed to help you communicate your symptoms
          clearly...
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <a href="#patient-portal" className="btn btn-maroon text-sm">
            Patient Portal
          </a>

          <a
            href="/education"
            className="btn btn-outline-lavender text-sm text-[var(--fg)]"
          >
            Health education
          </a>
        </div>
      </section>

      {/* Patient portal / triage section */}
      <section id="patient-portal" className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-50">
          Patient navigation & triage
        </h2>

        <div className="grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="space-y-4">
            <PatientSymptomForm onSubmit={handleSubmit} />

            {triageResult && (
              <TriageResultCard
                result={triageResult}
                hasShared={hasShared}
                onShare={() => setHasShared(true)}
                onDelete={() => {
                  setTriageResult(null);
                  setHasShared(false);
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            {triageResult && (
              <LocationSection
                recommendedCare={triageResult.recommendedCare}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
