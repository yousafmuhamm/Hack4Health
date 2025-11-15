"use client";

import { Preconsult } from "@/lib/types";

type TaskBucket = "today" | "this_week" | "next_visit";

type ScreeningTask = {
  id: string;
  label: string;
  bucket: TaskBucket;
  sourcePatient?: string; // which accepted case triggered this
};

type Props = {
  acceptedCases: Preconsult[];
};

function generateTasks(acceptedCases: Preconsult[]): ScreeningTask[] {
  const tasks: ScreeningTask[] = [];

  for (const pc of acceptedCases) {
    const lowerSummary = pc.summary.toLowerCase();

    // Mental health → PHQ-2 today
    if (
      lowerSummary.includes("low mood") ||
      lowerSummary.includes("depressed") ||
      lowerSummary.includes("anxiety")
    ) {
      tasks.push({
        id: `phq2-${pc.id}`,
        label: "PHQ-2 depression screen",
        bucket: "today",
        sourcePatient: pc.patientName,
      });
    }

    // Age-based colorectal screening (50+)
    if (pc.age >= 50) {
      tasks.push({
        id: `fit-${pc.id}`,
        label: "Colon cancer screen (FIT)",
        bucket: "this_week",
        sourcePatient: pc.patientName,
      });
    }

    // Metabolic risk → A1C
    if (
      lowerSummary.includes("diabetes") ||
      lowerSummary.includes("weight") ||
      lowerSummary.includes("thirst")
    ) {
      tasks.push({
        id: `a1c-${pc.id}`,
        label: "A1C for diabetes risk",
        bucket: "next_visit",
        sourcePatient: pc.patientName,
      });
    }
  }

  return tasks;
}

export default function ScreeningTasksCard({ acceptedCases }: Props) {
  const tasks = generateTasks(acceptedCases);

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/80">
      <header className="border-b border-slate-800 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
        Screening tasks
      </header>

      {tasks.length === 0 ? (
        // Empty state when no accepted cases have triggered tasks yet
        <div className="px-4 py-4 text-sm text-slate-300">
          No screening tasks yet.
          <span className="block text-xs text-slate-400 mt-1">
            Tasks appear once you <span className="font-medium">accept</span>{" "}
            incoming pre-consults that meet screening criteria (e.g., low mood,
            diabetes risk, age over 50).
          </span>
        </div>
      ) : (
        <div className="divide-y divide-slate-800">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between px-4 py-3 text-sm text-slate-100"
            >
              <div>
                <div>{task.label}</div>
                {task.sourcePatient && (
                  <div className="text-xs text-slate-400">
                    Triggered by: {task.sourcePatient}
                  </div>
                )}
              </div>
              <span className="text-xs text-slate-400">
                {task.bucket === "today"
                  ? "today"
                  : task.bucket === "this_week"
                  ? "this week"
                  : "next visit"}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
