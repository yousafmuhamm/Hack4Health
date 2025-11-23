"use client";

import React, { useMemo, useState } from "react";
import ChatWidget from "@/components/ChatWidget";
import Link from "next/link";


type SymptomEntry = {
  id: string;
  label: string;
  everyday: string;
  clinical: string;
  why: string;
  tags: string[];
};

const ENTRIES: SymptomEntry[] = [
  {
    id: "chest-pain-exertion",
    label: "Chest discomfort with activity",
    everyday: "My chest feels weird or tight when I walk or climb stairs.",
    clinical:
      "I get a tight, squeezing discomfort in the centre of my chest when I walk or climb stairs. It usually improves after I rest for a few minutes.",
    why: "Describing what triggers it (walking, stairs), where it is (centre of chest), and what makes it better (rest) gives your clinician much clearer information than just saying 'chest pain'.",
    tags: ["chest pain", "breathless", "heart"],
  },
  {
    id: "shortness-breath",
    label: "Shortness of breath",
    everyday: "I feel out of breath a lot.",
    clinical:
      "Over the past few days, I have been getting short of breath with light activity, like walking across a room. I sometimes need to pause to catch my breath. I do not usually feel this way.",
    why: "Mentioning how long it has been happening and what level of activity causes it helps your clinician judge how urgent this might be.",
    tags: ["breathing", "lungs"],
  },
  {
    id: "headache-sudden",
    label: "Sudden severe headache",
    everyday: "I had the worst headache of my life.",
    clinical:
      "Earlier today, I developed a sudden, very severe headache that reached full intensity within a minute. It is different from my usual headaches or migraines.",
    why: "For headaches, timing and how different it feels from your usual pattern are important for identifying red flags.",
    tags: ["headache", "neurology"],
  },
  {
    id: "abdominal-pain",
    label: "Abdominal pain",
    everyday: "My stomach has really been hurting.",
    clinical:
      "For the last 24 hours, I have had a constant cramping pain in the lower right side of my abdomen. It gets worse when I move or cough. I feel a bit nauseated but have not vomited.",
    why: "Location, timing, and what makes pain better or worse help narrow down possible causes.",
    tags: ["stomach", "abdomen"],
  },
  {
    id: "mood-low",
    label: "Low mood and lack of interest",
    everyday: "I just feel off and not like myself.",
    clinical:
      "For the past few weeks, I have felt low most days and have lost interest in activities I usually enjoy. My sleep and appetite have changed, and it is harder to get things done.",
    why: "Giving a time frame and specific changes (sleep, appetite, interest) helps your clinician understand how your mood is affecting daily life.",
    tags: ["mental health", "mood"],
  },
  {
    id: "rash",
    label: "New skin rash",
    everyday: "I got a random rash.",
    clinical:
      "I developed a red, itchy rash on both arms two days ago. It started after I used a new soap. There are no blisters, and I do not have a fever.",
    why: "Describing when the rash started, where it is on your body, what it looks like, and any possible triggers is more helpful than just saying 'rash'.",
    tags: ["skin", "rash"],
  },
  {
    id: "urinary",
    label: "Burning with urination",
    everyday: "It hurts when I pee.",
    clinical:
      "Since yesterday, I have had burning when I urinate and feel the urge to go more often, with only small amounts each time. There is no blood that I can see.",
    why: "Including timing and associated symptoms (frequency, urgency, blood) helps point toward or away from a urinary infection.",
    tags: ["urine", "infection"],
  },
];

