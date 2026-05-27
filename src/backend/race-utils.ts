import type {
  BackendRace,
  BackendRaceDistance,
  BackendRaceSource,
  DuplicateRaceMatch,
  RaceImportInput,
  RaceImportResult,
} from "@/backend/race-model";

export function normalizeRaceName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(the|race|run|trail|ultra)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeCountry(country: string) {
  return country.trim().toLowerCase().replace(/\s+/g, " ");
}

export function normalizeDate(date: string) {
  return toSafeIsoDate(date).slice(0, 10);
}

export function createDuplicateKey(input: Pick<BackendRace, "raceName" | "country" | "raceDate">) {
  return [
    normalizeRaceName(input.raceName),
    normalizeCountry(input.country),
    normalizeDate(input.raceDate),
  ].join("|");
}

export function createSlug(raceName: string, country: string, raceDate: string) {
  const year = normalizeDate(raceDate).slice(0, 4);
  const base = `${raceName}-${country}-${year}`
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base || `race-${year}`;
}

export function getPrimarySource(sources: BackendRaceSource[]) {
  const primary = sources[0];

  if (!primary) {
    throw new Error("Imported race must include at least one source.");
  }

  return primary;
}

export function calculateElevationGain(distances: BackendRaceDistance[]) {
  return distances.reduce((maxGain, distance) => Math.max(maxGain, distance.elevationGain), 0);
}

export function clampConfidenceScore(score: number) {
  if (Number.isNaN(score)) {
    return 0;
  }

  return Math.min(1, Math.max(0, score));
}

export function findDuplicateRace(
  candidate: Pick<BackendRace, "id" | "raceName" | "country" | "raceDate">,
  existingRaces: BackendRace[],
): DuplicateRaceMatch[] {
  const candidateKey = createDuplicateKey(candidate);

  return existingRaces
    .filter((race) => race.id !== candidate.id && createDuplicateKey(race) === candidateKey)
    .map((race) => ({
      candidateId: candidate.id,
      existingId: race.id,
      duplicateKey: candidateKey,
      reason: "name-country-date",
    }));
}

export function findDuplicateGroups(races: BackendRace[]) {
  const groups = new Map<string, BackendRace[]>();

  races.forEach((race) => {
    const key = createDuplicateKey(race);
    groups.set(key, [...(groups.get(key) ?? []), race]);
  });

  return Array.from(groups.entries())
    .filter(([, group]) => group.length > 1)
    .map(([duplicateKey, group]) => ({ duplicateKey, races: group }));
}

export function createImportedRace(input: RaceImportInput, existingRaces: BackendRace[] = []): RaceImportResult {
  const now = new Date().toISOString();
  const primarySource = getPrimarySource(input.sources);
  const race: BackendRace = {
    ...input,
    id: input.id ?? createRaceId(input.raceName, input.country, input.raceDate),
    slug: input.slug ?? createSlug(input.raceName, input.country, input.raceDate),
    elevationGain: calculateElevationGain(input.distances),
    sourceUrl: input.sourceUrl ?? primarySource.sourceUrl,
    sourceName: input.sourceName ?? primarySource.sourceName,
    sourceType: input.sourceType ?? primarySource.sourceType,
    lastCheckedAt: input.lastCheckedAt ?? primarySource.lastCheckedAt ?? now,
    lastUpdatedAt: input.lastUpdatedAt ?? now,
    verificationStatus: "pending",
    dataConfidenceScore: clampConfidenceScore(input.dataConfidenceScore ?? 0.5),
  };

  return {
    race,
    duplicateMatches: findDuplicateRace(race, existingRaces),
    shouldPublish: false,
  };
}

export function getPublishableRaces(races: BackendRace[]) {
  return races.filter((race) => race.verificationStatus === "verified");
}

function createRaceId(raceName: string, country: string, raceDate: string) {
  return createSlug(raceName, country, raceDate);
}

function toSafeIsoDate(value: string | Date | null | undefined, fallback = new Date()) {
  if (!value) {
    return fallback.toISOString();
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback.toISOString();
  }

  return date.toISOString();
}
