"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Winery } from "@swt/shared";
import type { CuratedWine } from "@/lib/data/curated-wines";

const COLOR_BADGE: Record<string, string> = {
  Red: "bg-burgundy-50 text-burgundy-800 border-burgundy-200",
  White: "bg-amber-50 text-amber-800 border-amber-200",
  "Rosé": "bg-pink-50 text-pink-800 border-pink-200",
};

const SWEET_BADGE: Record<string, string> = {
  Dry: "bg-gray-50 text-gray-700 border-gray-200",
  "Off-Dry": "bg-gray-50 text-gray-700 border-gray-200",
  "Semi-Sweet": "bg-orange-50 text-orange-700 border-orange-200",
  Sweet: "bg-yellow-50 text-yellow-800 border-yellow-200",
};

export function WinesClient({
  wines,
  wineries,
}: {
  wines: CuratedWine[];
  wineries: Winery[];
}) {
  const [search, setSearch] = useState("");
  const [winerySlug, setWinerySlug] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);

  const wineryNameBySlug = useMemo(
    () => Object.fromEntries(wineries.map((w) => [w.slug, w.name])),
    [wineries]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return wines.filter((wine) => {
      if (winerySlug && wine.winerySlug !== winerySlug) return false;
      if (color && wine.color !== color) return false;
      if (q) {
        const hay = `${wine.name} ${wine.wineryName} ${wine.color ?? ""} ${
          wine.sweetness ?? ""
        }`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [wines, search, winerySlug, color]);

  const colorCounts = useMemo(() => {
    const out: Record<string, number> = { Red: 0, White: 0, "Rosé": 0 };
    for (const w of wines) {
      if (w.color && w.color in out) out[w.color]++;
    }
    return out;
  }, [wines]);

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col gap-4 mb-8">
        <input
          type="search"
          placeholder="Search by wine name, varietal, or tasting room…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-burgundy-300 bg-white shadow-sm"
        />
        <div className="flex flex-col md:flex-row gap-3">
          <select
            value={winerySlug ?? ""}
            onChange={(e) => setWinerySlug(e.target.value || null)}
            className="flex-1 border border-gray-200 rounded-xl px-5 py-3 text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-burgundy-300"
          >
            <option value="">All tasting rooms</option>
            {wineries.map((w) => (
              <option key={w.slug} value={w.slug}>
                {w.name}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setColor(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                color === null
                  ? "wine-gradient text-white border-transparent"
                  : "bg-white text-gray-600 border-gray-200 hover:border-burgundy-300"
              }`}
            >
              All
            </button>
            {(["Red", "White", "Rosé"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(color === c ? null : c)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  color === c
                    ? "wine-gradient text-white border-transparent"
                    : "bg-white text-gray-600 border-gray-200 hover:border-burgundy-300"
                }`}
              >
                {c} <span className="opacity-60">({colorCounts[c]})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Showing {filtered.length} of {wines.length} wines
      </p>

      {filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-16 font-serif text-lg italic">
          No wines match those filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((wine) => {
            const wineryDisplayName =
              wineryNameBySlug[wine.winerySlug] ?? wine.wineryName;
            return (
              <article
                key={wine.slug}
                id={wine.slug}
                className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative w-full bg-cream aspect-square overflow-hidden">
                  <Image
                    src={wine.image}
                    alt={`${wine.wineryName} ${wine.name}`}
                    fill
                    sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    className="object-contain p-4 group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 flex flex-col p-5">
                  <p className="text-xs uppercase tracking-wider text-gold-700 font-semibold mb-1">
                    {wineryDisplayName}
                  </p>
                  <h3 className="font-serif text-lg font-semibold text-gray-900 leading-snug mb-2">
                    {wine.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {wine.color && (
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                          COLOR_BADGE[wine.color] ??
                          "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                      >
                        {wine.color}
                      </span>
                    )}
                    {wine.sweetness && (
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                          SWEET_BADGE[wine.sweetness] ??
                          "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                      >
                        {wine.sweetness}
                      </span>
                    )}
                  </div>
                  {wine.description && (
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-4 mb-4">
                      {wine.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between gap-3 pt-2 border-t border-gray-50">
                    {wine.price !== null ? (
                      <span className="font-serif text-xl font-bold text-burgundy-700">
                        ${wine.price.toFixed(0)}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">
                        Price at tasting room
                      </span>
                    )}
                    {wine.purchaseUrl && (
                      <a
                        href={wine.purchaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-burgundy-600 hover:text-burgundy-800 transition-colors"
                      >
                        Buy →
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
