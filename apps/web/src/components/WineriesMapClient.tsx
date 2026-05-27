"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Winery } from "@swt/shared";

// ─── Trail helpers ─────────────────────────────────────────────────────────────

// Geographic south-to-north walking order through Old Town Scottsdale.
// Aridus (E Main St) -> Wine Collective (N Scottsdale Rd) -> Marshall Way cluster
// (Carlson Creek -> Los Milics) -> Stetson Dr (Salvatore -> LDV)
const TRAIL_NAME_ORDER = [
  "Aridus",          // 33.4928, 7173 E Main St (southernmost)
  "Wine Collective", // 33.4943, 4020 N Scottsdale Rd
  "Carlson Creek",   // 33.4957, 4142 N Marshall Way
  "Los Milics",      // 33.4959, 4151 N Marshall Way (next door)
  "Salvatore",       // 33.4983, 7064 E 5th Ave
  "LDV",             // 33.4995, 7134 E Stetson Dr (northernmost)
];

function defaultTrailIndex(w: Winery): number {
  const n = w.name.toLowerCase();
  const i = TRAIL_NAME_ORDER.findIndex((t) => n.includes(t.toLowerCase()));
  return i === -1 ? TRAIL_NAME_ORDER.length : i;
}

function sortedByTrail(wineries: Winery[]): Winery[] {
  return [...wineries].sort((a, b) => defaultTrailIndex(a) - defaultTrailIndex(b));
}

// Haversine distance in metres, accurate enough for walking distances.
function haversineM(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6_371_000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Nearest-neighbour TSP starting from a given lat/lng.
// Wineries without coords are appended at the end unchanged.
function nearestNeighbor(
  startLat: number,
  startLng: number,
  wineries: Winery[]
): Winery[] {
  const mapped = wineries.filter((w) => w.lat != null && w.lng != null);
  const unmapped = wineries.filter((w) => w.lat == null || w.lng == null);

  const unvisited = [...mapped];
  const route: Winery[] = [];
  let curLat = startLat;
  let curLng = startLng;

  while (unvisited.length > 0) {
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < unvisited.length; i++) {
      const d = haversineM(curLat, curLng, unvisited[i].lat!, unvisited[i].lng!);
      if (d < bestDist) { bestDist = d; bestIdx = i; }
    }
    const next = unvisited.splice(bestIdx, 1)[0];
    route.push(next);
    curLat = next.lat!;
    curLng = next.lng!;
  }

  return [...route, ...unmapped];
}

// ─── Directions URL helpers ────────────────────────────────────────────────────

