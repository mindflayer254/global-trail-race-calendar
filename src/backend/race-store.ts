import { mergeRaceRecords } from "@/backend/admin-review";
import { createDuplicateKey } from "@/backend/race-utils";
import type { BackendRace, VerificationStatus } from "@/backend/race-model";

type RaceStoreState = {
  races: BackendRace[];
};

declare global {
  var __GLOBAL_TRAIL_RACE_STORE__: RaceStoreState | undefined;
}

const initialRaces: BackendRace[] = [
  {
    id: "verified-utmb-mont-blanc-2026",
    raceName: "UTMB Mont-Blanc",
    slug: "utmb-mont-blanc-2026",
    country: "France",
    region: "Europe",
    city: "Chamonix",
    raceDate: "2026-08-28",
    registrationOpenDate: "2026-01-09",
    registrationCloseDate: "2026-01-22",
    distances: [
      { id: "utmb-171", label: "UTMB", distanceKm: 171, elevationGain: 9963 },
      { id: "utmb-101", label: "CCC", distanceKm: 101, elevationGain: 6050 },
      { id: "utmb-57", label: "OCC", distanceKm: 57, elevationGain: 3500 },
    ],
    elevationGain: 9963,
    organizer: "UTMB Group",
    officialWebsite: "https://example.com/utmb-mont-blanc",
    registrationUrl: "https://example.com/utmb-mont-blanc/register",
    sourceUrl: "https://example.com/utmb-mont-blanc/race-info",
    sourceName: "Official race page",
    sourceType: "official",
    sources: [
      {
        id: "source-utmb",
        sourceUrl: "https://example.com/utmb-mont-blanc/race-info",
        sourceName: "Official race page",
        sourceType: "official",
        lastCheckedAt: "2026-05-27T00:10:00+08:00",
        confidenceScore: 0.96,
      },
    ],
    lastCheckedAt: "2026-05-27T00:10:00+08:00",
    lastUpdatedAt: "2026-05-27T00:10:00+08:00",
    verificationStatus: "verified",
    dataConfidenceScore: 0.96,
    languages: [{ locale: "en", isPrimary: true }, { locale: "fr" }],
    notes: "Verified seed record for the public calendar.",
  },
  {
    id: "verified-transgrancanaria-2026",
    raceName: "Transgrancanaria",
    slug: "transgrancanaria-2026",
    country: "Spain",
    region: "Europe",
    city: "Las Palmas",
    raceDate: "2026-02-20",
    registrationOpenDate: "2025-06-05",
    registrationCloseDate: "2026-01-18",
    distances: [
      { id: "tgc-126", label: "Classic", distanceKm: 126, elevationGain: 6800 },
      { id: "tgc-84", label: "Advanced", distanceKm: 84, elevationGain: 4800 },
      { id: "tgc-46", label: "Marathon", distanceKm: 46, elevationGain: 1900 },
    ],
    elevationGain: 6800,
    organizer: "Arista Eventos",
    officialWebsite: "https://example.com/transgrancanaria",
    registrationUrl: "https://example.com/transgrancanaria/register",
    sourceUrl: "https://example.com/transgrancanaria/program",
    sourceName: "Official race page",
    sourceType: "official",
    sources: [
      {
        id: "source-tgc",
        sourceUrl: "https://example.com/transgrancanaria/program",
        sourceName: "Official race page",
        sourceType: "official",
        lastCheckedAt: "2026-05-27T00:15:00+08:00",
        confidenceScore: 0.9,
      },
    ],
    lastCheckedAt: "2026-05-27T00:15:00+08:00",
    lastUpdatedAt: "2026-05-27T00:15:00+08:00",
    verificationStatus: "verified",
    dataConfidenceScore: 0.9,
    languages: [{ locale: "en", isPrimary: true }, { locale: "es" }],
    notes: "Verified seed record for the public calendar.",
  },
  {
    id: "pending-val-daran-2026",
    raceName: "Val d'Aran by UTMB",
    slug: "val-daran-by-utmb-spain-2026",
    country: "Spain",
    region: "Europe",
    city: "Vielha",
    raceDate: "2026-07-03",
    registrationOpenDate: "2026-01-15",
    registrationCloseDate: "2026-06-01",
    distances: [
      { id: "vda-110", label: "VDA 110K", distanceKm: 110, elevationGain: 6400 },
      { id: "vda-55", label: "PDA 55K", distanceKm: 55, elevationGain: 3300 },
    ],
    elevationGain: 6400,
    organizer: "UTMB Group",
    officialWebsite: "https://example.com/val-daran",
    registrationUrl: "https://example.com/val-daran/register",
    sourceUrl: "https://example.com/val-daran/source",
    sourceName: "Ahotu Trail Running Calendar",
    sourceType: "scraper",
    sources: [
      {
        id: "source-vda",
        sourceUrl: "https://example.com/val-daran/source",
        sourceName: "Ahotu Trail Running Calendar",
        sourceType: "scraper",
        lastCheckedAt: "2026-05-27T00:20:00+08:00",
        confidenceScore: 0.76,
      },
    ],
    lastCheckedAt: "2026-05-27T00:20:00+08:00",
    lastUpdatedAt: "2026-05-27T00:20:00+08:00",
    verificationStatus: "pending",
    dataConfidenceScore: 0.76,
    languages: [{ locale: "en", isPrimary: true }],
    notes: "Pending imported seed record.",
  },
  {
    id: "pending-madeira-2026",
    raceName: "Madeira Island Ultra-Trail",
    slug: "madeira-island-ultra-trail-portugal-2026",
    country: "Portugal",
    region: "Europe",
    city: "Porto Moniz",
    raceDate: "2026-04-25",
    registrationOpenDate: "",
    registrationCloseDate: "",
    distances: [{ id: "miut-115", label: "MIUT 115", distanceKm: 115, elevationGain: 7100 }],
    elevationGain: 7100,
    organizer: "",
    officialWebsite: "https://example.com/miut",
    registrationUrl: "",
    sourceUrl: "https://example.com/miut/source",
    sourceName: "Ahotu Trail Running Calendar",
    sourceType: "scraper",
    sources: [
      {
        id: "source-miut",
        sourceUrl: "https://example.com/miut/source",
        sourceName: "Ahotu Trail Running Calendar",
        sourceType: "scraper",
        lastCheckedAt: "2026-05-27T00:22:00+08:00",
        confidenceScore: 0.52,
      },
    ],
    lastCheckedAt: "2026-05-27T00:22:00+08:00",
    lastUpdatedAt: "2026-05-27T00:22:00+08:00",
    verificationStatus: "pending",
    dataConfidenceScore: 0.52,
    languages: [{ locale: "en", isPrimary: true }],
    notes: "Pending imported seed record with missing fields.",
  },
  {
    id: "pending-lavaredo-2026-a",
    raceName: "Lavaredo Ultra Trail",
    slug: "lavaredo-ultra-trail-italy-2026-a",
    country: "Italy",
    region: "Europe",
    city: "Cortina d'Ampezzo",
    raceDate: "2026-06-26",
    registrationOpenDate: "2025-10-01",
    registrationCloseDate: "2026-05-15",
    distances: [{ id: "lut-120", label: "120K", distanceKm: 120, elevationGain: 5800 }],
    elevationGain: 5800,
    organizer: "Lavaredo Ultra Trail",
    officialWebsite: "https://example.com/lavaredo",
    registrationUrl: "https://example.com/lavaredo/register",
    sourceUrl: "https://example.com/lavaredo/source-a",
    sourceName: "Ahotu Trail Running Calendar",
    sourceType: "scraper",
    sources: [
      {
        id: "source-lut-a",
        sourceUrl: "https://example.com/lavaredo/source-a",
        sourceName: "Ahotu Trail Running Calendar",
        sourceType: "scraper",
        lastCheckedAt: "2026-05-27T00:24:00+08:00",
        confidenceScore: 0.68,
      },
    ],
    lastCheckedAt: "2026-05-27T00:24:00+08:00",
    lastUpdatedAt: "2026-05-27T00:24:00+08:00",
    verificationStatus: "pending",
    dataConfidenceScore: 0.68,
    languages: [{ locale: "en", isPrimary: true }],
    notes: "Pending duplicate seed record.",
  },
  {
    id: "pending-lavaredo-2026-b",
    raceName: "Lavaredo Ultra Trail",
    slug: "lavaredo-ultra-trail-italy-2026-b",
    country: "Italy",
    region: "Europe",
    city: "Cortina",
    raceDate: "2026-06-26",
    registrationOpenDate: "2025-10-01",
    registrationCloseDate: "2026-05-15",
    distances: [{ id: "lut-50", label: "50K", distanceKm: 50, elevationGain: 2600 }],
    elevationGain: 2600,
    organizer: "Lavaredo Ultra Trail",
    officialWebsite: "https://example.com/lavaredo",
    registrationUrl: "https://example.com/lavaredo/register",
    sourceUrl: "https://example.com/lavaredo/source-b",
    sourceName: "Official Race Page",
    sourceType: "official",
    sources: [
      {
        id: "source-lut-b",
        sourceUrl: "https://example.com/lavaredo/source-b",
        sourceName: "Official Race Page",
        sourceType: "official",
        lastCheckedAt: "2026-05-27T00:26:00+08:00",
        confidenceScore: 0.91,
      },
    ],
    lastCheckedAt: "2026-05-27T00:26:00+08:00",
    lastUpdatedAt: "2026-05-27T00:26:00+08:00",
    verificationStatus: "pending",
    dataConfidenceScore: 0.91,
    languages: [{ locale: "en", isPrimary: true }, { locale: "it" }],
    notes: "Pending duplicate seed record from a higher-confidence source.",
  },
  {
    id: "rejected-fake-alpine-2026",
    raceName: "Fake Alpine Trail",
    slug: "fake-alpine-trail-france-2026",
    country: "France",
    region: "Europe",
    city: "Unknown",
    raceDate: "2026-09-01",
    registrationOpenDate: "",
    registrationCloseDate: "",
    distances: [],
    elevationGain: 0,
    organizer: "",
    officialWebsite: "",
    registrationUrl: "",
    sourceUrl: "https://example.com/rejected-source",
    sourceName: "Rejected seed source",
    sourceType: "scraper",
    sources: [
      {
        id: "source-rejected",
        sourceUrl: "https://example.com/rejected-source",
        sourceName: "Rejected seed source",
        sourceType: "scraper",
        lastCheckedAt: "2026-05-27T00:25:00+08:00",
        confidenceScore: 0.1,
      },
    ],
    lastCheckedAt: "2026-05-27T00:25:00+08:00",
    lastUpdatedAt: "2026-05-27T00:25:00+08:00",
    verificationStatus: "rejected",
    dataConfidenceScore: 0.1,
    languages: [{ locale: "en", isPrimary: true }],
    notes: "Rejected seed record. Must never appear publicly.",
  },
];

