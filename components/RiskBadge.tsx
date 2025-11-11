// components/RiskBadge.tsx

import { UrgencyLevel } from '@/lib/types';

interface Props {
  level: UrgencyLevel;
}

export function RiskBadge({ level }: Props) {
  const label =
    level === 'low'
      ? 'Low'
      : level === 'moderate'
      ? 'Moderate'
      : 'High';

  const colors =
    level === 'low'
      ? 'bg-emerald-900/60 text-emerald-200 border-emerald-700'
      : level === 'moderate'
      ? 'bg-amber-900/60 text-amber-200 border-amber-700'
      : 'bg-rose-900/60 text-rose-200 border-rose-700';

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-medium ${colors}`}
    >
      Urgency: {label}
    </span>
  );
}
