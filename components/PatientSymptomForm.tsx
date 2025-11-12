"use client";

import { useState } from "react";
import { SymptomInput } from "@/lib/types";

export default function PatientSymptomForm({
  onSubmit,
}: {
  onSubmit: (input: SymptomInput) => void;
}) {
  const [age, setAge] = useState<number>(30);
  const [symptoms, setSymptoms] = useState<string>("");
  const [onset, setOnset] = useState<string>("");
  const [severity, setSeverity] = useState<SymptomInput["severity"]>("mild");
  const [redFlags, setRedFlags] = useState<boolean>(false);

  return (
    <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <h2 className="text-sm font-semibold text-slate-100">Describe your symptoms</h2>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="text-xs text-slate-300">
          Age
          <input
            type="number"
            min={0}
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value || "0", 10))}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950/40 p-2 text-slate-100 outline-none focus:border-blue-500"
          />
        </label>

        <label className="text-xs text-slate-300">
          Onset (e.g., “2 days”, “sudden”)
          <input
            type="text"
            value={onset}
            onChange={(e) => setOnset(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950/40 p-2 text-slate-100 outline-none focus:border-blue-500"
          />
        </label>
      </div>

      <label className="text-xs text-slate-300 block">
        Symptoms (free text)
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950/40 p-2 text-slate-100 outline-none focus:border-blue-500"
          placeholder="e.g., sore throat, cough, chest pain..."
        />
      </label>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="text-xs text-slate-300">
          Severity
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as any)}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950/40 p-2 text-slate-100 outline-none focus:border-blue-500"
          >
            <option value="mild">mild</option>
            <option value="moderate">moderate</option>
            <option value="severe">severe</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-xs text-slate-300 mt-6 md:mt-0">
          <input
            type="checkbox"
            checked={redFlags}
            onChange={(e) => setRedFlags(e.target.checked)}
            className="h-4 w-4"
          />
          Red flags (e.g., severe trouble breathing, confusion, bluish lips)
        </label>
      </div>

      <div className="pt-2">
        <button
          onClick={() =>
            onSubmit({ age, symptoms, onset, severity, redFlags })
          }
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Check urgency
        </button>
      </div>
    </section>
  );
}
