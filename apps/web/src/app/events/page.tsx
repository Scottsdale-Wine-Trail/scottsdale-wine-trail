import type { Metadata } from "next";
import { getEvents } from "@/lib/supabase/queries";
import { EventsClient } from "@/components/EventsClient";

export const metadata: Metadata = { title: "Events" };

export default async function EventsPage() {
  const events = await getEvents().catch(() => []);
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-wine-900 mb-2">Events</h1>
      <p className="text-wine-600 mb-8">
        Tastings, festivals, tours, and more along the Scottsdale Wine Trail.
      </p>
      <EventsClient events={events} />
    </div>
  );
}
