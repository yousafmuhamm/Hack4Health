"use client";

import { useState } from "react";
import { mockPreconsults } from "@/lib/mockData";
import { Preconsult } from "@/lib/types";
import PatientPreconsultList from "@/components/PatientPreconsultList";
import PatientPreconsultDetail from "@/components/PatientPreconsultDetail";
import ScreeningTasksCard from "@/components/ScreeningTasksCard";

type DecisionStatus = "accepted" | "deferred";

export default function ClinicianPage() {
  // Keep pre-consults and selection in state
  const [preconsults] = useState<Preconsult[]>(mockPreconsults);
  const [selectedId, setSelectedId] = useState<string | null>(
    preconsults[0]?.id ?? null
  );

  // Track what the clinician did with each case (for now, just in memory)
  const [decisions, setDecisions] = useState<
    Record<string, DecisionStatus | undefined>
  >({});

  const selected: Preconsult | null =
    preconsults.find((pc) => pc.id === selectedId) ?? null;

  function handleAccept(id: string) {
    setDecisions((prev) => ({ ...prev, [id]: "accepted" }));
    console.log("Accepted pre-consult:", id);
  }

  function handleDefer(id: string) {
    setDecisions((prev) => ({ ...prev, [id]: "deferred" }));
    console.log("Deferred pre-consult:", id);
  }

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-50">
          Clinician dashboard
        </h1>
        <p className="max-w-2xl text-sm text-slate-300">
          This view simulates what a family physician or clinic team might see:
          pre-consult summaries flowing in from the patient navigation tool, and
          auto-generated screening tasks that help reduce admin overhead and
          burnout.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <PatientPreconsultList
          items={preconsults}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <PatientPreconsultDetail
          item={selected}
          onAccept={handleAccept}
          onDefer={handleDefer}
        />
      </div>

      <ScreeningTasksCard />
    </div>
  );
}
