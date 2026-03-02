import { getWineryBySlug, getWineries } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const wineries = await getWineries().catch(() => []);
  return wineries.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const winery = await getWineryBySlug(slug).catch(() => null);
  if (!winery) return { title: "Not Found" };
  return { title: winery.name };
}

export default async function WineryDetailPage({ params }: Props) {
  const { slug } = await params;
  const winery = await getWineryBySlug(slug).catch(() => null);
  if (!winery) notFound();

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero image */}
      {winery.hero_image_url && (
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
          <Image
            src={winery.hero_image_url}
            alt={winery.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-start gap-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-wine-900 mb-2">
            {winery.name}
          </h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {winery.tags.map((tag) => (
              <span
                key={tag}
                className="bg-wine-100 text-wine-700 text-sm px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-wine-700 text-lg leading-relaxed mb-6">
            {winery.description}
          </p>

          {/* Details */}
          <div className="space-y-3 text-wine-800">
            <div>
              <span className="font-semibold">Address:</span>{" "}
              {winery.address}, {winery.city}, {winery.state} {winery.zip}
            </div>
            {winery.phone && (
              <div>
                <span className="font-semibold">Phone:</span>{" "}
                <a
                  href={`tel:${winery.phone}`}
                  className="text-wine-600 hover:underline"
                >
                  {winery.phone}
                </a>
              </div>
            )}
            {winery.website && (
              <div>
                <span className="font-semibold">Website:</span>{" "}
                <a
                  href={winery.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-wine-600 hover:underline"
                >
                  {winery.website}
                </a>
              </div>
            )}
          </div>

          {/* Hours */}
          {winery.hours_json && (
            <div className="mt-6">
              <h2 className="text-xl font-bold text-wine-900 mb-3">Hours</h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-wine-700">
                {days.map((day) => (
                  <div key={day} className="flex justify-between">
                    <span className="font-medium">{day}</span>
                    <span>{winery.hours_json?.[day] ?? "Closed"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="md:w-64 space-y-4">
          <Link
            href={`/trail-map?winery=${winery.id}`}
            className="block w-full text-center bg-wine-700 text-white font-semibold px-6 py-3 rounded-full hover:bg-wine-800 transition-colors"
          >
            View on Map
          </Link>
          <Link
            href="/wineries"
            className="block w-full text-center border border-wine-300 text-wine-700 font-semibold px-6 py-3 rounded-full hover:bg-wine-50 transition-colors"
          >
            ← All Wineries
          </Link>
        </div>
      </div>

      {/* Reviews placeholder */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-wine-900 mb-4">Reviews</h2>
        <div className="bg-wine-50 rounded-2xl p-8 text-center text-wine-500">
          <p>Reviews coming soon. Be the first to share your experience!</p>
        </div>
      </section>
    </div>
  );
}
