import Link from "next/link";
import { getFeaturedWineries } from "@/lib/data";
import { WineryCard } from "@/components/WineryCard";
import { CURATED_EVENTS, TYPE_COLORS } from "@/lib/data/curated-events";

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
      "The Wine Collective made us feel right at home. Knowledgeable staff, a fantastic Arizona-focused list, and a relaxed atmosphere that turned a quick stop into a long, memorable afternoon.",
    name: "David K.",
    location: "Tempe, AZ",
    initials: "DK",
  },
];

export default async function HomePage() {
  const wineries = await getFeaturedWineries(3);
  const events = CURATED_EVENTS.slice(0, 3);

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
            Six award-winning tasting rooms within walking distance in downtown
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
                industry statewide. Five of the wineries produce award-winning
                wines available for tasting and purchase at unique tasting rooms
                in the heart of Scottsdale&apos;s entertainment district.
              </p>
              <blockquote className="border-l-4 border-gold-400 pl-6 italic text-lg text-gray-600">
                &ldquo;It was time to join forces and encourage residents and
                visitors alike to embrace our thriving Scottsdale wine,
                culinary, and entertainment scene.&rdquo;
                <footer className="mt-2 not-italic font-semibold text-burgundy-600 text-base">
                  Peggy Fiandaca, LDV Winery Co-Owner
                </footer>
              </blockquote>
              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { stat: "6", label: "Tasting Rooms" },
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
                <article
                  key={event.id}
                  className="card-hover-effect bg-gradient-to-br from-white to-cream border border-gold-100 rounded-2xl overflow-hidden shadow-md flex flex-col"
                >
                  {event.image && (
                    <div className="relative w-full aspect-[4/3] bg-cream overflow-hidden">
                      <img
                        src={event.image}
                        alt={`${event.title} flyer`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                          TYPE_COLORS[event.type] ??
                          "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        {event.type}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {event.schedule.split(" · ")[0]}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-gray-900 mb-1 leading-snug">
                      {event.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">{event.venue}</p>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1">
                      {event.body[0]}
                    </p>
                    <div className="mt-4">
                      <Link
                        href="/events"
                        className="text-sm font-medium text-burgundy-600 hover:text-burgundy-800 transition-colors"
                      >
                        Learn More &amp; RSVP →
                      </Link>
                    </div>
                  </div>
                </article>
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

      {/* Passport Teaser */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, hsl(351,67%,17%) 0%, hsl(280,55%,13%) 60%, hsl(43,70%,19%) 100%)",
            }}
          >
            {/* Ambient glows */}
            <div
              className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-[0.12] blur-3xl pointer-events-none"
              style={{ background: "hsl(43,100%,55%)" }}
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-[0.08] blur-3xl pointer-events-none"
              style={{ background: "hsl(351,67%,50%)" }}
              aria-hidden="true"
            />

            <div className="relative grid md:grid-cols-2 gap-10 items-center px-8 py-14 md:px-16">
              {/* Text */}
              <div className="text-white">
                <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border border-gold-400/40 text-gold-300 mb-5">
                  Paper &amp; Digital Passport · $5
                </span>
                <h2 className="font-serif text-4xl md:text-5xl font-bold mb-5 leading-tight">
                  Collect Stamps.
                  <br />
                  <span style={{ color: "hsl(43,100%,65%)" }}>Earn Rewards.</span>
                </h2>
                <p className="text-white/75 text-lg leading-relaxed mb-4">
                  The Scottsdale Wine Trail offers a paper and digital passport
                  for a full trail experience. Both offer $2 off every flight
                  and a reward for completing the trail. The digital passport
                  available via our mobile app offers guided navigation.
                </p>
                <p className="text-white/50 text-sm mb-8">
                  Available on iPhone &amp; Android, or pick up a paper passport
                  at any tasting room
                </p>
                <Link
                  href="/passport"
                  className="gold-gradient text-white font-semibold px-7 py-3.5 rounded-xl inline-block hover:opacity-90 transition-all transform hover:scale-105 shadow-lg text-base"
                >
                  Learn About the Passport →
                </Link>
              </div>

              {/* Stamp grid visual */}
              <div className="flex justify-center">
                <div className="relative w-60 h-60">
                  <div className="absolute inset-0 rounded-full border-4 border-dashed border-gold-400/30" />
                  <div className="absolute inset-7 grid grid-cols-3 grid-rows-3 gap-2.5">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xl flex items-center justify-center text-xs font-serif font-bold border transition-all ${
                          i < 5
                            ? "bg-gold-400/20 border-gold-400/50 text-gold-300"
                            : "bg-white/5 border-white/10 text-white/20"
                        }`}
                      >
                        {i < 5 ? "✓" : "·"}
                      </div>
                    ))}
                  </div>
                  {/* Centre label */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="sr-only">5 of 9 stamps collected</span>
                  </div>
                </div>
              </div>
            </div>
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
