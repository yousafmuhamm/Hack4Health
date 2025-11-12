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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      {/* Header */}
      <header className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--brand-maroon)] text-white grid place-items-center font-bold">
            C
          </div>
          <span className="font-semibold">Clinician dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-[var(--fg-muted)] hover:underline">
            Home
          </Link>
          {auth.isAuthenticated ? (
            <ProfileMenu />
          ) : (
            <button onClick={() => auth.signinRedirect()} className="btn btn-maroon">
              Sign in
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 pb-12 space-y-6">
        <section className="space-y-1">
          <h1 className="text-2xl font-semibold">Incoming pre-consults</h1>
          <p className="max-w-2xl text-sm text-[var(--fg-muted)]">
            Summaries from the patient navigation tool, plus auto-generated
            screening tasks to reduce admin overhead.
          </p>
        </section>

        <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="card p-4">
            <PatientPreconsultList
              items={mockPreconsults}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
          <div className="card p-4">
            <PatientPreconsultDetail item={selected} />
          </div>
        </div>

        <div className="card p-4">
          <ScreeningTasksCard />
        </div>
      </main>
    </div>
  );
}
