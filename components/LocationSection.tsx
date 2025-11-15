"use client";

export default function LocationSection({
  recommendedCare,
}: {
  recommendedCare: "ER" | "Walk-in clinic" | "Family doctor" | "Virtual care";
}) {
  const items =
    recommendedCare === "ER"
      ? [
          {
            name: "Alberta Children's Hospital – Emergency",
            distance: "0.9 km",
          },
          {
            name: "Foothills Medical Centre – Emergency",
            distance: "1.4 km",
          },
          {
            name: "Rockyview General Hospital – Emergency",
            distance: "10.0 km",
          },
        ]
      : recommendedCare === "Walk-in clinic"
      ? [
          { name: "Brentwood Medical Clinic", distance: "1.2 km" },
          { name: "University City Clinic", distance: "1.8 km" },
        ]
      : recommendedCare === "Family doctor"
      ? [
          { name: "UCalgary Student Wellness Clinic", distance: "0.5 km" },
          { name: "Care Medical Clinics NW", distance: "3.2 km" },
        ]
      : [
          { name: "VirtualCare AB", distance: "online" },
          { name: "Pharmacy Minor Ailments", distance: "nearby" },
        ];

  const openInMaps = (name: string) => {
    const url =
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(name);
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
              onClick={() => openInMaps(it.name)}
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
