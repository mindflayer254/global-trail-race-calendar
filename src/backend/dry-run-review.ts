import { getMissingRaceFields } from "@/backend/admin-review";
import { createDuplicateKey } from "@/backend/race-utils";
import type { BackendRace } from "@/backend/race-model";

export function enrichDryRunRace(race: BackendRace, existingRaces: BackendRace[]) {
  const duplicateKey = createDuplicateKey(race);
  const possibleDuplicates = existingRaces
    .filter((existingRace) => existingRace.id !== race.id && createDuplicateKey(existingRace) === duplicateKey)
    .map((existingRace) => ({
      id: existingRace.id,
      raceName: existingRace.raceName,
      verificationStatus: existingRace.verificationStatus,
    }));

  return {
    ...race,
    missingFields: getMissingRaceFields(race),
    possibleDuplicates,
    duplicateKey,
  };
}

export type DryRunPreviewRace = ReturnType<typeof enrichDryRunRace>;