// Shared AWS login helper for Sign up button
function buildLoginUrl(role: "patient" | "clinician") {
  const redirectUri =
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:3000"
       : "https://main.d2rm24vunvbzge.amplifyapp.com"; // match landing env

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

export default function EducationPage() {
  const [query, setQuery] = useState("");
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ENTRIES;
    return ENTRIES.filter((entry) => {
      const haystack =
        `${entry.label} ${entry.everyday} ${entry.clinical} ${entry.tags.join(
          " "
        )}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--maroon-700)] via-[var(--maroon-500)] to-[var(--maroon-300)] text-slate-50">
      {/* NAVBAR MATCHING LANDING PAGE */}
<nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
  <Link href="/" className="flex items-center gap-2">
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[var(--brand-maroon)] font-bold">
      ❤️
    </span>
    <span className="text-lg font-semibold text-white">HealthConnect</span>
  </Link>
</nav>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="space-y-8 rounded-3xl border border-white/10 bg-white/95 p-6 text-slate-900 shadow-xl lg:p-8">
          {/* Header + Sign up */}
          <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Health education
              </p>
              <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                Symptom phrasing guide
              </h1>
              <p className="max-w-2xl text-sm text-slate-800 md:text-base">
                This page helps you turn everyday language into descriptions
                that are easier for clinicians to understand. You don&apos;t
                need to know medical terms—just focus on{" "}
                <span className="font-semibold">
                  when it started, where it is, what it feels like, what makes
                  it better or worse, and how it affects your day.
                </span>
              </p>
              <p className="max-w-xl text-xs text-slate-500">
                This information is for education only and does not replace
                professional medical advice, diagnosis, or emergency care.
              </p>
            </div>

            <button
              onClick={() => setShowSignUpModal(true)}
              className="self-start rounded-full bg-[var(--brand-maroon)] px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-[var(--brand-maroon-dark)]"
            >
              Sign up
            </button>
          </section>

          {/* Search */}
          <section className="space-y-2">
            <label
              htmlFor="symptom-search"
              className="text-sm font-medium text-slate-800"
            >
              Search by symptom or keyword
            </label>
            <input
              id="symptom-search"
              type="text"
              className="w-full max-w-md rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="e.g. chest pain, headache, rash, mood…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <p className="text-xs text-slate-500">
              Try searching for a symptom or body part and see examples of how
              you might describe it during a visit.
            </p>
          </section>

          {/* Dictionary entries */}
          <section className="space-y-4">
            {filtered.length === 0 && (
              <p className="text-sm text-slate-600">
                No examples found for that search yet. Try a more general
                symptom like <span className="italic">pain</span>,{" "}
                <span className="italic">breathing</span>, or{" "}
                <span className="italic">mood</span>.
              </p>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((entry) => (
                <article
                  key={entry.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-900 p-4 text-slate-100"
                >
                  <header>
                    <h2 className="text-sm font-semibold text-slate-50">
                      {entry.label}
                    </h2>
                    {entry.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </header>

                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="font-semibold text-slate-200">
                        How people often say it
                      </div>
                      <p className="text-slate-200">{entry.everyday}</p>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">
                        How you could say it to your doctor
                      </div>
                      <p className="text-slate-100">{entry.clinical}</p>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">
                        Why this helps
                      </div>
                      <p className="text-slate-300">{entry.why}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Footer note */}
          <section className="border-t border-slate-200 pt-4">
            <p className="max-w-2xl text-xs text-slate-500">
              These examples are not scripts you must follow. They are meant to
              give you ideas for the kind of detail that can help your clinician
              understand what you&apos;re experiencing and decide on the safest
              next steps.
            </p>
          </section>
        </div>
      </div>

      {/* Sign up modal: patient / clinician */}
      {showSignUpModal && (
        <div className="modal-scrim fixed inset-0 z-50 flex items-center justify-center">
          <div className="modal-panel relative w-[90%] max-w-xl rounded-2xl p-7 shadow-xl animate-fadeIn">
            <h2 className="mb-5 text-2xl font-semibold text-white">
              Sign up to use the portal
            </h2>

            <div className="flex flex-col gap-4">
              <button
                onClick={() =>
                  (window.location.href = buildLoginUrl("patient"))
                }
                className="role-row text-white"
              >
                ○ Sign up as a Patient
              </button>

              <button
                onClick={() =>
                  (window.location.href = buildLoginUrl("clinician"))
                }
                className="role-row text-white"
              >
                ○ Sign up as a Clinician
              </button>
            </div>

            <button
              onClick={() => setShowSignUpModal(false)}
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
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-100">
        CareQuest AI
      </span>
      <button
        onClick={() => setShowChat(false)}
        className="text-lg text-slate-300 hover:text-white leading-none"
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
