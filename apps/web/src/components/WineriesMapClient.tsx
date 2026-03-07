"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Winery } from "@swt/shared";

// ─── Trail order ───────────────────────────────────────────────────────────────
// Ordered by winery name fragment. Easy to replace with a DB `trail_order`
// column later — just change getTrailIndex() to use that field.
const TRAIL_NAME_ORDER = [
  "Aridus",
  "LDV",
  "Salvatore",
  "Arizona Stronghold",
  "Carlson Creek",
  "Los Milics",
  "Wine Collective",
];

function getTrailIndex(winery: Winery): number {
  const n = winery.name.toLowerCase();
  for (let i = 0; i < TRAIL_NAME_ORDER.length; i++) {
    if (n.includes(TRAIL_NAME_ORDER[i].toLowerCase())) return i;
  }
  return TRAIL_NAME_ORDER.length; // unknown wineries sort to the end
}

function sortedByTrail(wineries: Winery[]): Winery[] {
  return [...wineries].sort((a, b) => getTrailIndex(a) - getTrailIndex(b));
}

// ─── Google Maps URL helpers ───────────────────────────────────────────────────

function walkingUrl(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): string {
  return `https://www.google.com/maps/dir/?api=1&travelmode=walking&origin=${originLat},${originLng}&destination=${destLat},${destLng}`;
}

function walkingUrlFromAddress(
  originAddress: string,
  destLat: number,
  destLng: number
): string {
  return `https://www.google.com/maps/dir/?api=1&travelmode=walking&origin=${encodeURIComponent(
    originAddress
  )}&destination=${destLat},${destLng}`;
}

