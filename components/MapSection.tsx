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
    libraries: ["places"] as any, // required for Places API
  });

  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [placesStatus, setPlacesStatus] = useState<string | null>(null);

  const center = useMemo(
    () => ({ lat: userLocation.lat, lng: userLocation.lng }),
    [userLocation]
  );

  if (loadError) {
    return <p className="text-red-400 text-xs">Error loading map.</p>;
  }
  if (!isLoaded) {
    return <p className="text-xs text-slate-300">Loading map...</p>;
  }

  // Open a place in Google Maps in a new tab
  const openInGoogleMaps = (place: Place) => {
    const query = place.address
      ? `${place.name} ${place.address}`
      : place.name;
    const url =
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(query);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const onMapLoad = (map: google.maps.Map) => {
    const service = new google.maps.places.PlacesService(map);

    // Build request for Places API based on careType
    let request: google.maps.places.PlaceSearchRequest = {
      location: center,
      radius: 15000, // 15 km to be safe
    };

    if (careType === "ER") {
      request = {
        ...request,
        type: "hospital",
        keyword: "emergency room emergency department hospital ER",
      };
    } else if (careType === "WALK_IN") {
      request = {
        ...request,
        keyword: "walk in clinic family doctor urgent care medical clinic",
      };
    } else {
      request = {
        ...request,
        keyword: "clinic hospital family doctor medical centre",
      };
    }

    service.nearbySearch(request, (results, status) => {
      console.log("Places status:", status, results);
      if (
        status !== google.maps.places.PlacesServiceStatus.OK ||
        !results
      ) {
        setPlaces([]);
        setSelectedPlace(null);
        setPlacesStatus(status);
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
      setSelectedPlace(null);
      setPlacesStatus("OK");
    });
  };

  return (
    <div className="space-y-2">
      <GoogleMap
        onLoad={onMapLoad}
        center={center}
        zoom={12}
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
          <Marker
            key={place.id}
            position={place.position}
            onClick={() => setSelectedPlace(place)}
          />
        ))}

        {/* Info bubble on click */}
        {selectedPlace && (
          <InfoWindow
            position={selectedPlace.position}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div className="text-xs max-w-[180px]">
              <div className="font-semibold mb-1">{selectedPlace.name}</div>
              {selectedPlace.address && (
                <div className="text-[11px] text-slate-700 mb-1">
                  {selectedPlace.address}
                </div>
              )}
              <button
                onClick={() => openInGoogleMaps(selectedPlace)}
                className="mt-1 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-medium text-white hover:bg-blue-700"
              >
                Open in Google Maps
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Clickable list under the map */}
      {places.length > 0 && (
        <div className="mt-2 max-h-40 overflow-y-auto rounded-xl bg-black/30 p-2 text-xs">
          <p className="mb-1 font-semibold text-[var(--lavender-50)]">
            Nearby healthcare locations:
          </p>
          <ul className="space-y-1">
            {places.slice(0, 8).map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => openInGoogleMaps(p)}
                  className="w-full text-left hover:underline"
                >
                  <span className="font-medium text-slate-50">
                    {p.name}
                  </span>
                  {p.address && (
                    <span className="block text-[11px] text-slate-300">
                      {p.address}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {places.length === 0 && (
        <p className="text-[11px] text-slate-300">
          No locations found yet.
          {placesStatus && ` (Places status: ${placesStatus}) `}
          If this keeps happening, make sure the
          {" "}
          <span className="font-semibold">Places API</span> is enabled for
          your Google Maps key.
        </p>
      )}
    </div>
  );
}
