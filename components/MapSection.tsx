"use client";

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo, useState } from "react";

type LatLng = { lat: number; lng: number };

type CareType = "ER" | "WALK_IN" | "GENERAL";

type Place = {
  id: string;
  name: string;
  position: LatLng;
  address?: string;
};

type MapSectionProps = {
  userLocation: LatLng;
  careType?: CareType;
};

export default function MapSection({
  userLocation,
  careType = "GENERAL",
}: MapSectionProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: ["places"] as any, // Required for Places API
  });

  const [places, setPlaces] = useState<Place[]>([]);

  const center = useMemo(() => {
    return { lat: userLocation.lat, lng: userLocation.lng };
  }, [userLocation]);

  if (loadError) {
    return <p className="text-red-400 text-xs">Error loading map.</p>;
  }
  if (!isLoaded) {
    return <p className="text-xs text-slate-300">Loading map...</p>;
  }

  const onMapLoad = (map: google.maps.Map) => {
    const service = new google.maps.places.PlacesService(map);

    // Build request for Places API
    let request: google.maps.places.PlaceSearchRequest = {
      location: center,
      radius: 5000,
    };

    if (careType === "ER") {
      request = {
        ...request,
        type: "hospital",
        keyword: "emergency room hospital ER",
      };
    } else if (careType === "WALK_IN") {
      request = {
        ...request,
        keyword: "walk in clinic urgent care family doctor",
      };
    } else {
      request = {
        ...request,
        keyword: "clinic hospital family doctor",
      };
    }

    // Search nearby places
    service.nearbySearch(request, (results, status) => {
      if (
        status !== google.maps.places.PlacesServiceStatus.OK ||
        !results
      ) {
        console.warn("No results from Places API:", status);
        setPlaces([]);
        return;
      }

      const formatted: Place[] = results.map((r) => ({
        id: r.place_id ?? r.name ?? Math.random().toString(),
        name: r.name ?? "Unknown place",
        position: {
          lat: r.geometry?.location?.lat() ?? center.lat,
          lng: r.geometry?.location?.lng() ?? center.lng,
        },
        address: r.vicinity,
      }));

      setPlaces(formatted);
    });
  };

  return (
    <div className="space-y-2">
      <GoogleMap
        onLoad={onMapLoad}
        center={center}
        zoom={13}
        mapContainerStyle={{
          width: "100%",
          height: "350px",
          borderRadius: "12px",
        }}
      >
        {/* Your location */}
        <Marker position={center} label="You" />

        {/* Nearby healthcare locations */}
        {places.map((place) => (
          <Marker key={place.id} position={place.position} />
        ))}
      </GoogleMap>

      {/* Listing results */}
      {places.length > 0 && (
        <div className="mt-2 max-h-40 overflow-y-auto rounded-xl bg-black/30 p-2 text-xs">
          <p className="mb-1 font-semibold text-[var(--lavender-50)]">
            Nearby healthcare locations:
          </p>
          <ul className="space-y-1">
            {places.slice(0, 6).map((p) => (
              <li key={p.id}>
                <span className="font-medium text-slate-50">{p.name}</span>
                {p.address && (
                  <span className="block text-[11px] text-slate-300">
                    {p.address}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {places.length === 0 && (
        <p className="text-[11px] text-slate-300">
          No locations found yet. Try zooming out or moving the map.
        </p>
      )}
    </div>
  );
}
