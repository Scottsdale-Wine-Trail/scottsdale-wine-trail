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
  const [search, setSearch] = useState("");
  const [wineryFilter, setWineryFilter] = useState<string | null>(null);

  const wineryMap = Object.fromEntries(wineries.map((w) => [w.id, w.name]));

  const filtered = wines.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.varietal.toLowerCase().includes(search.toLowerCase());
    const matchesWinery = wineryFilter ? w.winery_id === wineryFilter : true;
    return matchesSearch && matchesWinery;
  });

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="search"
          placeholder="Search wines or varietals…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-wine-200 rounded-full px-5 py-2.5 text-wine-900 placeholder:text-wine-300 focus:outline-none focus:ring-2 focus:ring-wine-400"
        />
        <select
          value={wineryFilter ?? ""}
          onChange={(e) => setWineryFilter(e.target.value || null)}
          className="border border-wine-200 rounded-full px-5 py-2.5 text-wine-900 focus:outline-none focus:ring-2 focus:ring-wine-400"
        >
          <option value="">All Wineries</option>
          {wineries.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-wine-400 text-center py-16">No wines found.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-wine-100">
          <table className="w-full text-sm">
            <thead className="bg-wine-50 text-wine-700">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Name</th>
                <th className="text-left px-4 py-3 font-semibold">Varietal</th>
                <th className="text-left px-4 py-3 font-semibold">Winery</th>
                <th className="text-left px-4 py-3 font-semibold">Price</th>
                <th className="text-left px-4 py-3 font-semibold">Available</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wine-50">
              {filtered.map((wine) => (
                <tr key={wine.id} className="hover:bg-wine-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-wine-900">
                    {wine.name}
                  </td>
                  <td className="px-4 py-3 text-wine-600">{wine.varietal}</td>
                  <td className="px-4 py-3 text-wine-600">
                    {wineryMap[wine.winery_id] ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-wine-600">
                    {wine.price != null ? `$${wine.price}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        wine.available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {wine.available ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
