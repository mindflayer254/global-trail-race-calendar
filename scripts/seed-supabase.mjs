import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const mockRacePath = join(rootDir, "src", "data", "races.json");
const mockRaces = JSON.parse(await readFile(mockRacePath, "utf8"));

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const checkedAt = new Date().toISOString();

const races = mockRaces.map((race) => ({
  id: race.slug,
  slug: race.slug,
  race_name: race.name,
  country: race.country,
  region: race.region,
  city: race.city,
  race_date: race.date,
  registration_open_date: race.registrationOpenDate || null,
  registration_close_date: race.registrationCloseDate || null,
  organizer: race.organizer,
  official_website: race.officialWebsite,
  registration_url: race.registrationUrl,
  source_url: race.sourceUrl,
  verification_status: "verified",
  data_confidence_score: 0.9,
  languages: [{ locale: "en", isPrimary: true }],
  notes: race.description,
  updated_at: race.lastUpdated,
}));

const distances = mockRaces.flatMap((race) =>
  race.distances.map((distance, index) => ({
    id: `${race.slug}-${index + 1}`,
    race_id: race.slug,
    category_name: distance.label,
    distance_km: distance.distanceKm,
    elevation_gain_m: distance.elevationGainM,
  })),
);

const sources = mockRaces.map((race) => ({
  id: `${race.slug}-official-source`,
  race_id: race.slug,
  source_name: "Official race page",
  source_url: race.sourceUrl,
  last_checked_at: checkedAt,
}));

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

const { error: sourceError } = await supabase
  .from("race_sources")
  .upsert(sources, { onConflict: "id" });

if (sourceError) {
  console.error(sourceError.message);
  process.exit(1);
}

console.log(
  `Seeded ${races.length} races, ${distances.length} race distances, and ${sources.length} race sources.`,
);
