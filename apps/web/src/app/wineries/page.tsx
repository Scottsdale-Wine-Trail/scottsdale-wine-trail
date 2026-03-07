import type { Metadata } from "next";
import { getWineries } from "@/lib/data";
import { WineriesClient } from "@/components/WineriesClient";

export const metadata: Metadata = {
  title: "Wineries",
  description: "Explore Scottsdale Wine Trail wineries around Scottsdale.",
};

export default async function WineriesPage() {
  const wineries = await getWineries();

  return (
    <>
      <div
        className="relative py-24 px-6 -mt-16"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(55, 0, 60, 0.7), rgba(20, 0, 30, 0.85)), url('https://assets.experiencescottsdale.com/simpleview/image/upload/c_fill,h_857,q_75,w_1500/v1/crm/scottsdale/Main-Street-Galleries-10-8e0f46305056b3a_8e0f4824-5056-b3a8-49577c01588a2e6d.gif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-4xl mx-auto text-center text-white pt-16">
          <h1 className="font-serif text-5xl font-bold mb-4">Wineries</h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto">
            Explore every winery and tasting room on the Scottsdale Wine Trail.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <WineriesClient wineries={wineries} />
      </div>
    </>
  );
}
