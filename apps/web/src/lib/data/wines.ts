import { createClient } from "@/lib/supabase/server";
import type { Wine } from "@swt/shared";

export async function getWines(): Promise<Wine[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wines")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Wine[];
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
