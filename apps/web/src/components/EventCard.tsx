import type { WineryEvent } from "@swt/shared";

const typeColors: Record<string, string> = {
  educational: "bg-blue-50 text-blue-700 border-blue-200",
  festival: "bg-amber-50 text-amber-700 border-amber-200",
  tasting: "bg-burgundy-50 text-burgundy-700 border-burgundy-200",
  tour: "bg-emerald-50 text-emerald-700 border-emerald-200",
  other: "bg-gray-50 text-gray-600 border-gray-200",
};

export function EventCard({ event }: { event: WineryEvent }) {
  const dateStr = new Date(event.start_date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="card-hover-effect bg-gradient-to-br from-white to-cream border border-gold-100 rounded-2xl overflow-hidden shadow-md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${
              typeColors[event.type] ?? typeColors.other
            }`}
          >
            {event.type}
          </span>
          <span className="text-xs text-gray-400 font-medium">{dateStr}</span>
        </div>
        <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2 leading-snug">
          {event.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {event.description}
        </p>
        <div className="mt-4">
          <span className="text-sm font-medium text-burgundy-600 hover:text-burgundy-800 transition-colors">
            Learn More &amp; RSVP →
          </span>
        </div>
      </div>
    </div>
  );
}
