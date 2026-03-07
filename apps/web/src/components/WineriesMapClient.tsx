"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Winery } from "@swt/shared";

type MarkerRef = {
  popup: import("mapbox-gl").Popup;
  lng: number;
  lat: number;
};

export function WineriesMapClient({ wineries }: { wineries: Winery[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("mapbox-gl").Map | null>(null);
  const markersRef = useRef<Record<string, MarkerRef>>({});
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const [activeWineryId, setActiveWineryId] = useState<string | null>(null);

  const withCoords = useMemo(
    () => wineries.filter((w) => w.lat != null && w.lng != null),
    [wineries]
  );

  useEffect(() => {
    if (!mapContainer.current || !token) return;

    let mounted = true;

    import("mapbox-gl/dist/mapbox-gl.css").catch(() => null);
    import("mapbox-gl").then((mapboxgl) => {
      if (!mounted || !mapContainer.current) return;

      const mb = mapboxgl.default;
      mb.accessToken = token;

      const initialCenter = withCoords[0]
        ? [withCoords[0].lng!, withCoords[0].lat!]
        : [-111.9261, 33.4942];

      const map = new mb.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: initialCenter as [number, number],
        zoom: 12,
      });

      mapRef.current = map;

      withCoords.forEach((winery) => {
        const popup = new mb.Popup({ offset: 20 }).setHTML(
          `<div><strong>${winery.name}</strong><br/><span>${winery.address}</span></div>`
        );

        new mb.Marker({ color: "#8a1538" })
          .setLngLat([winery.lng!, winery.lat!])
          .setPopup(popup)
          .addTo(map)
          .getElement()
          .addEventListener("click", () => setActiveWineryId(winery.id));

        markersRef.current[winery.id] = {
          popup,
          lng: winery.lng!,
          lat: winery.lat!,
        };
      });
    });

    return () => {
      mounted = false;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, [token, withCoords]);

  function focusWinery(winery: Winery) {
    setActiveWineryId(winery.id);

    const map = mapRef.current;

    if (winery.lat == null || winery.lng == null || !map) {
      return;
    }

    map.flyTo({ center: [winery.lng, winery.lat], zoom: 14 });

    const marker = markersRef.current[winery.id];
    if (marker) {
      marker.popup.setLngLat([marker.lng, marker.lat]).addTo(map);
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] grid md:grid-cols-[360px_1fr]">
      <aside className="border-r border-wine-200 bg-white overflow-y-auto">
        <div className="p-4 border-b border-wine-100">
          <h1 className="text-2xl font-bold text-wine-900">Wine Trail Map</h1>
          <p className="text-sm text-wine-600">Select a winery to center the map.</p>
        </div>

        <ul className="divide-y divide-wine-100">
          {wineries.map((winery) => {
            const hasCoords = winery.lat != null && winery.lng != null;
            return (
              <li key={winery.id}>
                <button
                  type="button"
                  onClick={() => focusWinery(winery)}
                  className={`w-full text-left p-4 hover:bg-wine-50 transition-colors ${
                    activeWineryId === winery.id ? "bg-wine-50" : ""
                  }`}
                >
                  <p className="font-medium text-wine-900">{winery.name}</p>
                  <p className="text-sm text-wine-700">{winery.address}</p>
                  <p className="text-xs text-wine-500 mt-1">
                    {hasCoords ? "Has map coordinates" : "No map coordinates yet"}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <section>
        {!token ? (
          <div className="h-full flex items-center justify-center text-wine-700">
            Missing NEXT_PUBLIC_MAPBOX_TOKEN
          </div>
        ) : (
          <div ref={mapContainer} className="h-full w-full" />
        )}
      </section>
    </div>
  );
}
