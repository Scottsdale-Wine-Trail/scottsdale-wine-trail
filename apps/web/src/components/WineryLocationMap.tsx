"use client";

import { useEffect, useRef } from "react";

type WineryLocationMapProps = {
  lat: number;
  lng: number;
  name: string;
};

export function WineryLocationMap({ lat, lng, name }: WineryLocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!mapContainer.current || !token) return;

    let mounted = true;
    let map: import("mapbox-gl").Map | null = null;

    import("mapbox-gl").then((mapboxgl) => {
      if (!mounted) return;

      const mb = mapboxgl.default;
      mb.accessToken = token;

      map = new mb.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: 13,
      });

      new mb.Marker({ color: "#8a1538" }).setLngLat([lng, lat]).addTo(map);
    });

    return () => {
      mounted = false;
      map?.remove();
    };
  }, [lat, lng, token]);

  if (!token) {
    return (
      <div className="h-72 bg-wine-50 rounded-xl border border-wine-200 flex items-center justify-center text-sm text-wine-700">
        Map unavailable: missing NEXT_PUBLIC_MAPBOX_TOKEN
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-wine-200">
      <div className="sr-only">Map for {name}</div>
      <div ref={mapContainer} className="h-72 w-full" />
    </div>
  );
}
