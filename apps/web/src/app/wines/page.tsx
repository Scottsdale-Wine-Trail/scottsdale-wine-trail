import type { Metadata } from "next";
import { getWineries } from "@/lib/data";
import { CURATED_WINES } from "@/lib/data/curated-wines";
import { WinesClient } from "@/components/WinesClient";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://scottsdalewinetrail.com";

export const metadata: Metadata = {
  title: "Wines",
  description:
    "Browse Arizona wines from every tasting room on the Scottsdale Wine Trail.",
};

export default async function WinesPage() {
  const wineries = await getWineries();

  // JSON-LD Product structured data so wines surface in Google Shopping / Search
  const productLd = CURATED_WINES.map((w) => ({
    "@context": "https://schema.org/",
    "@type": "Product",
    name: `${w.wineryName} ${w.name}`,
    description: w.description ?? `${w.name} from ${w.wineryName}.`,
    image: `${SITE_URL}${w.image}`,
    brand: { "@type": "Brand", name: w.wineryName },
    category: "Food, Beverages & Tobacco > Beverages > Alcoholic Beverages > Wine",
    sku: w.slug,
    ...(w.price !== null && {
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: w.price.toFixed(2),
        availability: "https://schema.org/InStock",
        url: w.purchaseUrl ?? `${SITE_URL}/wines#${w.slug}`,
      },
    }),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />

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
          <h1 className="font-serif text-5xl font-bold mb-4">Wines</h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto">
            Browse Arizona wines from every tasting room on the trail.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <WinesClient wines={CURATED_WINES} wineries={wineries} />
      </div>
    </>
  );
}
