import { NextResponse } from "next/server";
import { updateRaceRecord, updateRaceVerificationStatus } from "@/lib/supabase/races";
import type { BackendRace, VerificationStatus } from "@/backend/race-model";

export const dynamic = "force-dynamic";

type RouteParams = {
  params: Promise<{ id: string }>;
};

type AdminImportPatchBody =
  | { action: "approve" }
  | { action: "reject" }
  | { action: "merge" }
  | { action: "edit"; patch: Partial<BackendRace> };

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = (await request.json()) as AdminImportPatchBody;

  if (body.action === "approve") {
    return updateStatus(id, "verified");
  }

  if (body.action === "reject") {
    return updateStatus(id, "rejected");
  }

  if (body.action === "merge") {
    return NextResponse.json(
      { error: "Merge is not implemented for Supabase persistence yet. Edit or reject duplicates manually." },
      { status: 501 },
    );
  }

  if (body.action === "edit") {
    const result = await updateRaceRecord(id, sanitizePatch(body.patch));

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ race: result.data });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}

async function updateStatus(id: string, status: VerificationStatus) {
  const result = await updateRaceVerificationStatus(id, status);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ race: result.data });
}

function sanitizePatch(patch: Partial<BackendRace>) {
  const allowedPatch: Partial<BackendRace> = {};
  const allowedFields: Array<keyof BackendRace> = [
    "raceName",
    "country",
    "region",
    "city",
    "raceDate",
    "registrationOpenDate",
    "registrationCloseDate",
    "organizer",
    "officialWebsite",
    "registrationUrl",
    "notes",
  ];

  allowedFields.forEach((field) => {
    if (patch[field] !== undefined) {
      allowedPatch[field] = patch[field] as never;
    }
  });

  return allowedPatch;
}
