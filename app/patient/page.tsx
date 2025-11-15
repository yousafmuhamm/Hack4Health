"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import PatientSymptomForm from "@/components/PatientSymptomForm";
import TriageResultCard from "@/components/TriageResultCard";
import LocationSection from "@/components/LocationSection";
import ChatWidget from "@/components/ChatWidget";
import { SymptomInput, TriageResult } from "@/lib/types";
import { getTriageResult } from "@/lib/triage";
import { cognitoLogout } from "@/app/utils/logout";
import Link from "next/link";

// Shared AWS login helper (kept for future use if needed)
function buildLoginUrl(role: "patient" | "clinician") {
  const redirectUri =
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://example.com/";

  const state = JSON.stringify({ role });

  return `https://healthconnect.auth.us-west-2.amazoncognito.com/login?client_id=4s6jh35ds200g1abjd19pqd9gv&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${encodeURIComponent(state)}`;
}

export default function PatientPage() {
  const router = useRouter();
  const auth = useAuth();

  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [hasShared, setHasShared] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState("");

  const email =
    (auth.user?.profile?.email as string | undefined) ?? "patient@example.com";

  // Load saved medical history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("medicalHistory");
      if (stored) setMedicalHistory(stored);
    } catch {
      // ignore
    }
  }, []);

  // Persist medical history
  const handleHistoryChange = (value: string) => {
    setMedicalHistory(value);
    try {
      localStorage.setItem("medicalHistory", value);
    } catch {
      // ignore
    }
  };

  function handleSubmit(input: SymptomInput) {
    const result = getTriageResult(input);
    setTriageResult(result);
    setHasShared(false);
  }

  return (
    <>
      {/* NAVBAR – MAROON, MATCHES REST OF APP */}
      <header className="border-b border-white/10 bg-[var(--maroon-700)]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[var(--maroon-700)] font-bold">
              ❤️
            </span>
            <span className="text-lg font-semibold text-white">
              HealthConnect
            </span>
          </Link>
        </div>
      </header>

      <div className="min-h-screen bg-gradient-to-b from-[var(--maroon-700)] via-[var(--maroon-500)] to-[var(--maroon-300)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 text-slate-50">
          {/* Top bar: hero + profile */}
          <section className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            {/* Left: welcome copy */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wide text-[var(--maroon-100)]/90">
                Patient view
              </p>

              <h1 className="text-3xl md:text-4xl font-semibold">
                Welcome to a better healthcare.
              </h1>

              <p className="max-w-2xl text-sm text-[var(--lavender-50)]/90">
                This patient portal is designed to help you describe your
                symptoms, understand how urgent they might be, and decide what
                kind of care could be appropriate.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {/* Only Health education button */}
                <a href="/education" className="btn btn-outline-lavender text-sm">
                  Health education
                </a>
              </div>
            </div>

            {/* Right: Profile button + dropdown */}
            <div className="relative self-start">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-xs hover:bg-black/35"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--lavender-400)] text-[var(--maroon-700)] text-xs font-semibold">
                  {email?.[0]?.toUpperCase() ?? "P"}
                </span>
                <span className="hidden md:block text-xs font-medium">
                  Profile
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-white/10 bg-[#1b1018] text-xs shadow-xl">
                  <div className="border-b border-white/10 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">
                      Signed in as
                    </p>
                    <p className="truncate text-[11px] text-slate-100">
                      {email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowHistory(true);
                      setProfileOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-[11px] text-slate-100 hover:bg-white/5"
                  >
                    Medical history
                  </button>
                  <button
                    onClick={cognitoLogout}
                    className="w-full px-3 py-2 text-left text-[11px] text-red-200 hover:bg-white/5"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* CareQuest AI + triage tools */}
          <section id="patient-portal" className="space-y-6">
            <h2 className="text-lg md:text-xl font-semibold">
              CareQuest AI guidance &amp; triage tools
            </h2>

            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              {/* LEFT: CareQuest AI hero (inline chat) */}
              <div className="space-y-4">
                <ChatWidget medicalHistory={medicalHistory} />
              </div>

              {/* RIGHT: Symptom form + results */}
              <div className="space-y-4">
                <div className="rounded-3xl border border-[var(--lavender-400)] bg-[var(--popup-bg)]/95 p-5 shadow-2xl shadow-black/40 text-slate-50">
                  <h3 className="mb-2 text-base font-semibold">
                    Describe your symptoms
                  </h3>
                  <p className="mb-4 text-xs text-slate-300">
                    Fill in the details below. This helps CareQuest AI and your
                    clinician understand what you&apos;re experiencing.
                  </p>
                  <div className="rounded-xl border border-slate-800 bg-black/30 p-4">
                    <PatientSymptomForm onSubmit={handleSubmit} />
                  </div>
                </div>

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

                {triageResult && (
                  <LocationSection
                    recommendedCare={triageResult.recommendedCare}
                  />
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Medical history sidebar */}
      {showHistory && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-md flex-col bg-[var(--lavender-50)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--lavender-200)] px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold text-[var(--maroon-700)]">
                  Medical history
                </h2>
                <p className="text-[11px] text-[var(--fg-muted)]">
                  Add information like chronic conditions, medications, or past
                  surgeries. CareQuest AI can use this when giving guidance.
                </p>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="text-lg text-[var(--fg-muted)] hover:text-[var(--maroon-700)]"
                aria-label="Close medical history"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              <textarea
                className="h-full min-h-[260px] w-full resize-none rounded-xl border border-[var(--lavender-200)] bg-white px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] focus:border-[var(--lavender-400)] focus:outline-none focus:ring-2 focus:ring-[var(--lavender-400)]/60"
                placeholder="Example: Type 2 diabetes, on metformin; asthma since childhood; previous knee surgery in 2020..."
                value={medicalHistory}
                onChange={(e) => handleHistoryChange(e.target.value)}
              />
            </div>

            <div className="border-t border-[var(--lavender-200)] px-4 py-3 text-right">
              <button
                onClick={() => setShowHistory(false)}
                className="inline-flex items-center justify-center rounded-full border border-[var(--maroon-500)] bg-[var(--maroon-500)] px-4 py-1.5 text-xs font-medium text-white hover:bg-[var(--maroon-700)]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
