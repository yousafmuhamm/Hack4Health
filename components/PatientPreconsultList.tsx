"use client";

import { Preconsult } from "@/lib/types";

export default function PatientPreconsultList({
  items,
  selectedId,
  onSelect,
}: {
  items: Preconsult[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <h2 className="text-sm font-semibold text-slate-100">Incoming pre-consults</h2>
      <ul className="mt-3 space-y-2">
        {items.map((pc) => {
          const isActive = pc.id === selectedId;
          const ring =
            pc.priority === "high"
              ? "ring-rose-500/60"
              : pc.priority === "medium"
              ? "ring-amber-500/60"
              : "ring-emerald-500/60";
          return (
            <li key={pc.id}>
              <button
                onClick={() => onSelect(pc.id)}
                className={`w-full rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-left hover:bg-slate-900/60 ${
                  isActive ? `ring-2 ${ring}` : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-slate-100">
                    {pc.patientName} • {pc.age}
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(pc.createdAt).toLocaleTimeString()}
                  </div>
                </div>
                <p className="mt-1 text-sm text-slate-300">{pc.summary}</p>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
