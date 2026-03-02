import type { Metadata } from "next";
import { getWines, getWineries } from "@/lib/supabase/queries";
import { WinesClient } from "@/components/WinesClient";

export const metadata: Metadata = { title: "Wines" };

export default async function WinesPage() {
  const [wines, wineries] = await Promise.all([
    getWines().catch(() => []),
    getWineries().catch(() => []),
  ]);
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-wine-900 mb-2">Wine Database</h1>
      <p className="text-wine-600 mb-8">
        Browse and search wines from all wineries on the trail.
      </p>
      <WinesClient wines={wines} wineries={wineries} />
    </div>
  );
}
