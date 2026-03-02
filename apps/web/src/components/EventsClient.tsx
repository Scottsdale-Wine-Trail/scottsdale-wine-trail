"use client";

import { useState } from "react";
import type { WineryEvent } from "@swt/shared";
import { EventCard } from "./EventCard";

const eventTypes = ["educational", "festival", "tasting", "tour", "other"] as const;

export function EventsClient({ events }: { events: WineryEvent[] }) {
  const [activeType, setActiveType] = useState<string | null>(null);

  const filtered = activeType
    ? events.filter((e) => e.type === activeType)
    : events;

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveType(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeType === null
              ? "bg-wine-700 text-white"
              : "bg-wine-100 text-wine-700 hover:bg-wine-200"
          }`}
        >
          All
        </button>
        {eventTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type === activeType ? null : type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
              activeType === type
                ? "bg-wine-700 text-white"
                : "bg-wine-100 text-wine-700 hover:bg-wine-200"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-wine-400 text-center py-16">
          No events found for this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </>
  );
}
