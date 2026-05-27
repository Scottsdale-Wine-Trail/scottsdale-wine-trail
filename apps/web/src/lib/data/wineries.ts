import { createClient } from "@/lib/supabase/server";
import type { Winery } from "@swt/shared";

const EXCLUDED_SLUGS = new Set(["arizona-stronghold-vineyards"]);

// Canonical coordinates and addresses for each tasting room.
// Overlaid onto whatever's in Supabase so the maps + addresses on the
// detail pages always show the correct Old Town Scottsdale locations.
const WINERY_LOCATION_OVERRIDES: Record<
  string,
  { lat: number; lng: number; address: string; city: string; state: string; zip: string }
> = {
  "aridus-wine-company": {
    lat: 33.4928431,
    lng: -111.9267254,
    address: "7173 E. Main Street",
    city: "Scottsdale",
    state: "AZ",
    zip: "85251",
  },
  "the-wine-collective-of-scottsdale": {
    lat: 33.4943052,
    lng: -111.9264455,
    address: "4020 N. Scottsdale Rd. #104",
    city: "Scottsdale",
    state: "AZ",
    zip: "85251",
  },
  "carlson-creek-tasting-room": {
    lat: 33.4956085,
    lng: -111.9292911,
    address: "4142 N. Marshall Way",
    city: "Scottsdale",
    state: "AZ",
    zip: "85251",
  },
  "los-milics-vineyards": {
    lat: 33.4959464,
    lng: -111.9287280,
    address: "4151 N. Marshall Way",
    city: "Scottsdale",
    state: "AZ",
    zip: "85251",
  },
  "salvatore-vineyards-tasting-room": {
    lat: 33.4982043,
    lng: -111.9291499,
    address: "7064 E. 5th Ave",
    city: "Scottsdale",
    state: "AZ",
    zip: "85251",
  },
  "ldv-winery-tasting-room": {
    lat: 33.4994348,
    lng: -111.9278661,
    address: "7134 E. Stetson Dr., B-110",
    city: "Scottsdale",
    state: "AZ",
    zip: "85251",
  },
};

const WINERY_DESCRIPTION_OVERRIDES: Record<string, string> = {
  "aridus-wine-company":
    "Each bottle of Aridus wine tells a captivating story, encapsulating its own unique character and origin. With every sip, you embark on a journey of discovery, unravelling the layers of complexity and the sheer brilliance that can be found in each carefully crafted bottle. Every drop is a testament to the exceptional quality of grapes that are grown in our renowned eco-friendly winery, where sustainability and excellence come together harmoniously. From vine to bottle, our winemaking process is meticulously executed, ensuring that the distinct flavors and aromas of each grape varietal shine through. Immerse yourself in the world of Aridus wine, and experience the undeniable distinction that sets us apart.",
  "the-wine-collective-of-scottsdale":
    "At The Wine Collective of Scottsdale, our mission is to create unforgettable experiences that celebrate Arizona's growing wine scene while supporting local small businesses and wineries. Whether you're a seasoned wine connoisseur or a curious first-time taster, our space offers a relaxed, educational atmosphere that makes wine approachable and fun.",
  "carlson-creek-tasting-room":
    "Carlson Creek Vineyard is rooted in southeastern Arizona, just outside of Willcox, where our estate spans more than 300 acres at an elevation of 4,200 feet. This high-elevation setting creates a growing environment unlike what many expect from Arizona, one defined by warm days, cool nights, and a long, steady ripening season.\n\nThese conditions allow grapes to develop naturally, building structure, color, and depth while retaining balance and freshness. It's a climate more commonly associated with renowned wine regions in Argentina, Chile, and the south of France, and one that allows our vineyards to express both character and restraint.\n\nThe Carlson family planted the first seven acres of the vineyard in 2009, working the land together and establishing the foundation for what would become a fully estate-grown winery. Over the years, the vineyard expanded thoughtfully, guided by the belief that growth should always serve quality and longevity.",
  "los-milics-vineyards":
    "Our 20-acre Estate Vineyard is nestled in the pristine beauty of Elgin, Arizona, with a 5000-foot elevation ideal for growing grapes. We have an additional 50 acres planted 20 miles east of the Estate Vineyard in Elfrida, Arizona. In total, we currently grow 17 different types of grapes: Cabernet Franc, Carignan, Counoise, Graciano, Grenache, Malvasia Bianca, Marsanne, Monastrell, Montepulciano, Petit Manseng, Petit Verdot, Syrah, Tannat, Tempranillo, Teroldego, Vermentino, and Vranac.",
  "salvatore-vineyards-tasting-room":
    "Salvatore Vineyards is named after the grandfather of our winemaker, Jason Domanico. Following in his grandfather's footsteps, the Salvatore brand represents the highest quality wines we produce using the best grapes and barrels possible.\n\nSalvatore can best be described as small batch, meticulously made wines. Our wines are created with the utmost care and patience. Many of these special wines are comprised of a single barrel.\n\nThe Domanico family has its roots in Sicily and Calabria, Italy. The crest on the bottle is a combination of both of those regions. The woman's face with the three legs is from the Sicilian crest. We replaced the traditional wheat stalks around her face with grape clusters. The two crosses are from the crest of Calabria. We also chose to note the name or variety of the wine in the same red shade that is used on our Passion Cellars labels.",
  "ldv-winery-tasting-room":
    "From transforming cities to nurturing grapes, serendipity describes the LDV Winery evolution. As professional community and strategic planners, LDV owners Peggy Fiandaca and Curt Dunham made a career assisting clients in creating successful plans.\n\nA strong game plan is vital in any industry, but more importantly, success results from responding to possibilities. That life journey of possibilities is what led Fiandaca and Dunham to develop a vineyard in southeastern Arizona that is now producing distinctive, hand-crafted wines.\n\nThe initials L and D represent our family names, Lawrence and Dunham. The V denotes our vineyard.\n\nFiandaca and Dunham, long-time wine collectors, found the magic of the \"grape to glass\" journey intriguing. From wine collecting and thinking about retirement, to finding the perfect land in Arizona's Chiricahua Mountains, our vineyard and winemaking adventure began in the most serendipitous way.",
};

function applyOverrides(winery: Winery): Winery {
  const next = { ...winery };
  const descriptionOverride = WINERY_DESCRIPTION_OVERRIDES[winery.slug];
  if (descriptionOverride) {
    next.description = descriptionOverride;
  }
  if (!next.hero_image_url) {
    next.hero_image_url = `/images/wineries/${winery.slug}.jpg`;
  }
  const locationOverride = WINERY_LOCATION_OVERRIDES[winery.slug];
  if (locationOverride) {
    next.lat = locationOverride.lat;
    next.lng = locationOverride.lng;
    next.address = locationOverride.address;
    next.city = locationOverride.city;
    next.state = locationOverride.state;
    next.zip = locationOverride.zip;
  }
  return next;
}

function filterAndDecorate(wineries: Winery[]): Winery[] {
  return wineries
    .filter((w) => !EXCLUDED_SLUGS.has(w.slug))
    .map(applyOverrides);
}

export async function getWineries(): Promise<Winery[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wineries")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return filterAndDecorate((data ?? []) as Winery[]);
}

export async function getFeaturedWineries(limit = 3): Promise<Winery[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wineries")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return filterAndDecorate((data ?? []) as Winery[]).slice(0, limit);
}

export async function getWineryBySlug(slug: string): Promise<Winery | null> {
  if (EXCLUDED_SLUGS.has(slug)) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wineries")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return applyOverrides(data as Winery);
}
