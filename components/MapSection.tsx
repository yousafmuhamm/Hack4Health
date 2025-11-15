"use client";

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

type LatLng = {
  lat: number;
  lng: number;
};

export default function MapSection({ userLocation }: { userLocation: LatLng }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  });

  if (!isLoaded) return <p className="text-white">Loading map…</p>;

  return (
    <GoogleMap
      zoom={14}
      center={userLocation}
      mapContainerStyle={{
        width: "100%",
        height: "350px",
        borderRadius: "12px",
      }}
    >
      <Marker position={userLocation} />
    </GoogleMap>
  );
}
