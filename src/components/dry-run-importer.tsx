"use client";

import { useState } from "react";
import type { BackendRace } from "@/backend/race-model";
import type { IngestionLogEntry } from "@/backend/ingestion/types";

type PreviewRace = BackendRace & {
  missingFields: Array<keyof BackendRace>;
  possibleDuplicates: Array<{
    id: string;
    raceName: string;
    verificationStatus: string;
  }>;
  duplicateKey: string;
};

type DryRunResponse = {
  imported: PreviewRace[];
  skipped: Array<{ sourceName: string; sourceUrl: string; reason: string }>;
  duplicateCandidates: Array<{
    raceId: string;
    raceName: string;
    duplicateKey: string;
    existingIds: string[];
  }>;
  logs: IngestionLogEntry[];
  dryRun: boolean;
};

type ConfirmResponse = {
  importedCount: number;
  skippedCount: number;
};

const defaultListingUrl = "https://www.ahotu.com/calendar/trail-running?years=2026";

export function DryRunImporter() {
  const [listingUrl, setListingUrl] = useState(defaultListingUrl);
  const [maxRecords, setMaxRecords] = useState(8);
  const [preview, setPreview] = useState<DryRunResponse | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function runDryRun() {
    setIsRunning(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/imports/dry-run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ listingUrl, maxRecords }),
      });

      if (!response.ok) {
        throw new Error(`Dry run failed with ${response.status}`);
      }

      setPreview((await response.json()) as DryRunResponse);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Dry run failed.");
    } finally {
      setIsRunning(false);
    }
  }

  async function confirmImport() {
    if (!preview || preview.imported.length === 0) {
      return;
    }

    setIsConfirming(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/imports/confirm", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ races: preview.imported }),
      });

      if (!response.ok) {
        throw new Error(`Confirm import failed with ${response.status}`);
      }

      const result = (await response.json()) as ConfirmResponse;
      setMessage(
        `Confirmed import: ${result.importedCount} saved as pending, ${result.skippedCount} skipped as duplicates.`,
      );
      setPreview(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Confirm import failed.");
    } finally {
      setIsConfirming(false);
    }
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="grid gap-5">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            runDryRun();
          }}
          className="premium-card rounded-[2px] p-5"
        >
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-semibold text-[#34332f]">
              Public listing URL
              <input
                value={listingUrl}
                onChange={(event) => setListingUrl(event.target.value)}
                className="h-12 rounded-[2px] border border-[#c9c4b8] bg-[#f7f4ee] px-3 text-sm outline-none focus:border-[#9b5b2e] focus:ring-2 focus:ring-[#d7b48a]"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[#34332f] sm:max-w-48">
              Max preview records
              <input
                type="number"
                min={1}
                max={50}
                value={maxRecords}
                onChange={(event) => setMaxRecords(Number(event.target.value))}
                className="h-12 rounded-[2px] border border-[#c9c4b8] bg-[#f7f4ee] px-3 text-sm outline-none focus:border-[#9b5b2e] focus:ring-2 focus:ring-[#d7b48a]"
              />
            </label>
            <button
              type="submit"
              disabled={isRunning}
              className="w-full rounded-[2px] bg-[#191917] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#654021] disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
            >
              {isRunning ? "Running dry run..." : "Run dry run"}
            </button>
          </div>
        </form>

        {message ? (
          <div className="rounded-[2px] border border-[#ded8cc] bg-white p-4 text-sm font-semibold text-[#191917]">
            {message}
          </div>
        ) : null}

        {preview ? (
          <div className="grid gap-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-[#191917]">
                  Preview results
                </h2>
                <p className="mt-1 text-sm text-[#625f57]">
                  {preview.imported.length} previewed, {preview.skipped.length} skipped,{" "}
                  {preview.duplicateCandidates.length} duplicate warning(s)
                </p>
              </div>
              <button
                type="button"
                onClick={confirmImport}
                disabled={isConfirming || preview.imported.length === 0}
                className="rounded-[2px] bg-[#191917] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#654021] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isConfirming ? "Confirming..." : "Confirm import as pending"}
              </button>
            </div>

            {preview.imported.map((race) => (
              <article key={race.id} className="premium-card rounded-[2px] p-5">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-[2px] bg-[#f5ead8] px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#71461f]">
                    Dry run only
                  </span>
                  <span className="rounded-[2px] bg-[#ece9e1] px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#555149]">
                    Confidence {Math.round(race.dataConfidenceScore * 100)}%
                  </span>
                  {race.possibleDuplicates.length > 0 ? (
                    <span className="rounded-[2px] bg-[#e6eef0] px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#284d5f]">
                      Possible duplicate
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#191917]">
                  {race.raceName}
                </h3>
                <p className="mt-2 text-sm text-[#625f57]">
                  {race.city}, {race.country} / {race.raceDate}
                </p>

                <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  <PreviewItem label="Source URL" value={race.sourceUrl} isLink />
                  <PreviewItem label="Last checked" value={race.lastCheckedAt} />
                  <PreviewItem label="Registration URL" value={race.registrationUrl || "Missing"} isLink={Boolean(race.registrationUrl)} />
                  <PreviewItem label="Duplicate key" value={race.duplicateKey} />
                </dl>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <FlagPanel
                    title="Missing fields"
                    items={race.missingFields.map(String)}
                    emptyLabel="No required fields missing"
                  />
                  <FlagPanel
                    title="Possible duplicates"
                    items={race.possibleDuplicates.map(
                      (duplicate) =>
                        `${duplicate.raceName} (${duplicate.verificationStatus}) / ${duplicate.id}`,
                    )}
                    emptyLabel="No duplicate candidates"
                  />
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>

      <aside className="premium-card h-fit rounded-[2px] p-5 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold tracking-tight text-[#191917]">Dry-run logs</h2>
        <div className="mt-4 grid gap-3 text-sm text-[#625f57]">
          {preview?.logs.length ? (
            preview.logs.map((log) => (
              <div key={`${log.timestamp}-${log.message}`} className="border-b border-[#eee9df] pb-3 last:border-0">
                <p className="font-semibold text-[#191917]">{log.level.toUpperCase()}</p>
                <p className="mt-1">{log.message}</p>
                {log.error ? <p className="mt-1 text-[#8b3428]">{log.error}</p> : null}
              </div>
            ))
          ) : (
            <p>No dry-run logs yet.</p>
          )}
        </div>
      </aside>
    </div>
  );
}

function PreviewItem({ label, value, isLink }: { label: string; value: string; isLink?: boolean }) {
  return (
    <div className="min-w-0 rounded-[2px] border border-[#eee9df] bg-[#fffdfa] p-3">
      <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a756b]">{label}</dt>
      <dd className="mt-1 truncate font-semibold text-[#191917]">
        {isLink ? (
          <a href={value} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function FlagPanel({ title, items, emptyLabel }: { title: string; items: string[]; emptyLabel: string }) {
  return (
    <div className="rounded-[2px] border border-[#ded8cc] bg-white p-3">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a756b]">{title}</p>
      {items.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {items.map((item) => (
            <span key={item} className="rounded-[2px] bg-[#fff8ea] px-2 py-1 text-xs font-semibold text-[#71461f]">
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-[#625f57]">{emptyLabel}</p>
      )}
    </div>
  );
}
