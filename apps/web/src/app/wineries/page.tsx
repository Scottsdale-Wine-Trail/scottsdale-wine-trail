import { getWineries } from "@/lib/supabase/queries";
import { WineriesClient } from "@/components/WineriesClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Wineries" };

export default async function WineriesPage() {
  const wineries = await getWineries().catch(() => []);
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-wine-900 mb-2">Wineries</h1>
      <p className="text-wine-600 mb-8">
        Explore all wineries along the Scottsdale Wine Trail.
      </p>
      <WineriesClient wineries={wineries} />
    </div>
  );
}
