"use client";

import { useState } from "react";
import { mockPreconsults } from "@/lib/mockData";
import { Preconsult } from "@/lib/types";
import PatientPreconsultList from "@/components/PatientPreconsultList";
import PatientPreconsultDetail from "@/components/PatientPreconsultDetail";
import ScreeningTasksCard from "@/components/ScreeningTasksCard";

const urgencyPriority: Record<string, number> = {
  very_urgent: 1,
  urgent: 2,
  mildly_urgent: 3,
  not_urgent: 4,
};


type DecisionStatus = "accepted" | "deferred";

export default function ClinicianPage() {
  const sorted = [...mockPreconsults].sort((a, b) => {
    const pA = urgencyPriority[a.urgency] ?? 99;
    const pB = urgencyPriority[b.urgency] ?? 99;
  
    if (pA !== pB) return pA - pB;
  
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  const [preconsults] = useState<Preconsult[]>(sorted);

  const [selectedId, setSelectedId] = useState<string | null>(
    preconsults[0]?.id ?? null
  );

  const [decisions, setDecisions] = useState<
    Record<string, DecisionStatus | undefined>
  >({});

  const selected: Preconsult | null =
    preconsults.find((pc) => pc.id === selectedId) ?? null;

  function handleAccept(id: string) {
    setDecisions((prev) => ({ ...prev, [id]: "accepted" }));
  }

  function handleDefer(id: string) {
    setDecisions((prev) => ({ ...prev, [id]: "deferred" }));
  }

  const acceptedCases = preconsults.filter(
    (pc) => decisions[pc.id] === "accepted"
  );

  const selectedDecision =
    selected && decisions[selected.id] ? decisions[selected.id] : undefined;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex justify-center px-4 py-10">
      <div className="w-full max-w-6xl">

        {/* Page Title */}
        <div className="text-center mb-10">
          <p className="text-sm text-[var(--fg-muted)] uppercase tracking-wide">
            Clinician Workflow
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mt-1">
            <span className="text-[var(--accent)]">Care Review</span> Dashboard
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-[var(--fg-muted)]">
            Structured AI-generated pre-consults and suggested screening tasks to streamline patient care.
          </p>
        </div>

        {/* Dashboard Panels */}
        <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl">
          <PatientPreconsultList
            items={preconsults}
            selectedId={selectedId}
            onSelect={setSelectedId}
            decisions={decisions}
          />

          <PatientPreconsultDetail
            item={selected}
            onAccept={handleAccept}
            onDefer={handleDefer}
            decision={selectedDecision}
          />
        </div>

        {/* Screening Tasks */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl">
          <ScreeningTasksCard acceptedCases={acceptedCases} />
        </div>

      </div>
    </div>
  );
}
