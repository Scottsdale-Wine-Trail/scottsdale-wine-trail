import { createClient } from "@/lib/supabase/server";
import type { Winery } from "@swt/shared";

export async function getWineries(): Promise<Winery[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wineries")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Winery[];
}

export async function getFeaturedWineries(limit = 3): Promise<Winery[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wineries")
    .select("*")
    .order("name", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as Winery[];
}

export async function getWineryBySlug(slug: string): Promise<Winery | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wineries")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return (data as Winery | null) ?? null;
}
