import { createClient } from "@/lib/supabase/server";
import type { WineryEvent } from "@swt/shared";

export async function getEvents(): Promise<WineryEvent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("start_date", { ascending: true });

  if (error) throw error;
  return (data ?? []) as WineryEvent[];
}

export async function getUpcomingEvents(limit = 3): Promise<WineryEvent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("start_date", new Date().toISOString())
    .order("start_date", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as WineryEvent[];
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
