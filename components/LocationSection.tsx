"use client";

type RecommendedCare =
  | "ER"
  | "Walk-in clinic"
  | "Family doctor"
  | "Virtual care";

type Item = {
  name: string;
  distance: string;
  // optional override for the query we send to Google Maps
  mapsQuery?: string;
};

export default function LocationSection({
  recommendedCare,
}: {
  recommendedCare: RecommendedCare;
}) {
  // Demo content – plug in real data/provider APIs later
  const items: Item[] =
    recommendedCare === "ER"
      ? [
          {
            name: "Foothills Medical Centre – Emergency",
            distance: "3.1 km",
          },
          {
            name: "Peter Lougheed Centre – Emergency",
            distance: "6.4 km",
          },
        ]
      : recommendedCare === "Walk-in clinic"
      ? [
          { name: "Downtown Walk-in Clinic", distance: "1.2 km" },
          { name: "Community Care Clinic", distance: "2.7 km" },
        ]
      : recommendedCare === "Family doctor"
      ? [
          { name: "Your family clinic", distance: "-" },
          { name: "Find a family doctor (CPSA)", distance: "-" },
        ]
      : [
          { name: "VirtualCare AB (telehealth)", distance: "online" },
          { name: "Pharmacy minor ailments", distance: "online / nearby" },
        ];

  const openInGoogleMaps = (item: Item) => {
    const query = item.mapsQuery ?? item.name;
    const url =
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(query);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <h2 className="text-sm font-semibold text-slate-100">
        Nearby / appropriate care
      </h2>
      <ul className="space-y-2 text-sm text-slate-300">
        {items.map((it, idx) => (
          <li key={idx}>
            <button
              type="button"
              onClick={() => openInGoogleMaps(it)}
              className="flex w-full items-center justify-between rounded-md border border-slate-800 bg-slate-950/30 p-3 text-left hover:bg-slate-900/70 hover:underline"
            >
              <span>{it.name}</span>
              <span className="text-slate-400">{it.distance}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
