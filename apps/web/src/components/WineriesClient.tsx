"use client";

import { useState } from "react";
import type { Winery } from "@swt/shared";
import { WineryCard } from "./WineryCard";

export function WineriesClient({ wineries }: { wineries: Winery[] }) {
  const [search, setSearch] = useState("");

  const filtered = wineries.filter((winery) => {
    const query = search.toLowerCase();
    return (
      winery.name.toLowerCase().includes(query) ||
      winery.address.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <div className="mb-8">
        <input
          type="search"
          placeholder="Search by name or address…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-burgundy-300 bg-white shadow-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-16 font-serif text-lg italic">
          No wineries found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((winery) => (
            <WineryCard key={winery.id} winery={winery} />
          ))}
        </div>
      )}
    </>
  );
}
