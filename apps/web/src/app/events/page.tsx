import type { Metadata } from "next";
import Image from "next/image";
import { CURATED_EVENTS, TYPE_COLORS } from "@/lib/data/curated-events";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming events, tastings, classes, and experiences on the Scottsdale Wine Trail.",
};

export default function EventsPage() {
  return (
    <>
      {/* Hero */}
      <div
        className="relative py-24 px-6 -mt-16"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(55, 0, 60, 0.7), rgba(20, 0, 30, 0.85)), url('https://assets.experiencescottsdale.com/simpleview/image/upload/c_fill,h_857,q_75,w_1500/v1/crm/scottsdale/Main-Street-Galleries-10-8e0f46305056b3a_8e0f4824-5056-b3a8-49577c01588a2e6d.gif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-4xl mx-auto text-center text-white pt-16">
          <h1 className="font-serif text-5xl font-bold mb-4">Events</h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto">
            Upcoming tastings, classes, winemaker talks, and recurring
            experiences across the Scottsdale Wine Trail.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-8">
          {CURATED_EVENTS.map((event) => (
            <article
              key={event.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden grid md:grid-cols-[280px_1fr] gap-0"
            >
              {event.image ? (
                <a
                  href={event.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${event.title} flyer in full size`}
                  className="relative block bg-cream md:aspect-auto aspect-[4/5] group"
                >
                  <Image
                    src={event.image}
                    alt={`${event.title} event flyer`}
                    fill
                    sizes="(min-width:768px) 280px, 100vw"
                    className="object-cover group-hover:opacity-95 transition-opacity"
                  />
                </a>
              ) : (
                <div className="bg-cream md:aspect-auto aspect-[4/5] flex items-center justify-center">
                  <span className="font-serif text-gray-300 text-5xl">
                    {event.title.charAt(0)}
                  </span>
                </div>
              )}

              <div className="p-7 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-gray-900 leading-snug">
                      {event.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">{event.venue}</p>
                    <p className="text-sm font-medium text-burgundy-700 mt-0.5">
                      {event.schedule}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                      TYPE_COLORS[event.type] ??
                      "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    {event.type}
                  </span>
                </div>

                <div className="space-y-3 text-gray-700 leading-relaxed text-sm mb-5 flex-1">
                  {event.body.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {event.contact && (
                  <p className="text-sm text-gray-500 mb-4">{event.contact}</p>
                )}

                {event.cta && (
                  <a
                    href={event.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block self-start wine-gradient text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity shadow-sm"
                  >
                    {event.cta.label}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-500 mb-4">
            Have an event to share or want to plan a private experience?
          </p>
          <a
            href="/concierge"
            className="inline-block gold-gradient text-white font-semibold px-7 py-3 rounded-lg text-sm hover:opacity-90 transition-opacity shadow-md"
          >
            Contact the Concierge
          </a>
        </div>
      </div>
    </>
  );
}
