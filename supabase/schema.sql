create table if not exists public.races (
  id text primary key,
  race_name text not null,
  slug text not null unique,
  country text not null,
  region text not null,
  city text not null,
  race_date date not null,
  registration_open_date date,
  registration_close_date date,
  elevation_gain integer not null default 0,
  organizer text not null default '',
  official_website text not null default '',
  registration_url text not null default '',
  source_url text not null default '',
  source_name text not null default '',
  source_type text not null default 'manual',
  last_checked_at timestamptz not null default now(),
  last_updated_at timestamptz not null default now(),
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
  label text not null,
  distance_km numeric not null default 0,
  elevation_gain integer not null default 0,
  start_time timestamptz,
  cutoff_hours numeric,
  registration_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists races_verification_status_idx on public.races (verification_status);
create index if not exists races_slug_idx on public.races (slug);
create index if not exists races_country_date_idx on public.races (country, race_date);
create index if not exists race_distances_race_id_idx on public.race_distances (race_id);

alter table public.races enable row level security;
alter table public.race_distances enable row level security;

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
