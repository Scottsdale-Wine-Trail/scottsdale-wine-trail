import Link from "next/link";
import type { Metadata } from "next";
import { getWineries } from "@/lib/data";
import type { Winery } from "@swt/shared";

export const metadata: Metadata = {
  title: "Passport",
  description:
    "Get the Scottsdale Wine Trail Passport. Available as a paper or digital passport for $5. Visit every tasting room, collect stamps, earn a $2 discount on each flight, and unlock exclusive trail experiences.",
};

// ─── Static content ───────────────────────────────────────────────────────────

const STEPS = [
  {
    number: "01",
    title: "Get the Passport",
    body: "Download the Scottsdale Wine Trail app on iPhone or Android or pick up a paper passport at any tasting room.",
  },
  {
    number: "02",
    title: "Visit Tasting Rooms",
    body: "Show your passport at any participating tasting room to earn your stamp.",
  },
  {
    number: "03",
    title: "Complete the Trail",
    body: "Collect a stamp at every participating tasting room to complete the trail and unlock your reward.",
  },
];

const BENEFITS = [
  {
    title: "Always In Your Pocket",
    body: "Choose the format that fits you best. The digital passport lives in the app, with no paper to lose. Prefer paper? Pick one up at any tasting room.",
  },
  {
    title: "$2 Off Every Flight",
    body: "Show your passport at any participating tasting room to receive $2 off each wine flight. The passport pays for itself after three stops.",
  },
  {
    title: "Guided Trail Navigation",
    body: "The digital passport includes built-in maps with seamless directions from one tasting room to the next, no searching, no guessing.",
  },
  {
    title: "Trail Reward",
    body: "Complete the trail to unlock a Scottsdale Wine Trail reward, just for visiting every participating tasting room.",
  },
  {
    title: "Paper or Digital",
    body: "Both passports work at every participating tasting room. Buy the digital passport in our mobile app, or purchase a paper passport in person.",
  },
  {
    title: "Supports the Trail",
    body: "Passport purchases support Scottsdale Wine Trail marketing, helping the trail and the wineries on it continue to grow.",
  },
];

const APP_FEATURES = [
  {
    label: "Get Your Passport",
    description:
      "Purchase your passport in-app for $5 and unlock the full trail experience instantly.",
    accent: "from-burgundy-900 to-burgundy-700",
  },
  {
    label: "Stamp My Visit",
    description:
      "Check in at each tasting room to collect your stamp and log your wine experience.",
    accent: "from-[hsl(280,55%,20%)] to-[hsl(280,45%,35%)]",
  },
  {
    label: "Trail Map",
    description:
      "Navigate seamlessly between all participating tasting rooms with built-in directions.",
    accent: "from-[hsl(351,67%,22%)] to-[hsl(351,55%,38%)]",
  },
  {
    label: "Rewards & Progress",
    description:
      "Track your stamps, view your tasting notes, and see what rewards you've unlocked.",
    accent: "from-[hsl(35,80%,28%)] to-[hsl(43,100%,40%)]",
  },
];

const FAQS = [
  {
    q: "What is the Scottsdale Wine Trail Passport?",
    a: "The Scottsdale Wine Trail Passport is your guide to the trail. Purchase it digitally inside the free mobile app, or pick up a paper passport at any participating tasting room. Either format earns you $2 off each flight and a reward for completing the trail.",
  },
  {
    q: "Is the passport used on mobile only?",
    a: "No, we also offer a paper passport available to pick up in any participating tasting room.",
  },
  {
    q: "How do I get a paper passport?",
    a: "They are available for purchase at all participating tasting rooms.",
  },
  {
    q: "How do guests collect stamps?",
    a: "Visit any participating tasting room and show your digital or paper passport to the staff. Check in through the app and a staff member will enter the secret code to stamp your passport digitally, or staff can add a physical stamp to your paper passport.",
  },
  {
    q: "What does the passport cost?",
    a: "Both the digital and physical passports are $5 each, which earns guests $2 off each tasting flight at all 6 stops.",
  },
  {
    q: "Do tasting rooms still offer a flight discount?",
    a: "Yes. Passport holders receive a $2 discount on each wine flight at every participating tasting room. After three stops, the passport has more than paid for itself.",
  },
  {
    q: "Are more app features coming?",
    a: "Absolutely. The app is actively developed. Upcoming features include enhanced rewards, community tasting notes, winemaker stories, and exclusive event notifications for passport holders.",
  },
];

// ─── Participating winery card ────────────────────────────────────────────────