function getState() {
  globalThis.__GLOBAL_TRAIL_RACE_STORE__ ??= {
    races: initialRaces,
  };

  return globalThis.__GLOBAL_TRAIL_RACE_STORE__;
}

export function getAllWorkflowRaces() {
  return getState().races;
}

export function getWorkflowRacesByStatus(status: VerificationStatus) {
  return getAllWorkflowRaces().filter((race) => race.verificationStatus === status);
}

export function getVerifiedWorkflowRaces() {
  return getWorkflowRacesByStatus("verified");
}

export function getPendingWorkflowRaces() {
  return getWorkflowRacesByStatus("pending");
}

export function getWorkflowRaceBySlug(slug: string) {
  return getAllWorkflowRaces().find((race) => race.slug === slug);
}

export function updateWorkflowRaceStatus(id: string, status: VerificationStatus) {
  const state = getState();
  const race = state.races.find((item) => item.id === id);

  if (!race) {
    return undefined;
  }

  race.verificationStatus = status;
  race.lastUpdatedAt = new Date().toISOString();
  return race;
}

export function updateWorkflowRace(id: string, patch: Partial<BackendRace>) {
  const state = getState();
  const index = state.races.findIndex((race) => race.id === id);

  if (index === -1) {
    return undefined;
  }

  state.races[index] = {
    ...state.races[index],
    ...patch,
    id,
    lastUpdatedAt: new Date().toISOString(),
  };

  return state.races[index];
}

