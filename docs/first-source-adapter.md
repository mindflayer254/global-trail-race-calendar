# First Source Adapter: Ahotu Trail Running Calendar

The first concrete source adapter is:

```ts
createAhotuTrailRunningAdapter()
```

File:

```txt
src/backend/ingestion/adapters/ahotu-trail-running-adapter.ts
```

## Source

Default public listing page:

```txt
https://www.ahotu.com/calendar/trail-running?years=2026
```

The adapter uses the shared ingestion fetch wrapper, so it inherits:

- public-page-only fetching
- user-agent identification
- polite request rate limiting
- `robots.txt` checks where technically possible
- protected-content checks
- timeout handling
- structured logs

## Parsed Fields

The adapter attempts to parse:

- race name
- race date
- country
- city
- distance categories
- registration URL when available, otherwise the race detail URL

The normalized output is `RaceImportInput`, which is then passed through `createImportedRace()`.

## Pending By Default

Imported races are never published directly.

The runner normalizes all adapter results into `BackendRace` records with:

```ts
verificationStatus: "pending"
```

## Dry Run First

The ingestion runner defaults to dry-run mode:

```ts
const result = await runIngestion({
  adapters: [createAhotuTrailRunningAdapter()],
  dryRun: true,
});
```

Dry-run mode returns preview records and logs, but should not be wired to persistence.

## Confirmed Pending Import

After review, the same one-source adapter can be run in confirmed import mode:

```ts
const result = await importAhotuTrailRunningAsPending({
  existingRaces,
  maxRecords: 10,
});
```

Confirmed imports are still not published. They are normalized as `BackendRace` records with:

```ts
verificationStatus: "pending"
```

The public calendar only reads `verified` races, so rejected or pending imported records cannot appear on the public site.

## Logs

The runner logs:

- source start
- candidate count
- imported pending previews
- duplicate skips
- parse skips
- adapter failures

This gives a clear preview of what would be imported, skipped, or failed before adding database persistence.
