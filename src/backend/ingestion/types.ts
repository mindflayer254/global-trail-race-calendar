import type { BackendRace, RaceImportInput } from "@/backend/race-model";

export type IngestionLogLevel = "info" | "warn" | "error";

export type IngestionLogEntry = {
  level: IngestionLogLevel;
  message: string;
  sourceName?: string;
  sourceUrl?: string;
  timestamp: string;
  error?: string;
};

export type FetchPolicy = {
  userAgent: string;
  minDelayMs: number;
  timeoutMs: number;
  respectRobotsTxt: boolean;
};

export type SourceAdapterContext = {
  fetchPublicPage: (sourceUrl: string) => Promise<string>;
  log: (entry: Omit<IngestionLogEntry, "timestamp">) => void;
  now: () => string;
};

export type SourceAdapter = {
  id: string;
  sourceName: string;
  sourceUrl: string;
  sourceType: RaceImportInput["sourceType"];
  parse: (context: SourceAdapterContext) => Promise<RaceImportInput[]>;
};

export type IngestionRunResult = {
  imported: BackendRace[];
  skipped: Array<{
    sourceName: string;
    sourceUrl: string;
    reason: string;
  }>;
  duplicateCandidates: Array<{
    raceId: string;
    raceName: string;
    duplicateKey: string;
    existingIds: string[];
  }>;
  logs: IngestionLogEntry[];
  dryRun: boolean;
};
