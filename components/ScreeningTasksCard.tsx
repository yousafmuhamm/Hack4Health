// components/ScreeningTasksCard.tsx
'use client';

import { useState } from 'react';
import { ScreeningTask } from '@/lib/types';
import { getDueScreeningTasks } from '@/lib/screening';

export default function ScreeningTasksCard() {
  const [tasks, setTasks] = useState<ScreeningTask[]>(
    getDueScreeningTasks()
  );

  function markCompleted(id: string) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: 'completed' } : task
      )
    );
  }

  return (
    <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-100">
          Screening & follow-up tasks
        </h2>
        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">
          {tasks.filter((t) => t.status === 'due').length} due
        </span>
      </div>
      <p className="text-xs text-slate-400">
        These tasks are auto-generated when patients are due for routine
        screening or monitoring, so staff don&apos;t have to manually
        track them.
      </p>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-medium">
                  {task.patientName}{' '}
                  <span className="text-[10px] text-slate-400">
                    · {task.type}
                  </span>
                </p>
                <p className="text-[11px] text-slate-300">
                  Due:{' '}
                  {new Date(task.dueDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                  {task.lastDone && (
                    <> · Last done: {task.lastDone}</>
                  )}
                </p>
                {task.notes && (
                  <p className="text-[11px] text-slate-400">
                    {task.notes}
                  </p>
                )}
              </div>
              <button
                disabled={task.status === 'completed'}
                onClick={() => markCompleted(task.id)}
                className={`rounded-md px-2 py-1 text-[11px] font-medium ${
                  task.status === 'completed'
                    ? 'bg-emerald-900/40 text-emerald-200'
                    : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                }`}
              >
                {task.status === 'completed'
                  ? 'Completed'
                  : 'Send requisition'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
