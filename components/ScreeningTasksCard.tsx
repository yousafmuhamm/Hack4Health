"use client";

import { Preconsult } from "@/lib/types";

type TaskBucket = "today" | "this_week" | "next_visit";

type ScreeningTask = {
  id: string;
  label: string;
  bucket: TaskBucket;
  sourcePatient?: string; // optional: whose case triggered it
};

type Props = {
  acceptedCases: Preconsult[];
};

function generateTasks(acceptedCases: Preconsult[]): ScreeningTask[] {
  // Simple rule-based demo: in reality this would be smarter.
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

    // Age-based colorectal screening
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

  // Fallback demo tasks if nothing accepted yet
  if (tasks.length === 0) {
    return [
      {
        id: "phq2-demo",
        label: "PHQ-2 depression screen",
        bucket: "today",
      },
      {
        id: "fit-demo",
        label: "Colon cancer screen (FIT)",
        bucket: "this_week",
      },
      {
        id: "a1c-demo",
        label: "A1C for diabetes risk",
        bucket: "next_visit",
      },
    ];
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
    </section>
  );
}
