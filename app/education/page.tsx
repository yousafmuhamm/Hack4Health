"use client";

import React, { useMemo, useState } from "react";

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

export default function EducationPage() {
  const [query, setQuery] = useState("");

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
    <main className="min-h-screen bg-white text-slate-900">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <section className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Health education
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Symptom phrasing guide
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-slate-800">
            This page helps you turn everyday language into descriptions that
            are easier for clinicians to understand. You don&apos;t need to know
            medical terms—just focus on{" "}
            <span className="font-semibold">
              when it started, where it is, what it feels like, what makes it
              better or worse, and how it affects your day.
            </span>
          </p>
          <p className="text-xs text-slate-500 max-w-xl">
            This information is for education only and does not replace
            professional medical advice, diagnosis, or emergency care.
          </p>
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
            className="w-full max-w-md rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            placeholder="e.g. chest pain, headache, rash, mood…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <p className="text-xs text-slate-500">
            Try searching for a symptom or body part and see examples of how you
            might describe it during a visit.
          </p>
        </section>

        {/* Dictionary entries */}
        <section className="space-y-4">
          {filtered.length === 0 && (
            <p className="text-sm text-slate-600">
              No examples found for that search yet. Try a more general symptom
              like <span className="italic">pain</span>,{" "}
              <span className="italic">breathing</span>, or{" "}
              <span className="italic">mood</span>.
            </p>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((entry) => (
              <article
                key={entry.id}
                className="rounded-2xl border border-slate-200 bg-slate-900 text-slate-100 p-4 flex flex-col gap-3"
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
        <section className="pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 max-w-2xl">
            These examples are not scripts you must follow. They are meant to
            give you ideas for the kind of detail that can help your clinician
            understand what you&apos;re experiencing and decide on the safest
            next steps.
          </p>
        </section>
      </div>
    </main>
  );
}
