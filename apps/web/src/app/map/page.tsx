import type { Metadata } from "next";
import { getWineries } from "@/lib/data";
import { WineriesMapClient } from "@/components/WineriesMapClient";

export const metadata: Metadata = {
  title: "Trail Map",
  description:
    "Interactive map of all Scottsdale Wine Trail wineries. Get walking directions from one tasting room to the next.",
};

export default async function MapPage() {
  const wineries = await getWineries();

  return <WineriesMapClient wineries={wineries} />;
}
