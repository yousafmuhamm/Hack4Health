"use client";

import React, { useState } from "react";
import Link from "next/link";
import ChatWidget from "@/components/ChatWidget";

// Shared AWS login helper
function buildLoginUrl(role: "patient" | "clinician") {
  const redirectUri =
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://example.com/";

  // include returnPath in state
  const returnPath = role === "patient" ? "/patient" : "/clinician";

  const state = JSON.stringify({ role, returnPath });

  return (
     `https://us-west-2yshsyjevr.auth.us-west-2.amazoncognito.com/login` +
    `?client_id=4s6jh35ds200g1abjd19pqd9gv` +
    `&response_type=code` +
    `&scope=email+openid+profile` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${encodeURIComponent(state)}`
  );
}

export default function GuestPage() {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showChat, setShowChat] = useState(false);

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-[var(--maroon-700)] via-[var(--maroon-500)] to-[var(--maroon-300)] text-slate-50">
      {/* NAV */}
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        {/* Brand matches landing and links back to home */}
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[var(--brand-maroon)] font-bold">
            ❤️
          </span>
          <span className="text-lg font-semibold text-white">
            HealthConnect
          </span>
        </Link>

        <button
          onClick={() => setShowSignInModal(true)}
          className="btn btn-outline-lavender"
        >
          Sign in
        </button>
      </nav>

      {/* HERO CARD */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-10">
        <div className="rounded-3xl border border-white/10 bg-white/95 p-6 text-slate-900 shadow-xl lg:p-8">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Guest preview
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
            Built to support safer care.
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-800">
            HealthConnect was created because we care about patient safety and
            the wellbeing of clinicians. By organizing pre-consult information,
            reducing repeated storytelling, and making next steps clearer, the
            platform helps patients avoid unsafe delays while giving clinicians
            a calmer, more structured workflow. These are some of the reasons we
            built this website.
          </p>

          {/* CTA row – only Health education, using maroon styling */}
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/education" className="btn btn-maroon">
              Health education
            </a>
          </div>
        </div>
      </section>

      {/* SIGN IN MODAL */}
      {showSignInModal && (
        <div className="modal-scrim fixed inset-0 z-50 flex items-center justify-center">
          <div className="modal-panel relative w-[90%] max-w-xl rounded-2xl p-7 shadow-xl animate-fadeIn">
            <h2 className="mb-5 text-2xl font-semibold text-white">
              Sign in to get started
            </h2>

            <div className="flex flex-col gap-4">
              <button
                onClick={() =>
                  (window.location.href = buildLoginUrl("patient"))
                }
                className="role-row text-white"
              >
                ○ Sign in as a Patient
              </button>

              <button
                onClick={() =>
                  (window.location.href = buildLoginUrl("clinician"))
                }
                className="role-row text-white"
              >
                ○ Sign in as a Clinician
              </button>
            </div>

            <button
              onClick={() => setShowSignInModal(false)}
              className="absolute right-4 top-3 text-xl text-white/70 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Floating CareQuest AI button */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-4 right-4 z-40 rounded-full bg-[var(--brand-maroon)] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg hover:bg-[var(--brand-maroon-dark)]"
      >
        CareQuest AI
      </button>

      {/* CareQuest AI popup */}
      {showChat && (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm rounded-3xl border border-[var(--lavender-400)] bg-[var(--popup-bg)]/95 shadow-2xl shadow-black/50 backdrop-blur-md overflow-hidden">
          {/* Header with single CareQuest AI label */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-100">
              CareQuest AI
            </span>
            <button
              onClick={() => setShowChat(false)}
              className="text-lg leading-none text-slate-300 hover:text-white"
            >
              ×
            </button>
          </div>

          {/* Chat content – now just one box total */}
          <ChatWidget variant="popup" />
        </div>
      )}
    </main>
  );
}
