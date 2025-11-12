"use client";

import { useEffect, useState } from "react";

const KEY = "hc_med_history_v1";

export default function MedicalHistoryCard() {
  const [history, setHistory] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem(KEY);
    if (v) setHistory(v);
  }, []);

  function save() {
    localStorage.setItem(KEY, history);
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
  }

  function clearIt() {
    localStorage.removeItem(KEY);
    setHistory("");
  }

  return (
    <section className="card p-4 bg-[var(--surface)]">
      <h2 className="text-lg font-semibold mb-2">Medical history (optional)</h2>
      <p className="text-sm text-[var(--fg-muted)] mb-3">
        Add any information you want to keep handy (conditions, allergies,
        medications, surgeries). You control what you store here.
      </p>
      <textarea
        className="w-full min-h-[140px] rounded-lg border border-[var(--accent-strong)]/30 p-3 outline-none focus:ring-2 focus:ring-[var(--accent-strong)] bg-white"
        value={history}
        onChange={(e) => setHistory(e.target.value)}
        placeholder="- Penicillin allergy
- Asthma diagnosed 2015
- Ibuprofen 200mg as needed"
      />
      <div className="mt-3 flex gap-2">
        <button onClick={save} className="btn btn-maroon">
          Save
        </button>
        <button onClick={clearIt} className="btn btn-outline-lavender">
          Clear
        </button>
        {saved && (
          <span className="text-sm text-[var(--fg-muted)] self-center">
            Saved ✓
          </span>
        )}
      </div>
    </section>
  );
}
