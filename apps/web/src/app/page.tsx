import Link from "next/link";
import { getFeaturedWineries } from "@/lib/data";
import { WineryCard } from "@/components/WineryCard";
import { CURATED_EVENTS, TYPE_COLORS } from "@/lib/data/curated-events";

// Six wine motifs for the passport stamps. Each renders inside a 100x100
// SVG between roughly y=37 and y=63 (the area between the stamp crossbars).
const STAMP_MOTIFS: { label: string; node: React.ReactNode }[] = [
  {
    label: "Wine Glass",
    node: (
      <g
        stroke="hsla(43, 95%, 86%, 0.92)"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 40 39 L 50 54 L 60 39" />
        <line x1="50" y1="54" x2="50" y2="62" />
        <line x1="43" y1="62" x2="57" y2="62" />
      </g>
    ),
  },
  {
    label: "Grape Cluster",
    node: (
      <g fill="hsla(43, 95%, 86%, 0.88)">
        {/* tiny stem on top */}
        <path
          d="M 50 36 L 50 40"
          stroke="hsla(43, 95%, 86%, 0.88)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* triangle bunch */}
        <circle cx="45" cy="42" r="2.7" />
        <circle cx="55" cy="42" r="2.7" />
        <circle cx="40" cy="47.5" r="2.7" />
        <circle cx="50" cy="47.5" r="2.7" />
        <circle cx="60" cy="47.5" r="2.7" />
        <circle cx="45" cy="53" r="2.7" />
        <circle cx="55" cy="53" r="2.7" />
        <circle cx="50" cy="58.5" r="2.7" />
      </g>
    ),
  },
  {
    label: "Wine Bottle",
    node: (
      <g
        stroke="hsla(43, 95%, 86%, 0.92)"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 47 37 L 47 44 Q 47 46.5 45 48 L 44 49.5 Q 43 51 43 53 L 43 63 L 57 63 L 57 53 Q 57 51 56 49.5 L 55 48 Q 53 46.5 53 44 L 53 37 Z" />
        {/* label band */}
        <line x1="44" y1="55" x2="56" y2="55" strokeWidth="1.1" />
      </g>
    ),
  },
  {
    label: "Grape Leaf",
    node: (
      <g
        stroke="hsla(43, 95%, 86%, 0.92)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* leaf outline (5-lobed silhouette) */}
        <path d="M 50 37 C 56 37 60 41 60 45 C 64 45 64 51 60 52 C 62 55 60 59 56 59 C 55 62 50 62 50 62 C 50 62 45 62 44 59 C 40 59 38 55 40 52 C 36 51 36 45 40 45 C 40 41 44 37 50 37 Z" />
        {/* center vein */}
        <line x1="50" y1="38" x2="50" y2="62" strokeWidth="1.4" />
      </g>
    ),
  },
  {
    label: "Wine Barrel",
    node: (
      <g
        stroke="hsla(43, 95%, 86%, 0.92)"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* barrel body — curved top and bottom */}
        <path d="M 38 41 Q 35 50 38 59 L 62 59 Q 65 50 62 41 Z" />
        {/* hoops */}
        <line x1="37.2" y1="45.5" x2="62.8" y2="45.5" strokeWidth="1.4" />
        <line x1="37.2" y1="54.5" x2="62.8" y2="54.5" strokeWidth="1.4" />
      </g>
    ),
  },
  {
    label: "Corkscrew",
    node: (
      <g
        stroke="hsla(43, 95%, 86%, 0.92)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* handle */}
        <line x1="43" y1="39" x2="57" y2="39" />
        {/* shaft top */}
        <line x1="50" y1="39" x2="50" y2="43" />
        {/* spiral */}
        <path d="M 50 43 C 55 45 45 48 50 50 C 55 52 45 55 50 57 C 53 58 50 60 50 61" />
        {/* point */}
        <line x1="48" y1="61" x2="52" y2="61" strokeWidth="1.4" />
      </g>
    ),
  },
];

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
                                    style={{
                                      filter:
                                        "drop-shadow(0 0 1px rgba(255,210,120,0.15))",
                                    }}
                                  >
                                    {/* Outer ring */}
                                    <circle
                                      cx="50"
                                      cy="50"
                                      r="44"
                                      fill="hsla(43, 85%, 55%, 0.10)"
                                      stroke="hsla(43, 90%, 72%, 0.62)"
                                      strokeWidth="2.4"
                                    />
                                    {/* Inner ring */}
                                    <circle
                                      cx="50"
                                      cy="50"
                                      r="36"
                                      fill="none"
                                      stroke="hsla(43, 90%, 72%, 0.38)"
                                      strokeWidth="0.9"
                                    />
                                    {/* Crossbars */}
                                    <line
                                      x1="14"
                                      y1="35"
                                      x2="86"
                                      y2="35"
                                      stroke="hsla(43, 90%, 72%, 0.40)"
                                      strokeWidth="0.9"
                                    />
                                    <line
                                      x1="14"
                                      y1="65"
                                      x2="86"
                                      y2="65"
                                      stroke="hsla(43, 90%, 72%, 0.40)"
                                      strokeWidth="0.9"
                                    />
                                    {/* Top crest label */}
                                    <text
                                      x="50"
                                      y="29"
                                      textAnchor="middle"
                                      fontFamily="'Playfair Display', Georgia, serif"
                                      fontSize="9"
                                      fontWeight="700"
                                      letterSpacing="2.4"
                                      fill="hsla(43, 95%, 82%, 0.85)"
                                    >
                                      SWT
                                    </text>
                                    {/* Centre motif (wine glass, grapes, bottle, leaf, barrel, corkscrew) */}
                                    {STAMP_MOTIFS[i]?.node}
                                    {/* Bottom mark */}
                                    <text
                                      x="50"
                                      y="78"
                                      textAnchor="middle"
                                      fontFamily="Inter, sans-serif"
                                      fontSize="6.5"
                                      fontWeight="600"
                                      letterSpacing="1.8"
                                      fill="hsla(43, 95%, 82%, 0.62)"
                                    >
                                      VISITED
                                    </text>
                                  </svg>
                                ) : (
                                  <svg
                                    viewBox="0 0 100 100"
                                    className="w-full h-full"
                                  >
                                    <circle
                                      cx="50"
                                      cy="50"
                                      r="44"
                                      fill="none"
                                      stroke="rgba(255,255,255,0.22)"
                                      strokeWidth="1.4"
                                      strokeDasharray="3 3.5"
                                    />
                                    {/* Faded preview of the motif waiting for a stamp */}
                                    <g opacity="0.22">{STAMP_MOTIFS[i]?.node}</g>
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
