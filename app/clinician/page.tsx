"use client";

import { useState } from "react";
import { useAuth } from "react-oidc-context";
import Link from "next/link";
import ProfileMenu from "@/components/ProfileMenu";
import { mockPreconsults } from "@/lib/mockData";
import { Preconsult } from "@/lib/types";
import PatientPreconsultList from "@/components/PatientPreconsultList";
import PatientPreconsultDetail from "@/components/PatientPreconsultDetail";
import ScreeningTasksCard from "@/components/ScreeningTasksCard";

export default function ClinicianPage() {
  const auth = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(
    mockPreconsults[0]?.id ?? null
  );
  const selected: Preconsult | null =
    mockPreconsults.find((pc) => pc.id === selectedId) ?? null;

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-50">
          Clinician dashboard
        </h1>
        <p className="max-w-2xl text-sm text-slate-300">
          This view simulates what a family physician or clinic team
          might see: pre-consult summaries flowing in from the patient
          navigation tool, and auto-generated screening tasks that help
          reduce admin overhead and burnout.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <PatientPreconsultList
          items={mockPreconsults}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <PatientPreconsultDetail item={selected} />
      </div>

      <ScreeningTasksCard />
    </div>
  );
}
