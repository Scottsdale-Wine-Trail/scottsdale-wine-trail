import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guided Tours",
  description:
    "Experience the Scottsdale Wine Trail with a private guided tour through Old Town Scottsdale's Arizona wine tasting rooms.",
};

const INCLUDED = [
  "Personalized Scottsdale Wine Trail itinerary",
  "Guided walk through participating tasting rooms",
  "Arizona wine education and recommendations",
  "Flexible pacing based on your group",
  "Assistance with reservations for larger groups when needed",
];

const NOT_INCLUDED = [
  "Tastings, wine flights, glasses, bottles, and food are purchased separately directly from each tasting room",
  "Guests are free to order whatever they would like at each stop",
  "Optional golf cart transportation through Old Town Scottsdale may be arranged for an additional fee",
];

export default function ToursPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative -mt-16 flex items-center justify-center min-h-[60vh] py-28"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(55, 0, 60, 0.7), rgba(20, 0, 30, 0.85)), url('https://assets.experiencescottsdale.com/simpleview/image/upload/c_fill,h_857,q_75,w_1500/v1/crm/scottsdale/Main-Street-Galleries-10-8e0f46305056b3a_8e0f4824-5056-b3a8-49577c01588a2e6d.gif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative text-center text-white px-6 max-w-3xl mx-auto pt-12">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border border-gold-400/40 text-gold-300 mb-6">
            Private Guided Tours
          </span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-5 leading-tight">
            Guided Scottsdale Wine Trail Tours
          </h1>
          <p className="text-xl text-white/85 leading-relaxed max-w-2xl mx-auto">
            Experience the Scottsdale Wine Trail with a private guided tour
            through Old Town Scottsdale&apos;s Arizona wine tasting rooms.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-lg text-gray-700 leading-relaxed">
          <p>
            Perfect for bachelorette groups, birthdays, corporate outings,
            tourists, or anyone looking for a more personalized wine experience.
          </p>
          <p>
            Your guide will help curate the experience based on your
            group&apos;s preferences, whether you&apos;re interested in bold
            reds, crisp whites, hidden gems, food pairings, Arizona wine
            education, or simply a fun afternoon exploring the trail.
          </p>
          <p>
            Tours are fully customizable and arranged directly with your guide
            prior to your visit.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Pricing
            </h2>
            <p className="text-gray-500 text-lg">
              Simple, transparent rates for any group size
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-cream border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
              <p className="text-gray-500 text-sm uppercase tracking-wider mb-3">
                Up to 6 guests
              </p>
              <p className="font-serif text-5xl font-bold text-burgundy-700 mb-2">
                $150
              </p>
              <p className="text-gray-500 text-sm">flat rate</p>
            </div>
            <div className="bg-cream border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
              <p className="text-gray-500 text-sm uppercase tracking-wider mb-3">
                Additional Guests
              </p>
              <p className="font-serif text-5xl font-bold text-burgundy-700 mb-2">
                $25
              </p>
              <p className="text-gray-500 text-sm">per additional guest</p>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            This rate covers the private guided tour service only.
          </p>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-5">
                What&apos;s Included
              </h3>
              <ul className="space-y-3">
                {INCLUDED.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-burgundy-600 shrink-0" />
                    <span className="leading-relaxed text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-5">
                Please Note
              </h3>
              <ul className="space-y-3">
                {NOT_INCLUDED.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
                    <span className="leading-relaxed text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="relative rounded-3xl overflow-hidden p-10 md:p-14 text-white shadow-xl"
            style={{
              background:
                "linear-gradient(135deg, hsl(351,67%,17%) 0%, hsl(280,55%,13%) 60%, hsl(43,70%,19%) 100%)",
            }}
          >
            <div
              className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-[0.12] blur-3xl pointer-events-none"
              style={{ background: "hsl(43,100%,55%)" }}
              aria-hidden="true"
            />

            <div className="relative">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3 leading-tight">
                Book a Tour
              </h2>
              <p className="text-white/75 mb-8 leading-relaxed">
                To book a guided Scottsdale Wine Trail experience, contact:
              </p>

              <div className="space-y-5 mb-8">
                <div>
                  <p className="text-white/50 text-sm font-medium tracking-wide uppercase mb-1">
                    Phone
                  </p>
                  <a
                    href="tel:9712697715"
                    className="text-2xl font-serif text-white hover:text-gold-300 transition-colors"
                  >
                    971-269-7715
                  </a>
                </div>
                <div>
                  <p className="text-white/50 text-sm font-medium tracking-wide uppercase mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:info@scottsdalewinetrail.com"
                    className="text-xl font-serif text-white hover:text-gold-300 transition-colors break-all"
                  >
                    info@scottsdalewinetrail.com
                  </a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <a
                  href="tel:9712697715"
                  className="gold-gradient text-white font-semibold px-7 py-3.5 rounded-xl hover:opacity-90 transition-all shadow-lg text-center"
                >
                  Call to Book
                </a>
                <a
                  href="mailto:info@scottsdalewinetrail.com"
                  className="bg-white/10 backdrop-blur-sm text-white border border-white/20 font-semibold px-7 py-3.5 rounded-xl hover:bg-white/20 transition-all text-center"
                >
                  Email the Concierge
                </a>
              </div>

              <p className="text-white/60 text-sm leading-relaxed border-t border-white/15 pt-6">
                <strong className="text-white/80">Please note:</strong> Guided
                tour availability is not guaranteed for bookings made less than
                one week in advance. Advance booking is strongly recommended,
                especially for weekends and larger groups.
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-10">
            Prefer to plan your own visit?{" "}
            <Link
              href="/concierge"
              className="text-burgundy-600 hover:underline"
            >
              Contact our concierge for help
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
