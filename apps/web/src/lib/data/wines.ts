import { createClient } from "@/lib/supabase/server";
import type { Wine } from "@swt/shared";

const EXCLUDED_WINERY_SLUGS = new Set(["arizona-stronghold-vineyards"]);

async function getExcludedWineryIds(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<Set<string>> {
  if (EXCLUDED_WINERY_SLUGS.size === 0) return new Set();
  const { data } = await supabase
    .from("wineries")
    .select("id, slug")
    .in("slug", Array.from(EXCLUDED_WINERY_SLUGS));
  return new Set((data ?? []).map((w: { id: string }) => w.id));
}

export async function getWines(): Promise<Wine[]> {
  const supabase = await createClient();
  const [{ data, error }, excludedIds] = await Promise.all([
    supabase.from("wines").select("*").order("name", { ascending: true }),
    getExcludedWineryIds(supabase),
  ]);

  if (error) throw error;
  return ((data ?? []) as Wine[]).filter((w) => !excludedIds.has(w.winery_id));
}

export async function getWinesByWinery(wineryId: string): Promise<Wine[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wines")
    .select("*")
    .eq("winery_id", wineryId)
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Wine[];
}
