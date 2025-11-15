"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { mockPreconsults } from "@/lib/mockData";
import { Preconsult } from "@/lib/types";
import PatientPreconsultList from "@/components/PatientPreconsultList";
import PatientPreconsultDetail from "@/components/PatientPreconsultDetail";
import ScreeningTasksCard from "@/components/ScreeningTasksCard";

// Shared AWS login helper
function buildLoginUrl(role: "patient" | "clinician") {
  const redirectUri =
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:3000/"
      : "https://example.com/";

  const state = JSON.stringify({ role });

  return (
    `https://healthconnect.auth.us-west-2.amazoncognito.com/login?client_id=4s6jh35ds200g1abjd19pqd9gv&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}`
  );
}
export default function ClinicianPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(
    mockPreconsults[0]?.id ?? null
  );

  const selected: Preconsult | null =
    mockPreconsults.find((pc) => pc.id === selectedId) ?? null;

  // SIMPLE ROLE GUARD (localStorage)
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (!role || role !== "clinician") {
      router.replace("/");
    }
  }, [router]);

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
