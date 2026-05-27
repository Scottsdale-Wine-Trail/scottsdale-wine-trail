import Link from "next/link";
import { getFeaturedWineries, getWineries } from "@/lib/data";
import { WineryCard } from "@/components/WineryCard";
import { CURATED_EVENTS, TYPE_COLORS } from "@/lib/data/curated-events";
import { getAggregateGoogleReviews } from "@/lib/data/reviews";
import { ReviewCard } from "@/components/ReviewCard";

// Six wine motifs for the passport stamps. Drawn as filled silhouettes in
// a 100x100 viewBox, sized to fill ~y=18-82 inside the stamp ring.
const STAMP_MOTIFS: { label: string; node: React.ReactNode }[] = [
  {
    label: "Wine Glass",
    node: (
      <g fill="hsla(43, 95%, 88%, 0.95)">
        {/* tulip cup */}
        <path d="M 30 22 C 30 46 38 60 50 60 C 62 60 70 46 70 22 Z" />
        {/* stem */}
        <rect x="48" y="59" width="4" height="18" rx="0.5" />
        {/* base */}
        <rect x="34" y="76" width="32" height="4" rx="1" />
      </g>
    ),
  },
  {
    label: "Grape Cluster",
    node: (
      <g fill="hsla(43, 95%, 88%, 0.95)">
        {/* small leaf + stem */}
        <path
          d="M 50 18 L 50 25"
          stroke="hsla(43, 95%, 88%, 0.95)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M 50 19 C 60 17 64 22 60 26 C 56 28 52 25 50 22 Z" />
        {/* triangular bunch of berries */}
        <circle cx="42" cy="32" r="5.5" />
        <circle cx="50" cy="32" r="5.5" />
        <circle cx="58" cy="32" r="5.5" />
        <circle cx="38" cy="41" r="5.5" />
        <circle cx="46" cy="41" r="5.5" />
        <circle cx="54" cy="41" r="5.5" />
        <circle cx="62" cy="41" r="5.5" />
        <circle cx="42" cy="50" r="5.5" />
        <circle cx="50" cy="50" r="5.5" />
        <circle cx="58" cy="50" r="5.5" />
        <circle cx="46" cy="59" r="5.5" />
        <circle cx="54" cy="59" r="5.5" />
        <circle cx="50" cy="68" r="5.5" />
      </g>
    ),
  },
  {
    label: "Wine Bottle",
    node: (
      <g fill="hsla(43, 95%, 88%, 0.95)">
        {/* bottle silhouette: neck → shoulders → body */}
        <path d="M 45 18 L 45 32 C 45 35 42 36 40 40 C 38 44 38 47 38 52 L 38 80 L 62 80 L 62 52 C 62 47 62 44 60 40 C 58 36 55 35 55 32 L 55 18 Z" />
        {/* label band (subtle darker stripe) */}
        <rect x="38" y="56" width="24" height="8" fill="hsla(280, 50%, 18%, 0.45)" />
      </g>
    ),
  },
  {
    label: "Wine Barrel",
    node: (
      <g fill="hsla(43, 95%, 88%, 0.95)">
        {/* barrel body (oak stave silhouette) */}
        <path d="M 30 28 Q 22 50 30 72 L 70 72 Q 78 50 70 28 Z" />
        {/* hoops */}
        <rect x="28" y="36" width="44" height="3" fill="hsla(280, 40%, 18%, 0.45)" />
        <rect x="28" y="61" width="44" height="3" fill="hsla(280, 40%, 18%, 0.45)" />
        {/* center bunghole accent */}
        <circle cx="50" cy="50" r="2.5" fill="hsla(280, 40%, 18%, 0.55)" />
      </g>
    ),
  },
  {
    label: "Champagne Flute",
    node: (
      <g fill="hsla(43, 95%, 88%, 0.95)">
        {/* tall narrow flute cup */}
        <path d="M 42 18 L 42 52 C 42 58 44 62 50 62 C 56 62 58 58 58 52 L 58 18 Z" />
        {/* stem */}
        <rect x="48" y="61" width="4" height="16" rx="0.5" />
        {/* base */}
        <rect x="38" y="76" width="24" height="4" rx="1" />
        {/* bubbles */}
        <circle cx="49" cy="46" r="1.6" fill="hsla(280, 50%, 18%, 0.35)" />
        <circle cx="52" cy="38" r="1.2" fill="hsla(280, 50%, 18%, 0.35)" />
        <circle cx="48" cy="30" r="1" fill="hsla(280, 50%, 18%, 0.35)" />
      </g>
    ),
  },
  {
    label: "Corkscrew",
    node: (
      <g
        fill="none"
        stroke="hsla(43, 95%, 88%, 0.95)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* T-handle */}
        <line x1="36" y1="22" x2="64" y2="22" />
        {/* shaft top */}
        <line x1="50" y1="22" x2="50" y2="32" />
        {/* helix spiral */}
        <path d="M 50 32 C 58 36 42 42 50 46 C 58 50 42 56 50 60 C 58 64 42 70 50 74" />
      </g>
    ),
  },
];

