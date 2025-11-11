// components/PatientSymptomForm.tsx
'use client';

import { FormEvent, useState } from 'react';
import { SymptomInput } from '@/lib/types';

interface Props {
  onSubmit: (input: SymptomInput) => void;
}

export default function PatientSymptomForm({ onSubmit }: Props) {
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>(
    'mild'
  );
  const [redFlags, setRedFlags] = useState({
    chestPain: false,
    breathingDifficulty: false,
    facialDroop: false,
    weakness: false,
    confusion: false,
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;

    const input: SymptomInput = {
      description,
      duration,
      severity,
      redFlags,
    };

    onSubmit(input);
  }

  function toggleFlag(key: keyof typeof redFlags) {
    setRedFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4"
    >
      <h2 className="text-lg font-semibold text-slate-100">
        Tell us what&apos;s going on
      </h2>

      <label className="block text-sm text-slate-200 space-y-1">
        <span>Describe your symptoms in your own words</span>
        <textarea
          className="w-full rounded-md border border-slate-700 bg-slate-950 p-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. My chest feels tight and I'm short of breath..."
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm text-slate-200 space-y-1">
          <span>How long has this been going on?</span>
          <input
            className="w-full rounded-md border border-slate-700 bg-slate-950 p-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g. 30 minutes, 2 days, 3 weeks"
          />
        </label>

        <div className="block text-sm text-slate-200 space-y-1">
          <span>How bad is it?</span>
          <div className="flex gap-2">
            {(['mild', 'moderate', 'severe'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSeverity(level)}
                className={`flex-1 rounded-md border px-2 py-1 text-xs capitalize ${
                  severity === level
                    ? 'border-sky-500 bg-sky-500/20 text-sky-100'
                    : 'border-slate-700 bg-slate-950 text-slate-200 hover:border-slate-500'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm text-slate-200">
        <p className="font-medium">
          Do you have any of these urgent symptoms?
        </p>
        <div className="grid gap-2 md:grid-cols-2">
          {[
            ['chestPain', 'Chest pain or pressure'],
            ['breathingDifficulty', 'Trouble breathing'],
            ['facialDroop', 'Facial drooping'],
            ['weakness', 'Weakness in arm or leg'],
            ['confusion', 'Confusion or trouble speaking'],
          ].map(([key, label]) => (
            <label
              key={key}
              className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs"
            >
              <input
                type="checkbox"
                checked={redFlags[key as keyof typeof redFlags]}
                onChange={() =>
                  toggleFlag(key as keyof typeof redFlags)
                }
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="mt-2 inline-flex items-center rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400"
      >
        Get guidance
      </button>
    </form>
  );
}
