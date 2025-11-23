"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ChatWidget from "@/components/ChatWidget";
import { useRouter } from "next/navigation";

type Role = "patient" | "clinician" | "guest";

export default function HealthConnectLanding() {
  const router = useRouter();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showChat, setShowChat] = useState(false);

  /* --------------------------
     AWS COGNITO LOGIN
  --------------------------- */

  const redirectUri =
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://main.d2rm24vunvbzge.amplifyapp.com";

  // Build Cognito login URL, embedding role + returnPath into `state`
  const buildLoginUrl = (role: Role) => {
    const returnPath =
      role === "clinician"
        ? "/clinician"
        : role === "patient"
        ? "/patient"
        : "/";

    const stateObj = JSON.stringify({
      role,
      returnPath,
    });

    return (
      `https://healthconnect.auth.us-west-2.amazoncognito.com/login` +
      `?client_id=4s6jh35ds200g1abjd19pqd9gv` +
      `&response_type=code` +
      `&scope=email+openid+profile` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&state=${encodeURIComponent(stateObj)}`
    );
  };

  const handleRoleLogin = (role: Role) => {
    if (role === "guest") {
      setShowRoleModal(false);
      router.push("/guest");
      return;
    }

    setShowRoleModal(false);

    const url = buildLoginUrl(role);
    window.location.href = url;
  };

  /* --------------------------
     Detect Cognito redirect
  --------------------------- */
  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const stateRaw = params.get("state");

    if (code && stateRaw) {
      try {
        // stateRaw was URL-encoded JSON, URLSearchParams already decoded it
        const state = JSON.parse(stateRaw) as {
          role?: string;
          returnPath?: string;
        };

        if (state.role) {
          localStorage.setItem("role", state.role);
        }

        if (state.returnPath) {
          // Redirect to clinician/patient dashboard after successful login
          router.replace(state.returnPath);
          return;
        }
      } catch (e) {
        console.error("Invalid state JSON from Cognito redirect:", e);
      }
    }
  }, [router]);

  /* --------------------------
     UI START
  --------------------------- */
  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--maroon-700)] via-[var(--maroon-500)] to-[var(--maroon-300)] text-slate-50">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--brand-maroon)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[var(--brand-maroon)] font-bold">
              ❤️
            </span>
            <span className="text-lg font-semibold text-white">
              HealthConnect
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden gap-6 text-sm text-white/90 md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#how" className="transition hover:text-white">
              How it Works
            </a>
            <a href="#faq" className="transition hover:text-white">
              FAQ
            </a>
          </nav>

          {/* Buttons */}
          <button
            onClick={() => setShowRoleModal(true)}
            className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-[var(--brand-maroon)] shadow-sm transition hover:bg-slate-100"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="px-4 pt-10 pb-16">
        <div className="mx-auto grid max-w-6xl gap-10 rounded-3xl border border-white/10 bg-white/95 p-6 text-slate-900 shadow-xl md:grid-cols-2 lg:p-8">
          {/* LEFT */}
          <div className="max-w-[540px]">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--lavender-light)] px-3 py-1 text-xs font-semibold text-[var(--brand-maroon)]">
              ❤️ HealthConnect
            </span>

            <h1 className="mt-4 text-[36px] font-bold leading-[1.12] sm:text-[46px] lg:text-[54px]">
              Smarter care,
              <br /> stronger outcomes.
            </h1>

            <p className="mt-4 max-w-[500px] text-[18px] leading-[1.6] text-black/70">
              A modern digital health platform that supports patients and
              clinicians with clearer communication, structured pre-consults,
              and guided health insights — all in one place.
            </p>

            <ul className="mt-4 space-y-1 text-sm text-slate-700">
              <li>
                • Patients only need to share their story once — clearly and in
                their own words.
              </li>
              <li>
                • Every pre-consult is carefully reviewed by a real clinician
                before any referral decisions are made.
              </li>
              <li>
                • If your case is deferred, you receive a clear note with
                concrete next steps, so you&apos;re never left guessing.
              </li>
            </ul>

            <div className="mt-7 flex flex-wrap gap-4">
              <button
                onClick={() => setShowRoleModal(true)}
                className="h-[52px] rounded-[40px] bg-[var(--brand-maroon)] px-8 font-semibold text-white shadow-sm transition hover:bg-[var(--brand-maroon-dark)]"
              >
                Get Started
              </button>

              <Link
                href="/education"
                className="grid h-[52px] place-items-center rounded-[40px] border border-[var(--lavender)] px-8 font-semibold text-[var(--brand-maroon)] transition hover:bg-[var(--lavender-light)]"
              >
                Health Education
              </Link>
            </div>
          </div>

          {/* RIGHT — Patient & clinician feedback */}
          <div className="self-start">
            <div className="space-y-4 rounded-[24px] border border-black/10 bg-white p-6 shadow-lg">
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--lavender-light)] px-3 py-1 text-xs font-semibold text-[var(--brand-maroon)]">
                ⭐ Patient & clinician feedback
              </span>

              <div className="space-y-3 text-[14px] leading-[1.6] text-[#111]">
                <p>
                  “The pre-consult form made my visit smoother. My doctor knew
                  my symptoms before I even arrived.”
                </p>
                <div className="text-[12px] text-[#777]">— Sarah M., patient</div>

                <hr className="border-dashed border-slate-200" />

                <p>
                  “I felt less anxious walking into my appointment because I had
                  already written everything down. My doctor could focus on what
                  to do next instead of trying to piece my story together.”
                </p>
                <div className="text-[12px] text-[#777]">
                  — Daniel R., patient
                </div>

                <hr className="border-dashed border-slate-200" />

                <p>
                  “Instead of spending the whole appointment trying to understand
                  the story, I can go straight to decisions and next steps.”
                </p>
                <div className="text-[12px] text-[#777]">
                  — Dr. L. Ahmed, family physician
                </div>

                <hr className="border-dashed border-slate-200" />

                <p>
                  “Having a clear summary before I walk into the room makes it
                  easier to stay present with each patient, instead of
                  scrambling through notes.”
                </p>
                <div className="text-[12px] text-[#777]">
                  — Dr. S. Patel, family physician
                </div>

                <hr className="border-dashed border-slate-200" />

                <p className="text-[13px] text-slate-700">
                  If your case isn&apos;t appropriate for a referral, your
                  clinician can send a short note with concrete next steps
                  (e.g., urgent care vs routine follow-up), so you&apos;re never
                  left guessing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-4 pb-12">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/95 p-6 text-slate-900 shadow-lg lg:p-8">
          <h2 className="text-2xl font-semibold text-[var(--brand-maroon)]">
            Why HealthConnect?
          </h2>
          <p className="mt-2 text-slate-600">
            Tools to support safer and more efficient care.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Feature
              icon="📝"
              title="Structured Pre-Consults"
              desc="Patients provide answers ahead of time so clinicians can prepare efficiently."
            />
            <Feature
              icon="🔍"
              title="Guided Triage Assistance"
              desc="Smart question pathways help patients express their symptoms clearly."
            />
            <Feature
              icon="🤝"
              title="Clinician Dashboard"
              desc="Organized insights and history summaries for safer care decisions."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="px-4 pb-12">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/95 p-6 text-slate-900 shadow-lg lg:p-8">
          <h2 className="text-2xl font-semibold text-[var(--brand-maroon)]">
            How it Works
          </h2>

          <div className="mt-6 grid gap-6 text-slate-700 md:grid-cols-3">
            <Step
              n={1}
              title="Pick your role"
              desc="Sign in as a patient, clinician, or explore as a guest."
            />
            <Step
              n={2}
              title="Access guidance"
              desc="Fill in symptoms or browse education to understand your next steps."
            />
            <Step
              n={3}
              title="Support your care"
              desc="Clinicians review your case, accept or defer it, and can send a note with clear next steps."
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 pb-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/95 p-6 text-slate-900 shadow-lg lg:p-8">
          <h2 className="text-2xl font-semibold text-[var(--brand-maroon)]">
            Frequently Asked Questions
          </h2>

          <div className="mt-6 divide-y rounded-xl border bg-white">
            <details className="px-4 py-4">
              <summary className="cursor-pointer text-slate-900">
                Is HealthConnect free?
              </summary>
              <p className="pt-2 text-slate-600">
                Yes — all core features are free during development.
              </p>
            </details>

            <details className="px-4 py-4">
              <summary className="cursor-pointer text-slate-900">
                Is this real medical advice?
              </summary>
              <p className="pt-2 text-slate-600">
                No — the platform supports communication but does not replace
                professional diagnosis.
              </p>
            </details>

            <details className="px-4 py-4">
              <summary className="cursor-pointer text-slate-900">
                How do clinicians access the dashboard?
              </summary>
              <p className="pt-2 text-slate-600">
                Clinicians must sign in and will automatically receive access to
                the dashboard.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-200 md:flex-row">
          <p>© {new Date().getFullYear()} HealthConnect</p>
          <div className="flex items-center gap-6">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>

      {/* ROLE SELECT MODAL */}
      {showRoleModal && (
        <div className="modal-scrim fixed inset-0 z-50 flex items-center justify-center">
          <div className="modal-panel relative w-[90%] max-w-xl rounded-2xl p-7 shadow-xl animate-fadeIn">
            <h2 className="mb-5 text-2xl font-semibold text-white">
              Who are you using this tool as?
            </h2>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleRoleLogin("patient")}
                className="role-row text-white"
              >
                ○ A Patient looking for guidance
              </button>

              <button
                onClick={() => handleRoleLogin("clinician")}
                className="role-row text-white"
              >
                ○ A Clinician supporting a patient
              </button>

              <button
                onClick={() => handleRoleLogin("guest")}
                className="role-row text-white"
              >
                ○ A Guest just exploring the tool
              </button>
            </div>

            <button
              onClick={() => setShowRoleModal(false)}
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

      {/* CareQuest AI popup (bottom-right) */}
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

/* --------------------------
   FEATURE COMPONENT
--------------------------- */
function Feature({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-[2px] hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--lavender-light)] text-lg text-[var(--brand-maroon)]">
          {icon}
        </div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
    </div>
  );
}

/* --------------------------
   STEP COMPONENT
--------------------------- */
function Step({
  n,
  title,
  desc,
}: {
  n: number;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 transition hover:bg-slate-50">
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--brand-maroon)] text-sm font-semibold text-white">
          {n}
        </div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
    </div>
  );
}
