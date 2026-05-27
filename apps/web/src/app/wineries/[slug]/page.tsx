import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getUpcomingEventsByWinery,
  getWineryBySlug,
} from "@/lib/data";
import { CURATED_WINES } from "@/lib/data/curated-wines";
import { getGoogleReviewsForWinery } from "@/lib/data/reviews";
import { WineryLocationMap } from "@/components/WineryLocationMap";
import { CopyAddressButton } from "@/components/CopyAddressButton";
import { ReviewerAvatar } from "@/components/ReviewerAvatar";

function ReviewStars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars: ("full" | "half" | "empty")[] = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push("full");
    else if (i === full && half) stars.push("half");
    else stars.push("empty");
  }
  return (
    <div className="inline-flex items-center gap-0.5" aria-hidden="true">
      {stars.map((kind, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className="w-4 h-4"
          fill={kind === "empty" ? "none" : "currentColor"}
          stroke="currentColor"
          strokeWidth="1"
          style={{ color: "hsl(43, 100%, 50%)" }}
        >
          <defs>
            <linearGradient id={`half-${i}`}>
              <stop offset="50%" stopColor="hsl(43, 100%, 50%)" />
              <stop offset="50%" stopColor="transparent" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            d="M10 1.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L10 14.9l-5.25 2.75 1-5.85L1.5 7.65l5.9-.85L10 1.5z"
            fill={kind === "half" ? `url(#half-${i})` : undefined}
          />
        </svg>
      ))}
    </div>
  );
}

type WineryDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: WineryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const winery = await getWineryBySlug(slug);

  if (!winery) {
    return { title: "Winery Not Found" };
  }

  return {
    title: winery.name,
    description: winery.description || `${winery.name} at ${winery.address}, ${winery.city}, ${winery.state} ${winery.zip}`,
  };
}

