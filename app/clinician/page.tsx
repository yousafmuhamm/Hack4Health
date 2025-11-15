"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useRouter } from "next/navigation";
import { mockPreconsults } from "@/lib/mockData";
import { cognitoLogout } from "@/app/utils/logout";

type Preconsult = any;

type ScreeningTask = {
  id: string;
  patientName: string;
  title: string;
  description: string;
  createdAtLabel: string;
  createdAtMs: number;
  urgency: string;
};

// Helper: get urgency label from a pre-consult object
const getUrgencyLabelFromPreconsult = (p: any): string => {
  return (
    p.urgencyLabel ||
    p.urgency ||
    p.triageLevel ||
    p.urgency_level ||
    "Routine"
  );
};

// Helper: convert an urgency label into a numeric score (lower = more urgent)
const getUrgencyScoreFromLabel = (raw: any): number => {
  const label = String(raw).toLowerCase();

  if (label.includes("very")) return 1; // VERY URGENT
  if (label.includes("mild") || label.includes("moderate")) return 2;
  return 3; // routine / unknown
};

// Helper: normalize status
const getStatusLabelFromPreconsult = (
  p: any
): "accepted" | "deferred" | "pending" => {
  const raw = (p.status || "").toString().toLowerCase();
  if (raw === "accepted") return "accepted";
  if (raw === "deferred") return "deferred";
  return "pending";
};

// Shared comparator for tasks: urgency, then created time
const compareTasks = (a: ScreeningTask, b: ScreeningTask) => {
  const scoreDiff =
    getUrgencyScoreFromLabel(a.urgency) -
    getUrgencyScoreFromLabel(b.urgency);
  if (scoreDiff !== 0) return scoreDiff;

  // Same urgency → newer first
  return b.createdAtMs - a.createdAtMs;
};

