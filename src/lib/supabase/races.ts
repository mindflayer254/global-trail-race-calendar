import type { BackendRace, BackendRaceDistance, RaceLanguage, RaceSourceType } from "@/backend/race-model";
import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type RaceRow = Database["public"]["Tables"]["races"]["Row"];
type DistanceRow = Database["public"]["Tables"]["race_distances"]["Row"];
type SourceRow = Database["public"]["Tables"]["race_sources"]["Row"];
type RaceWithDistances = RaceRow & {
  race_distances: DistanceRow[];
  race_sources?: SourceRow[];
};

export type RaceQueryResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };

export async function getVerifiedRaceRecords(): Promise<RaceQueryResult<BackendRace[]>> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("races")
      .select("*, race_distances(*), race_sources(*)")
      .eq("verification_status", "verified")
      .order("race_date", { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: (data ?? []).map(toBackendRace), error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Failed to load races." };
  }
}

export async function getVerifiedRaceRecordBySlug(slug: string): Promise<RaceQueryResult<BackendRace | undefined>> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("races")
      .select("*, race_distances(*), race_sources(*)")
      .eq("verification_status", "verified")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data ? toBackendRace(data) : undefined, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Failed to load race." };
  }
}

export async function getPendingRaceRecords(): Promise<RaceQueryResult<BackendRace[]>> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("races")
      .select("*, race_distances(*), race_sources(*)")
      .eq("verification_status", "pending")
      .order("updated_at", { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: (data ?? []).map(toBackendRace), error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Failed to load pending races." };
  }
}

export async function updateRaceVerificationStatus(id: string, status: BackendRace["verificationStatus"]) {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("races")
      .update({
        verification_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*, race_distances(*), race_sources(*)")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: toBackendRace(data), error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Failed to update race." };
  }
}

export async function updateRaceRecord(id: string, patch: Partial<BackendRace>) {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("races")
      .update({
        race_name: patch.raceName,
        country: patch.country,
        region: patch.region,
        city: patch.city,
        race_date: patch.raceDate,
        registration_open_date: patch.registrationOpenDate || null,
        registration_close_date: patch.registrationCloseDate || null,
        organizer: patch.organizer,
        official_website: patch.officialWebsite,
        registration_url: patch.registrationUrl,
        notes: patch.notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*, race_distances(*), race_sources(*)")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: toBackendRace(data), error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Failed to update race." };
  }
}

export async function addPendingRaceRecords(races: BackendRace[]) {
  try {
    const supabase = getSupabaseAdminClient();
    const raceRows = races.map(toRaceInsert);
    const distanceRows = races.flatMap((race) => race.distances.map((distance) => toDistanceInsert(race.id, distance)));
    const sourceRows = races.flatMap(toSourceInserts);

    const { error: raceError } = await supabase.from("races").upsert(raceRows, { onConflict: "id" });

    if (raceError) {
      return { data: null, error: raceError.message };
    }

    if (distanceRows.length > 0) {
      const { error: distanceError } = await supabase
        .from("race_distances")
        .upsert(distanceRows, { onConflict: "id" });

      if (distanceError) {
        return { data: null, error: distanceError.message };
      }
    }

    if (sourceRows.length > 0) {
      const { error: sourceError } = await supabase
        .from("race_sources")
        .upsert(sourceRows, { onConflict: "id" });

      if (sourceError) {
        return { data: null, error: sourceError.message };
      }
    }

    return { data: { importedCount: races.length }, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Failed to import races." };
  }
}

function toBackendRace(row: RaceWithDistances): BackendRace {
  const distances = row.race_distances.map(toBackendDistance);
  const sources = (row.race_sources ?? []).map((source) => ({
    id: source.id,
    sourceUrl: source.source_url,
    sourceName: source.source_name,
    sourceType: "manual" as RaceSourceType,
    lastCheckedAt: source.last_checked_at,
    confidenceScore: row.data_confidence_score,
  }));
  const primarySource = sources[0] ?? {
    id: `${row.id}-source`,
    sourceUrl: row.source_url,
    sourceName: "Primary source",
    sourceType: "manual" as RaceSourceType,
    lastCheckedAt: row.updated_at,
    confidenceScore: row.data_confidence_score,
  };
  const elevationGain = distances.reduce(
    (maxGain, distance) => Math.max(maxGain, distance.elevationGain),
    0,
  );

  return {
    id: row.id,
    raceName: row.race_name,
    slug: row.slug,
    country: row.country,
    region: row.region,
    city: row.city,
    raceDate: row.race_date,
    registrationOpenDate: row.registration_open_date ?? "",
    registrationCloseDate: row.registration_close_date ?? "",
    distances,
    elevationGain,
    organizer: row.organizer,
    officialWebsite: row.official_website,
    registrationUrl: row.registration_url,
    sourceUrl: row.source_url,
    sourceName: primarySource.sourceName,
    sourceType: primarySource.sourceType,
    sources: sources.length > 0 ? sources : [primarySource],
    lastCheckedAt: primarySource.lastCheckedAt,
    lastUpdatedAt: row.updated_at,
    verificationStatus: row.verification_status,
    dataConfidenceScore: row.data_confidence_score,
    languages: parseLanguages(row.languages),
    notes: row.notes,
  };
}

function toBackendDistance(row: DistanceRow): BackendRaceDistance {
  return {
    id: row.id,
    label: row.category_name,
    distanceKm: row.distance_km,
    elevationGain: row.elevation_gain_m,
  };
}

function toRaceInsert(race: BackendRace): Database["public"]["Tables"]["races"]["Insert"] {
  return {
    id: race.id,
    race_name: race.raceName,
    slug: race.slug,
    country: race.country,
    region: race.region,
    city: race.city,
    race_date: race.raceDate,
    registration_open_date: race.registrationOpenDate || null,
    registration_close_date: race.registrationCloseDate || null,
    organizer: race.organizer,
    official_website: race.officialWebsite,
    registration_url: race.registrationUrl,
    source_url: race.sourceUrl,
    verification_status: "pending",
    data_confidence_score: race.dataConfidenceScore,
    languages: race.languages,
    notes: race.notes,
  };
}

function toDistanceInsert(
  raceId: string,
  distance: BackendRaceDistance,
): Database["public"]["Tables"]["race_distances"]["Insert"] {
  return {
    id: distance.id,
    race_id: raceId,
    category_name: distance.label,
    distance_km: distance.distanceKm,
    elevation_gain_m: distance.elevationGain,
  };
}

function toSourceInserts(race: BackendRace): Database["public"]["Tables"]["race_sources"]["Insert"][] {
  const sources =
    race.sources.length > 0
      ? race.sources
      : [
          {
            id: `${race.id}-source`,
            sourceUrl: race.sourceUrl,
            sourceName: race.sourceName,
            sourceType: race.sourceType,
            lastCheckedAt: race.lastCheckedAt,
          },
        ];

  return sources.map((source) => ({
    id: source.id,
    race_id: race.id,
    source_name: source.sourceName,
    source_url: source.sourceUrl,
    last_checked_at: source.lastCheckedAt,
  }));
}

function parseLanguages(value: unknown): RaceLanguage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is RaceLanguage =>
      typeof item === "object" &&
      item !== null &&
      "locale" in item &&
      typeof (item as RaceLanguage).locale === "string",
  );
}
