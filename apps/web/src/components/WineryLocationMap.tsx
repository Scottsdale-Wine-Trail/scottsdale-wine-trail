"use client";

import { useEffect, useRef } from "react";

type WineryLocationMapProps = {
  lat: number;
  lng: number;
  name: string;
};

const MAPBOX_VERSION = "3.9.3";
const CDN = `https://api.mapbox.com/mapbox-gl-js/v${MAPBOX_VERSION}`;

export function WineryLocationMap({ lat, lng, name }: WineryLocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!mapContainer.current || !token) return;
    let mounted = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any = null;

    function initMap() {
      if (!mounted || !mapContainer.current) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mb = (window as any).mapboxgl;
      if (!mb) return;
      mb.accessToken = token;

      map = new mb.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: 15,
      });

      map.once("load", () => map?.resize());

      new mb.Marker({ color: "#8a1538" }).setLngLat([lng, lat]).addTo(map);
    }

    // Inject the CSS once globally so marker styling renders.
    if (!document.querySelector('link[href*="mapbox-gl"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `${CDN}/mapbox-gl.css`;
      document.head.appendChild(link);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).mapboxgl) {
      initMap();
    } else if (!document.querySelector('script[src*="mapbox-gl"]')) {
      const script = document.createElement("script");
      script.src = `${CDN}/mapbox-gl.js`;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      document
        .querySelector('script[src*="mapbox-gl"]')
        ?.addEventListener("load", initMap);
    }

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
