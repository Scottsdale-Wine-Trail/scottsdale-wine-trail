import type { Metadata } from "next";
import { getWineries } from "@/lib/data";
import { WineriesMapClient } from "@/components/WineriesMapClient";

export const metadata: Metadata = {
  title: "Map",
};

export default async function MapPage() {
  const wineries = await getWineries();

  return <WineriesMapClient wineries={wineries} />;
}
