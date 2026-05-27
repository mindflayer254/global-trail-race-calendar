import { NextResponse } from "next/server";
import { addPendingImportedRaces } from "@/backend/race-store";
import type { BackendRace } from "@/backend/race-model";

export const dynamic = "force-dynamic";

type ConfirmImportBody = {
  races: BackendRace[];
};

export async function POST(request: Request) {
  const body = (await request.json()) as ConfirmImportBody;

  if (!Array.isArray(body.races)) {
    return NextResponse.json({ error: "Expected races array." }, { status: 400 });
  }

  const result = addPendingImportedRaces(body.races);

  return NextResponse.json({
    importedCount: result.imported.length,
    skippedCount: result.skipped.length,
    imported: result.imported,
    skipped: result.skipped,
  });
}
