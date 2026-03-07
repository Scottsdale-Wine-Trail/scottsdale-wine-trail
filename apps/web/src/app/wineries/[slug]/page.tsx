import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getUpcomingEventsByWinery,
  getWinesByWinery,
  getWineryBySlug,
} from "@/lib/data";
import { WineryLocationMap } from "@/components/WineryLocationMap";
import { CopyAddressButton } from "@/components/CopyAddressButton";

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

  const [events, wines] = await Promise.all([
    getUpcomingEventsByWinery(winery.id),
    getWinesByWinery(winery.id),
  ]);

  const fullAddress = `${winery.address}, ${winery.city}, ${winery.state} ${winery.zip}`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

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
                <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-4">
                  Wines
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {wines.map((wine) => (
                    <div
                      key={wine.id}
                      className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm"
                    >
                      <p className="font-semibold text-gray-900">{wine.name}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{wine.varietal}</p>
                    </div>
                  ))}
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
