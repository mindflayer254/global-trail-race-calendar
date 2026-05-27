import { createAhotuTrailRunningAdapter } from "@/backend/ingestion/adapters/ahotu-trail-running-adapter";
import { runIngestion } from "@/backend/ingestion/runner";
import type { BackendRace } from "@/backend/race-model";

type PreviewAhotuOptions = {
  listingUrl?: string;
  maxRecords?: number;
  existingRaces?: BackendRace[];
};

type ImportAhotuOptions = PreviewAhotuOptions;

export function previewAhotuTrailRunningImport({
  listingUrl,
  maxRecords,
  existingRaces = [],
}: PreviewAhotuOptions = {}) {
  return runIngestion({
    adapters: [createAhotuTrailRunningAdapter({ listingUrl, maxRecords })],
    existingRaces,
    dryRun: true,
  });
}

export function importAhotuTrailRunningAsPending({
  listingUrl,
  maxRecords,
  existingRaces = [],
}: ImportAhotuOptions = {}) {
  return runIngestion({
    adapters: [createAhotuTrailRunningAdapter({ listingUrl, maxRecords })],
    existingRaces,
    dryRun: false,
  });
}
