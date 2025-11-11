// components/PatientPreconsultList.tsx
'use client';

import { Preconsult } from '@/lib/types';
import { RiskBadge } from './RiskBadge';

interface Props {
  items: Preconsult[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function PatientPreconsultList({
  items,
  selectedId,
  onSelect,
}: Props) {
  return (
    <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-sm">
      <h2 className="text-sm font-semibold text-slate-100">
        Pre-consult queue
      </h2>
      <p className="text-xs text-slate-400">
        These summaries came from the patient navigation tool before the
        visit.
      </p>
      <ul className="space-y-2">
        {items.map((pc) => (
          <li key={pc.id}>
            <button
              onClick={() => onSelect(pc.id)}
              className={`w-full rounded-md border px-3 py-2 text-left ${
                selectedId === pc.id
                  ? 'border-sky-500 bg-sky-500/10'
                  : 'border-slate-700 bg-slate-950 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-slate-100">
                    {pc.patientName}{' '}
                    <span className="text-xs text-slate-400">
                      · {pc.age} y/o
                    </span>
                  </p>
                  <p className="line-clamp-2 text-xs text-slate-300">
                    {pc.symptoms}
                  </p>
                </div>
                <RiskBadge level={pc.urgency} />
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
