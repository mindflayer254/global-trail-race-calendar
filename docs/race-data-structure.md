# Race Data Structure

This schema is designed for future scraping, API ingestion, manual curation, and multilingual publishing. It keeps the current MVP simple while giving the data layer a normalized model that can grow into a database or external API.

## Core Model

Use `RaceDataSet` as the top-level transport format:

- `races`: normalized race events.
- `distances`: one-to-many distance categories for each race.
- `locations`: reusable location entities.
- `organizers`: reusable organizer entities.
- `sources`: source records used by scrapers, API ingestors, and manual reviewers.

The TypeScript source of truth is [race-schema.ts](../src/types/race-schema.ts).

## Normalization

`RaceEvent` stores event-level data only:

- identity: `id`, `slug`
- names and descriptions: `canonicalName`, `shortName`, `description`
- dates: `eventStartDate`, `eventEndDate`
- relationships: `locationId`, `organizerIds`, `distanceIds`, `sourceIds`
- registration windows: `registrationStages`
- ingestion history: `ingestion`
- admin state: `review`

Distance-specific data belongs in `RaceDistance`:

- `distanceKm`
- `elevationGainM`
- `elevationLossM`
- `startTime`
- `cutoffHours`
- `capacity`
- `qualificationRequired`
- route or gear links

This avoids duplicating race rows when one event has 10K, 25K, 50K, and 100K categories.

## Multilingual Content

All user-facing text should use `LocalizedText`:

```ts
{
  defaultLocale: "en",
  translations: [
    {
      locale: "en",
      value: "Ultra Trail Mount Siguniang",
      updatedAt: "2026-05-27T00:00:00+08:00"
    },
    {
      locale: "zh-CN",
      value: "四姑娘山超级越野赛",
      updatedAt: "2026-05-27T00:00:00+08:00"
    }
  ]
}
```

This supports English-first publishing for international runners while preserving original source text in any local language.

## Registration Stages

`registrationStages` supports complex registration workflows:

- early bird
- standard registration
- lottery
- waitlist
- sold out
- closed

Each stage can track:

- `opensAt`
- `closesAt`
- `lotteryDrawAt`
- `capacity`
- `price`
- `registrationUrl`
- `sourceIds`

This is more scalable than a single `registrationStatus` field.

## Source Tracking

Every scraped or manually entered fact should be traceable through `sourceIds`.

`SourceReference` tracks:

- source type: official site, registration platform, API, scraper, manual research
- URL
- retrieval time
- last seen time
- checksum
- confidence score
- notes

For future scraping, store raw HTML/API payloads outside the main JSON and reference them with `rawPayloadUri` in `IngestionMetadata`.

## API Ingestion

`IngestionMetadata` records where a record came from:

- `method`: manual, scrape, API, import
- `provider`
- `externalId`
- `parserVersion`
- `apiVersion`
- `rawPayloadUri`
- `ingestedAt`

This allows repeated imports from multiple providers without losing provenance.

## Admin Review

Manual moderation is represented by `AdminReview`:

- `draft`
- `pending-review`
- `approved`
- `needs-changes`
- `rejected`
- `archived`

This lets scrapers ingest quickly while keeping public publishing controlled by an admin review workflow.

## Migration Path

The current MVP can keep using `src/data/races.json`. When scraping or API ingestion begins:

1. Convert each existing race into a `RaceEvent`.
2. Move each distance into `RaceDistance`.
3. Create one `LocationEntity` per unique city or venue.
4. Create one `OrganizerEntity` per organizer.
5. Attach at least one `SourceReference` to every race and distance.
6. Publish only records with `review.status === "approved"`.
