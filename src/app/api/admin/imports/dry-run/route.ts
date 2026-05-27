import { NextResponse } from "next/server";
import { enrichDryRunRace } from "@/backend/dry-run-review";
import { previewAhotuTrailRunningImport } from "@/backend/ingestion/dry-run";
import { getPendingRaceRecords, getVerifiedRaceRecords } from "@/lib/supabase/races";

export const dynamic = "force-dynamic";

type DryRunRequestBody = {
  listingUrl?: string;
  maxRecords?: number;
};

export async function POST(request: Request) {
  const body = (await request.json()) as DryRunRequestBody;
  const [verifiedResult, pendingResult] = await Promise.all([
    getVerifiedRaceRecords(),
    getPendingRaceRecords(),
  ]);
  const existingRaces = [...(verifiedResult.data ?? []), ...(pendingResult.data ?? [])];
  const result = await previewAhotuTrailRunningImport({
    listingUrl: body.listingUrl,
    maxRecords: body.maxRecords ?? 8,
    existingRaces,
  });

  return NextResponse.json({
    ...result,
    imported: result.imported.map((race) => enrichDryRunRace(race, existingRaces)),
  });
}
