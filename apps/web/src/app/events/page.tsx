import type { Metadata } from "next";
import { getEvents } from "@/lib/data";

export const metadata: Metadata = { title: "Events" };

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-wine-900 mb-2">Events</h1>
      <p className="text-wine-600 mb-8">Upcoming tastings, tours, and wine trail experiences.</p>

      {events.length === 0 ? (
        <p className="text-wine-500">No events yet.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.id} className="bg-white border border-wine-200 rounded-xl p-5">
              <p className="text-sm text-wine-500 mb-1">
                {new Date(event.start_date).toLocaleString()}
              </p>
              <h2 className="text-lg font-semibold text-wine-900">{event.title}</h2>
              <p className="text-wine-700 text-sm mt-1">{event.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
