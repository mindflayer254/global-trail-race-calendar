import { createDuplicateKey } from "@/backend/race-utils";
import type { BackendRace } from "@/backend/race-model";

export const REQUIRED_REVIEW_FIELDS: Array<keyof BackendRace> = [
  "raceName",
  "country",
  "region",
  "city",
  "raceDate",
  "registrationOpenDate",
  "registrationCloseDate",
  "organizer",
  "officialWebsite",
  "registrationUrl",
  "sourceUrl",
  "sourceName",
  "lastCheckedAt",
];

export function getMissingRaceFields(race: BackendRace) {
  const missingFields = REQUIRED_REVIEW_FIELDS.filter((field) => {
    const value = race[field];
    return typeof value === "string" && value.trim().length === 0;
  });

  if (race.distances.length === 0) {
    missingFields.push("distances");
  }

  if (race.languages.length === 0) {
    missingFields.push("languages");
  }

  return missingFields;
}

export function getDuplicateReviewKeys(races: BackendRace[]) {
  const counts = new Map<string, number>();

  races.forEach((race) => {
    const key = createDuplicateKey(race);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return counts;
}

export function isDuplicateCandidate(race: BackendRace, races: BackendRace[]) {
  return (getDuplicateReviewKeys(races).get(createDuplicateKey(race)) ?? 0) > 1;
}

export function mergeRaceRecords(primary: BackendRace, duplicate: BackendRace): BackendRace {
  const sourceUrls = new Set(primary.sources.map((source) => source.sourceUrl));
  const mergedSources = [
    ...primary.sources,
    ...duplicate.sources.filter((source) => !sourceUrls.has(source.sourceUrl)),
  ];

  return {
    ...primary,
    distances: primary.distances.length > 0 ? primary.distances : duplicate.distances,
    registrationUrl: primary.registrationUrl || duplicate.registrationUrl,
    officialWebsite: primary.officialWebsite || duplicate.officialWebsite,
    notes: [primary.notes, `Merged duplicate record ${duplicate.id}.`, duplicate.notes]
      .filter(Boolean)
      .join(" "),
    sources: mergedSources,
    lastUpdatedAt: new Date().toISOString(),
  };
}