function walkingUrl(oLat: number, oLng: number, dLat: number, dLng: number) {
  return `https://www.google.com/maps/dir/?api=1&travelmode=walking&origin=${oLat},${oLng}&destination=${dLat},${dLng}`;
}
function walkingUrlFromAddr(origin: string, dLat: number, dLng: number) {
  return `https://www.google.com/maps/dir/?api=1&travelmode=walking&origin=${encodeURIComponent(origin)}&destination=${dLat},${dLng}`;
}
function fullAddress(w: Winery) {
  return `${w.address}, ${w.city}, ${w.state} ${w.zip}`;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function WineriesMapClient({ wineries }: { wineries: Winery[] }) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef         = useRef<import("mapbox-gl").Map | null>(null);
  // marker root elements, for colour/scale updates
  const markerEls  = useRef<Map<string, HTMLElement>>(new Map());
  // number spans, for re-labelling when order changes
  const markerNums = useRef<Map<string, HTMLSpanElement>>(new Map());
  // user-location marker element
  const userMarkerRef = useRef<import("mapbox-gl").Marker | null>(null);

  const [activeId,       setActiveId]       = useState<string | null>(null);
  const [optimizedOrder, setOptimizedOrder] = useState<Winery[] | null>(null);
  const [optimizing,     setOptimizing]     = useState(false);
  const [userCoords,     setUserCoords]     = useState<[number, number] | null>(null);

  // Which order is live
  const ordered = useMemo(
    () => optimizedOrder ?? sortedByTrail(wineries),
    [optimizedOrder, wineries]
  );
  const withCoords = useMemo(
    () => ordered.filter((w) => w.lat != null && w.lng != null),
    [ordered]
  );

  const activeWinery = useMemo(
    () => ordered.find((w) => w.id === activeId) ?? null,
    [ordered, activeId]
  );
  const activeIdx  = activeWinery ? ordered.indexOf(activeWinery) : -1;
  const nextWinery = activeIdx >= 0 && activeIdx < ordered.length - 1
    ? ordered[activeIdx + 1] : null;
  const isLast = activeIdx === ordered.length - 1 && activeIdx >= 0;

  const nextDirectionsUrl = useMemo(() => {
    if (!activeWinery || !nextWinery?.lat || !nextWinery.lng) return null;
    if (activeWinery.lat && activeWinery.lng)
      return walkingUrl(activeWinery.lat, activeWinery.lng, nextWinery.lat, nextWinery.lng);
    return walkingUrlFromAddr(fullAddress(activeWinery), nextWinery.lat, nextWinery.lng);
  }, [activeWinery, nextWinery]);

  // ── Map initialisation (once) ──────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || !token) return;
    let mounted = true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function initMap() {
      if (!mounted || !mapContainerRef.current) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mb = (window as any).mapboxgl;
      if (!mb) return;
      mb.accessToken = token;

      const avgLng = withCoords.length
        ? withCoords.reduce((s, w) => s + w.lng!, 0) / withCoords.length : -111.926;
      const avgLat = withCoords.length
        ? withCoords.reduce((s, w) => s + w.lat!, 0) / withCoords.length : 33.494;

      const map = new mb.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [avgLng, avgLat],
        zoom: 14,
      });
      mapRef.current = map;

      // Force correct canvas dimensions once the container is measured
      map.once("load", () => map.resize());

      map.on("load", () => {
        if (!mounted) return;

        // Trail line source, data updated separately when order changes
        map.addSource("trail", {
          type: "geojson",
          data: {
            type: "Feature", properties: {},
            geometry: {
              type: "LineString",
              coordinates: withCoords.map((w) => [w.lng!, w.lat!]),
            },
          },
        });
        map.addLayer({
          id: "trail-line", type: "line", source: "trail",
          paint: {
            "line-color": "hsl(351,67%,40%)",
            "line-width": 2.5,
            "line-dasharray": [3, 4],
            "line-opacity": 0.5,
          },
        });

        // Numbered markers, placed once at winery coords
        // Numbers are updated via markerNums refs when order changes
        const snap = sortedByTrail(wineries); // initial order for placement
        snap.forEach((winery, idx) => {
          if (winery.lat == null || winery.lng == null) return;

          const el = document.createElement("div");
          el.style.cssText = `
            width:34px;height:34px;
            border-radius:50% 50% 50% 0;transform:rotate(-45deg);
            cursor:pointer;border:2.5px solid white;
            box-shadow:0 2px 10px rgba(0,0,0,.22);
            background:hsl(351,67%,31%);
            display:flex;align-items:center;justify-content:center;
            transition:background .2s,transform .2s,box-shadow .2s;
          `;
          const num = document.createElement("span");
          num.textContent = String(idx + 1);
          num.style.cssText = `
            transform:rotate(45deg);color:white;font-size:12px;
            font-weight:700;font-family:"Playfair Display",Georgia,serif;line-height:1;
          `;
          el.appendChild(num);
          el.addEventListener("click", () => {
            setActiveId(winery.id);
            map.flyTo({ center: [winery.lng!, winery.lat!], zoom: 15, duration: 700 });
          });

          new mb.Marker({ element: el })
            .setLngLat([winery.lng!, winery.lat!])
            .addTo(map);

          markerEls.current.set(winery.id, el);
          markerNums.current.set(winery.id, num);
        });
      });
    }

    // Load Mapbox GL JS + CSS from CDN, avoids the UMD/ESM conflict that
    // causes the npm package's dynamic import to silently fail in webpack.
    const MAPBOX_VERSION = "3.9.3";
    const CDN = `https://api.mapbox.com/mapbox-gl-js/v${MAPBOX_VERSION}`;

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
      // Script tag already injected by a previous render, wait for it
      document
        .querySelector('script[src*="mapbox-gl"]')
        ?.addEventListener("load", initMap);
    }

    return () => {
      mounted = false;
      mapRef.current?.remove();
      mapRef.current = null;
      markerEls.current.clear();
      markerNums.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ── Re-label markers + redraw trail line when order changes ───────────────
  useEffect(() => {
    // Update number labels
    ordered.forEach((winery, idx) => {
      const span = markerNums.current.get(winery.id);
      if (span) span.textContent = String(idx + 1);
    });

    // Update trail line
    const map = mapRef.current;
    if (!map) return;
    const src = map.getSource("trail") as { setData?: (d: unknown) => void } | undefined;
    src?.setData?.({
      type: "Feature", properties: {},
      geometry: {
        type: "LineString",
        coordinates: withCoords.map((w) => [w.lng!, w.lat!]),
      },
    });
  }, [ordered, withCoords]);

  // ── Highlight active marker ────────────────────────────────────────────────
  useEffect(() => {
    markerEls.current.forEach((el, id) => {
      if (id === activeId) {
        el.style.background = "hsl(43,100%,40%)";
        el.style.boxShadow  = "0 4px 16px rgba(0,0,0,.35)";
        el.style.transform  = "rotate(-45deg) scale(1.25)";
        el.style.zIndex     = "10";
      } else {
        el.style.background = "hsl(351,67%,31%)";
        el.style.boxShadow  = "0 2px 10px rgba(0,0,0,.22)";
        el.style.transform  = "rotate(-45deg) scale(1)";
        el.style.zIndex     = "1";
      }
    });
  }, [activeId]);

  // ── Place / update user-location dot on map ────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userCoords) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mb = (window as any).mapboxgl;
    if (!mb) return;

    userMarkerRef.current?.remove();

    const dot = document.createElement("div");
    dot.style.cssText = `
      width:16px;height:16px;border-radius:50%;
      background:#3b82f6;border:3px solid white;
      box-shadow:0 0 0 4px rgba(59,130,246,.25);
    `;
    userMarkerRef.current = new mb.Marker({ element: dot })
      .setLngLat([userCoords[1], userCoords[0]])
      .addTo(map);
  }, [userCoords]);

  // ── Focus winery from sidebar ──────────────────────────────────────────────
  const focusWinery = useCallback((winery: Winery) => {
    setActiveId(winery.id);
    if (winery.lat != null && winery.lng != null && mapRef.current) {
      mapRef.current.flyTo({ center: [winery.lng, winery.lat], zoom: 15, duration: 700 });
    }
  }, []);

  // ── Optimize route from user's location ───────────────────────────────────
  function handleOptimize() {
    setOptimizing(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserCoords([lat, lng]);
        setOptimizedOrder(nearestNeighbor(lat, lng, wineries));
        setActiveId(null);
        setOptimizing(false);
        // Fly map to user location
        mapRef.current?.flyTo({ center: [lng, lat], zoom: 14, duration: 800 });
      },
      () => {
        setOptimizing(false);
        alert("Couldn't get your location. Please allow location access and try again.");
      },
      { timeout: 8000, maximumAge: 30000 }
    );
  }

  function handleReset() {
    setOptimizedOrder(null);
    setUserCoords(null);
    setActiveId(null);
    userMarkerRef.current?.remove();
    userMarkerRef.current = null;
  }

  // ── Directions from my location to selected winery ────────────────────────
  function handleDirectionsHere() {
    if (!activeWinery?.lat || !activeWinery.lng) return;
    if (userCoords) {
      window.open(
        walkingUrl(userCoords[0], userCoords[1], activeWinery.lat, activeWinery.lng),
        "_blank", "noopener"
      );
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        window.open(
          walkingUrl(pos.coords.latitude, pos.coords.longitude, activeWinery.lat!, activeWinery.lng!),
          "_blank", "noopener"
        );
      },
      () => {
        window.open(
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress(activeWinery))}`,
          "_blank", "noopener"
        );
      },
      { timeout: 7000, maximumAge: 60000 }
    );
  }

  // ── Estimated walk time between two wineries (at ~5 km/h) ─────────────────
  function walkMinutes(a: Winery, b: Winery): string | null {
    if (!a.lat || !a.lng || !b.lat || !b.lng) return null;
    const m = haversineM(a.lat, a.lng, b.lat, b.lng);
    const mins = Math.round((m / 5000) * 60);
    return mins <= 1 ? "~1 min" : `~${mins} min`;
  }

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="md:w-[380px] flex flex-col bg-white border-r border-gray-100 overflow-hidden md:h-full h-[55vh] order-2 md:order-1">

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="font-serif text-xl font-bold text-gray-900 leading-tight">
                Scottsdale Wine Trail
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {ordered.length} tasting rooms ·{" "}
                {optimizedOrder
                  ? <span className="text-blue-600 font-medium">Route optimised from your location</span>
                  : "Default trail order"}
              </p>
            </div>

            {/* Optimise / Reset button */}
            {optimizedOrder ? (
              <button
                type="button"
                onClick={handleReset}
                className="shrink-0 text-xs font-medium text-gray-500 border border-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset ↺
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOptimize}
                disabled={optimizing}
                className="shrink-0 text-xs font-semibold text-white wine-gradient px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 whitespace-nowrap"
              >
                {optimizing ? "Locating…" : "Optimise Route"}
              </button>
            )}
          </div>

          {/* Route stats when optimised */}
          {optimizedOrder && userCoords && withCoords.length > 1 && (
            <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-xs text-blue-700">
              Nearest stop first · Walk times shown · Tap any stop to navigate
            </div>
          )}
        </div>

        {/* Selected winery detail card */}
        {activeWinery && (
          <div className="px-4 py-4 border-b border-gray-100 bg-cream shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full wine-gradient text-white text-xs font-bold font-serif shrink-0">
                {activeIdx + 1}
              </span>
              <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                {isLast ? "Final Stop" : `Stop ${activeIdx + 1} of ${ordered.length}`}
              </span>
              {/* Walk time from prev stop */}
              {activeIdx > 0 && (() => {
                const t = walkMinutes(ordered[activeIdx - 1], activeWinery);
                return t ? (
                  <span className="ml-auto text-xs text-gray-400">{t} from prev</span>
                ) : null;
              })()}
            </div>

            <h2 className="font-serif text-lg font-bold text-gray-900 mb-1 leading-snug">
              {activeWinery.name}
            </h2>
            <p className="text-sm text-gray-500 mb-0.5">{activeWinery.address}</p>
            <p className="text-sm text-gray-500 mb-3">
              {activeWinery.city}, {activeWinery.state}
            </p>

            {activeWinery.description && (
              <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">
                {activeWinery.description}
              </p>
            )}

            <div className="flex flex-col gap-2">
              {/* Walk to next */}
              {!isLast && nextWinery && nextDirectionsUrl && (
                <a
                  href={nextDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 wine-gradient text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
                >
                  Walk to {nextWinery.name.split(" ").slice(0, 2).join(" ")}
                  {(() => {
                    const t = walkMinutes(activeWinery, nextWinery);
                    return t ? <span className="opacity-80 font-normal">· {t}</span> : null;
                  })()}
                </a>
              )}

              {/* End of trail */}
              {isLast && (
                <div className="text-center py-1.5">
                  <p className="text-xs font-semibold text-burgundy-600 mb-1.5">
                    End of Trail, you&apos;ve visited them all!
                  </p>
                  <button
                    type="button"
                    onClick={() => focusWinery(ordered[0])}
                    className="text-xs text-gray-400 underline hover:text-burgundy-700"
                  >
                    Back to first stop
                  </button>
                </div>
              )}

              {/* From my location */}
              <button
                type="button"
                onClick={handleDirectionsHere}
                className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 font-medium text-sm px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {userCoords ? "Walk Here from My Location" : "Directions from My Location"}
              </button>

              <Link
                href={`/wineries/${activeWinery.slug}`}
                className="text-center text-sm font-medium text-burgundy-600 hover:text-burgundy-800 transition-colors py-0.5"
              >
                View Winery Details →
              </Link>
            </div>
          </div>
        )}

        {/* Trail list */}
        <ul className="overflow-y-auto flex-1 divide-y divide-gray-50">
          {ordered.map((winery, idx) => {
            const hasCoords = winery.lat != null && winery.lng != null;
            const isActive  = winery.id === activeId;
            const prevW     = idx > 0 ? ordered[idx - 1] : null;
            const legTime   = prevW ? walkMinutes(prevW, winery) : null;

            return (
              <li key={winery.id}>
                {/* Walk-time separator between stops */}
                {legTime && optimizedOrder && (
                  <div className="px-5 py-1 flex items-center gap-2">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-xs text-gray-300 shrink-0">{legTime}</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => focusWinery(winery)}
                  className={`w-full text-left px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                    isActive ? "bg-gold-50" : ""
                  }`}
                >
                  <span
                    className={`mt-0.5 shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold font-serif transition-colors ${
                      isActive ? "gold-gradient text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {idx + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className={`font-semibold text-sm leading-snug ${isActive ? "text-burgundy-800" : "text-gray-900"}`}>
                      {winery.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {winery.address}
                    </p>
                    {!hasCoords && (
                      <p className="text-xs text-amber-500 mt-0.5">Map pin coming soon</p>
                    )}
                  </div>

                  {isActive && <span className="text-gold-500 text-sm shrink-0 mt-0.5">●</span>}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-cream shrink-0">
          <p className="text-xs text-gray-400 text-center">
            {optimizedOrder
              ? "Route ordered by walking distance from your location"
              : "Tap a stop · Use \"Optimise Route\" to sort by proximity"}
          </p>
        </div>
      </aside>

      {/* ── Map ─────────────────────────────────────────────────────────── */}
      <section className="flex-1 relative order-1 md:order-2 min-h-[45vh] md:min-h-0">
        {!token ? (
          <div className="h-full flex flex-col items-center justify-center bg-cream text-center px-8 gap-5">
            <div>
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">Map Unavailable</h2>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Add{" "}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">
                  NEXT_PUBLIC_MAPBOX_TOKEN
                </code>{" "}
                to your <code className="font-mono text-xs">.env.local</code>.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                The winery list and direction links still work without a map.
              </p>
            </div>
            <Link href="/wineries" className="wine-gradient text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:opacity-90">
              Browse All Wineries
            </Link>
          </div>
        ) : (
          <>
            <div ref={mapContainerRef} className="h-full w-full" />

            {/* Idle prompt */}
            {!activeWinery && !optimizing && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl px-5 py-3 text-sm text-gray-700 font-medium pointer-events-none border border-gray-100 whitespace-nowrap">
                Select a stop · or use <span className="text-burgundy-600">Optimise Route</span> for your location
              </div>
            )}

            {/* Mobile floating CTA */}
            {activeWinery && (
              <div className="md:hidden absolute bottom-4 left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full wine-gradient text-white text-xs font-bold font-serif">
                    {activeIdx + 1}
                  </span>
                  <p className="font-serif font-semibold text-gray-900 text-sm truncate">
                    {activeWinery.name}
                  </p>
                </div>
                {!isLast && nextWinery && nextDirectionsUrl ? (
                  <a
                    href={nextDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 wine-gradient text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:opacity-90 mt-1"
                  >
                    Walk to {nextWinery.name.split(" ").slice(0, 2).join(" ")}
                    {(() => {
                      const t = walkMinutes(activeWinery, nextWinery);
                      return t ? <span className="opacity-75 font-normal">· {t}</span> : null;
                    })()}
                  </a>
                ) : isLast ? (
                  <p className="text-xs text-burgundy-600 font-semibold text-center mt-1">
                    End of trail, well done!
                  </p>
                ) : null}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
