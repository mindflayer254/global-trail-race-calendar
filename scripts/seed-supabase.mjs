import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const races = [
  {
    id: "verified-utmb-mont-blanc-2026",
    race_name: "UTMB Mont-Blanc",
    slug: "utmb-mont-blanc-2026",
    country: "France",
    region: "Europe",
    city: "Chamonix",
    race_date: "2026-08-28",
    registration_open_date: "2026-01-09",
    registration_close_date: "2026-01-22",
    elevation_gain: 9963,
    organizer: "UTMB Group",
    official_website: "https://example.com/utmb-mont-blanc",
    registration_url: "https://example.com/utmb-mont-blanc/register",
    source_url: "https://example.com/utmb-mont-blanc/race-info",
    source_name: "Official race page",
    source_type: "official",
    last_checked_at: "2026-05-27T00:10:00+08:00",
    last_updated_at: "2026-05-27T00:10:00+08:00",
    verification_status: "verified",
    data_confidence_score: 0.96,
    languages: [{ locale: "en", isPrimary: true }, { locale: "fr" }],
    notes: "Verified seed record for the public calendar.",
  },
  {
    id: "verified-transgrancanaria-2026",
    race_name: "Transgrancanaria",
    slug: "transgrancanaria-2026",
    country: "Spain",
    region: "Europe",
    city: "Las Palmas",
    race_date: "2026-02-20",
    registration_open_date: "2025-06-05",
    registration_close_date: "2026-01-18",
    elevation_gain: 6800,
    organizer: "Arista Eventos",
    official_website: "https://example.com/transgrancanaria",
    registration_url: "https://example.com/transgrancanaria/register",
    source_url: "https://example.com/transgrancanaria/program",
    source_name: "Official race page",
    source_type: "official",
    last_checked_at: "2026-05-27T00:15:00+08:00",
    last_updated_at: "2026-05-27T00:15:00+08:00",
    verification_status: "verified",
    data_confidence_score: 0.9,
    languages: [{ locale: "en", isPrimary: true }, { locale: "es" }],
    notes: "Verified seed record for the public calendar.",
  },
  {
    id: "pending-val-daran-2026",
    race_name: "Val d'Aran by UTMB",
    slug: "val-daran-by-utmb-spain-2026",
    country: "Spain",
    region: "Europe",
    city: "Vielha",
    race_date: "2026-07-03",
    registration_open_date: "2026-01-15",
    registration_close_date: "2026-06-01",
    elevation_gain: 6400,
    organizer: "UTMB Group",
    official_website: "https://example.com/val-daran",
    registration_url: "https://example.com/val-daran/register",
    source_url: "https://example.com/val-daran/source",
    source_name: "Ahotu Trail Running Calendar",
    source_type: "scraper",
    last_checked_at: "2026-05-27T00:20:00+08:00",
    last_updated_at: "2026-05-27T00:20:00+08:00",
    verification_status: "pending",
    data_confidence_score: 0.76,
    languages: [{ locale: "en", isPrimary: true }],
    notes: "Pending imported seed record.",
  },
  {
    id: "rejected-fake-alpine-2026",
    race_name: "Fake Alpine Trail",
    slug: "fake-alpine-trail-france-2026",
    country: "France",
    region: "Europe",
    city: "Unknown",
    race_date: "2026-09-01",
    registration_open_date: null,
    registration_close_date: null,
    elevation_gain: 0,
    organizer: "",
    official_website: "",
    registration_url: "",
    source_url: "https://example.com/rejected-source",
    source_name: "Rejected seed source",
    source_type: "scraper",
    last_checked_at: "2026-05-27T00:25:00+08:00",
    last_updated_at: "2026-05-27T00:25:00+08:00",
    verification_status: "rejected",
    data_confidence_score: 0.1,
    languages: [{ locale: "en", isPrimary: true }],
    notes: "Rejected seed record. Must never appear publicly.",
  },
];

const distances = [
  { id: "utmb-171", race_id: "verified-utmb-mont-blanc-2026", label: "UTMB", distance_km: 171, elevation_gain: 9963 },
  { id: "utmb-101", race_id: "verified-utmb-mont-blanc-2026", label: "CCC", distance_km: 101, elevation_gain: 6050 },
  { id: "utmb-57", race_id: "verified-utmb-mont-blanc-2026", label: "OCC", distance_km: 57, elevation_gain: 3500 },
  { id: "tgc-126", race_id: "verified-transgrancanaria-2026", label: "Classic", distance_km: 126, elevation_gain: 6800 },
  { id: "tgc-84", race_id: "verified-transgrancanaria-2026", label: "Advanced", distance_km: 84, elevation_gain: 4800 },
  { id: "tgc-46", race_id: "verified-transgrancanaria-2026", label: "Marathon", distance_km: 46, elevation_gain: 1900 },
  { id: "vda-110", race_id: "pending-val-daran-2026", label: "VDA 110K", distance_km: 110, elevation_gain: 6400 },
  { id: "vda-55", race_id: "pending-val-daran-2026", label: "PDA 55K", distance_km: 55, elevation_gain: 3300 },
];

const { error: raceError } = await supabase.from("races").upsert(races, { onConflict: "id" });

if (raceError) {
  console.error(raceError.message);
  process.exit(1);
}

const { error: distanceError } = await supabase
  .from("race_distances")
  .upsert(distances, { onConflict: "id" });

if (distanceError) {
  console.error(distanceError.message);
  process.exit(1);
}

console.log(`Seeded ${races.length} races and ${distances.length} race distances.`);
