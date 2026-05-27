export type VerificationStatus = "pending" | "verified" | "rejected";

export type RaceSourceType =
  | "official"
  | "registration-platform"
  | "organizer-submission"
  | "social"
  | "scraper"
  | "api"
  | "manual";

export type RaceLanguage = {
  locale: string;
  isPrimary?: boolean;
};

export type BackendRaceDistance = {
  id: string;
  label: string;
  distanceKm: number;
  elevationGain: number;
  startTime?: string;
  cutoffHours?: number;
  registrationUrl?: string;
};

export type BackendRaceSource = {
  id: string;
  sourceUrl: string;
  sourceName: string;
  sourceType: RaceSourceType;
  lastCheckedAt: string;
  rawPayloadUri?: string;
  confidenceScore?: number;
};

export type BackendRace = {
  id: string;
  raceName: string;
  slug: string;
  country: string;
  region: string;
  city: string;
  raceDate: string;
  registrationOpenDate: string;
  registrationCloseDate: string;
  distances: BackendRaceDistance[];
  elevationGain: number;
  organizer: string;
  officialWebsite: string;
  registrationUrl: string;
  sourceUrl: string;
  sourceName: string;
  sourceType: RaceSourceType;
  sources: BackendRaceSource[];
  lastCheckedAt: string;
  lastUpdatedAt: string;
  verificationStatus: VerificationStatus;
  dataConfidenceScore: number;
  languages: RaceLanguage[];
  notes: string;
};

export type RaceImportInput = Omit<
  BackendRace,
  | "id"
  | "slug"
  | "elevationGain"
  | "sourceUrl"
  | "sourceName"
  | "sourceType"
  | "lastCheckedAt"
  | "lastUpdatedAt"
  | "verificationStatus"
  | "dataConfidenceScore"
> & {
  id?: string;
  slug?: string;
  sourceUrl?: string;
  sourceName?: string;
  sourceType?: RaceSourceType;
  lastCheckedAt?: string;
  lastUpdatedAt?: string;
  dataConfidenceScore?: number;
};

export type DuplicateRaceMatch = {
  candidateId: string;
  existingId: string;
  duplicateKey: string;
  reason: "name-country-date";
};

export type RaceImportResult = {
  race: BackendRace;
  duplicateMatches: DuplicateRaceMatch[];
  shouldPublish: false;
};

export type RacePipelineBatch = {
  batchId: string;
  provider: string;
  importedAt: string;
  races: RaceImportResult[];
};
