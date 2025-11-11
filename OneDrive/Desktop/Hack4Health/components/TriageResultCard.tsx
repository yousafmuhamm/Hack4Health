// components/TriageResultCard.tsx

import { TriageResult } from '@/lib/types';
import { RiskBadge } from './RiskBadge';

interface Props {
  result: TriageResult;
  hasShared: boolean;
  onShare: () => void;
  onDelete: () => void;
}

export default function TriageResultCard({
  result,
  hasShared,
  onShare,
  onDelete,
}: Props) {
  const careLabel =
    result.recommendedCare === 'er'
      ? 'Emergency Department (ER)'
      : result.recommendedCare === 'walk-in'
      ? 'Walk-in clinic or urgent care'
      : result.recommendedCare === 'family-doctor'
      ? 'Family doctor or primary care provider'
      : 'Virtual appointment';

  return (
    <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-100">
          Suggested next step
        </h2>
        <RiskBadge level={result.urgency} />
      </div>
      <p className="text-sm text-slate-200">
        Recommended level of care:{' '}
        <span className="font-semibold text-sky-300">{careLabel}</span>
      </p>
      <p className="text-sm text-slate-300">{result.explanation}</p>

      {!hasShared ? (
        <div className="space-y-2 border-t border-slate-800 pt-3 text-sm">
          <p className="text-slate-300">
            Would you like to send a pre-consult summary to the clinic
            or doctor you&apos;ll be seeing?
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onShare}
              className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-medium text-slate-950 hover:bg-emerald-400"
            >
              Yes, send my summary
            </button>
            <button
              onClick={onDelete}
              className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-500"
            >
              No, delete my information
            </button>
          </div>
          <p className="text-xs text-slate-400">
            If you choose not to share, your answers will be removed
            from this session to protect your privacy.
          </p>
        </div>
      ) : (
        <p className="border-t border-slate-800 pt-3 text-xs text-emerald-300">
          ✅ Your pre-consult summary has been prepared and shared with
          the selected clinic for this visit only.
        </p>
      )}
    </div>
  );
}
