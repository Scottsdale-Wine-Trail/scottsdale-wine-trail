import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Our Concierge",
  description:
    "Planning a Scottsdale Wine Trail visit? Our concierge can help with route recommendations, custom itineraries, group reservations, and more.",
};

const HELPS_WITH = [
  "Route recommendations between tasting rooms",
  "Custom itinerary planning",
  "Reservation assistance for groups of 6 or more",
  "Suggestions based on your wine preferences, timing, and group size",
  "General questions about the trail, passports, events, and experiences",
];

export default function ConciergePage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative -mt-16 flex items-center justify-center min-h-[55vh] py-28"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(55, 0, 60, 0.7), rgba(20, 0, 30, 0.85)), url('https://assets.experiencescottsdale.com/simpleview/image/upload/c_fill,h_857,q_75,w_1500/v1/crm/scottsdale/Main-Street-Galleries-10-8e0f46305056b3a_8e0f4824-5056-b3a8-49577c01588a2e6d.gif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative text-center text-white px-6 max-w-3xl mx-auto pt-12">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-5 leading-tight">
            Contact Our Concierge
          </h1>
          <p className="text-xl text-white/85 leading-relaxed max-w-xl mx-auto">
            Planning a Scottsdale Wine Trail visit? Let us help make your
            experience seamless.
          </p>
        </div>
      </section>

      {/* Helps with */}
      <section className="py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-10 md:p-12">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              The Scottsdale Wine Trail Concierge is available to help make your
              experience seamless. Whether you&apos;re visiting for a casual
              afternoon, a birthday, bachelorette party, or group outing,
              assistance is available with:
            </p>

            <ul className="space-y-3 mb-8">
              {HELPS_WITH.map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-burgundy-600 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              The Scottsdale Wine Trail is designed to be self-guided and
              walkable, but a little planning can help you make the most of
              your visit.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              Reach out to start planning your day in Old Town Scottsdale.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Card */}
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
              <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border border-gold-400/40 text-gold-300 mb-6">
                Scottsdale Wine Trail Concierge
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-8 leading-tight">
                Let&apos;s plan your visit.
              </h2>

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

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:9712697715"
                  className="gold-gradient text-white font-semibold px-7 py-3.5 rounded-xl hover:opacity-90 transition-all shadow-lg text-center"
                >
                  Call Now
                </a>
                <a
                  href="mailto:info@scottsdalewinetrail.com"
                  className="bg-white/10 backdrop-blur-sm text-white border border-white/20 font-semibold px-7 py-3.5 rounded-xl hover:bg-white/20 transition-all text-center"
                >
                  Send an Email
                </a>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-10">
            Looking for a guided experience?{" "}
            <Link href="/tours" className="text-burgundy-600 hover:underline">
              Explore guided tours
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
