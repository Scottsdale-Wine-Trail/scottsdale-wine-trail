import { CURATED_WINES } from "@/lib/data/curated-wines";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://scottsdalewinetrail.com";

export const dynamic = "force-static";
export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wineItem(w: (typeof CURATED_WINES)[number]): string {
  const title = `${w.wineryName} ${w.name}`;
  const description =
    w.description ?? `${w.name} from ${w.wineryName}, available on the Scottsdale Wine Trail.`;
  const link = w.purchaseUrl ?? `${SITE_URL}/wines#${w.slug}`;
  const imageLink = `${SITE_URL}${w.image}`;
  const priceLine =
    w.price !== null
      ? `<g:price>${w.price.toFixed(2)} USD</g:price>`
      : "";

  return `<item>
    <g:id>${escapeXml(w.slug)}</g:id>
    <g:title>${escapeXml(title)}</g:title>
    <g:description>${escapeXml(description)}</g:description>
    <g:link>${escapeXml(link)}</g:link>
    <g:image_link>${escapeXml(imageLink)}</g:image_link>
    <g:availability>in stock</g:availability>
    <g:condition>new</g:condition>
    ${priceLine}
    <g:brand>${escapeXml(w.wineryName)}</g:brand>
    <g:google_product_category>Food, Beverages &amp; Tobacco &gt; Beverages &gt; Alcoholic Beverages &gt; Wine</g:google_product_category>
    <g:product_type>${escapeXml(`Wine > ${w.color ?? "Wine"}`)}</g:product_type>
    <g:identifier_exists>no</g:identifier_exists>
    <g:adult>yes</g:adult>
  </item>`;
}

export async function GET() {
  const items = CURATED_WINES.map(wineItem).join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Scottsdale Wine Trail Wines</title>
    <link>${SITE_URL}/wines</link>
    <description>Wine product feed for Google Merchant Center.</description>
    ${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
