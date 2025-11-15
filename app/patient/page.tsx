"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import Link from "next/link";

import PatientSymptomForm from "@/components/PatientSymptomForm";
import TriageResultCard from "@/components/TriageResultCard";
import LocationSection from "@/components/LocationSection";
import ChatWidget from "@/components/ChatWidget";
import MapSection from "@/components/MapSection";

import { SymptomInput, TriageResult } from "@/lib/types";
// we call /api/triage instead of getTriageResult
import { cognitoLogout } from "@/app/utils/logout";
import { savePreconsult } from "@/lib/db";

type LatLng = { lat: number; lng: number };

// (Optional) kept in case you reuse it later
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

// Decide ER vs WALK_IN vs GENERAL based on recommendedCare text
function inferCareType(result: TriageResult): "ER" | "WALK_IN" | "GENERAL" {
  const text = (result.recommendedCare || "").toLowerCase();

  // ER-type wording
  if (
    text.includes("emergency") ||
    text.includes("er") ||
    text.includes("go to the nearest emergency") ||
    text.includes("call 911")
  ) {
    return "ER";
  }

  // Family / walk-in clinic wording
  if (
    text.includes("family doctor") ||
    text.includes("family clinic") ||
    text.includes("walk-in") ||
    text.includes("walk in") ||
    text.includes("urgent care") ||
    text.includes("clinic")
  ) {
    return "WALK_IN";
  }

  return "GENERAL";
}

export default function PatientPage() {
  const router = useRouter();
  const auth = useAuth();

  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For Google Maps
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

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

  // 🔧 IMPORTANT: now automatically attaches the patient's name
  const handleSubmit = async (input: SymptomInput) => {
    setLoading(true);
    setError(null);
    setTriageResult(null);

    // derive a name from Cognito profile / email
    const fromProfileName =
      (auth.user?.profile?.name as string | undefined) || "";
    const fromEmailPrefix =
      ((auth.user?.profile?.email as string | undefined) || "")
        .split("@")[0]
        .trim();

    const derivedName =
      fromProfileName.trim() ||
      fromEmailPrefix ||
      "Patient";

    const payload = {
      ...input,
      patientName: derivedName,
    };

    try {
      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: TriageResult = await res.json();

      if (!res.ok) {
        setError("There was a problem analyzing your symptoms.");
      } else {
        setTriageResult(data);

        // Save into Firestore so the clinician can see it
        await savePreconsult(payload as any, data);
      }
    } catch (e) {
      console.error(e);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Ask for exact user location
  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("Location is not supported by your browser.");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLoadingLocation(false);
      },
      (err) => {
        console.error("Error getting location:", err);
        setLoadingLocation(false);
        alert(
          "We couldn't get your location. Please check location permissions and try again."
        );
      }
    );
  };

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
                <a
                  href="/education"
                  className="btn btn-outline-lavender text-sm"
                >
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
              <div className="space-y-2">
                <ChatWidget medicalHistory={medicalHistory} />

                {/* HIPAA badge under chatbot */}
                <div className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/20 px-2 py-0.5 text-[10px] font-medium text-[var(--lavender-100)]">
                  <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white/30 text-[8px]">
                    🔒
                  </span>
                  <span>HIPAA · Private</span>
                </div>
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

                  {error && (
                    <p className="mt-2 text-xs text-red-200">{error}</p>
                  )}
                </div>

                {/* HIPAA badge under symptom form */}
                <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/20 px-2 py-0.5 text-[10px] font-medium text-[var(--lavender-100)]">
                  <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white/30 text-[8px]">
                    🔒
                  </span>
                  <span>HIPAA · Private</span>
                </div>

                {triageResult && (
                  <>
                    <TriageResultCard
                      result={triageResult}
                      hasShared={hasShared}
                      onShare={() => setHasShared(true)}
                      onDelete={() => {
                        setTriageResult(null);
                        setHasShared(false);
                      }}
                    />

                    <LocationSection
                      recommendedCare={triageResult.recommendedCare}
                    />

                    {/* Ask for exact location + show Google Map */}
                    <div className="mt-4 space-y-2">
                      {!userLocation && (
                        <button
                          type="button"
                          onClick={requestLocation}
                          className="rounded-full border border-[var(--lavender-400)] bg-black/30 px-4 py-1.5 text-xs font-medium hover:bg-black/50"
                        >
                          Share my current location
                        </button>
                      )}

                      {loadingLocation && (
                        <p className="text-xs text-slate-300">
                          Getting your location…
                        </p>
                      )}

                      {userLocation && triageResult && (
                        <div className="mt-2">
                          <MapSection
                            userLocation={userLocation}
                            careType={inferCareType(triageResult)}
                          />
                        </div>
                      )}
                    </div>
                  </>
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
