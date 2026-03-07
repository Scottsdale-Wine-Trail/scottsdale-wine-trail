"use client";

import { useState } from "react";
import type { Wine, Winery } from "@swt/shared";

export function WinesClient({
  wines,
  wineries,
}: {
  wines: Wine[];
  wineries: Winery[];
}) {
  const [wineryFilter, setWineryFilter] = useState<string | null>(null);

  const wineryMap = Object.fromEntries(wineries.map((w) => [w.id, w.name]));

  const filtered = wineryFilter
    ? wines.filter((wine) => wine.winery_id === wineryFilter)
    : wines;

  return (
    <>
      <div className="mb-6">
        <select
          value={wineryFilter ?? ""}
          onChange={(e) => setWineryFilter(e.target.value || null)}
          className="border border-wine-200 rounded-lg px-4 py-2 text-wine-900"
        >
          <option value="">All wineries</option>
          {wineries.map((winery) => (
            <option key={winery.id} value={winery.id}>
              {winery.name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-wine-500">No wines yet.</p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((wine) => (
            <li key={wine.id} className="bg-white border border-wine-200 rounded-xl p-4">
              <p className="font-medium text-wine-900">{wine.name}</p>
              <p className="text-sm text-wine-700">{wine.varietal}</p>
              <p className="text-sm text-wine-600">{wineryMap[wine.winery_id] || "Unknown winery"}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
