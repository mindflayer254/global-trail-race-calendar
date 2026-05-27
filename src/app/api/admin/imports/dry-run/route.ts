import { NextResponse } from "next/server";
import { getAllWorkflowRaces } from "@/backend/race-store";
import { enrichDryRunRace } from "@/backend/dry-run-review";
import { previewAhotuTrailRunningImport } from "@/backend/ingestion/dry-run";

export const dynamic = "force-dynamic";

type DryRunRequestBody = {
  listingUrl?: string;
  maxRecords?: number;
};

export async function POST(request: Request) {
  const body = (await request.json()) as DryRunRequestBody;
  const existingRaces = getAllWorkflowRaces();
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
