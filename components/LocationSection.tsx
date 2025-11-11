// components/LocationSection.tsx

import { RecommendedCare } from '@/lib/types';
import { getFacilitiesForCare } from '@/lib/location';

interface Props {
  recommendedCare: RecommendedCare;
}

export default function LocationSection({ recommendedCare }: Props) {
  const facilities = getFacilitiesForCare(recommendedCare);
  if (!facilities.length) return null;

  const header =
    recommendedCare === 'er'
      ? 'Nearest emergency departments'
      : recommendedCare === 'walk-in'
      ? 'Walk-in and urgent care near you'
      : recommendedCare === 'family-doctor'
      ? 'Primary care options near you'
      : 'Virtual care options';

  return (
    <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <h2 className="text-lg font-semibold text-slate-100">
        {header}
      </h2>
      <p className="text-xs text-slate-400">
        For demo purposes, this uses sample healthcare locations. In a
        real system, we would use your location and live data from local
        health services.
      </p>
      <ul className="space-y-2 text-sm text-slate-100">
        {facilities.map((fac) => (
          <li
            key={fac.id}
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-medium">{fac.name}</p>
                <p className="text-xs text-slate-400">
                  {fac.type} · {fac.address}
                </p>
              </div>
              <p className="text-xs text-slate-300">
                {fac.distanceKm.toFixed(1)} km
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
