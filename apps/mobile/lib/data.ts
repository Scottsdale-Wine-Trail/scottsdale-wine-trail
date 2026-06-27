import { supabase } from "@/lib/supabase";
import { sortByTrail } from "@/lib/trail";
import { STAMP_CODE } from "@/lib/constants";
import type { PassportStamp } from "@/lib/types";
import type { Winery, Wine, WineryEvent } from "@swt/shared";

/** All participating wineries, ordered along the trail. */
export async function getWineries(): Promise<Winery[]> {
  const { data, error } = await supabase.from("wineries").select("*");
  if (error) throw error;
  return sortByTrail((data ?? []) as unknown as Winery[]);
}

export async function getWineryBySlug(slug: string): Promise<Winery | null> {
  const { data, error } = await supabase
    .from("wineries")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return data as unknown as Winery;
}

export async function getWinesByWinery(wineryId: string): Promise<Wine[]> {
  const { data, error } = await supabase
    .from("wines")
    .select("*")
    .eq("winery_id", wineryId)
    .order("available", { ascending: false })
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as Wine[];
}

export async function getUpcomingEventsByWinery(
  wineryId: string
): Promise<WineryEvent[]> {
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("winery_id", wineryId)
    .gte("start_date", nowIso)
    .order("start_date", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as WineryEvent[];
}

/** The current user's collected stamps. */
export async function getStamps(userId: string): Promise<PassportStamp[]> {
  const { data, error } = await supabase
    .from("passport_stamps")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as PassportStamp[];
}

/**
 * MVP code check. Case-insensitive match against the shared employee code.
 *
 * NOTE: this is a client-side UX gate ONLY — it is not a security boundary.
 * The code never reaches the server, and RLS lets an authenticated user insert
 * their own stamps directly. Swap this for per-winery codes or a signed QR
 * payload validated by a SECURITY DEFINER rpc / Edge Function before relying on
 * passport completion for real rewards. See the passport_stamps migration.
 */
export function verifyStampCode(code: string): boolean {
  return code.trim().toUpperCase() === STAMP_CODE.toUpperCase();
}

export type AddStampResult =
  | { ok: true; alreadyStamped: boolean }
  | { ok: false; error: string };

/** Insert a stamp for (user, winery). Treats the unique-constraint hit as "already collected". */
export async function addStamp(
  userId: string,
  wineryId: string
): Promise<AddStampResult> {
  const { error } = await supabase
    .from("passport_stamps")
    .insert({ user_id: userId, winery_id: wineryId });

  if (error) {
    // 23505 = unique_violation → the stamp already exists, which is fine.
    if (error.code === "23505") return { ok: true, alreadyStamped: true };
    return { ok: false, error: error.message };
  }
  return { ok: true, alreadyStamped: false };
}
