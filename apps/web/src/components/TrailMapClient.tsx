"use client";

import { useRef, useEffect } from "react";
import type { Winery } from "@swt/shared";

export function TrailMapClient({ wineries }: { wineries: Winery[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!mapContainer.current || !token) return;

    // Dynamically import mapbox-gl to avoid SSR issues
    let map: { remove: () => void } | null = null;

    import("mapbox-gl/dist/mapbox-gl.css" as never).catch(() => null);
    import("mapbox-gl").then((mapboxgl) => {
      const mb = mapboxgl.default;
      mb.accessToken = token;

      map = new mb.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [-111.891, 33.4942],
        zoom: 11,
      });

      wineries.forEach((winery) => {
        if (!winery.lat || !winery.lng) return;

        const popup = new mb.Popup({ offset: 25 }).setHTML(
          `<div style="font-family:sans-serif;max-width:160px">
            <strong style="color:#420a21">${winery.name}</strong><br/>
            <a href="/wineries/${winery.slug}" style="color:#c43060;font-size:12px">View details →</a>
          </div>`
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new mb.Marker({ color: "#c43060" })
          .setLngLat([winery.lng, winery.lat])
          .setPopup(popup)
          .addTo(map as any);
      });
    });

    return () => {
      map?.remove();
    };
  }, [token, wineries]);

  if (!token) {
    return (
      <div className="flex items-center justify-center h-full bg-wine-50">
        <div className="text-center p-8">
          <p className="text-wine-600 text-lg font-medium mb-2">
            Mapbox token not configured
          </p>
          <p className="text-wine-400 text-sm">
            Set{" "}
            <code className="bg-wine-100 px-1 rounded">
              NEXT_PUBLIC_MAPBOX_TOKEN
            </code>{" "}
            in your environment to enable the map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {wineries.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="bg-white/80 px-4 py-2 rounded-lg text-wine-600 text-sm">
            No winery locations found.
          </p>
        </div>
      )}
    </div>
  );
}