export default async function HomePage() {
  const [wineries, allWineries] = await Promise.all([
    getFeaturedWineries(3),
    getWineries(),
  ]);
  const events = CURATED_EVENTS.slice(0, 3);
  const liveReviews = await getAggregateGoogleReviews(
    allWineries.map((w) => ({
      name: w.name,
      slug: w.slug,
      address: `${w.address}, ${w.city}, ${w.state} ${w.zip}`,
    })),
    3
  );

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
      <section className="py-20 bg-trail-soft">
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
      <section className="py-20 bg-trail-warm">
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
                        className="w-full h-full object-contain p-2"
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

              {/* Passport visual */}
              {(() => {
                const TOTAL = 6;
                const COLLECTED = 4;
                return (
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-sm">
                      {/* Ambient glow behind */}
                      <div
                        className="absolute -inset-6 rounded-3xl opacity-50 blur-3xl pointer-events-none"
                        style={{
                          background:
                            "radial-gradient(circle, hsl(43,100%,55%) 0%, transparent 65%)",
                        }}
                        aria-hidden="true"
                      />

                      {/* Passport page card */}
                      <div className="relative bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-2xl px-7 py-7 shadow-2xl">
                        {/* Header rule */}
                        <div className="flex items-center justify-between mb-6">
                          <p className="text-[10px] tracking-[0.28em] uppercase text-gold-300/90 font-semibold">
                            Wine Trail Passport
                          </p>
                          <div className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-gold-400/80" />
                            <span className="w-1 h-1 rounded-full bg-gold-400/80" />
                            <span className="w-1 h-1 rounded-full bg-gold-400/80" />
                          </div>
                        </div>

                        {/* 3 × 2 stamps grid */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          {Array.from({ length: TOTAL }).map((_, i) => {
                            const filled = i < COLLECTED;
                            // Varied tilt so stamps don't feel mechanically aligned
                            const tilt = [-4, 3, -2, 5, -3, 2][i] ?? 0;
                            return (
                              <div
                                key={i}
                                className="aspect-square"
                                style={
                                  filled
                                    ? { transform: `rotate(${tilt}deg)` }
                                    : undefined
                                }
                                aria-hidden="true"
                              >
                                {filled ? (
                                  <svg
                                    viewBox="0 0 100 100"
                                    className="w-full h-full"
                                  >
                                    {/* Soft tinted disc behind motif */}
                                    <circle
                                      cx="50"
                                      cy="50"
                                      r="46"
                                      fill="hsla(43, 85%, 55%, 0.10)"
                                    />
                                    {/* Outer ring */}
                                    <circle
                                      cx="50"
                                      cy="50"
                                      r="46"
                                      fill="none"
                                      stroke="hsla(43, 90%, 72%, 0.70)"
                                      strokeWidth="2.5"
                                    />
                                    {/* Subtle inner accent ring */}
                                    <circle
                                      cx="50"
                                      cy="50"
                                      r="41"
                                      fill="none"
                                      stroke="hsla(43, 90%, 72%, 0.22)"
                                      strokeWidth="0.6"
                                    />
                                    {/* Wine motif silhouette */}
                                    {STAMP_MOTIFS[i]?.node}
                                  </svg>
                                ) : (
                                  <svg
                                    viewBox="0 0 100 100"
                                    className="w-full h-full"
                                  >
                                    <circle
                                      cx="50"
                                      cy="50"
                                      r="46"
                                      fill="none"
                                      stroke="rgba(255,255,255,0.22)"
                                      strokeWidth="1.4"
                                      strokeDasharray="3 3.5"
                                    />
                                    {/* Ghosted preview of the awaiting motif */}
                                    <g opacity="0.18">{STAMP_MOTIFS[i]?.node}</g>
                                  </svg>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] tracking-[0.2em] uppercase font-semibold">
                            <span className="text-white/45">Progress</span>
                            <span className="text-gold-300">
                              {COLLECTED} of {TOTAL} stamps
                            </span>
                          </div>
                          <div
                            className="h-[3px] bg-white/8 rounded-full overflow-hidden"
                            role="progressbar"
                            aria-valuenow={COLLECTED}
                            aria-valuemin={0}
                            aria-valuemax={TOTAL}
                            aria-label={`${COLLECTED} of ${TOTAL} stamps collected`}
                          >
                            <div
                              className="h-full gold-gradient rounded-full"
                              style={{
                                width: `${(COLLECTED / TOTAL) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials — live Google reviews aggregated across all 6 tasting rooms */}
      {liveReviews.length > 0 && (
        <section className="py-20 wine-gradient text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                What Our Visitors Say
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Real reviews from Google, across every tasting room on the
                Scottsdale Wine Trail.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-start">
              {liveReviews.map((review, idx) => (
                <ReviewCard
                  key={`${review.winerySlug}-${idx}`}
                  review={review}
                  variant="dark"
                  initialClampLines={6}
                  showWinery
                />
              ))}
            </div>

            {liveReviews.length > 0 && (
              <p className="text-center text-xs text-white/40 mt-8">
                Reviews from Google · Click any review to read it on Google
              </p>
            )}
          </div>
        </section>
      )}
    </>
  );
}
