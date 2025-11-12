"use client";

import { Preconsult } from "@/lib/types";

export default function PatientPreconsultDetail({
  item,
}: {
  item: Preconsult | null;
}) {
  if (!item) {
    return (
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-slate-300">
        Select a pre-consult on the left.
      </section>
    );
  }

  return (
    <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-100">
          {item.patientName} • {item.age}
        </h2>
        <span className="text-xs text-slate-400">
          {new Date(item.createdAt).toLocaleString()}
        </span>
      </div>
      <p className="text-sm text-slate-300">{item.summary}</p>
      {item.details && (
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-sm text-slate-300">
          {item.details}
        </div>
      )}
      <div className="flex gap-2 pt-1">
        <button className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700">
          Accept
        </button>
        <button className="rounded-full border border-slate-500 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800">
          Defer
        </button>
      </div>
    </section>
  );
}
