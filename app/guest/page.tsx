"use client";

import React, { useState } from "react";
import ProfileMenu from "@/components/ProfileMenu";
import ChatWidget from "@/components/ChatWidget";

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

export default function GuestPage() {
  const [showSignInModal, setShowSignInModal] = useState(false);

  return (
    <main className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* NAV */}
      <nav className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--brand-maroon)] text-white grid place-items-center font-bold">
            H
          </div>
          <span className="font-semibold text-lg">HealthConnect</span>
        </div>

        <button
          onClick={() => setShowSignInModal(true)}
          className="btn btn-outline-lavender"
        >
          Sign in
        </button>
      </nav>

      {/* HERO */}
      <section className="w-full max-w-5xl mx-auto px-6 py-12">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Guest preview
        </p>
        <h1 className="text-4xl font-bold text-slate-900">
          Take control of your healthcare experience.
        </h1>
        <p className="max-w-2xl text-sm text-slate-800 mt-4">
          Explore how HealthConnect helps patients describe their symptoms...
        </p>

        <div className="flex gap-3 mt-6 flex-wrap">
          <a href="#guest-patient-portal" className="btn btn-maroon">
            Patient Portal
          </a>

          <a href="/education" className="btn btn-outline-lavender">
            Health education
          </a>

          <button
            onClick={() => setShowSignInModal(true)}
            className="btn btn-outline-lavender"
          >
            Sign in to get started
          </button>
        </div>
      </section>

      {/* SIGN IN MODAL */}
      {showSignInModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="modal-panel rounded-2xl w-[90%] max-w-xl p-7 relative">
            <h2 className="text-2xl font-semibold mb-5 text-white">
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
              className="absolute top-3 right-4 text-white/70 hover:text-white text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <ChatWidget />
    </main>
  );
}
