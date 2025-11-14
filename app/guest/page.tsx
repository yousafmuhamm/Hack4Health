"use client";

import React, { useState } from "react";
import { useAuth } from "react-oidc-context";
import ProfileMenu from "@/components/ProfileMenu";
import ChatWidget from "@/components/ChatWidget";

export default function GuestPage() {
  const auth = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);

  const openSignInModal = () => {
    setShowSignInModal(true);
  };

  const closeSignInModal = () => {
    setShowSignInModal(false);
  };

  const handleSignIn = async (role: "patient" | "clinician") => {
    try {
      await auth.signinRedirect({ state: { role } });
    } catch (err) {
      console.error(err);
      alert("Sign-in could not start. Please check your configuration.");
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* NAV */}
      <nav className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--brand-maroon)] text-white grid place-items-center font-bold">
            H
          </div>
          <span className="font-semibold text-lg text-slate-900">
            HealthConnect
          </span>
        </div>

        <div className="flex items-center gap-3">
          {auth.isAuthenticated ? (
            <ProfileMenu />
          ) : (
            <button
              onClick={openSignInModal}
              className="btn btn-outline-lavender text-slate-900"
            >
              Sign in
            </button>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="w-full max-w-5xl mx-auto px-6 py-8 md:py-12 space-y-6">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Guest preview
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-slate-900">
            Take control of your healthcare experience.
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-slate-800">
            This guest view lets you see how HealthConnect makes care faster,
            clearer, and more user-friendly. Explore how patients describe their
            symptoms, how information flows to clinicians, and how health
            education supports safer decisions — all before you create an
            account.
          </p>
        </header>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-3">
          {/* 1. Patient Portal = maroon button */}
          <a
            href="#guest-patient-portal"
            className="btn btn-maroon text-sm md:text-base"
          >
            Patient Portal
          </a>

          {/* 2. Health education = outline lavender */}
          <a
            href="/education"
            className="btn btn-outline-lavender text-sm md:text-base text-slate-900"
          >
            Health education
          </a>

          {/* 3. Sign in to get started = outline lavender */}
          {!auth.isAuthenticated && (
            <button
              onClick={openSignInModal}
              className="btn btn-outline-lavender text-sm md:text-base text-slate-900"
            >
              Sign in to get started
            </button>
          )}
        </div>
      </section>

      {/* CONTENT SECTIONS */}
      <section className="w-full max-w-5xl mx-auto px-6 pb-16 space-y-10">
        <div
          className="grid gap-8 md:grid-cols-2 items-start"
          id="guest-patient-portal"
        >
          {/* Patient portal demo card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Patient portal (demo view)
            </h2>
            <p className="text-sm text-slate-800">
              In the full patient portal, you can clearly describe your
              symptoms, timing, and concerns. The system uses structured
              questions to organize your story, so your care team sees exactly
              what they need to know.
            </p>
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 text-xs text-slate-800">
              <div className="font-semibold mb-1">
                Example symptom summary (read-only)
              </div>
              <p>
                <span className="font-semibold">Main concern:</span> Chest
                discomfort and shortness of breath when walking up stairs.
              </p>
              <p>
                <span className="font-semibold">Started:</span> 3 days ago,
                gradually getting worse.
              </p>
              <p>
                <span className="font-semibold">Impact:</span> Needs to stop
                and rest after one flight of stairs. Feels “tight” in the chest.
              </p>
              <p className="text-xs text-slate-500 mt-2">
                In this guest demo, the form is not active. Sign in to describe
                your own symptoms and share them securely with your care team.
              </p>
            </div>
          </div>

          {/* Who we are / why start */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">
                Built for patients and clinicians
              </h2>
              <p className="text-sm text-slate-800">
                HealthConnect is designed with both sides of the visit in mind.
                Patients get clear guidance and a calm, step-by-step way to tell
                their story. Clinicians receive focused summaries instead of
                long, unstructured messages.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">
                Why sign up
              </h2>
              <p className="text-sm text-slate-800">
                When you create an account, you can use the full patient portal,
                receive tailored guidance, and share structured information with
                your clinic. This helps reduce back-and-forth phone calls and
                makes your visit more focused on what matters most.
              </p>
              {!auth.isAuthenticated && (
                <button
                  onClick={openSignInModal}
                  className="btn btn-outline-lavender text-sm mt-1 text-slate-900"
                >
                  Sign in to get started
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Health education preview */}
        <section
          id="guest-health-education"
          className="grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start"
        >
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Health education, in plain language
            </h2>
            <p className="text-sm text-slate-800">
              After using the patient portal, you can review clear, short
              guidance about common symptoms and red flags. This helps you
              decide when self-care is appropriate, when to seek routine care,
              and when to treat something as an emergency.
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-slate-900 bg-slate-900 p-4 text-xs text-slate-300">
            <h3 className="text-sm font-semibold text-slate-50">
              Sample health education (demo)
            </h3>
            <p>
              These are examples of the kind of information you might see after
              answering questions in the patient portal:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                Chest pain with shortness of breath, sweating, or nausea is an
                emergency. Call local emergency services.
              </li>
              <li>
                Sudden weakness on one side of the body, facial droop, or
                trouble speaking may be a stroke and needs urgent care.
              </li>
              <li>
                Mild cold symptoms without breathing problems are often
                appropriate for self-care, virtual care, or a walk-in clinic.
              </li>
            </ul>
          </div>
        </section>

        <p className="text-xs text-slate-500 max-w-2xl">
          This guest preview is for demonstration only. It does not replace
          professional medical advice, diagnosis, or treatment. If you think
          you are experiencing a medical emergency, call your local emergency
          number.
        </p>
      </section>

      {/* Local sign-in modal (only patient + clinician) */}
      {showSignInModal && !auth.isAuthenticated && (
        <div className="fixed inset-0 modal-scrim flex items-center justify-center z-50">
          <div className="modal-panel rounded-2xl w-[90%] max-w-xl p-7 relative animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-5 text-white">
              Sign in to get started
            </h2>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleSignIn("patient")}
                className="role-row text-white"
              >
                ○ Sign in as a Patient
              </button>

              <button
                onClick={() => handleSignIn("clinician")}
                className="role-row text-white"
              >
                ○ Sign in as a Clinician
              </button>
            </div>

            <button
              onClick={closeSignInModal}
              className="absolute top-3 right-4 text-white/70 hover:text-white text-xl"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* CareQuest AI chat for guests as well */}
      <ChatWidget />
    </main>
  );
}