export default async function WineryDetailPage({ params }: WineryDetailPageProps) {
  const { slug } = await params;
  const winery = await getWineryBySlug(slug);

  if (!winery) {
    notFound();
  }

  const fullAddress = `${winery.address}, ${winery.city}, ${winery.state} ${winery.zip}`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  const [events, googleReviews] = await Promise.all([
    getUpcomingEventsByWinery(winery.id),
    getGoogleReviewsForWinery(winery.name, fullAddress),
  ]);
  const wines = CURATED_WINES.filter((w) => w.winerySlug === winery.slug);

  return (
    <>
      {/* Hero */}
      <div
        className="relative h-72 md:h-96 -mt-16 flex flex-col justify-end"
        style={
          winery.hero_image_url
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(20,0,30,0.75)), url('${winery.hero_image_url}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        {!winery.hero_image_url && (
          <div className="absolute inset-0 wine-gradient" />
        )}
        <div className="relative max-w-5xl mx-auto w-full px-6 pb-8 pt-20">
          <Link
            href="/wineries"
            className="text-white/70 hover:text-white text-sm transition-colors mb-3 inline-block"
          >
            ← Back to wineries
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
            {winery.name}
          </h1>
          {winery.city && (
            <p className="text-white/70 mt-1">
              {winery.city}, {winery.state}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {winery.description && (
              <section>
                <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-3">
                  About
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {winery.description}
                </p>
              </section>
            )}

            {winery.tags && winery.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {winery.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm px-3 py-1 bg-gold-50 text-gold-700 rounded-full border border-gold-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <section>
              <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-3">
                Location
              </h2>
              {winery.lat != null && winery.lng != null ? (
                <div className="rounded-2xl overflow-hidden shadow-md">
                  <WineryLocationMap lat={winery.lat} lng={winery.lng} name={winery.name} />
                </div>
              ) : (
                <div className="h-64 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 font-serif italic">
                  Map coming soon
                </div>
              )}
            </section>

            {events.length > 0 && (
              <section>
                <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-4">
                  Upcoming Events
                </h2>
                <ul className="space-y-3">
                  {events.map((event) => (
                    <li
                      key={event.id}
                      className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm"
                    >
                      <p className="text-xs text-gray-400 mb-1">
                        {new Date(event.start_date).toLocaleString()}
                      </p>
                      <p className="font-semibold text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {wines.length > 0 && (
              <section>
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="font-serif text-2xl font-semibold text-gray-900">
                    Wines
                  </h2>
                  <Link
                    href="/wines"
                    className="text-sm font-medium text-burgundy-600 hover:text-burgundy-800 transition-colors"
                  >
                    View full catalog →
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {wines.map((wine) => (
                    <a
                      key={wine.slug}
                      href={wine.purchaseUrl ?? `/wines#${wine.slug}`}
                      target={wine.purchaseUrl ? "_blank" : undefined}
                      rel={wine.purchaseUrl ? "noopener noreferrer" : undefined}
                      className="group flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="relative aspect-square bg-cream">
                        <Image
                          src={wine.image}
                          alt={`${wine.wineryName} ${wine.name}`}
                          fill
                          sizes="(min-width:640px) 200px, 50vw"
                          className="object-contain p-3 group-hover:scale-[1.03] transition-transform"
                        />
                      </div>
                      <div className="p-3">
                        <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
                          {wine.name}
                        </p>
                        <div className="flex items-center justify-between mt-1.5 gap-2">
                          {wine.color && (
                            <span className="text-[10px] uppercase tracking-wide text-gold-700 font-semibold">
                              {wine.color}
                            </span>
                          )}
                          {wine.price !== null && (
                            <span className="font-serif text-sm font-bold text-burgundy-700">
                              ${wine.price.toFixed(0)}
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {googleReviews && googleReviews.reviews.length > 0 && (
              <section>
                <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-3">
                  Guest Reviews
                </h2>
                <div className="flex items-center gap-3 mb-4">
                  {googleReviews.rating !== null && (
                    <>
                      <span className="text-2xl font-serif font-bold text-gray-900">
                        {googleReviews.rating.toFixed(1)}
                      </span>
                      <ReviewStars value={googleReviews.rating} />
                    </>
                  )}
                  {googleReviews.userRatingCount !== null && (
                    <span className="text-sm text-gray-400 mt-0.5">
                      {googleReviews.userRatingCount.toLocaleString()} reviews on Google
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {googleReviews.reviews.slice(0, 4).map((review, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <ReviewerAvatar
                          name={review.authorName}
                          photoUrl={review.authorPhotoUrl}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 text-sm leading-snug">
                            {review.authorName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <ReviewStars value={review.rating} />
                            {review.relativePublishTime && (
                              <span className="text-xs text-gray-400">
                                {review.relativePublishTime}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-5">
                        {review.text}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[11px] text-gray-300">
                    Reviews from Google
                  </span>
                  {googleReviews.googleMapsUri && (
                    <a
                      href={googleReviews.googleMapsUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-burgundy-600 hover:text-burgundy-800 transition-colors"
                    >
                      See all reviews on Google →
                    </a>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md sticky top-24 space-y-4">
              <h3 className="font-serif text-lg font-semibold text-gray-900">
                Visit Us
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p className="leading-relaxed">{fullAddress}</p>
                {winery.phone && (
                  <p>
                    <span className="text-gray-400">Phone</span>
                    <br />
                    <a href={`tel:${winery.phone}`} className="text-burgundy-600 hover:underline">
                      {winery.phone}
                    </a>
                  </p>
                )}
                {winery.email && (
                  <p>
                    <span className="text-gray-400">Email</span>
                    <br />
                    <a href={`mailto:${winery.email}`} className="text-burgundy-600 hover:underline">
                      {winery.email}
                    </a>
                  </p>
                )}
                {winery.website && (
                  <p>
                    <span className="text-gray-400">Website</span>
                    <br />
                    <a
                      href={winery.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-burgundy-600 hover:underline break-all"
                    >
                      {winery.website.replace(/^https?:\/\//, "")}
                    </a>
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="wine-gradient text-white font-medium px-4 py-2.5 rounded-lg text-center text-sm hover:opacity-90 transition-opacity"
                >
                  Get Directions
                </a>
                <CopyAddressButton address={fullAddress} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
