"use client";

import { useRouter } from "next/navigation";
import type { Winery } from "@swt/shared";

export function WineryCard({ winery }: { winery: Winery }) {
  const router = useRouter();

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/wineries/${winery.slug}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(`/wineries/${winery.slug}`);
        }
      }}
      className="card-hover-effect bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 cursor-pointer"
    >
      {winery.hero_image_url ? (
        <img
          src={winery.hero_image_url}
          alt={`${winery.name} tasting room`}
          className="w-full h-56 object-cover"
        />
      ) : (
        <div className="w-full h-56 wine-gradient flex items-center justify-center">
          <span className="font-serif text-5xl text-white/40 font-bold">
            {winery.name.charAt(0)}
          </span>
        </div>
      )}
      <div className="p-6">
        <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2 leading-snug">
          {winery.name}
        </h3>
        {winery.description && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {winery.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            {winery.city}, {winery.state}
          </p>
          <span className="text-sm font-medium text-burgundy-600 hover:text-burgundy-800 transition-colors">
            Explore →
          </span>
        </div>
        {winery.tags && winery.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {winery.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-gold-50 text-gold-700 rounded-full border border-gold-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
