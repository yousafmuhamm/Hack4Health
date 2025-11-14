"use client";

import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useRouter } from "next/navigation";
import PatientSymptomForm from "@/components/PatientSymptomForm";
import TriageResultCard from "@/components/TriageResultCard";
import LocationSection from "@/components/LocationSection";
import { SymptomInput, TriageResult } from "@/lib/types";
import { getTriageResult } from "@/lib/triage";

export default function PatientPage() {
  const auth = useAuth();
  const router = useRouter();

  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [hasShared, setHasShared] = useState(false);

  // Patient-only guard
  useEffect(() => {
    if (auth.isLoading) return;

    if (!auth.isAuthenticated) {
      router.replace("/");
      return;
    }

    const role = auth.user?.profile?.role;
    if (role !== "patient") {
      if (role === "clinician") {
        router.replace("/clinician");
      } else {
        router.replace("/");
      }
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.user, router]);

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        Checking permissions…
      </div>
    );
  }

  if (!auth.isAuthenticated || auth.user?.profile?.role !== "patient") {
    return null;
  }

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
          clearly, understand the potential urgency of your concerns, and
          prepare for your next appointment with confidence. By providing
          structured information, you enable your care team to focus on what
          matters most—your health and your safety.
          <br />
          <br />
          Use the <span className="font-semibold">Patient Portal</span> to
          describe what you’re experiencing in a clear and organized way, or
          explore <span className="font-semibold">Health Education</span> to
          learn about common symptoms, red flags, and when to seek different
          levels of care. This guidance is informational only and is not a
          diagnosis or a substitute for emergency medical services.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {/* 1. Patient Portal = maroon button */}
          <a href="#patient-portal" className="btn btn-maroon text-sm">
            Patient Portal
          </a>

          {/* 2. Health education = outline lavender */}
          <a
            href="/education"
            className="btn btn-outline-lavender text-[var(--fg)] text-sm"
          >
            Health education
          </a>
        </div>
      </section>

      {/* Patient portal / triage section */}
      <section id="patient-portal" className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-50">
            Patient navigation &amp; triage
          </h2>
          <p className="max-w-2xl text-sm text-slate-300">
            This tool helps you describe your symptoms, learn about possible
            urgency, and find the right level of care. It does
            <span className="font-semibold"> not</span> give a diagnosis, and it
            is not a substitute for emergency services.
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

            {/* Quick health education block; main detailed content lives at /education */}
            <section className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-300">
              <h2 className="text-sm font-semibold text-slate-100">
                Health education (quick tips)
              </h2>
              <p>
                After triage, you can also visit the full{" "}
                <span className="font-semibold">Health education</span> page for
                more examples of how to describe your symptoms in clear,
                clinician-friendly language.
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  Chest pain with shortness of breath or sweating is an
                  emergency. Call local emergency services.
                </li>
                <li>
                  Sudden facial droop, weakness, or trouble speaking may be a
                  stroke and requires urgent care.
                </li>
                <li>
                  Mild sore throat and low-grade fever are often safe to assess
                  at a walk-in clinic or through virtual care.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
