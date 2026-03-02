-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Wineries
create table if not exists wineries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  address     text not null default '',
  city        text not null default '',
  state       text not null default 'AZ',
  zip         text not null default '',
  lat         numeric(10, 7),
  lng         numeric(10, 7),
  description text not null default '',
  hero_image_url text,
  phone       text,
  website     text,
  hours_json  jsonb,
  tags        text[] not null default '{}',
  created_at  timestamptz not null default now()
);

-- Events
create table if not exists events (
  id          uuid primary key default gen_random_uuid(),
  winery_id   uuid not null references wineries(id) on delete cascade,
  title       text not null,
  description text not null default '',
  start_date  timestamptz not null,
  end_date    timestamptz,
  type        text not null default 'other'
    check (type in ('educational','festival','tasting','tour','other'))
);

-- Wines
create table if not exists wines (
  id          uuid primary key default gen_random_uuid(),
  winery_id   uuid not null references wineries(id) on delete cascade,
  name        text not null,
  varietal    text not null default '',
  price       numeric(8, 2),
  available   boolean not null default true
);

-- Row Level Security (allow read-only for anon)
alter table wineries enable row level security;
alter table events enable row level security;
alter table wines enable row level security;

create policy "Public read wineries" on wineries for select using (true);
create policy "Public read events"   on events   for select using (true);
create policy "Public read wines"    on wines     for select using (true);
