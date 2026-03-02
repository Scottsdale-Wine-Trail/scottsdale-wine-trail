import { createClient } from "./server";
import type { Winery, WineryEvent, Wine } from "@swt/shared";

export async function getWineries(): Promise<Winery[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wineries")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getWineryBySlug(slug: string): Promise<Winery | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wineries")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}

export async function getFeaturedWineries(limit = 3): Promise<Winery[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wineries")
    .select("*")
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getEvents(): Promise<WineryEvent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("start_date");
  if (error) throw error;
  return data ?? [];
}

export async function getUpcomingEvents(limit = 3): Promise<WineryEvent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("start_date", new Date().toISOString())
    .order("start_date")
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getWines(): Promise<Wine[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wines")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}
