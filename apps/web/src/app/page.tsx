import Link from "next/link";
import { getFeaturedWineries, getUpcomingEvents } from "@/lib/data";
import { WineryCard } from "@/components/WineryCard";
import { EventCard } from "@/components/EventCard";

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "An absolutely magical evening hopping between tasting rooms. Every winery had its own personality and the wines were outstanding.",
    name: "Sarah M.",
    location: "Phoenix, AZ",
    initials: "SM",
  },
  {
    id: 2,
    quote:
      "We did the wine trail on a Saturday afternoon and couldn't believe everything was within walking distance. Perfect date night!",
    name: "James & Lauren R.",
    location: "Scottsdale, AZ",
    initials: "JR",
  },
  {
    id: 3,
    quote:
      "Arizona wine is seriously underrated. The Scottsdale Wine Trail opened my eyes to how world-class our local vintners are.",
    name: "David K.",
    location: "Tempe, AZ",
    initials: "DK",
  },
];

export default async function HomePage() {
  const [wineries, events] = await Promise.all([
    getFeaturedWineries(3),
    getUpcomingEvents(3),
  ]);

  return (
    <>
      {/* Hero */}
      <section
        className="relative h-screen -mt-16 flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(55, 0, 60, 0.55), rgba(20, 0, 30, 0.82)), url('https://assets.experiencescottsdale.com/simpleview/image/upload/c_fill,h_857,q_75,w_1500/v1/crm/scottsdale/Main-Street-Galleries-10-8e0f46305056b3a_8e0f4824-5056-b3a8-49577c01588a2e6d.gif')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Discover Arizona&apos;s
            <span className="block" style={{ color: "hsl(43, 100%, 65%)" }}>
              Premier Wine Trail
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 font-light leading-relaxed text-white/90">
            Seven award-winning wineries within walking distance in downtown
            Scottsdale
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/wineries"
              className="gold-gradient text-white font-semibold px-8 py-4 rounded-lg text-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
            >
              Explore Wineries
            </Link>
            <Link
              href="/trail-map"
              className="bg-white/20 backdrop-blur-md text-white border border-white/30 font-semibold px-8 py-4 rounded-lg text-lg hover:bg-white/30 transition-all"
            >
              View Trail Map
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About the Scottsdale Wine Trail
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Downtown Scottsdale is a destination for Arizona wine tasting.
              Award-winning wineries with tasting rooms within walking distance
              have joined forces to create Arizona&apos;s premier wine
              experience.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="https://www.azcentral.com/gcdn/-mm-/4970a517fad09d4ea33bb530fe060a1d464449b2/c=0-95-1915-1177/local/-/media/2016/08/24/Phoenix/Phoenix/636076564394869126-PNIBrd2-08-29-2015-Republic-1-F006-2015-08-28-IMG-View-from-Pillsbury-1-1-LRBO5SPI-L666501274-IMG-View-from-Pillsbury-1-1-LRBO5SPI.jpg?width=660&height=373&fit=crop&format=pjpg&auto=webp"
                alt="Arizona vineyard landscape"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                This cooperative of wineries united to advance education and
                exposure for Arizona-produced wines and the growing wine
                industry statewide. Six of the wineries produce award-winning
                wines available for tasting and purchase at unique tasting rooms
                in the heart of Scottsdale&apos;s entertainment district.
              </p>
              <blockquote className="border-l-4 border-gold-400 pl-6 italic text-lg text-gray-600">
                &ldquo;It was time to join forces and encourage residents and
                visitors alike to embrace our thriving Scottsdale wine,
                culinary, and entertainment scene.&rdquo;
                <footer className="mt-2 not-italic font-semibold text-burgundy-600 text-base">
                  — Peggy Fiandaca, LDV Winery Co-Owner
                </footer>
              </blockquote>
              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { stat: "7", label: "Wineries" },
                  { stat: "100+", label: "Award-Winning Wines" },
                  { stat: "1", label: "Historic District" },
                ].map(({ stat, label }) => (
                  <div key={label} className="text-center">
                    <div className="font-serif text-3xl font-bold text-burgundy-600">
                      {stat}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Wineries */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Tasting Rooms
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Old Town Scottsdale&apos;s premier wine tasting destinations
            </p>
          </div>

          {wineries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {wineries.map((winery) => (
                <WineryCard key={winery.id} winery={winery} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-16 font-serif text-lg italic">
              Wineries coming soon.
            </p>
          )}

          <div className="text-center">
            <Link
              href="/wineries"
              className="gold-gradient text-white font-semibold px-8 py-4 rounded-lg text-lg hover:opacity-90 transition-all transform hover:scale-105 inline-block shadow-md"
            >
              View All Wineries
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join us for exclusive wine events and tastings
            </p>
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-16 font-serif text-lg italic">
              Events coming soon.
            </p>
          )}

          <div className="text-center">
            <Link
              href="/events"
              className="wine-gradient text-white font-semibold px-8 py-4 rounded-lg text-lg hover:opacity-90 transition-all inline-block shadow-md"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 wine-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              What Our Visitors Say
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Discover why the Scottsdale Wine Trail has become Arizona&apos;s
              premier wine destination
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <div className="flex text-gold-400 mb-4">
                  {"★★★★★".split("").map((star, i) => (
                    <span key={i} className="text-lg">
                      {star}
                    </span>
                  ))}
                </div>
                <blockquote className="text-lg italic mb-5 text-white/90 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <footer className="flex items-center gap-3">
                  <div className="w-11 h-11 gold-gradient rounded-full flex items-center justify-center text-sm font-bold text-burgundy-900 shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-white/60 text-xs">{t.location}</div>
                  </div>
                </footer>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
