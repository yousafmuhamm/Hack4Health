"use client";

import { TriageResult } from "@/lib/types";

export default function TriageResultCard({
  result,
  hasShared,
  onShare,
  onDelete,
}: {
  result: TriageResult;
  hasShared: boolean;
  onShare: () => void;
  onDelete: () => void;
}) {
  const color =
    result.urgency === "emergency"
      ? "bg-red-600/20 text-red-200 border-red-700"
      : result.urgency === "urgent"
      ? "bg-yellow-600/20 text-yellow-200 border-yellow-700"
      : "bg-emerald-600/20 text-emerald-200 border-emerald-700";

  return (
    <section className={`space-y-3 rounded-xl border ${color} p-4`}>
      <h3 className="text-sm font-semibold">Triage result</h3>
      <div className="text-sm">
        <div>
          <span className="font-semibold">Urgency:</span> {result.urgency}
        </div>
        <div>
          <span className="font-semibold">Recommended care:</span>{" "}
          {result.recommendedCare}
        </div>
        <p className="mt-2 text-slate-200/90">{result.summary}</p>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={onShare}
          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-900 hover:bg-white"
        >
          {hasShared ? "Shared ✔" : "Share with clinic"}
        </button>
        <button
          onClick={onDelete}
          className="rounded-full border border-slate-500 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800"
        >
          Clear
        </button>
      </div>
    </section>
  );
}
