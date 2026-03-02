import Link from "next/link";
import Image from "next/image";
import { getFeaturedWineries, getUpcomingEvents } from "@/lib/supabase/queries";
import { WineryCard } from "@/components/WineryCard";
import { EventCard } from "@/components/EventCard";

export default async function HomePage() {
  const [wineries, events] = await Promise.all([
    getFeaturedWineries(3).catch(() => []),
    getUpcomingEvents(3).catch(() => []),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-wine-950 via-wine-800 to-wine-600 text-white py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Discover Arizona&apos;s Premier Wine Trail
          </h1>
          <p className="text-xl md:text-2xl text-wine-100 mb-10 max-w-2xl mx-auto">
            Explore world-class wineries, tasting rooms, and unforgettable
            events nestled in the heart of Scottsdale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/wineries"
              className="bg-white text-wine-800 font-semibold px-8 py-4 rounded-full hover:bg-wine-50 transition-colors text-lg"
            >
              Explore Wineries
            </Link>
            <Link
              href="/trail-map"
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-colors text-lg"
            >
              View Trail Map
            </Link>
          </div>
        </div>
      </section>

      {/* About strip */}
      <section className="bg-wine-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-wine-900 mb-4">
            A Trail Like No Other
          </h2>
          <p className="text-lg text-wine-700 leading-relaxed">
            The Scottsdale Wine Trail winds through some of Arizona&apos;s most
            celebrated winemaking destinations. Whether you&apos;re a seasoned
            sommelier or a curious newcomer, our curated trail offers
            award-winning tastings, breathtaking desert scenery, and warm
            Southwestern hospitality at every stop.
          </p>
        </div>
      </section>

      {/* Featured Wineries */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-wine-900">
              Featured Wineries
            </h2>
            <Link
              href="/wineries"
              className="text-wine-600 hover:text-wine-800 font-medium"
            >
              View all →
            </Link>
          </div>
          {wineries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wineries.map((w) => (
                <WineryCard key={w.id} winery={w} />
              ))}
            </div>
          ) : (
            <p className="text-wine-500 text-center py-12">
              Wineries coming soon.
            </p>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-wine-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-wine-900">
              Upcoming Events
            </h2>
            <Link
              href="/events"
              className="text-wine-600 hover:text-wine-800 font-medium"
            >
              View all →
            </Link>
          </div>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          ) : (
            <p className="text-wine-500 text-center py-12">
              Events coming soon.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
