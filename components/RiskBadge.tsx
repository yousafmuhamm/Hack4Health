// components/RiskBadge.tsx
import { PreconsultUrgency } from "@/lib/types";

interface Props {
  level: PreconsultUrgency;
}

export function RiskBadge({ level }: Props) {
  const label =
    level === "not_urgent"
      ? "Not Urgent"
      : level === "mildly_urgent"
      ? "Mildly Urgent"
      : "Very Urgent";

  const colors =
    level === "not_urgent"
      ? "bg-emerald-900/60 text-emerald-200 border-emerald-700"
      : level === "mildly_urgent"
      ? "bg-amber-900/60 text-amber-200 border-amber-700"
      : "bg-rose-900/60 text-rose-200 border-rose-700";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-medium ${colors}`}
    >
      Urgency: {label}
    </span>
  );
}
