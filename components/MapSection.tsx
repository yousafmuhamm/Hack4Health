"use client";

import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import { useMemo, useState } from "react";

type LatLng = { lat: number; lng: number };
type CareType = "ER" | "WALK_IN" | "GENERAL";

type Hospital = {
  id: string;
  name: string;
  position: LatLng;
  address: string;
};

const HOSPITALS_UOFC: Hospital[] = [
  {
    id: "ach",
    name: "Alberta Children's Hospital – Emergency",
    position: { lat: 51.07583, lng: -114.14771 },
    address: "28 Oki Dr NW, Calgary",
  },
  {
    id: "foothills",
    name: "Foothills Medical Centre – Emergency",
    position: { lat: 51.06557, lng: -114.13319 },
    address: "1403 29 St NW, Calgary",
  },
  {
    id: "rockyview",
    name: "Rockyview General Hospital – Emergency",
    position: { lat: 50.99085, lng: -114.09736 },
    address: "7007 14 St SW, Calgary",
  },
  {
    id: "plc",
    name: "Peter Lougheed Centre – Emergency",
    position: { lat: 51.07945, lng: -113.98276 },
    address: "3500 26 Ave NE, Calgary",
  },
];

export default function MapSection({
  userLocation,
  careType = "ER",
}: {
  userLocation: LatLng;
  careType?: CareType;
}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    // NO PLACES LIBRARY NEEDED ANYMORE
  });

  const [selected, setSelected] = useState<Hospital | null>(null);

  const center = useMemo(
    () => ({ lat: userLocation.lat, lng: userLocation.lng }),
    [userLocation]
  );

  const openInMaps = (h: Hospital) => {
    const url =
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(`${h.name} ${h.address}`);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loadError) return <p>Error loading map</p>;
  if (!isLoaded) return <p>Loading…</p>;

  return (
    <div className="space-y-2">
      <GoogleMap
        center={center}
        zoom={12}
        mapContainerStyle={{
          width: "100%",
          height: "350px",
          borderRadius: "12px",
        }}
      >
        {/* User location */}
        <Marker position={center} label="You" />

        {/* Static hospital markers */}
        {HOSPITALS_UOFC.map((h) => (
          <Marker
            key={h.id}
            position={h.position}
            onClick={() => setSelected(h)}
          />
        ))}

        {selected && (
          <InfoWindow
            position={selected.position}
            onCloseClick={() => setSelected(null)}
          >
            <div className="text-xs max-w-[180px]">
              <div className="font-semibold">{selected.name}</div>
              <div className="text-[11px] text-slate-700">{selected.address}</div>
              <button
                onClick={() => openInMaps(selected)}
                className="mt-2 px-2 py-1 bg-blue-600 text-white rounded-md text-[10px]"
              >
                Open in Google Maps
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Clickable list */}
      <div className="mt-2 bg-black/30 p-2 rounded-xl text-xs max-h-40 overflow-y-auto">
        <p className="font-semibold text-white mb-1">Nearby Hospitals:</p>
        {HOSPITALS_UOFC.map((h) => (
          <button
            key={h.id}
            onClick={() => openInMaps(h)}
            className="block text-left w-full hover:underline mb-2"
          >
            <span className="text-white">{h.name}</span>
            <span className="block text-[11px] text-slate-300">{h.address}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