function fullAddress(w: Winery) {
  return `${w.address}, ${w.city}, ${w.state} ${w.zip}`;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function WineriesMapClient({ wineries }: { wineries: Winery[] }) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("mapbox-gl").Map | null>(null);
  const markersRef = useRef<Map<string, HTMLElement>>(new Map());

  const [activeId, setActiveId] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const ordered = useMemo(() => sortedByTrail(wineries), [wineries]);
  const withCoords = useMemo(
    () => ordered.filter((w) => w.lat != null && w.lng != null),
    [ordered]
  );

  const activeWinery = useMemo(
    () => ordered.find((w) => w.id === activeId) ?? null,
    [ordered, activeId]
  );
  const activeIdx = activeWinery ? ordered.indexOf(activeWinery) : -1;
  const nextWinery = activeIdx >= 0 && activeIdx < ordered.length - 1
    ? ordered[activeIdx + 1]
    : null;
  const isLast = activeIdx === ordered.length - 1 && activeIdx >= 0;

  // ── Build "next stop" directions URL ────────────────────────────────────────
  const nextDirectionsUrl = useMemo(() => {
    if (!activeWinery || !nextWinery) return null;
    const dest = nextWinery;
    if (!dest.lat || !dest.lng) return null;
    if (activeWinery.lat && activeWinery.lng) {
      return walkingUrl(activeWinery.lat, activeWinery.lng, dest.lat, dest.lng);
    }
    return walkingUrlFromAddress(fullAddress(activeWinery), dest.lat, dest.lng);
  }, [activeWinery, nextWinery]);

  // ── Map init ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || !token) return;

    let mounted = true;

    import("mapbox-gl/dist/mapbox-gl.css").catch(() => null);
    import("mapbox-gl").then((mod) => {
      if (!mounted || !mapContainerRef.current) return;

      const mb = mod.default;
      mb.accessToken = token;

      // Center on average coords or fall back to Old Town Scottsdale
      const avgLng =
        withCoords.length
          ? withCoords.reduce((s, w) => s + w.lng!, 0) / withCoords.length
          : -111.926;
      const avgLat =
        withCoords.length
          ? withCoords.reduce((s, w) => s + w.lat!, 0) / withCoords.length
          : 33.494;

      const map = new mb.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [avgLng, avgLat],
        zoom: 13.8,
      });

      mapRef.current = map;

      map.on("load", () => {
        if (!mounted) return;

        // ── Trail connecting line ──────────────────────────────────────────────
        if (withCoords.length > 1) {
          map.addSource("trail", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: withCoords.map((w) => [w.lng!, w.lat!]),
              },
            },
          });
          map.addLayer({
            id: "trail-line",
            type: "line",
            source: "trail",
            paint: {
              "line-color": "hsl(351,67%,40%)",
              "line-width": 2,
              "line-dasharray": [3, 4],
              "line-opacity": 0.45,
            },
          });
        }

        // ── Numbered markers ───────────────────────────────────────────────────
        ordered.forEach((winery, idx) => {
          if (winery.lat == null || winery.lng == null) return;

          const el = document.createElement("div");
          el.dataset.wineryId = winery.id;
          el.style.cssText = `
            width: 34px; height: 34px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            cursor: pointer;
            border: 2.5px solid white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.22);
            background: hsl(351,67%,31%);
            display: flex; align-items: center; justify-content: center;
            transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          `;

          const num = document.createElement("span");
          num.textContent = String(idx + 1);
          num.style.cssText = `
            transform: rotate(45deg);
            color: white;
            font-size: 12px;
            font-weight: 700;
            font-family: "Playfair Display", Georgia, serif;
            line-height: 1;
          `;
          el.appendChild(num);

          el.addEventListener("click", () => {
            setActiveId(winery.id);
            map.flyTo({
              center: [winery.lng!, winery.lat!],
              zoom: 15,
              duration: 700,
            });
          });

          new mb.Marker({ element: el })
            .setLngLat([winery.lng!, winery.lat!])
            .addTo(map);

          markersRef.current.set(winery.id, el);
        });
      });
    });

    return () => {
      mounted = false;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ── Highlight active marker ───────────────────────────────────────────────────
  useEffect(() => {
    markersRef.current.forEach((el, id) => {
      if (id === activeId) {
        el.style.background = "hsl(43,100%,40%)";
        el.style.boxShadow = "0 4px 16px rgba(0,0,0,0.35)";
        el.style.transform = "rotate(-45deg) scale(1.25)";
        el.style.zIndex = "10";
      } else {
        el.style.background = "hsl(351,67%,31%)";
        el.style.boxShadow = "0 2px 10px rgba(0,0,0,0.22)";
        el.style.transform = "rotate(-45deg) scale(1)";
        el.style.zIndex = "1";
      }
    });
  }, [activeId]);

  // ── Sidebar focus winery ──────────────────────────────────────────────────────
  const focusWinery = useCallback(
    (winery: Winery) => {
      setActiveId(winery.id);
      if (winery.lat != null && winery.lng != null && mapRef.current) {
        mapRef.current.flyTo({
          center: [winery.lng, winery.lat],
          zoom: 15,
          duration: 700,
        });
      }
    },
    []
  );

  // ── Geolocation → directions to active winery ─────────────────────────────────
  function handleLocateToActive() {
    if (!activeWinery?.lat || !activeWinery.lng) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const url = walkingUrl(
          pos.coords.latitude,
          pos.coords.longitude,
          activeWinery.lat!,
          activeWinery.lng!
        );
        window.open(url, "_blank", "noopener");
      },
      () => {
        setLocating(false);
        // Fallback: search in Google Maps
        window.open(
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            fullAddress(activeWinery)
          )}`,
          "_blank",
          "noopener"
        );
      },
      { timeout: 7000, maximumAge: 60000 }
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className="md:w-[380px] flex flex-col bg-white border-r border-gray-100 overflow-hidden md:h-full h-[55vh] order-2 md:order-1">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 shrink-0">
          <h1 className="font-serif text-xl font-bold text-gray-900 leading-tight">
            Scottsdale Wine Trail
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {ordered.length} tasting rooms ·{" "}
            {activeWinery ? `Stop ${activeIdx + 1} selected` : "Select a stop"}
          </p>
        </div>

        {/* Selected winery detail card */}
        {activeWinery && (
          <div className="px-4 py-4 border-b border-gray-100 bg-cream shrink-0">
            {/* Stop badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full wine-gradient text-white text-xs font-bold font-serif shrink-0">
                {activeIdx + 1}
              </span>
              <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                {isLast ? "Final Stop" : `Stop ${activeIdx + 1} of ${ordered.length}`}
              </span>
            </div>

            <h2 className="font-serif text-lg font-bold text-gray-900 mb-1 leading-snug">
              {activeWinery.name}
            </h2>
            <p className="text-sm text-gray-500 mb-1">{activeWinery.address}</p>
            <p className="text-sm text-gray-500 mb-3">
              {activeWinery.city}, {activeWinery.state}
            </p>

            {activeWinery.description && (
              <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                {activeWinery.description}
              </p>
            )}

            {/* CTAs */}
            <div className="flex flex-col gap-2">
              {/* Next winery */}
              {!isLast && nextWinery && nextDirectionsUrl && (
                <a
                  href={nextDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 wine-gradient text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
                >
                  <span>🚶</span>
                  Walk to {nextWinery.name.split(" ").slice(0, 2).join(" ")} →
                </a>
              )}

              {/* End of trail */}
              {isLast && (
                <div className="text-center py-2">
                  <p className="text-xs font-semibold text-burgundy-600 mb-1.5">
                    🎉 End of Trail
                  </p>
                  <button
                    type="button"
                    onClick={() => focusWinery(ordered[0])}
                    className="text-xs text-gray-500 underline hover:text-burgundy-700"
                  >
                    Back to first stop
                  </button>
                </div>
              )}

              {/* From my location */}
              {activeWinery.lat && activeWinery.lng && (
                <button
                  type="button"
                  onClick={handleLocateToActive}
                  disabled={locating}
                  className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-medium text-sm px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60"
                >
                  {locating ? (
                    "Finding your location…"
                  ) : (
                    <>
                      <span>📍</span> Directions from My Location
                    </>
                  )}
                </button>
              )}

              {/* View winery page */}
              <Link
                href={`/wineries/${activeWinery.slug}`}
                className="text-center text-sm font-medium text-burgundy-600 hover:text-burgundy-800 transition-colors py-1"
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
            const isActive = winery.id === activeId;

            return (
              <li key={winery.id}>
                <button
                  type="button"
                  onClick={() => focusWinery(winery)}
                  className={`w-full text-left px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                    isActive ? "bg-gold-50" : ""
                  }`}
                >
                  {/* Trail number */}
                  <span
                    className={`mt-0.5 shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold font-serif transition-colors ${
                      isActive
                        ? "gold-gradient text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {idx + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-semibold text-sm leading-snug ${
                        isActive ? "text-burgundy-800" : "text-gray-900"
                      }`}
                    >
                      {winery.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {winery.address}
                    </p>
                    {!hasCoords && (
                      <p className="text-xs text-amber-600 mt-0.5">
                        Map pin coming soon
                      </p>
                    )}
                  </div>

                  {isActive && (
                    <span className="text-gold-500 text-sm shrink-0 mt-0.5">●</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Footer hint */}
        <div className="px-5 py-3 border-t border-gray-100 bg-cream shrink-0">
          <p className="text-xs text-gray-400 text-center">
            Click a stop to select · Tap the map to explore
          </p>
        </div>
      </aside>

      {/* ── Map ─────────────────────────────────────────────────────────────── */}
      <section className="flex-1 relative order-1 md:order-2 min-h-[45vh] md:min-h-0">
        {!token ? (
          /* No token fallback — still shows full winery list in sidebar */
          <div className="h-full flex flex-col items-center justify-center bg-cream text-center px-8 gap-5">
            <div className="text-5xl">🗺️</div>
            <div>
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">
                Map Unavailable
              </h2>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Add{" "}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">
                  NEXT_PUBLIC_MAPBOX_TOKEN
                </code>{" "}
                to your <code className="font-mono text-xs">.env.local</code> to
                enable the interactive map.
              </p>
              <p className="text-gray-400 text-sm mt-3">
                The winery list and direction links still work without a map.
              </p>
            </div>
            <Link
              href="/wineries"
              className="wine-gradient text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity"
            >
              Browse All Wineries
            </Link>
          </div>
        ) : (
          <>
            <div ref={mapContainerRef} className="h-full w-full" />

            {/* Floating "no winery selected" prompt */}
            {!activeWinery && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl px-5 py-3 text-sm text-gray-700 font-medium pointer-events-none border border-gray-100">
                Select a stop to get walking directions
              </div>
            )}

            {/* Floating directions card on mobile when winery selected */}
            {activeWinery && nextDirectionsUrl && (
              <div className="md:hidden absolute bottom-4 left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
                <p className="font-serif font-semibold text-gray-900 text-sm mb-1">
                  Stop {activeIdx + 1}: {activeWinery.name}
                </p>
                {!isLast && nextWinery && (
                  <a
                    href={nextDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 wine-gradient text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity mt-2"
                  >
                    🚶 Walk to {nextWinery.name.split(" ").slice(0, 2).join(" ")} →
                  </a>
                )}
                {isLast && (
                  <p className="text-xs text-burgundy-600 font-semibold text-center mt-1">
                    🎉 You&apos;ve reached the end of the trail!
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
