import { NextResponse } from "next/server";
import { addPendingRaceRecords } from "@/lib/supabase/races";
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

  const result = await addPendingRaceRecords(body.races);

  if (result.error || !result.data) {
    return NextResponse.json({ error: result.error ?? "Import failed." }, { status: 500 });
  }

  return NextResponse.json({
    importedCount: result.data.importedCount,
    skippedCount: 0,
    imported: body.races,
    skipped: [],
  });
}
