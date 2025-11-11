// app/page.tsx

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-400">
          Hack4Health 2025
        </p>
        <h1 className="text-3xl font-bold text-slate-50 md:text-4xl">
          CareCompass AI
        </h1>
        <p className="max-w-2xl text-sm text-slate-300 md:text-base">
          An AI-assisted healthcare navigation and screening platform
          that helps patients find the right level of care, and helps
          family physicians reduce burnout by automating routine
          screening and follow-up tasks.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            href="/patient"
            className="rounded-md bg-sky-500 px-4 py-2 font-medium text-slate-950 hover:bg-sky-400"
          >
            Try patient navigation
          </Link>
          <Link
            href="/clinician"
            className="rounded-md border border-slate-700 px-4 py-2 font-medium text-slate-100 hover:border-slate-500"
          >
            Open clinician dashboard
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3 text-sm">
        <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="text-sm font-semibold text-slate-100">
            1. Chatbot triage & education
          </h2>
          <p className="text-slate-300">
            Patients describe their symptoms in their own words. The AI
            highlights red-flag patterns, explains common symptom
            meanings, and suggests the appropriate level of care without
            making a diagnosis.
          </p>
        </div>
        <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="text-sm font-semibold text-slate-100">
            2. Pre-consult EMR-style view
          </h2>
          <p className="text-slate-300">
            Pre-consult summaries flow into a clinician dashboard,
            giving family physicians a quick, structured view of what the
            patient reported before they even enter the room.
          </p>
        </div>
        <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="text-sm font-semibold text-slate-100">
            3. Smart screening scheduler
          </h2>
          <p className="text-slate-300">
            Routine tasks like mammograms, BMD scans, INR checks, and
            refills are turned into auto-generated tasks, so front desk
            and physicians don&apos;t spend hours chasing recalls.
          </p>
        </div>
      </section>

      <section className="space-y-2 text-xs text-slate-400">
        <p>
          This demo does not diagnose or replace clinical judgment. It
          is designed to showcase how AI can support navigation, equity,
          and physician well-being in a safe, privacy-conscious way.
        </p>
      </section>
    </div>
  );
}
