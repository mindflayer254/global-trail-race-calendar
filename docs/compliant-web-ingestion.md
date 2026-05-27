# Compliant Web Data Ingestion

The ingestion module lives in `src/backend/ingestion`. It is built for public race pages only and deliberately avoids bypassing access controls.

## Compliance Rules

- Use only public web pages.
- Do not bypass login, CAPTCHA, paywalls, anti-bot pages, or access controls.
- Respect `robots.txt` where technically possible.
- Identify requests with a clear user agent.
- Apply polite rate limiting between requests.
- Do not scrape personal data.
- Save `sourceUrl` and `lastCheckedAt` for every imported record.
- Imported records must be `pending` by default.
- Use one adapter per source.

## Module Layout

- `types.ts`: adapter and ingestion result contracts.
- `policy.ts`: user-agent, rate limit defaults, restricted-page detection, personal-data redaction helpers.
- `robots.ts`: lightweight `robots.txt` allow/disallow check.
- `rate-limiter.ts`: polite delay between requests.
- `fetch-public-page.ts`: public-page fetch wrapper with user-agent, robots check, timeout, content-type check, and protected-content guard.
- `runner.ts`: runs source adapters, imports pending races, captures errors and logs.
- `adapters/`: one adapter per source.

## Adapter Pattern

Each source should implement `SourceAdapter`:

```ts
export type SourceAdapter = {
  id: string;
  sourceName: string;
  sourceUrl: string;
  sourceType: RaceImportInput["sourceType"];
  parse: (context: SourceAdapterContext) => Promise<RaceImportInput[]>;
};
```

Adapters receive `fetchPublicPage()` from the runner. They should not call `fetch()` directly, because the shared fetch wrapper handles user-agent identification, robots checks, timeout handling, protected-content checks, and rate limiting.

## Pending By Default

Adapters return `RaceImportInput`. The runner passes that data through `createImportedRace()`, which always sets:

```ts
verificationStatus: "pending"
```

Public APIs should only expose records returned by `getPublishableRaces()`.

## Error Handling And Logging

The runner captures adapter failures and stores structured log entries:

```ts
{
  level: "error",
  message: "Source adapter failed.",
  sourceName,
  sourceUrl,
  timestamp,
  error
}
```

Failed adapters do not stop the full batch. Other source adapters can continue.

## Personal Data

Race pages may contain organizer emails or phone numbers. The ingestion module includes `stripPotentialPersonalData()` for text extraction paths, but adapters should avoid collecting contact details entirely unless there is a clear product need and legal review.
