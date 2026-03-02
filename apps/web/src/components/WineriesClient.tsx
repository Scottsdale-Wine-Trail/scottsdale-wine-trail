"use client";

import { useState } from "react";
import type { Winery } from "@swt/shared";
import { WineryCard } from "./WineryCard";

export function WineriesClient({ wineries }: { wineries: Winery[] }) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(wineries.flatMap((w) => w.tags))).sort();

  const filtered = wineries.filter((w) => {
    const matchesSearch = w.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesTag = activeTag ? w.tags.includes(activeTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <>
      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="search"
          placeholder="Search wineries…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-wine-200 rounded-full px-5 py-2.5 text-wine-900 placeholder:text-wine-300 focus:outline-none focus:ring-2 focus:ring-wine-400"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTag === null
                ? "bg-wine-700 text-white"
                : "bg-wine-100 text-wine-700 hover:bg-wine-200"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTag === tag
                  ? "bg-wine-700 text-white"
                  : "bg-wine-100 text-wine-700 hover:bg-wine-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-wine-400 text-center py-16">
          No wineries match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((w) => (
            <WineryCard key={w.id} winery={w} />
          ))}
        </div>
      )}
    </>
  );
}
