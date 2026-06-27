-- Digital Passport stamps. One row per (user, winery) a guest has visited.
--
-- MVP SECURITY NOTE: stamping is gated only by a shared, client-side employee
-- code (EXPO_PUBLIC_STAMP_CODE). The INSERT policy below intentionally lets an
-- authenticated user write their OWN stamp for ANY winery — it is NOT an
-- anti-fraud boundary, just enough for a demo. Before relying on passport
-- completion for real rewards/discounts, move issuance server-side: a
-- SECURITY DEFINER rpc or Edge Function that validates a per-winery secret (or
-- a short-lived signed QR token), then drop this direct client INSERT policy.
create extension if not exists "pgcrypto";

create table if not exists public.passport_stamps (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  winery_id  uuid not null references public.wineries(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, winery_id)
);

create index if not exists passport_stamps_user_id_idx
  on public.passport_stamps (user_id);

alter table public.passport_stamps enable row level security;

-- Authenticated users may read only their own stamps.
drop policy if exists "Users read own stamps" on public.passport_stamps;
create policy "Users read own stamps"
  on public.passport_stamps
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Authenticated users may insert only stamps for themselves.
-- (No public/anon insert: the `to authenticated` clause excludes anon.)
drop policy if exists "Users insert own stamps" on public.passport_stamps;
create policy "Users insert own stamps"
  on public.passport_stamps
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Authenticated users may remove their own stamps (e.g. an accidental stamp).
drop policy if exists "Users delete own stamps" on public.passport_stamps;
create policy "Users delete own stamps"
  on public.passport_stamps
  for delete
  to authenticated
  using (auth.uid() = user_id);
