"use client";

import { useMemo, useState } from "react";
import type { Wine, Winery } from "@swt/shared";

export function WinesClient({
  wines,
  wineries,
}: {
  wines: Wine[];
  wineries: Winery[];
}) {
  const [wineryFilter, setWineryFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const wineryMap = useMemo(
    () => Object.fromEntries(wineries.map((w) => [w.id, w.name])),
    [wineries]
  );

  const validWineryIds = useMemo(
    () => new Set(wineries.map((w) => w.id)),
    [wineries]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return wines
      .filter((wine) => validWineryIds.has(wine.winery_id))
      .filter((wine) =>
        wineryFilter ? wine.winery_id === wineryFilter : true
      )
      .filter((wine) =>
        q
          ? wine.name.toLowerCase().includes(q) ||
            wine.varietal?.toLowerCase().includes(q)
          : true
      );
  }, [wines, wineryFilter, validWineryIds, search]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="search"
          placeholder="Search by wine name or varietal…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-burgundy-300 bg-white shadow-sm"
        />
        <select
          value={wineryFilter ?? ""}
          onChange={(e) => setWineryFilter(e.target.value || null)}
          className="border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-burgundy-300 md:w-72"
        >
          <option value="">All tasting rooms</option>
          {wineries.map((winery) => (
            <option key={winery.id} value={winery.id}>
              {winery.name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-16 font-serif text-lg italic">
          No wines found.
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((wine) => (
            <li
              key={wine.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="font-serif text-lg font-semibold text-gray-900 leading-snug">
                {wine.name}
              </p>
              {wine.varietal && (
                <p className="text-sm text-gold-700 mt-0.5">{wine.varietal}</p>
              )}
              <p className="text-xs text-gray-500 mt-3">
                {wineryMap[wine.winery_id] || "Unknown winery"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