function WineryPassportCard({ winery }: { winery: Winery }) {
  return (
    <Link
      href={`/wineries/${winery.slug}`}
      className="group flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-burgundy-200 transition-all duration-200"
    >
      <div
        className={`w-14 h-14 shrink-0 rounded-xl flex items-center justify-center overflow-hidden ${
          winery.hero_image_url ? "" : "wine-gradient"
        }`}
      >
        {winery.hero_image_url ? (
          <img
            src={winery.hero_image_url}
            alt={winery.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-serif text-xl text-white/60">
            {winery.name.charAt(0)}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-900 group-hover:text-burgundy-700 transition-colors leading-snug truncate">
          {winery.name}
        </p>
        <p className="text-sm text-gray-500">
          {winery.city}, {winery.state}
        </p>
        {winery.tags && winery.tags.length > 0 && (
          <p className="text-xs text-gold-600 mt-0.5 truncate">{winery.tags[0]}</p>
        )}
      </div>

      {/* Stamp slot indicator */}
      <div className="shrink-0 w-8 h-8 rounded-full border-2 border-dashed border-gray-200 group-hover:border-gold-400 transition-colors" />
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PassportPage() {
  const wineries = await getWineries();
  const wineCount = wineries.length || 6;

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="relative -mt-16 flex items-center justify-center min-h-[75vh] py-32 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, hsl(351,67%,16%) 0%, hsl(280,55%,12%) 55%, hsl(43,70%,18%) 100%)",
        }}
      >
        {/* Ambient glows */}
        <div
          className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full opacity-[0.12] blur-3xl pointer-events-none"
          style={{ background: "hsl(43,100%,55%)" }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full opacity-[0.1] blur-3xl pointer-events-none"
          style={{ background: "hsl(351,67%,50%)" }}
          aria-hidden="true"
        />

        <div className="relative text-center text-white px-6 max-w-3xl mx-auto pt-8">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border border-gold-400/40 text-gold-300 mb-7">
            Paper &amp; Digital · $5 Passport · Available Now
          </span>

          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1]">
            Explore the Trail.
            <span className="block mt-1" style={{ color: "hsl(43,100%,65%)" }}>
              Collect the Stamps.
            </span>
          </h1>

          <p className="text-xl text-white/75 leading-relaxed mb-10 max-w-xl mx-auto">
            The Scottsdale Wine Trail passport is your guide to six walkable
            tasting rooms. Purchase your passport digitally through our mobile
            app or on paper in person at any of our tasting rooms.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#download"
              className="gold-gradient text-white font-semibold px-9 py-4 rounded-xl text-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-xl"
            >
              Get the Passport, $5
            </a>
            <Link
              href="/wineries"
              className="bg-white/10 backdrop-blur-sm text-white border border-white/20 font-semibold px-9 py-4 rounded-xl text-lg hover:bg-white/20 transition-all"
            >
              Explore Wineries
            </Link>
          </div>

          {/* Trust chips */}
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-white/50">
            <span>✓ Paper or digital</span>
            <span>✓ $2 off every flight</span>
            <span>✓ {wineCount} participating wineries</span>
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-500 max-w-xl mx-auto">
              From pickup to your first stamp in three easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector */}
            <div
              className="hidden md:block absolute top-14 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px border-t-2 border-dashed border-gold-200"
              aria-hidden="true"
            />

            {STEPS.map((step) => (
              <div key={step.number} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center h-full flex flex-col">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl wine-gradient text-white font-serif text-xl font-bold mb-6 shadow-md mx-auto">
                    {step.number}
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm flex-1">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Fully Curated App Experience
            </h2>
            <p className="text-xl text-gray-500 max-w-xl mx-auto">
              One $5 passport unlocks the complete trail experience
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="card-hover-effect group bg-cream rounded-2xl p-7 border border-gray-100"
              >
                <h3 className="font-serif text-lg font-semibold text-gray-900 mb-2">
                  {b.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── App Feature Preview ───────────────────────────────────────────── */}
      <section className="py-24 wine-gradient text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border border-gold-400/40 text-gold-300 mb-5">
              Inside the App
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Built for the Trail
            </h2>
            <p className="text-xl text-white/70 max-w-xl mx-auto">
              Every feature is designed to make your Wine Trail day effortless
              and memorable
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {APP_FEATURES.map((f) => (
              <div
                key={f.label}
                className="group relative bg-white/8 backdrop-blur-sm rounded-2xl border border-white/10 p-7 overflow-hidden hover:bg-white/12 transition-colors"
              >
                {/* Gradient accent swatch */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${f.accent} opacity-80`}
                  aria-hidden="true"
                />
                <h3 className="font-serif text-lg font-semibold text-white mb-2">
                  {f.label}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {f.description}
                </p>
                <div className="mt-5 inline-block text-xs font-medium text-gold-400 border border-gold-400/30 px-3 py-1 rounded-full">
                  Available in app
                </div>
              </div>
            ))}
          </div>

          {/* Phone mockup row */}
          <div className="mt-16 flex justify-center">
            <div className="relative">
              <div className="w-52 rounded-[2.5rem] border-4 border-white/15 bg-white/8 backdrop-blur-sm shadow-2xl overflow-hidden aspect-[9/19] mx-auto">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black/40 rounded-full z-10" />
                <div className="pt-12 px-4 pb-6 h-full flex flex-col gap-3">
                  <p className="text-white/40 text-xs font-semibold tracking-widest uppercase text-center">
                    My Passport
                  </p>
                  <p className="font-serif text-white text-center text-sm">
                    {Math.min(5, wineCount)} of {wineCount} stamps
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 flex-1">
                    {Array.from({ length: wineCount }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-lg aspect-square flex items-center justify-center text-xs font-serif font-bold border ${
                          i < 5
                            ? "bg-gold-400/25 border-gold-400/50 text-gold-300"
                            : "bg-white/5 border-white/10 text-white/15"
                        }`}
                      >
                        {i < 5 ? "✓" : "·"}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-white/40 mb-1.5">
                      <span>Trail progress</span>
                      <span>
                        {Math.round((Math.min(5, wineCount) / wineCount) * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full gold-gradient rounded-full"
                        style={{
                          width: `${Math.round((Math.min(5, wineCount) / wineCount) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Glow */}
              <div
                className="absolute inset-0 -z-10 blur-3xl opacity-20 rounded-full scale-150"
                style={{ background: "hsl(43,100%,60%)" }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Participating Wineries ─────────────────────────────────────────── */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Participating Wineries
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Every tasting room on the Scottsdale Wine Trail is a stamp in your
              passport. Visit them all to complete the trail.
            </p>
          </div>

          {wineries.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {wineries.map((winery) => (
                <WineryPassportCard key={winery.id} winery={winery} />
              ))}
            </div>
          ) : (
            <p className="text-center py-12 font-serif italic text-gray-400">
              Wineries coming soon.
            </p>
          )}

          <p className="text-center text-sm text-gray-400">
            {wineries.length > 0
              ? `${wineries.length} participating ${wineries.length === 1 ? "winery" : "wineries"} · `
              : ""}
            <Link href="/wineries" className="text-burgundy-600 hover:underline">
              View full winery details
            </Link>
          </p>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Common Questions
            </h2>
            <p className="text-gray-500 text-xl max-w-xl mx-auto">
              Everything you need to know before your first visit
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="border border-gray-100 rounded-2xl bg-cream px-7 py-6 shadow-sm"
              >
                <h3 className="font-semibold text-gray-900 mb-2 text-base">
                  {faq.q}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm">{faq.a}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-400 mt-10">
            Still have questions?{" "}
            <Link href="/concierge" className="text-burgundy-600 hover:underline">
              Contact the concierge
            </Link>
          </p>
        </div>
      </section>

      {/* ── Download CTA ──────────────────────────────────────────────────── */}
      <section id="download" className="py-24 bg-cream">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl wine-gradient shadow-xl mb-8">
            <span className="font-serif text-3xl text-white font-bold">
              SWT
            </span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            Your Trail Awaits.
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-3 leading-relaxed">
            Download the free Scottsdale Wine Trail app for your $5 digital
            passport, or pick up a paper passport at any tasting room, and start
            collecting stamps.
          </p>
          <p className="text-sm text-gray-400 mb-10">
            Free app · $5 passport · $2 off every flight · No subscription
          </p>

          {/* App store buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a
              href="#"
              aria-label="Download on the App Store"
              className="flex items-center gap-3 bg-gray-950 text-white px-7 py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
            >
              <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <p className="text-xs text-gray-400 leading-none">Download on the</p>
                <p className="text-lg font-semibold leading-snug">App Store</p>
              </div>
            </a>

            <a
              href="#"
              aria-label="Get it on Google Play"
              className="flex items-center gap-3 bg-gray-950 text-white px-7 py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
            >
              <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3,20.5v-17c0-.83.94-1.3,1.6-.8l14,8.5c.6.37.6,1.23,0,1.6l-14,8.5C3.94,21.8,3,21.33,3,20.5Z" />
              </svg>
              <div className="text-left">
                <p className="text-xs text-gray-400 leading-none">Get it on</p>
                <p className="text-lg font-semibold leading-snug">Google Play</p>
              </div>
            </a>
          </div>

          {/* Secondary CTAs */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/wineries"
              className="text-burgundy-600 hover:text-burgundy-800 font-medium transition-colors"
            >
              Browse Wineries →
            </Link>
            <span className="text-gray-300">·</span>
            <Link
              href="/trail-map"
              className="text-burgundy-600 hover:text-burgundy-800 font-medium transition-colors"
            >
              View Trail Map →
            </Link>
            <span className="text-gray-300">·</span>
            <Link
              href="/events"
              className="text-burgundy-600 hover:text-burgundy-800 font-medium transition-colors"
            >
              Upcoming Events →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
