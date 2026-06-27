/** MVP product constants. Centralized so they're trivial to change later. */

export const PASSPORT_PRICE = "$5";
export const FLIGHT_DISCOUNT = "$2";
export const TOTAL_STOPS = 7;

/**
 * MVP "Stamp My Visit" employee/manual code. Staff enter this at the tasting
 * room to stamp a guest's passport. Replace with per-winery codes or a signed
 * QR scan later — validation lives in lib/data.ts `verifyStampCode`.
 */
export const STAMP_CODE = process.env.EXPO_PUBLIC_STAMP_CODE ?? "TRAIL2026";

export const PASSPORT_BENEFITS = [
  {
    icon: "pricetag" as const,
    title: "$2 off every flight",
    body: "Show your passport at any tasting room for $2 off each wine flight. It pays for itself after three stops.",
  },
  {
    icon: "ribbon" as const,
    title: "Collect stamps",
    body: "Earn a stamp at each of the 7 participating tasting rooms as you go.",
  },
  {
    icon: "map" as const,
    title: "Complete the trail",
    body: "Visit every tasting room to finish the Scottsdale Wine Trail.",
  },
  {
    icon: "gift" as const,
    title: "Rewards coming soon",
    body: "Finish the trail to unlock a Scottsdale Wine Trail reward. More perks on the way.",
  },
];
