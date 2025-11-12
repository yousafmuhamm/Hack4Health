"use client";

const tasks = [
  { id: "t1", label: "PHQ-2 depression screen", due: "today" },
  { id: "t2", label: "Colon cancer screen (FIT)", due: "this week" },
  { id: "t3", label: "A1C for diabetes risk", due: "next visit" },
];

export default function ScreeningTasksCard() {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <h2 className="text-sm font-semibold text-slate-100">Screening tasks</h2>
      <ul className="mt-2 space-y-2">
        {tasks.map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950/40 p-3 text-sm text-slate-300"
          >
            <span>{t.label}</span>
            <span className="text-slate-400">{t.due}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
