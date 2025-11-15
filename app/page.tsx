"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProfileMenu from "@/components/ProfileMenu";
import ChatWidget from "@/components/ChatWidget";
import { useRouter } from "next/navigation";

type Role = "patient" | "clinician" | "guest";

export default function HealthConnectLanding() {
  const router = useRouter();
  const [showRoleModal, setShowRoleModal] = useState(false);

  /* --------------------------
     AWS COGNITO LOGIN
  --------------------------- */

  const redirectUri =
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://your-production-url.com/"; // change this later

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
    <main className="min-h-screen bg-white text-black">
      <StyleAnimations />

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-[var(--brand-maroon)] text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[var(--brand-maroon)] font-bold">
              ❤️
            </span>
            <span className="text-lg font-semibold">HealthConnect</span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex gap-6 text-sm text-white/90">
            <a href="#features" className="hover:text-white transition">
              Features
            </a>
            <a href="#how" className="hover:text-white transition">
              How it Works
            </a>
            <a href="#faq" className="hover:text-white transition">
              FAQ
            </a>
          </nav>

          {/* Buttons */}
          <button
            onClick={() => setShowRoleModal(true)}
            className="px-4 py-2 rounded-xl bg-white text-[var(--brand-maroon)] hover:bg-slate-100 transition"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 pt-14 pb-20 grid md:grid-cols-2 gap-10">
          {/* LEFT */}
          <div className="max-w-[540px]">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--lavender-light)] text-[var(--brand-maroon)] px-3 py-1 text-xs font-semibold">
              ❤️ HealthConnect
            </span>

            <h1 className="mt-4 text-[36px] sm:text-[46px] lg:text-[54px] font-bold leading-[1.12]">
              Smarter care,
              <br /> stronger outcomes.
            </h1>

            <p className="mt-4 text-[18px] leading-[1.6] text-black/70 max-w-[500px]">
              A modern digital health platform that supports patients and
              clinicians with clearer communication, structured pre-consults,
              and guided health insights — all in one place.
            </p>

            <div className="mt-7 flex gap-4">
              <button
                onClick={() => setShowRoleModal(true)}
                className="px-8 h-[52px] rounded-[40px] bg-[var(--brand-maroon)] text-white hover:bg-[var(--brand-maroon-dark)] transition font-semibold shadow-sm"
              >
                Get Started
              </button>

              <Link
                href="/education"
                className="px-8 h-[52px] grid place-items-center rounded-[40px] border border-[var(--lavender)] text-[var(--brand-maroon)] hover:bg-[var(--lavender-light)] transition font-semibold"
              >
                Health Education
              </Link>
            </div>
          </div>

          {/* RIGHT — Small highlight box */}
          <div className="self-start">
            <div className="rounded-[24px] border border-black/10 bg-white p-6 shadow-lg">
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--lavender-light)] text-[var(--brand-maroon)] px-3 py-1 text-xs font-semibold">
                ⭐ Patient Feedback
              </span>

              <p className="mt-3 text-[18px] leading-[1.6] text-[#111]">
                “The pre-consult form made my visit smoother. My doctor knew my
                symptoms before I even arrived.”
              </p>

              <div className="mt-3 text-[13px] text-[#777]">— Sarah M.</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-semibold text-[var(--brand-maroon)]">
            Why HealthConnect?
          </h2>
          <p className="mt-2 text-slate-600">
            Tools to support safer and more efficient care.
          </p>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
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
      <section id="how" className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-semibold text-[var(--brand-maroon)]">
            How it Works
          </h2>

          <div className="mt-6 grid md:grid-cols-3 gap-6 text-slate-700">
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
              desc="Clinicians receive summaries and screening tasks to improve visits."
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-14">
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
      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[var(--brand-maroon)] p-7 rounded-2xl w-[90%] max-w-xl relative text-white shadow-xl animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-5">
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
    <div className="rounded-2xl border p-5 bg-white shadow-sm hover:shadow-md hover:-translate-y-[2px] transition">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 grid place-items-center rounded-xl bg-[var(--lavender-light)] text-[var(--brand-maroon)] text-lg">
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
    <div className="rounded-2xl border bg-white p-5 hover:bg-slate-50 transition">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 grid place-items-center rounded-lg bg-[var(--brand-maroon)] text-white text-sm font-semibold">
          {n}
        </div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
    </div>
  );
}

/* --------------------------
   ANIMATIONS
--------------------------- */
function StyleAnimations() {
  return (
    <style>{`
      :root {
        --brand-maroon: #6a1b1a;
        --brand-maroon-dark: #4a1a1a;
        --lavender: #c8b6ff;
        --lavender-light: #f3edff;
      }

      .animate-fadeIn {
        animation: fadeIn .25s ease-out;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: scale(.97); }
        to { opacity: 1; transform: scale(1); }
      }
    `}</style>
  );
}
