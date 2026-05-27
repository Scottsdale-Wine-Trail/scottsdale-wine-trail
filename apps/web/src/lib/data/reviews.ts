// Google Places (New) integration for winery detail pages.
//
// Two-step lookup with aggressive caching to keep billing minimal:
//   1. Text-search the winery name + address once to discover its place_id
//      (cached 30 days)
//   2. Fetch place details with reviews using that place_id
//      (cached 24 hours)
//
// Returns null on missing API key, missing place, or any API error so the
// detail page can gracefully omit the reviews section.

const PLACES_BASE = "https://places.googleapis.com/v1";

function apiKey(): string | null {
  return (
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    null
  );
}

export type GoogleReview = {
  authorName: string;
  authorPhotoUrl?: string | null;
  rating: number;
  text: string;
  relativePublishTime: string;
  publishTime: string;
};

export type GooglePlaceSummary = {
  placeId: string;
  rating: number | null;
  userRatingCount: number | null;
  googleMapsUri: string | null;
  reviews: GoogleReview[];
};

async function findPlaceId(
  name: string,
  address: string
): Promise<string | null> {
  const key = apiKey();
  if (!key) return null;

  try {
    const res = await fetch(`${PLACES_BASE}/places:searchText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "places.id",
      },
      body: JSON.stringify({
        textQuery: `${name}, ${address}`,
        maxResultCount: 1,
      }),
      next: { revalidate: 60 * 60 * 24 * 30 },
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { places?: { id: string }[] };
    return data.places?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

async function fetchPlaceDetails(
  placeId: string
): Promise<GooglePlaceSummary | null> {
  const key = apiKey();
  if (!key) return null;

  try {
    const res = await fetch(
      `${PLACES_BASE}/places/${placeId}?languageCode=en`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask":
            "id,rating,userRatingCount,googleMapsUri,reviews",
        },
        next: { revalidate: 60 * 60 * 24 },
      }
    );

    if (!res.ok) return null;
    const data = (await res.json()) as {
      id: string;
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      reviews?: Array<{
        authorAttribution?: { displayName?: string; photoUri?: string };
        rating?: number;
        text?: { text?: string };
        relativePublishTimeDescription?: string;
        publishTime?: string;
      }>;
    };

    const reviews: GoogleReview[] = (data.reviews ?? [])
      .filter((r) => r.text?.text && r.authorAttribution?.displayName)
      .map((r) => ({
        authorName: r.authorAttribution!.displayName!,
        authorPhotoUrl: r.authorAttribution?.photoUri ?? null,
        rating: r.rating ?? 0,
        text: r.text!.text!,
        relativePublishTime: r.relativePublishTimeDescription ?? "",
        publishTime: r.publishTime ?? "",
      }));

    return {
      placeId: data.id,
      rating: data.rating ?? null,
      userRatingCount: data.userRatingCount ?? null,
      googleMapsUri: data.googleMapsUri ?? null,
      reviews,
    };
  } catch {
    return null;
  }
}

export async function getGoogleReviewsForWinery(
  name: string,
  address: string
): Promise<GooglePlaceSummary | null> {
  const placeId = await findPlaceId(name, address);
  if (!placeId) return null;
  return fetchPlaceDetails(placeId);
}