export default function ClinicianPage() {
  const auth = useAuth();
  const router = useRouter();

  const [preconsults, setPreconsults] = useState<Preconsult[]>(
    () => (mockPreconsults as Preconsult[]) ?? []
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [screeningTasks, setScreeningTasks] = useState<ScreeningTask[]>([]);

  // TEMP: do NOT redirect at all – just log what we see
  useEffect(() => {
    if (auth.isLoading) return;

    const role =
      typeof window !== "undefined"
        ? sessionStorage.getItem("loginRole")
        : null;

    console.log(
      "Clinician guard debug => isAuthenticated:",
      auth.isAuthenticated,
      "role:",
      role
    );
  }, [auth.isLoading, auth.isAuthenticated]);

  // Pick first item by default
  useEffect(() => {
    if (!selectedId && preconsults.length > 0) {
      setSelectedId(preconsults[0].id ?? preconsults[0].preconsultId);
    }
  }, [preconsults, selectedId]);

  // Sort pre-consults by urgency
  const sortedPreconsults = useMemo(() => {
    return [...preconsults].sort(
      (a, b) =>
        getUrgencyScoreFromLabel(getUrgencyLabelFromPreconsult(a)) -
        getUrgencyScoreFromLabel(getUrgencyLabelFromPreconsult(b))
    );
  }, [preconsults]);

  const selected = useMemo(() => {
    if (!selectedId) return null;
    return preconsults.find(
      (p: any) => p.id === selectedId || p.preconsultId === selectedId
    );
  }, [preconsults, selectedId]);

  // Sort screening tasks by urgency, then created time
  const sortedScreeningTasks = useMemo(
    () => [...screeningTasks].sort(compareTasks),
    [screeningTasks]
  );

  const handleAccept = () => {
    if (!selected) return;

    const id = selected.id ?? selected.preconsultId ?? crypto.randomUUID();
    const patientName =
      selected.patientName || selected.name || selected.fullName || "Patient";
    const urgencyLabel = getUrgencyLabelFromPreconsult(selected);
    const urgencyLower = urgencyLabel.toLowerCase();

    // Mark as accepted in the preconsult list
    setPreconsults((prev) =>
      prev.map((p: any) =>
        p === selected ? { ...p, status: "accepted" } : p
      )
    );

    // Only create a screening task if the case is NOT routine
    if (urgencyLower.includes("routine")) {
      return;
    }

    const nowMs = Date.now();
    const nowLabel = new Date(nowMs).toLocaleString();

    setScreeningTasks((prev) => {
      // If we already have a task for this pre-consult, don't add another
      if (prev.some((t) => t.id === id)) {
        return prev;
      }

      const next: ScreeningTask[] = [
        ...prev,
        {
          id,
          patientName,
          title: "Follow-up screening",
          description:
            "Complete recommended labs / questionnaires based on pre-consult summary.",
          createdAtLabel: nowLabel,
          createdAtMs: nowMs,
          urgency: urgencyLabel,
        },
      ];

      return next.sort(compareTasks);
    });
  };

  const handleDefer = () => {
    if (!selected) return;

    const id = selected.id ?? selected.preconsultId ?? null;
    if (!id) return;

    // Mark as deferred in the preconsult list
    setPreconsults((prev) =>
      prev.map((p: any) =>
        p === selected ? { ...p, status: "deferred" } : p
      )
    );

    // Remove any existing screening task for this pre-consult
    setScreeningTasks((prev) => prev.filter((t) => t.id !== id));
  };

  if (auth.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdf8f6] text-sm text-slate-600">
        Loading your dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f6]">
      {/* Top bar to match maroon landing page */}
      <header className="border-b border-rose-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-700 text-sm font-semibold text-white">
              HC
            </span>
            <span className="text-base font-semibold text-slate-900">
              HealthConnect
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
              Clinician view
            </span>
            <button
              onClick={cognitoLogout}
              className="text-xs font-medium text-slate-700 hover:text-rose-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        {/* Page header */}
        <section className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">
            Clinician workflow
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Care Review <span className="text-rose-700">Dashboard</span>
          </h1>
          <p className="max-w-2xl text-sm text-slate-600">
            Review incoming AI-generated pre-consults, accept or defer cases,
            and track follow-up screening tasks in one place.
          </p>
        </section>

        {/* Main two-column layout */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.4fr)]">
          {/* Incoming pre-consults list */}
          <div className="rounded-2xl border border-rose-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-rose-100 px-5 py-3">
              <div>
                <p className="text-xs font-semibold tracking-wide text-slate-500">
                  INCOMING PRE-CONSULTS
                </p>
                <p className="text-[11px] text-slate-400">
                  Sorted by urgency for quicker review
                </p>
              </div>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-[11px] font-medium text-rose-700">
                {sortedPreconsults.length} active
              </span>
            </div>

            <div className="max-h-[430px] space-y-1 overflow-y-auto px-3 py-3">
              {sortedPreconsults.map((p: any) => {
                const id = p.id ?? p.preconsultId;
                const name =
                  p.patientName || p.name || p.fullName || "Patient";
                const age = p.age ?? p.patientAge;
                const summary =
                  p.summary || p.chiefComplaint || p.presentingIssue || "";
                const submittedAt =
                  p.submittedAt || p.createdAt || p.timestamp || "";
                const urgency = getUrgencyLabelFromPreconsult(p);
                const status = getStatusLabelFromPreconsult(p);

                const isSelected = id === selectedId;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedId(id)}
                    className={`flex w-full flex-col rounded-xl border px-4 py-3 text-left transition ${
                      isSelected
                        ? "border-rose-300 bg-rose-50"
                        : "border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/60"
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-900">
                        {name}
                        {age && (
                          <span className="ml-1 text-xs font-normal text-slate-500">
                            · {age}
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                          {String(urgency).toUpperCase()}
                        </span>
                        {status !== "pending" && (
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                              status === "accepted"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {status === "accepted" ? "ACCEPTED" : "DEFERRED"}
                          </span>
                        )}
                      </div>
                    </div>
                    {summary && (
                      <p className="line-clamp-2 text-xs text-slate-600">
                        {summary}
                      </p>
                    )}
                    {submittedAt && (
                      <p className="mt-1 text-[10px] text-slate-400">
                        {submittedAt}
                      </p>
                    )}
                  </button>
                );
              })}

              {sortedPreconsults.length === 0 && (
                <div className="rounded-xl border border-dashed border-rose-100 bg-rose-50/40 px-4 py-6 text-center text-xs text-slate-500">
                  No incoming pre-consults yet. New cases will appear here once
                  patients submit forms.
                </div>
              )}
            </div>
          </div>

          {/* Selected pre-consult detail */}
          <div className="rounded-2xl border border-rose-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-rose-100 px-5 py-3">
              <p className="text-xs font-semibold tracking-wide text-slate-500">
                PRE-CONSULT SUMMARY
              </p>
              {selected && (
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                    {getUrgencyLabelFromPreconsult(selected)
                      .toString()
                      .toUpperCase()}
                  </span>
                  {getStatusLabelFromPreconsult(selected) !== "pending" && (
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wide ${
                        getStatusLabelFromPreconsult(selected) === "accepted"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {getStatusLabelFromPreconsult(selected) === "accepted"
                        ? "ACCEPTED"
                        : "DEFERRED"}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4 px-5 py-4">
              {selected ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {selected.patientName ||
                          selected.name ||
                          selected.fullName ||
                          "Patient"}
                        {selected.age && (
                          <span className="ml-1 text-xs font-normal text-slate-500">
                            · {selected.age}
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {selected.gender && `${selected.gender} · `}
                        {(selected.primaryConcern ||
                          selected.chiefComplaint ||
                          "Pre-consult generated by patient intake form") as string}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-xl bg-rose-50/60 px-4 py-3">
                    <p className="text-[11px] font-semibold text-slate-700">
                      AI-generated summary
                    </p>
                    <p className="text-xs leading-relaxed text-slate-700">
                      {(selected.summary ||
                        selected.aiSummary ||
                        selected.presentingIssue ||
                        "No summary text provided.") as string}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-slate-700">
                      Key details
                    </p>
                    <ul className="list-disc space-y-1 pl-4 text-xs text-slate-600">
                      {selected.onset && (
                        <li>Onset: {String(selected.onset)}</li>
                      )}
                      {selected.duration && (
                        <li>Duration: {String(selected.duration)}</li>
                      )}
                      {selected.redFlags && (
                        <li>Red flags: {String(selected.redFlags)}</li>
                      )}
                      {selected.history && (
                        <li>Relevant history: {String(selected.history)}</li>
                      )}
                    </ul>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleAccept}
                      className="inline-flex items-center justify-center rounded-full bg-rose-700 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-rose-800"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={handleDefer}
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                    >
                      Defer
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-500">
                  Select a pre-consult on the left to view details.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Screening tasks */}
        <section>
          <div className="rounded-2xl border border-rose-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-rose-100 px-5 py-3">
              <p className="text-xs font-semibold tracking-wide text-slate-500">
                SCREENING TASKS
              </p>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-100">
                {sortedScreeningTasks.length} open
              </span>
            </div>

            <div className="px-5 py-4">
              {sortedScreeningTasks.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No screening tasks yet. Once you accept a non-routine
                  pre-consult, suggested follow-up tasks will appear here.
                </p>
              ) : (
                <ul className="space-y-3">
                  {sortedScreeningTasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex flex-col rounded-xl border border-rose-100 bg-rose-50/40 px-4 py-3 text-xs text-slate-700"
                    >
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-900">
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                            {task.urgency.toUpperCase()}
                          </span>
                          <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-medium text-rose-700">
                            {task.patientName}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {task.description}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        Created {task.createdAtLabel}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
