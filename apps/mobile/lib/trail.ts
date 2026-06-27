import type { Winery } from "@swt/shared";

/**
 * Canonical walking order of the Scottsdale Wine Trail (Feature 6 spec).
 * Used to sort wineries everywhere and to compute "Walk to Next Stop".
 */
export const TRAIL_ORDER: string[] = [
  "aridus-wine-company",
  "ldv-winery-tasting-room",
  "salvatore-vineyards-tasting-room",
  "arizona-stronghold-vineyards",
  "carlson-creek-tasting-room",
  "los-milics-vineyards",
  "the-wine-collective-of-scottsdale",
];

/** Position on the trail (1-based) or `null` if the slug isn't a trail stop. */
export function trailStopNumber(slug: string): number | null {
  const i = TRAIL_ORDER.indexOf(slug);
  return i === -1 ? null : i + 1;
}

/** Sort wineries by trail order; anything off-trail falls to the end alphabetically. */
export function sortByTrail<T extends { slug: string; name: string }>(
  wineries: T[]
): T[] {
  return [...wineries].sort((a, b) => {
    const ai = TRAIL_ORDER.indexOf(a.slug);
    const bi = TRAIL_ORDER.indexOf(b.slug);
    if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

/** The next stop after `slug` on the trail, or `null` if it's the last/unknown. */
export function nextStop(slug: string, wineries: Winery[]): Winery | null {
  const i = TRAIL_ORDER.indexOf(slug);
  if (i === -1 || i >= TRAIL_ORDER.length - 1) return null;
  const nextSlug = TRAIL_ORDER[i + 1];
  return wineries.find((w) => w.slug === nextSlug) ?? null;
}

function coordsOf(w: Pick<Winery, "lat" | "lng" | "address" | "city" | "state">): string {
  if (w.lat != null && w.lng != null) return `${w.lat},${w.lng}`;
  return encodeURIComponent(`${w.address}, ${w.city}, ${w.state}`);
}

/**
 * Universal Google Maps directions URL (opens the Google Maps app or browser,
 * and Apple Maps can handle the query on iOS via the system sheet). Walking mode.
 */
export function walkingDirectionsUrl(
  origin: Pick<Winery, "lat" | "lng" | "address" | "city" | "state">,
  destination: Pick<Winery, "lat" | "lng" | "address" | "city" | "state">
): string {
  return (
    "https://www.google.com/maps/dir/?api=1" +
    `&origin=${coordsOf(origin)}` +
    `&destination=${coordsOf(destination)}` +
    "&travelmode=walking"
  );
}

/** Directions to a single destination (used by the detail-screen "Directions" CTA). */
export function directionsToUrl(
  destination: Pick<Winery, "lat" | "lng" | "address" | "city" | "state" | "name">
): string {
  const dest =
    destination.lat != null && destination.lng != null
      ? `${destination.lat},${destination.lng}`
      : encodeURIComponent(
          `${destination.name}, ${destination.address}, ${destination.city}, ${destination.state}`
        );
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=walking`;
}
