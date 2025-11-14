"use client";

import { Preconsult } from "@/lib/types";

type DecisionStatus = "accepted" | "deferred" | undefined;

type Props = {
  items: Preconsult[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  decisions: Record<string, DecisionStatus>;
};

export default function PatientPreconsultList({
  items,
  selectedId,
  onSelect,
  decisions,
}: Props) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/80">
      <header className="border-b border-slate-800 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
        Incoming pre-consults
      </header>
      <ul className="max-h-[320px] overflow-y-auto">
        {items.map((item) => {
          const isSelected = item.id === selectedId;
          const decision = decisions[item.id];

          const opacityClass =
            decision === "accepted"
              ? "opacity-70"
              : decision === "deferred"
              ? "opacity-50"
              : "opacity-100";

          const urgencyClass =
            item.urgency === "very_urgent"
              ? "bg-red-500/20 text-red-300"
              : item.urgency === "mildly_urgent"
              ? "bg-amber-500/20 text-amber-300"
              : "bg-emerald-500/20 text-emerald-300";

          return (
            <li
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`flex cursor-pointer items-center justify-between border-b border-slate-800 px-4 py-3 text-sm hover:bg-slate-800/70 ${
                isSelected ? "ring-2 ring-emerald-400/80" : ""
              } ${opacityClass}`}
            >
              <div>
                <div className="font-medium text-slate-100">
                  {item.patientName} • {item.age}
                </div>
                <div className="max-w-xs truncate text-xs text-slate-300">
                  {item.summary}
                </div>
                {decision && (
                  <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
                    {decision === "accepted" ? "Accepted" : "Deferred"}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${urgencyClass}`}
                >
                  {item.urgency.replace("_", " ").toUpperCase()}
                </span>
                <span className="text-[10px] text-slate-400">
                  {new Date(item.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
