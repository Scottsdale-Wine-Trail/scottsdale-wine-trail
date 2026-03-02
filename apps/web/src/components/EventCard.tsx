import type { WineryEvent } from "@swt/shared";

const typeColors: Record<string, string> = {
  educational: "bg-blue-100 text-blue-700",
  festival: "bg-yellow-100 text-yellow-700",
  tasting: "bg-wine-100 text-wine-700",
  tour: "bg-green-100 text-green-700",
  other: "bg-gray-100 text-gray-700",
};

export function EventCard({ event }: { event: WineryEvent }) {
  const dateStr = new Date(event.start_date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return (
    <div className="bg-white rounded-2xl p-5 border border-wine-100 shadow hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            typeColors[event.type] ?? typeColors.other
          }`}
        >
          {event.type}
        </span>
        <span className="text-xs text-wine-400">{dateStr}</span>
      </div>
      <h3 className="text-base font-bold text-wine-900 mb-1">{event.title}</h3>
      <p className="text-wine-600 text-sm line-clamp-3">{event.description}</p>
    </div>
  );
}
