-- Global Trail Race Finder Supabase setup
-- Safe to run more than once in the Supabase SQL editor.

create table if not exists public.races (
  id text primary key,
  slug text not null unique,
  race_name text not null,
  country text not null,
  region text not null,
  city text not null,
  race_date date not null,
  registration_open_date date,
  registration_close_date date,
  organizer text not null default '',
  official_website text not null default '',
  registration_url text not null default '',
  source_url text not null default '',
  verification_status text not null default 'pending'
    check (verification_status in ('pending', 'verified', 'rejected')),
  data_confidence_score numeric not null default 0
    check (data_confidence_score >= 0 and data_confidence_score <= 1),
  languages jsonb not null default '[]'::jsonb,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.race_distances (
  id text primary key,
  race_id text not null references public.races(id) on delete cascade,
  category_name text,
  distance_km numeric not null default 0,
  elevation_gain_m integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.race_sources (
  id text primary key,
  race_id text not null references public.races(id) on delete cascade,
  source_name text not null default '',
  source_url text not null default '',
  last_checked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Compatibility for earlier local drafts of this schema.
alter table public.races add column if not exists data_confidence_score numeric not null default 0;
alter table public.races add column if not exists languages jsonb not null default '[]'::jsonb;
alter table public.races add column if not exists notes text not null default '';

alter table public.race_distances add column if not exists category_name text;
alter table public.race_distances add column if not exists elevation_gain_m integer;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'race_distances'
      and column_name = 'label'
  ) then
    execute 'update public.race_distances set category_name = coalesce(category_name, label)';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'race_distances'
      and column_name = 'elevation_gain'
  ) then
    execute 'update public.race_distances set elevation_gain_m = coalesce(elevation_gain_m, elevation_gain)';
  end if;
end $$;

update public.race_distances
set category_name = coalesce(category_name, 'Race distance'),
    elevation_gain_m = coalesce(elevation_gain_m, 0);

alter table public.race_distances alter column category_name set not null;
alter table public.race_distances alter column elevation_gain_m set not null;

create index if not exists races_verification_status_idx on public.races (verification_status);
create index if not exists races_slug_idx on public.races (slug);
create index if not exists races_country_date_idx on public.races (country, race_date);
create index if not exists race_distances_race_id_idx on public.race_distances (race_id);
create index if not exists race_sources_race_id_idx on public.race_sources (race_id);

alter table public.races enable row level security;
alter table public.race_distances enable row level security;
alter table public.race_sources enable row level security;

drop policy if exists "Public can read verified races" on public.races;
create policy "Public can read verified races"
  on public.races
  for select
  using (verification_status = 'verified');

drop policy if exists "Public can read distances for verified races" on public.race_distances;
create policy "Public can read distances for verified races"
  on public.race_distances
  for select
  using (
    exists (
      select 1
      from public.races
      where races.id = race_distances.race_id
        and races.verification_status = 'verified'
    )
  );

drop policy if exists "Public can read sources for verified races" on public.race_sources;
create policy "Public can read sources for verified races"
  on public.race_sources
  for select
  using (
    exists (
      select 1
      from public.races
      where races.id = race_sources.race_id
        and races.verification_status = 'verified'
    )
  );
