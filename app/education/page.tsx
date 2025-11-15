"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export default function EducationPage() {
  const [query, setQuery] = useState("");

  const filteredSymptoms = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return symptoms;

    return symptoms.filter((s) =>
      [s.title, s.tags, s.casual, s.clinical, s.reason].some((field) =>
        field.toLowerCase().includes(q)
      )
    );
  }, [query]);

  return (
    <main className="min-h-screen bg-white text-black">
      <StyleVariables />

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

          {/* Back button */}
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-white text-[var(--brand-maroon)] hover:bg-slate-100 transition text-sm font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* CONTENT */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-maroon)]">
          Health Education
        </h2>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Symptom phrasing guide
        </h1>

        <p className="mt-3 text-[15px] text-slate-600 leading-relaxed max-w-3xl">
          This page helps you turn everyday language into descriptions that are
          easier for clinicians to understand. You don’t need to know medical
          terms—just focus on when it <strong>started</strong>, where it{" "}
          <strong>is</strong>, what it <strong>feels like</strong>, what makes
          it <strong>better or worse</strong>, and how it{" "}
          <strong>affects your day</strong>.
        </p>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by symptom or keyword (e.g. chest pain, headache, rash, weight loss...)"
          className="mt-8 w-full rounded-[14px] border border-slate-200 px-5 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-maroon)]"
        />

        {/* GRID */}
        <div className="mt-10">
          {filteredSymptoms.length === 0 ? (
            <p className="text-sm text-slate-500">
              No examples match “<span className="font-semibold">{query}</span>
              ”. Try a different word like “pain”, “rash”, “breath”, or “sleep”.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredSymptoms.map((symptom, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-slate-900 text-white px-6 py-5 shadow-md"
                >
                  <h3 className="text-lg font-semibold">{symptom.title}</h3>
                  <div className="mt-1 text-[11px] uppercase tracking-wide text-slate-300">
                    {symptom.tags}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed">
                    <strong>How people often say it:</strong> <br />
                    {symptom.casual}
                  </p>

                  <p className="mt-4 text-sm leading-relaxed">
                    <strong>How you could phrase it to your doctor:</strong>{" "}
                    <br />
                    {symptom.clinical}
                  </p>

                  <p className="mt-4 text-sm leading-relaxed">
                    <strong>Why this helps:</strong> <br />
                    {symptom.reason}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTNOTE */}
        <p className="mt-10 text-[12px] text-slate-500 max-w-2xl">
          These examples are not scripts you must follow. They are meant to give
          you ideas for the kind of detail that can help your clinician
          understand what you’re experiencing and decide on the safest next
          steps.
        </p>
      </section>
    </main>
  );
}

/* --------------------------
   STYLE VARIABLES
--------------------------- */
function StyleVariables() {
  return (
    <style>{`
      :root {
        --brand-maroon: #6a1b1a;
        --brand-maroon-dark: #4a1a1a;
        --lavender: #c8b6ff;
        --lavender-light: #f3edff;
      }
    `}</style>
  );
}

/* --------------------------
   SYMPTOM DATA
--------------------------- */
const symptoms = [
  {
    title: "Chest discomfort with activity",
    tags: "CHEST PAIN • BREATHLESSNESS • HEART",
    casual:
      "I have chest pain when I go up stairs. It feels tight when I walk or climb stairs.",
    clinical:
      "I get a tight, squeezing pressure in the center of my chest whenever I walk or climb stairs. It usually improves after I rest for a few minutes.",
    reason:
      "This helps highlight triggers, location, and timing which gives your clinician more information than just saying 'chest pain'.",
  },
  {
    title: "Shortness of breath",
    tags: "BREATHING • ACTIVITY",
    casual: "I feel out of breath easily.",
    clinical:
      "Over the last 2 months I’ve started getting short of breath with light activity, like walking from my car. Sometimes I need to pause to catch my breath.",
    reason:
      "This shows how long it has been happening and what level of activity causes it.",
  },
  {
    title: "Sudden severe headache",
    tags: "HEADACHE • NEUROLOGY",
    casual: "Worst headache of my life.",
    clinical:
      "I had a sudden, severe headache that reached its worst intensity within a minute. It’s different from my usual headaches.",
    reason:
      "Sudden onset and 'worst ever' are important red flags for clinicians.",
  },
  {
    title: "Abdominal pain",
    tags: "STOMACH • ABDOMEN",
    casual: "I have deep pain that keeps hurting.",
    clinical:
      "For the past 3 days I’ve had constant cramping pain in the lower right side of my abdomen. It worsens when I move or cough.",
    reason:
      "Location, timing, and what makes pain better/worse helps narrow diagnosis.",
  },
  {
    title: "Low mood and lack of interest",
    tags: "MENTAL HEALTH • MOOD",
    casual: "I just feel off and not like myself.",
    clinical:
      "For the past 6 weeks I’ve had low mood most days and have lost interest in activities I normally enjoy. I’ve also been more tired than usual.",
    reason:
      "Duration, impact on functioning, and previous mood shifts are key clinical details.",
  },
  {
    title: "New skin rash",
    tags: "SKIN • IRRITATION",
    casual: "I got a rash a few weeks ago.",
    clinical:
      "I developed a red, itchy rash 3 weeks ago on my torso. It started after using a new detergent. It hasn’t gone away and I don’t have a fever.",
    reason:
      "Explains onset, appearance, triggers, and duration — more helpful than 'I have a rash'.",
  },
  {
    title: "Burning with urination",
    tags: "URINE • INFECTION",
    casual: "It hurts when I pee.",
    clinical:
      "Since yesterday I’ve had burning when urinating and feel the urge to go more often. The urine looks cloudy. There is no blood that I’ve noticed.",
    reason:
      "Symptom clarity plus associated findings helps clinicians assess infection risk.",
  },
  {
    title: "Swelling in legs or ankles",
    tags: "SWELLING • FLUID • LEGS",
    casual: "My feet and ankles are puffy by the end of the day.",
    clinical:
      "For the past month my ankles and lower legs have been noticeably swollen by the evening. The swelling improves overnight but comes back by the end of the day, especially if I’ve been standing a lot.",
    reason:
      "Describing location, timing, and what makes swelling better or worse helps your clinician think about circulation, fluid balance, and heart or kidney causes.",
  },
  {
    title: "Racing or irregular heartbeat",
    tags: "HEART • PALPITATIONS",
    casual: "Sometimes my heart just starts racing out of nowhere.",
    clinical:
      "A few times a week I suddenly feel my heart pounding fast and irregular for a few minutes, even when I’m resting. I sometimes feel lightheaded when it happens but I haven’t fainted.",
    reason:
      "Noting frequency, duration, and associated symptoms (like lightheadedness) is more useful than just saying 'palpitations'.",
  },
  {
    title: "Persistent cough",
    tags: "COUGH • LUNGS",
    casual: "I’ve had a cough that just won’t go away.",
    clinical:
      "I’ve had a dry cough for about 5 weeks. It’s worse at night and when I lie flat. I don’t have a fever, but I sometimes feel a mild tightness in my chest when I cough a lot.",
    reason:
      "Duration, type of cough (dry vs. phlegmy), timing, and triggers help differentiate infections, asthma, reflux, or other causes.",
  },
  {
    title: "Dizziness when standing up",
    tags: "DIZZINESS • BLOOD PRESSURE",
    casual: "I get dizzy when I stand up too fast.",
    clinical:
      "For the past 2 weeks I’ve felt lightheaded for a few seconds whenever I stand up from sitting or lying down. It usually passes quickly, but once I had to sit back down so I wouldn’t fall.",
    reason:
      "Connecting the symptom to position changes and describing how long it lasts helps your clinician consider blood pressure and circulation issues.",
  },
  {
    title: "Joint pain and morning stiffness",
    tags: "JOINTS • PAIN • STIFFNESS",
    casual: "My hands and knees are always sore, especially in the morning.",
    clinical:
      "For the last 3 months I’ve had aching and stiffness in both hands and knees. It’s worst in the morning and takes about an hour of moving around before it loosens up.",
    reason:
      "Mentioning which joints are involved, how long stiffness lasts, and how long it’s been going on helps distinguish between different types of arthritis.",
  },
  {
    title: "Trouble falling or staying asleep",
    tags: "SLEEP • INSOMNIA",
    casual: "I just can’t sleep properly lately.",
    clinical:
      "For about 6 weeks I’ve had trouble falling asleep, sometimes lying awake for over an hour. I wake up 2–3 times most nights and feel unrefreshed in the morning, even on weekends.",
    reason:
      "Detailing how long it’s been happening, how often you wake up, and how it affects your days gives a clearer picture than only saying 'I have insomnia'.",
  },
  {
    title: "Unintentional weight loss",
    tags: "WEIGHT CHANGE • APPETITE",
    casual: "I’ve lost weight without really trying.",
    clinical:
      "Over the last 3 months I’ve lost about 10 pounds without changing my diet or exercise. My clothes fit looser and I’ve noticed a slightly decreased appetite.",
    reason:
      "Quantifying how much weight you’ve lost and over what time period, plus appetite changes, helps your clinician judge how significant the weight loss is.",
  },
];
