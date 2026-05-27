import { createClient } from "@/lib/supabase/server";
import type { WineryEvent } from "@swt/shared";

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

export async function getEvents(): Promise<WineryEvent[]> {
  const supabase = await createClient();
  const [{ data, error }, excludedIds] = await Promise.all([
    supabase.from("events").select("*").order("start_date", { ascending: true }),
    getExcludedWineryIds(supabase),
  ]);

  if (error) throw error;
  return ((data ?? []) as WineryEvent[]).filter(
    (e) => !excludedIds.has(e.winery_id)
  );
}

export async function getUpcomingEvents(limit = 3): Promise<WineryEvent[]> {
  const supabase = await createClient();
  const [{ data, error }, excludedIds] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .gte("start_date", new Date().toISOString())
      .order("start_date", { ascending: true }),
    getExcludedWineryIds(supabase),
  ]);

  if (error) throw error;
  return ((data ?? []) as WineryEvent[])
    .filter((e) => !excludedIds.has(e.winery_id))
    .slice(0, limit);
}

export async function getUpcomingEventsByWinery(
  wineryId: string,
  limit = 6
): Promise<WineryEvent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("winery_id", wineryId)
    .gte("start_date", new Date().toISOString())
    .order("start_date", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as WineryEvent[];
}
