import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Stories, winemaker spotlights, and tasting notes from the Scottsdale Wine Trail.",
};

export default function BlogPage() {
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
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border border-gold-400/40 text-gold-300 mb-6">
            Coming Soon
          </span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-5 leading-tight">
            The Scottsdale Wine Trail Blog
          </h1>
          <p className="text-xl text-white/85 leading-relaxed max-w-2xl mx-auto">
            Stories from the trail, winemaker spotlights, tasting notes, and
            Old Town happenings.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="py-20 bg-trail-soft">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-10 md:p-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-gray-900 mb-5">
              First posts are on the way.
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              We&apos;re lining up our first features: behind-the-scenes
              winemaker conversations, Arizona varietal deep-dives, and
              recommended ways to spend a day in Old Town Scottsdale.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              In the meantime, browse upcoming events or contact our concierge
              for ideas on how to spend your visit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/events"
                className="wine-gradient text-white font-semibold px-7 py-3.5 rounded-xl hover:opacity-90 transition-all shadow-md"
              >
                See Upcoming Events
              </Link>
              <Link
                href="/concierge"
                className="bg-white border border-gray-200 text-gray-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-gray-50 transition-all"
              >
                Contact the Concierge
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
