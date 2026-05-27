import { createImportedRace } from "@/backend/race-utils";
import { fetchPublicPage } from "@/backend/ingestion/fetch-public-page";
import { DEFAULT_FETCH_POLICY } from "@/backend/ingestion/policy";
import { PoliteRateLimiter } from "@/backend/ingestion/rate-limiter";
import type { BackendRace } from "@/backend/race-model";
import type { FetchPolicy, IngestionLogEntry, IngestionRunResult, SourceAdapter } from "@/backend/ingestion/types";

type RunIngestionOptions = {
  adapters: SourceAdapter[];
  existingRaces?: BackendRace[];
  policy?: Partial<FetchPolicy>;
  dryRun?: boolean;
};

export async function runIngestion({
  adapters,
  existingRaces = [],
  policy: policyOverrides = {},
  dryRun = true,
}: RunIngestionOptions): Promise<IngestionRunResult> {
  const policy = { ...DEFAULT_FETCH_POLICY, ...policyOverrides };
  const limiter = new PoliteRateLimiter(policy.minDelayMs);
  const logs: IngestionLogEntry[] = [];
  const imported: BackendRace[] = [];
  const skipped: IngestionRunResult["skipped"] = [];
  const duplicateCandidates: IngestionRunResult["duplicateCandidates"] = [];

  const log = (entry: Omit<IngestionLogEntry, "timestamp">) => {
    logs.push({ ...entry, timestamp: new Date().toISOString() });
  };

  for (const adapter of adapters) {
    try {
      log({
        level: "info",
        message: dryRun ? "Starting source adapter in dry-run mode." : "Starting source adapter.",
        sourceName: adapter.sourceName,
        sourceUrl: adapter.sourceUrl,
      });

      const adapterRecords = await adapter.parse({
        fetchPublicPage: async (sourceUrl) => {
          await limiter.waitTurn();
          return fetchPublicPage(sourceUrl, policy);
        },
        log,
        now: () => new Date().toISOString(),
      });

      adapterRecords.forEach((record) => {
        const importedRace = createImportedRace(record, existingRaces);

        if (importedRace.duplicateMatches.length > 0) {
          duplicateCandidates.push({
            raceId: importedRace.race.id,
            raceName: importedRace.race.raceName,
            duplicateKey: importedRace.duplicateMatches[0].duplicateKey,
            existingIds: importedRace.duplicateMatches.map((match) => match.existingId),
          });
          log({
            level: "warn",
            message: `Potential duplicate detected: ${record.raceName}`,
            sourceName: adapter.sourceName,
            sourceUrl: adapter.sourceUrl,
          });

          if (!dryRun) {
            skipped.push({
              sourceName: adapter.sourceName,
              sourceUrl: adapter.sourceUrl,
              reason: "Potential duplicate race detected by name + country + date.",
            });
            return;
          }
        }

        imported.push(importedRace.race);

        log({
          level: "info",
          message: `${dryRun ? "Dry-run previewed" : "Imported"} pending race: ${importedRace.race.raceName}`,
          sourceName: adapter.sourceName,
          sourceUrl: importedRace.race.sourceUrl,
        });
      });

      log({
        level: "info",
        message: `${dryRun ? "Previewed" : "Imported"} ${imported.length} pending record(s).`,
        sourceName: adapter.sourceName,
        sourceUrl: adapter.sourceUrl,
      });
    } catch (error) {
      log({
        level: "error",
        message: "Source adapter failed.",
        sourceName: adapter.sourceName,
        sourceUrl: adapter.sourceUrl,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { imported, skipped, duplicateCandidates, logs, dryRun };
}
