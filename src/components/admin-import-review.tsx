"use client";

import { useMemo, useState } from "react";
import {
  getDuplicateReviewKeys,
  getMissingRaceFields,
} from "@/backend/admin-review";
import { createDuplicateKey } from "@/backend/race-utils";
import type { BackendRace, VerificationStatus } from "@/backend/race-model";

type AdminImportReviewProps = {
  initialRaces: BackendRace[];
};

type EditState = Pick<
  BackendRace,
  | "raceName"
  | "country"
  | "region"
  | "city"
  | "raceDate"
  | "registrationOpenDate"
  | "registrationCloseDate"
  | "organizer"
  | "registrationUrl"
  | "officialWebsite"
  | "notes"
>;

export function AdminImportReview({ initialRaces }: AdminImportReviewProps) {
  const [races, setRaces] = useState(initialRaces);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activity, setActivity] = useState<string[]>([]);
  const [busyRaceId, setBusyRaceId] = useState<string | null>(null);

  const pendingRaces = races.filter((race) => race.verificationStatus === "pending");
  const duplicateKeys = useMemo(() => getDuplicateReviewKeys(pendingRaces), [pendingRaces]);

  async function updateStatus(raceId: string, status: VerificationStatus) {
    const action = status === "verified" ? "approve" : "reject";
    const race = await patchRace(raceId, { action });

    if (!race) {
      return;
    }

    setRaces((current) => current.filter((item) => item.id !== raceId));
    setActivity((current) => [`${status.toUpperCase()}: ${race.raceName}`, ...current]);
  }

  async function saveEdit(raceId: string, edit: EditState) {
    const race = await patchRace(raceId, { action: "edit", patch: edit });

    if (!race) {
      return;
    }

    setRaces((current) => current.map((item) => (item.id === raceId ? race : item)));
    setEditingId(null);
    setActivity((current) => [`EDITED: ${race.raceName}`, ...current]);
  }

  async function mergeDuplicates(primaryRace: BackendRace) {
    const duplicateKey = createDuplicateKey(primaryRace);
    const duplicates = pendingRaces.filter(
      (race) => race.id !== primaryRace.id && createDuplicateKey(race) === duplicateKey,
    );

    if (duplicates.length === 0) {
      setActivity((current) => [`NO MERGE: no duplicate found for ${primaryRace.id}`, ...current]);
      return;
    }

    const mergedRace = await patchRace(primaryRace.id, { action: "merge" });

    if (!mergedRace) {
      return;
    }

    const duplicateIds = new Set(duplicates.map((race) => race.id));

    setRaces((current) =>
      current
        .filter((race) => !duplicateIds.has(race.id))
        .map((race) => (race.id === primaryRace.id ? mergedRace : race)),
    );
    setActivity((current) => [`MERGED: ${primaryRace.id} absorbed ${duplicates.length} duplicate(s)`, ...current]);
  }

  async function patchRace(
    raceId: string,
    body:
      | { action: "approve" }
      | { action: "reject" }
      | { action: "merge" }
      | { action: "edit"; patch: EditState },
  ) {
    setBusyRaceId(raceId);

    try {
      const response = await fetch(`/api/admin/imports/${raceId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }

      const payload = (await response.json()) as { race: BackendRace };
      return payload.race;
    } catch (error) {
      setActivity((current) => [
        `FAILED: ${raceId} (${error instanceof Error ? error.message : "unknown error"})`,
        ...current,
      ]);
      return undefined;
    } finally {
      setBusyRaceId(null);
    }
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="grid gap-4">
        {pendingRaces.length === 0 ? (
          <div className="premium-card rounded-[2px] p-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-[#20231E]">No pending imports</h2>
            <p className="mt-3 text-sm text-[#625f57]">Approved and rejected records are no longer in this queue.</p>
          </div>
        ) : (
          pendingRaces.map((race) => {
            const missingFields = getMissingRaceFields(race);
            const isDuplicate = (duplicateKeys.get(createDuplicateKey(race)) ?? 0) > 1;

            return (
              <article key={race.id} className="premium-card overflow-hidden rounded-[2px]">
                <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_220px]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-[2px] bg-[#f5ead8] px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#71461f]">
                        Pending
                      </span>
                      {isDuplicate ? (
                        <span className="rounded-[2px] bg-[#e6eef0] px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#284d5f]">
                          Duplicate candidate
                        </span>
                      ) : null}
                      <span className="rounded-[2px] bg-[#ece9e1] px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#555149]">
                        Confidence {Math.round(race.dataConfidenceScore * 100)}%
                      </span>
                    </div>

                    {editingId === race.id ? (
                      <EditRaceForm race={race} onCancel={() => setEditingId(null)} onSave={saveEdit} />
                    ) : (
                      <RaceReviewSummary race={race} missingFields={missingFields} />
                    )}
                  </div>

                  <div className="grid content-start gap-2">
                    <button
                      type="button"
                      onClick={() => updateStatus(race.id, "verified")}
                      disabled={busyRaceId === race.id}
                      className="rounded-[2px] bg-[#20231E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7c431f]"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(race.id)}
                      disabled={busyRaceId === race.id}
                      className="rounded-[2px] border border-[#D8D0C2] bg-white px-4 py-2.5 text-sm font-semibold text-[#20231E] transition hover:border-[#A45A2A]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => mergeDuplicates(race)}
                      disabled={!isDuplicate || busyRaceId === race.id}
                      className="rounded-[2px] border border-[#D8D0C2] bg-white px-4 py-2.5 text-sm font-semibold text-[#20231E] transition hover:border-[#A45A2A] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Merge duplicates
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(race.id, "rejected")}
                      disabled={busyRaceId === race.id}
                      className="rounded-[2px] border border-[#d7b8ae] bg-[#fff7f3] px-4 py-2.5 text-sm font-semibold text-[#8b3428] transition hover:border-[#8b3428]"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      <aside className="premium-card h-fit rounded-[2px] p-5 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold tracking-tight text-[#20231E]">Review log</h2>
        <div className="mt-4 grid gap-3 text-sm text-[#625f57]">
          {activity.length > 0 ? (
            activity.slice(0, 8).map((item) => (
              <p key={item} className="border-b border-[#eee9df] pb-3 last:border-0">
                {item}
              </p>
            ))
          ) : (
            <p>No review actions yet.</p>
          )}
        </div>
      </aside>
    </div>
  );
}

function RaceReviewSummary({
  race,
  missingFields,
}: {
  race: BackendRace;
  missingFields: Array<keyof BackendRace>;
}) {
  return (
    <div className="mt-4">
      <h2 className="text-2xl font-semibold tracking-tight text-[#20231E]">{race.raceName}</h2>
      <p className="mt-2 text-sm leading-6 text-[#625f57]">
        {race.city}, {race.country} / {race.region} / {race.raceDate}
      </p>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <ReviewItem label="Source URL" value={race.sourceUrl} isLink />
        <ReviewItem label="Last checked" value={race.lastCheckedAt} />
        <ReviewItem label="Registration URL" value={race.registrationUrl || "Missing"} isLink={Boolean(race.registrationUrl)} />
        <ReviewItem label="Source name" value={`${race.sourceName} (${race.sourceType})`} />
      </dl>

      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a756b]">Distances</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {race.distances.map((distance) => (
            <span key={distance.id} className="rounded-[2px] border border-[#D8D0C2] bg-white px-2.5 py-1 text-xs font-semibold text-[#20231E]">
              {distance.label} / {distance.distanceKm} km / {distance.elevationGain.toLocaleString()} m
            </span>
          ))}
        </div>
      </div>

      {missingFields.length > 0 ? (
        <div className="mt-5 rounded-[2px] border border-[#dfc696] bg-[#fff8ea] p-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#71461f]">Missing fields</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {missingFields.map((field) => (
              <span key={field} className="rounded-[2px] bg-white px-2 py-1 text-xs font-semibold text-[#71461f]">
                {field}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ReviewItem({ label, value, isLink }: { label: string; value: string; isLink?: boolean }) {
  return (
    <div className="min-w-0 rounded-[2px] border border-[#eee9df] bg-[#fffdfa] p-3">
      <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a756b]">{label}</dt>
      <dd className="mt-1 truncate font-semibold text-[#20231E]">
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

function EditRaceForm({
  race,
  onCancel,
  onSave,
}: {
  race: BackendRace;
  onCancel: () => void;
  onSave: (raceId: string, edit: EditState) => void;
}) {
  const [edit, setEdit] = useState<EditState>({
    raceName: race.raceName,
    country: race.country,
    region: race.region,
    city: race.city,
    raceDate: race.raceDate,
    registrationOpenDate: race.registrationOpenDate,
    registrationCloseDate: race.registrationCloseDate,
    organizer: race.organizer,
    registrationUrl: race.registrationUrl,
    officialWebsite: race.officialWebsite,
    notes: race.notes,
  });

  function updateField(field: keyof EditState, value: string) {
    setEdit((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="mt-5 grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {Object.entries(edit).map(([field, value]) => (
          <label key={field} className="grid gap-1 text-sm font-semibold text-[#34332f]">
            {field}
            <input
              value={value}
              onChange={(event) => updateField(field as keyof EditState, event.target.value)}
              className="h-11 rounded-[2px] border border-[#D8D0C2] bg-[#f7f4ee] px-3 text-sm outline-none focus:border-[#A45A2A] focus:ring-2 focus:ring-[#d7b48a]"
            />
          </label>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSave(race.id, edit)}
          className="rounded-[2px] bg-[#20231E] px-4 py-2 text-sm font-semibold text-white"
        >
          Save changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-[2px] border border-[#D8D0C2] bg-white px-4 py-2 text-sm font-semibold text-[#20231E]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