export function mergeWorkflowDuplicates(id: string) {
  const state = getState();
  const primary = state.races.find((race) => race.id === id);

  if (!primary) {
    return undefined;
  }

  const duplicateKey = createDuplicateKey(primary);
  const duplicates = state.races.filter(
    (race) => race.id !== id && race.verificationStatus === "pending" && createDuplicateKey(race) === duplicateKey,
  );

  if (duplicates.length === 0) {
    return primary;
  }

  const merged = duplicates.reduce((current, duplicate) => mergeRaceRecords(current, duplicate), primary);
  const duplicateIds = new Set(duplicates.map((race) => race.id));
  state.races = state.races.filter((race) => !duplicateIds.has(race.id));

  return updateWorkflowRace(id, merged);
}

export function addPendingImportedRaces(races: BackendRace[]) {
  const state = getState();
  const existingKeys = new Set(state.races.map((race) => createDuplicateKey(race)));
  const imported: BackendRace[] = [];
  const skipped: BackendRace[] = [];

  races.forEach((race) => {
    const key = createDuplicateKey(race);

    if (existingKeys.has(key)) {
      skipped.push(race);
      return;
    }

    existingKeys.add(key);
    imported.push({
      ...race,
      verificationStatus: "pending",
      lastUpdatedAt: new Date().toISOString(),
    });
  });

  state.races = [...state.races, ...imported];
  return { imported, skipped };
}
