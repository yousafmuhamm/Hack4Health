"use client";

import { Preconsult } from "@/lib/types";

type DecisionStatus = "accepted" | "deferred" | undefined;

type PatientPreconsultDetailProps = {
  item: Preconsult | null;
  onAccept: (id: string) => void;
  onDefer: (id: string) => void;
  decision?: DecisionStatus;
};

export default function PatientPreconsultDetail({
  item,
  onAccept,
  onDefer,
  decision,
}: PatientPreconsultDetailProps) {
  if (!item) {
    return (
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-slate-300">
        Select a pre-consult on the left.
      </section>
    );
  }

  const decisionLabel =
    decision === "accepted"
      ? "Accepted"
      : decision === "deferred"
      ? "Deferred"
      : null;

  const decisionClass =
    decision === "accepted"
      ? "bg-emerald-500/20 text-emerald-300"
      : decision === "deferred"
      ? "bg-amber-500/20 text-amber-300"
      : "";

  return (
    <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">
            {item.patientName} • {item.age}
          </h2>
          <p className="text-xs text-slate-400">
            {new Date(item.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
            {item.urgency.replace("_", " ").toUpperCase()}
          </span>
          {decisionLabel && (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${decisionClass}`}
            >
              {decisionLabel}
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-300">{item.summary}</p>

      {item.details && (
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-sm text-slate-300">
          {item.details}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onAccept(item.id)}
          className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
        >
          Accept
        </button>
        <button
          onClick={() => onDefer(item.id)}
          className="rounded-full border border-slate-500 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800"
        >
          Defer
        </button>
      </div>
    </section>
  );
}
