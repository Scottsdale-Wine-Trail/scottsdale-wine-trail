import Link from "next/link";
import Image from "next/image";
import type { Winery } from "@swt/shared";

export function WineryCard({ winery }: { winery: Winery }) {
  return (
    <Link
      href={`/wineries/${winery.slug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition-shadow border border-wine-100"
    >
      <div className="relative h-48 bg-wine-100">
        {winery.hero_image_url ? (
          <Image
            src={winery.hero_image_url}
            alt={winery.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-wine-300 text-5xl">
            🍷
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-wine-900 mb-1">{winery.name}</h3>
        <p className="text-wine-600 text-sm line-clamp-2 mb-3">
          {winery.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {winery.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-wine-50 text-wine-600 text-xs px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
