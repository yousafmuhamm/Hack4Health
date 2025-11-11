// components/PatientPreconsultDetail.tsx

import { Preconsult } from '@/lib/types';
import { RiskBadge } from './RiskBadge';

interface Props {
  item: Preconsult | null;
}

export default function PatientPreconsultDetail({ item }: Props) {
  if (!item) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-400">
        Select a pre-consult from the list to view details.
      </div>
    );
  }

  const careLabel =
    item.recommendedCare === 'er'
      ? 'Emergency Department'
      : item.recommendedCare === 'walk-in'
      ? 'Walk-in / Urgent Care'
      : item.recommendedCare === 'family-doctor'
      ? 'Family Physician'
      : 'Virtual Visit';

  return (
    <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-100">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">
            {item.patientName}{' '}
            <span className="text-xs text-slate-400">
              · {item.age} y/o
            </span>
          </p>
          <p className="text-xs text-slate-400">
            Received: {new Date(item.createdAt).toLocaleString()}
          </p>
        </div>
        <RiskBadge level={item.urgency} />
      </div>

      <div className="space-y-1">
        <p className="text-xs font-medium text-slate-300">
          Summary from patient:
        </p>
        <p className="rounded-md border border-slate-700 bg-slate-950 p-2 text-xs text-slate-100">
          {item.symptoms}
        </p>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-medium text-slate-300">
          Suggested level of care:
        </p>
        <p className="text-xs text-sky-300">{careLabel}</p>
      </div>

      {item.hasRedFlags && (
        <p className="rounded-md border border-rose-700 bg-rose-950/60 p-2 text-xs text-rose-100">
          ⚠ This pre-consult includes potential red flag symptoms. Please
          review urgently.
        </p>
      )}

      <div className="flex flex-wrap gap-2 pt-1">
        <button className="rounded-md bg-sky-500 px-3 py-1.5 text-xs font-medium text-slate-950 hover:bg-sky-400">
          Mark as reviewed
        </button>
        <button className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-500">
          Open in EMR (demo)
        </button>
      </div>
    </div>
  );
}
