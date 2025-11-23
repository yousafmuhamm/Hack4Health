"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useRouter } from "next/navigation";
import { cognitoLogout } from "@/app/utils/logout";
import type { Preconsult } from "@/lib/types";
import { fetchPreconsults, updatePreconsultStatus } from "@/lib/db";

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
    p.urgency ||
    p.urgencyLabel ||
    p.triageLevel ||
    p.urgency_level ||
    "routine"
  );
};

// Helper: convert an urgency label into a numeric score (lower = more urgent)
const getUrgencyScoreFromLabel = (raw: any): number => {
  const label = String(raw).toLowerCase();
  if (label.includes("very")) return 1; // VERY_URGENT
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
    getUrgencyScoreFromLabel(a.urgency) - getUrgencyScoreFromLabel(b.urgency);
  if (scoreDiff !== 0) return scoreDiff;
  // Same urgency → newer first
  return b.createdAtMs - a.createdAtMs;
};

export default function ClinicianPage() {
  const auth = useAuth();
  const router = useRouter();

  const [preconsults, setPreconsults] = useState<Preconsult[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [screeningTasks, setScreeningTasks] = useState<ScreeningTask[]>([]);
  const [loadingPreconsults, setLoadingPreconsults] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Defer modal state
  const [isDeferModalOpen, setIsDeferModalOpen] = useState(false);
  const [deferNoteDraft, setDeferNoteDraft] = useState("");

  // Collapsing + search UI state
  const [incomingCollapsed, setIncomingCollapsed] = useState(false);
  const [tasksCollapsed, setTasksCollapsed] = useState(false);
  const [deferredCollapsed, setDeferredCollapsed] = useState(false);
  const [screeningSearch, setScreeningSearch] = useState("");
  const [deferredSearch, setDeferredSearch] = useState("");

  // Load from Firestore when page mounts
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchPreconsults();
        if (!cancelled) {
          setPreconsults(data);
          if (!selectedId && data.length > 0) {
            setSelectedId(data[0].id);
          }
        }
      } catch (err) {
        console.error("Error loading preconsults:", err);
        if (!cancelled) {
          setLoadError("Could not load pre-consults.");
        }
      } finally {
        if (!cancelled) setLoadingPreconsults(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debug auth / guard
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

  // Pick first item by default when preconsults change
  useEffect(() => {
    if (!selectedId && preconsults.length > 0) {
      const firstPending =
        preconsults.find(
          (p) => getStatusLabelFromPreconsult(p) === "pending"
        ) ?? preconsults[0];
      setSelectedId(firstPending.id);
    }
  }, [preconsults, selectedId]);

  // Separate pre-consults by status
  const incomingPreconsults = useMemo(
    () =>
      preconsults.filter(
        (p) => getStatusLabelFromPreconsult(p) === "pending"
      ),
    [preconsults]
  );

  const deferredPreconsults = useMemo(
    () =>
      preconsults.filter(
        (p) => getStatusLabelFromPreconsult(p) === "deferred"
      ),
    [preconsults]
  );

  // Sort incoming by urgency
  const sortedIncomingPreconsults = useMemo(() => {
    return [...incomingPreconsults].sort(
      (a, b) =>
        getUrgencyScoreFromLabel(getUrgencyLabelFromPreconsult(a)) -
        getUrgencyScoreFromLabel(getUrgencyLabelFromPreconsult(b))
    );
  }, [incomingPreconsults]);

  const selected = useMemo(() => {
    if (!selectedId) return null;
    return preconsults.find((p) => p.id === selectedId) ?? null;
  }, [preconsults, selectedId]);

  // Sort screening tasks by urgency, then created time
  const sortedScreeningTasks = useMemo(
    () => [...screeningTasks].sort(compareTasks),
    [screeningTasks]
  );

  // Filter screening tasks via search
  const filteredScreeningTasks = useMemo(() => {
    const term = screeningSearch.trim().toLowerCase();
    if (!term) return sortedScreeningTasks;
    return sortedScreeningTasks.filter((task) => {
      const haystack =
        `${task.title} ${task.patientName} ${task.description}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [sortedScreeningTasks, screeningSearch]);

  // Filter + sort deferred via search
  const filteredDeferredPreconsults = useMemo(() => {
    const term = deferredSearch.trim().toLowerCase();
    const base = deferredPreconsults
      .slice()
      .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    if (!term) return base;

    return base.filter((pc) => {
      const haystack = `${pc.patientName ?? ""} ${
        pc.deferNote ?? ""
      } ${pc.summary ?? ""}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [deferredPreconsults, deferredSearch]);

  // ACCEPT: move to screening tasks, remove from incoming
  const handleAccept = async () => {
    if (!selected) return;
    const status = getStatusLabelFromPreconsult(selected);
    if (status !== "pending") return; // already finalized

    const id = selected.id;
    const patientName = selected.patientName || "Patient";
    const urgencyLabel = getUrgencyLabelFromPreconsult(selected);
    const urgencyLower = urgencyLabel.toLowerCase();

    // Update Firestore
    try {
      await updatePreconsultStatus(id, "accepted");
    } catch (e) {
      console.error("Error updating status:", e);
    }

    // Update local state: mark accepted
    setPreconsults((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "accepted" } : p))
    );

    // Skip routine if you like
    if (urgencyLower.includes("routine")) {
      return;
    }

    const nowMs = Date.now();
    const nowLabel = new Date(nowMs).toLocaleString();

    // Add to screening tasks
    setScreeningTasks((prev) => {
      if (prev.some((t) => t.id === id)) return prev;

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

  // First click on "Defer" → open modal with note box
  const handleOpenDeferModal = () => {
    if (!selected) return;
    const status = getStatusLabelFromPreconsult(selected);
    if (status !== "pending") return;

    setDeferNoteDraft(selected.deferNote ?? "");
    setIsDeferModalOpen(true);
  };

  // Confirm defer: send note to Firestore, mark as deferred, remove from tasks
  const handleConfirmDefer = async () => {
    if (!selected) return;
    const id = selected.id;
    const note = deferNoteDraft.trim();

    try {
      await updatePreconsultStatus(id, "deferred", note);
    } catch (e) {
      console.error("Error updating status:", e);
    }

    setPreconsults((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "deferred", deferNote: note } : p
      )
    );

    // Remove any screening tasks for this id, just in case
    setScreeningTasks((prev) => prev.filter((t) => t.id !== id));

    setIsDeferModalOpen(false);
  };

  // Re-open a deferred case back to "pending"
  const handleReopen = async (id: string) => {
    try {
      await updatePreconsultStatus(id, "pending");
    } catch (e) {
      console.error("Error updating status:", e);
    }

    setPreconsults((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "pending" } : p))
    );
    setSelectedId(id);
  };

  if (auth.isLoading || loadingPreconsults) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdf8f6] text-sm text-slate-600">
        Loading your dashboard…
      </div>
    );
  }

  const selectedStatus = selected
    ? getStatusLabelFromPreconsult(selected)
    : "pending";
  const isSelectedFinalized = selectedStatus !== "pending";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--maroon-700)] via-[var(--maroon-500)] to-[var(--maroon-300)]">
      {/* NAVBAR MATCHING LANDING PAGE */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--brand-maroon)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Brand */}
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[var(--brand-maroon)] font-bold">
              ❤️
            </span>
            <span className="text-lg font-semibold text-white">
              HealthConnect
            </span>
          </div>

          {/* Clinician label + Sign out */}
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
              Clinician view
            </span>
            <button
              onClick={cognitoLogout}
              className="text-xs font-medium text-white/80 hover:text-white"
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
          {loadError && (
            <p className="text-xs text-red-500">{loadError}</p>
          )}
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
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-rose-50 px-3 py-1 text-[11px] font-medium text-rose-700">
                  {sortedIncomingPreconsults.length} active
                </span>
                <button
                  type="button"
                  onClick={() => setIncomingCollapsed((v) => !v)}
                  className="text-[11px] text-slate-500 hover:text-slate-700"
                >
                  {incomingCollapsed ? "Expand" : "Collapse"}
                </button>
              </div>
            </div>

            {!incomingCollapsed && (
              <div className="max-h-[430px] space-y-1 overflow-y-auto px-3 py-3">
                {sortedIncomingPreconsults.map((p) => {
                  const id = p.id;
                  const name = p.patientName || "Patient";
                  const age = (p as any).age;
                  const summary = p.summary || "";
                  const submittedAt = p.createdAt
                    ? new Date(p.createdAt).toLocaleString()
                    : "";
                  const urgency = getUrgencyLabelFromPreconsult(p);

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

                {sortedIncomingPreconsults.length === 0 && (
                  <div className="rounded-xl border border-dashed border-rose-100 bg-rose-50/40 px-4 py-6 text-center text-xs text-slate-500">
                    No incoming pre-consults yet. New cases will appear here
                    once patients submit forms.
                  </div>
                )}
              </div>
            )}
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
                  {selectedStatus !== "pending" && (
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wide ${
                        selectedStatus === "accepted"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {selectedStatus === "accepted"
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
                        {selected.patientName || "Patient"}
                        {(selected as any).age && (
                          <span className="ml-1 text-xs font-normal text-slate-500">
                            · {(selected as any).age}
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Pre-consult generated by patient intake form
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-xl bg-rose-50/60 px-4 py-3">
                    <p className="text-[11px] font-semibold text-slate-700">
                      AI-generated summary
                    </p>
                    <p className="text-xs leading-relaxed text-slate-700">
                      {selected.summary || "No summary text provided."}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-slate-700">
                      Key details
                    </p>
                    <ul className="list-disc space-y-1 pl-4 text-xs text-slate-600">
                      {selected.details && (
                        <li>{String(selected.details)}</li>
                      )}
                    </ul>
                  </div>

                  {/* Show note that WAS sent to patient when deferred */}
                  {selectedStatus === "deferred" && selected.deferNote && (
                    <div className="space-y-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold text-slate-800">
                        Note sent to patient
                      </p>
                      <p className="text-xs text-slate-700 whitespace-pre-wrap">
                        {selected.deferNote}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleAccept}
                      disabled={isSelectedFinalized}
                      className={`inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-medium shadow-sm ${
                        isSelectedFinalized
                          ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                          : "bg-rose-700 text-white hover:bg-rose-800"
                      }`}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenDeferModal}
                      disabled={isSelectedFinalized}
                      className={`inline-flex items-center justify-center rounded-full border px-4 py-1.5 text-xs font-medium ${
                        isSelectedFinalized
                          ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                      }`}
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

        {/* Screening tasks + Deferred cases */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Screening tasks */}
          <div className="rounded-2xl border border-rose-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-rose-100 px-5 py-3">
              <p className="text-xs font-semibold tracking-wide text-slate-500">
                SCREENING TASKS
              </p>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-100">
                  {filteredScreeningTasks.length} open
                </span>
                <button
                  type="button"
                  onClick={() => setTasksCollapsed((v) => !v)}
                  className="text-[11px] text-slate-500 hover:text-slate-700"
                >
                  {tasksCollapsed ? "Expand" : "Collapse"}
                </button>
              </div>
            </div>

            {!tasksCollapsed && (
              <div className="px-5 py-4 space-y-3">
                <input
                  type="text"
                  value={screeningSearch}
                  onChange={(e) => setScreeningSearch(e.target.value)}
                  placeholder="Search tasks or patients..."
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />

                {filteredScreeningTasks.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    {screeningSearch.trim()
                      ? "No screening tasks match your search."
                      : "No screening tasks yet. Once you accept a non-routine pre-consult, suggested follow-up tasks will appear here."}
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {filteredScreeningTasks.map((task) => (
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
            )}
          </div>

          {/* Deferred cases */}
          <div className="rounded-2xl border border-rose-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-rose-100 px-5 py-3">
              <p className="text-xs font-semibold tracking-wide text-slate-500">
                DEFERRED CASES
              </p>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-amber-700">
                  {filteredDeferredPreconsults.length} open
                </span>
                <button
                  type="button"
                  onClick={() => setDeferredCollapsed((v) => !v)}
                  className="text-[11px] text-slate-500 hover:text-slate-700"
                >
                  {deferredCollapsed ? "Expand" : "Collapse"}
                </button>
              </div>
            </div>

            {!deferredCollapsed && (
              <div className="px-5 py-4 space-y-3">
                <input
                  type="text"
                  value={deferredSearch}
                  onChange={(e) => setDeferredSearch(e.target.value)}
                  placeholder="Search by patient name or note..."
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />

                {filteredDeferredPreconsults.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    {deferredSearch.trim()
                      ? "No deferred cases match your search."
                      : "No deferred cases. When you defer a case with a note, it will appear here and show in the patient's portal."}
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {filteredDeferredPreconsults.map((pc) => (
                      <li
                        key={pc.id}
                        className="flex flex-col gap-2 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-xs text-slate-800"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-900">
                            {pc.patientName || "Patient"}
                            {pc.age && (
                              <span className="ml-1 text-xs font-normal text-slate-600">
                                · {pc.age}
                              </span>
                            )}
                          </span>
                          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-medium text-amber-800">
                            DEFERRED
                          </span>
                        </div>
                        {pc.deferNote && (
                          <p className="text-[11px] text-slate-800 line-clamp-3">
                            {pc.deferNote}
                          </p>
                        )}
                        <p className="text-[10px] text-slate-500">
                          Updated {new Date(pc.createdAt).toLocaleString()}
                        </p>
                        <div>
                          <button
                            type="button"
                            onClick={() => handleReopen(pc.id)}
                            className="rounded-full border border-slate-400 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
                          >
                            Re-open for review
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Defer modal */}
      {isDeferModalOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h2 className="text-sm font-semibold text-slate-900">
              Defer case &amp; send note to patient
            </h2>
            <p className="mt-1 text-[11px] text-slate-600">
              Explain why this case is being deferred and what the patient
              should do next (for example, visit a walk-in clinic, book with
              their family doctor, or monitor symptoms).
            </p>

            <textarea
              className="mt-3 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              rows={4}
              value={deferNoteDraft}
              onChange={(e) => setDeferNoteDraft(e.target.value)}
              placeholder="Example: Based on your symptoms, we recommend visiting the nearest walk-in clinic within the next 24–48 hours instead of the emergency department…"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeferModalOpen(false)}
                className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDefer}
                className="rounded-full bg-amber-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-amber-700"
              >
                Send note &amp; Defer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
