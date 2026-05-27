import type { BackendRace, BackendRaceDistance, RaceLanguage, RaceSourceType } from "@/backend/race-model";
import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type RaceRow = Database["public"]["Tables"]["races"]["Row"];
type DistanceRow = Database["public"]["Tables"]["race_distances"]["Row"];
type RaceWithDistances = RaceRow & {
  race_distances: DistanceRow[];
};

export type RaceQueryResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };

export async function getVerifiedRaceRecords(): Promise<RaceQueryResult<BackendRace[]>> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("races")
      .select("*, race_distances(*)")
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
      .select("*, race_distances(*)")
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
      .select("*, race_distances(*)")
      .eq("verification_status", "pending")
      .order("last_checked_at", { ascending: false });

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
        last_updated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*, race_distances(*)")
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
        last_updated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*, race_distances(*)")
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

    return { data: { importedCount: races.length }, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Failed to import races." };
  }
}

function toBackendRace(row: RaceWithDistances): BackendRace {
  const distances = row.race_distances.map(toBackendDistance);

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
    elevationGain: row.elevation_gain,
    organizer: row.organizer,
    officialWebsite: row.official_website,
    registrationUrl: row.registration_url,
    sourceUrl: row.source_url,
    sourceName: row.source_name,
    sourceType: row.source_type as RaceSourceType,
    sources: [
      {
        id: `${row.id}-source`,
        sourceUrl: row.source_url,
        sourceName: row.source_name,
        sourceType: row.source_type as RaceSourceType,
        lastCheckedAt: row.last_checked_at,
        confidenceScore: row.data_confidence_score,
      },
    ],
    lastCheckedAt: row.last_checked_at,
    lastUpdatedAt: row.last_updated_at,
    verificationStatus: row.verification_status,
    dataConfidenceScore: row.data_confidence_score,
    languages: parseLanguages(row.languages),
    notes: row.notes,
  };
}

function toBackendDistance(row: DistanceRow): BackendRaceDistance {
  return {
    id: row.id,
    label: row.label,
    distanceKm: row.distance_km,
    elevationGain: row.elevation_gain,
    startTime: row.start_time ?? undefined,
    cutoffHours: row.cutoff_hours ?? undefined,
    registrationUrl: row.registration_url ?? undefined,
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
    elevation_gain: race.elevationGain,
    organizer: race.organizer,
    official_website: race.officialWebsite,
    registration_url: race.registrationUrl,
    source_url: race.sourceUrl,
    source_name: race.sourceName,
    source_type: race.sourceType,
    last_checked_at: race.lastCheckedAt,
    last_updated_at: race.lastUpdatedAt,
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
    label: distance.label,
    distance_km: distance.distanceKm,
    elevation_gain: distance.elevationGain,
    start_time: distance.startTime ?? null,
    cutoff_hours: distance.cutoffHours ?? null,
    registration_url: distance.registrationUrl ?? null,
  };
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
