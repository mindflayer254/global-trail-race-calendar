import { stripPotentialPersonalData } from "@/backend/ingestion/policy";
import type { RaceImportInput } from "@/backend/race-model";
import type { SourceAdapter } from "@/backend/ingestion/types";

export function createExampleOfficialRaceAdapter(sourceUrl: string): SourceAdapter {
  return {
    id: "example-official-race",
    sourceName: "Example Official Race Page",
    sourceUrl,
    sourceType: "official",
    async parse(context) {
      const html = await context.fetchPublicPage(sourceUrl);
      const lastCheckedAt = context.now();
      const title = stripPotentialPersonalData(extractTitle(html) ?? "Imported Trail Race");

      context.log({
        level: "info",
        message: "Fetched public official race page.",
        sourceName: "Example Official Race Page",
        sourceUrl,
      });

      return [
        {
          raceName: title,
          country: "Unknown",
          region: "Unknown",
          city: "Unknown",
          raceDate: new Date().toISOString().slice(0, 10),
          registrationOpenDate: new Date().toISOString().slice(0, 10),
          registrationCloseDate: new Date().toISOString().slice(0, 10),
          distances: [
            {
              id: "distance-unknown",
              label: "Distance TBD",
              distanceKm: 0,
              elevationGain: 0,
            },
          ],
          organizer: "Unknown",
          officialWebsite: sourceUrl,
          registrationUrl: sourceUrl,
          sources: [
            {
              id: "primary-source",
              sourceUrl,
              sourceName: "Example Official Race Page",
              sourceType: "official",
              lastCheckedAt,
              confidenceScore: 0.3,
            },
          ],
          languages: [{ locale: "en", isPrimary: true }],
          notes: "Imported from public page. Requires manual admin review before publishing.",
        } satisfies RaceImportInput,
      ];
    },
  };
}

function extractTitle(html: string) {
  return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim();
}
