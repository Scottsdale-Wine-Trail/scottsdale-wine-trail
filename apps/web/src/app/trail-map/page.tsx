import type { Metadata } from "next";
import { getWineries } from "@/lib/supabase/queries";
import { TrailMapClient } from "@/components/TrailMapClient";

export const metadata: Metadata = { title: "Trail Map" };

export default async function TrailMapPage() {
  const wineries = await getWineries().catch(() => []);
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="px-4 py-4 bg-white border-b border-wine-100">
        <h1 className="text-2xl font-bold text-wine-900">Trail Map</h1>
        <p className="text-wine-600 text-sm">
          Click a pin to see winery details.
        </p>
      </div>
      <div className="flex-1">
        <TrailMapClient wineries={wineries} />
      </div>
    </div>
  );
}
