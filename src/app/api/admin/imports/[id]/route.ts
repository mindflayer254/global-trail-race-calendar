import { NextResponse } from "next/server";
import {
  mergeWorkflowDuplicates,
  updateWorkflowRace,
  updateWorkflowRaceStatus,
} from "@/backend/race-store";
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
    const race = mergeWorkflowDuplicates(id);

    if (!race) {
      return NextResponse.json({ error: "Race not found" }, { status: 404 });
    }

    return NextResponse.json({ race });
  }

  if (body.action === "edit") {
    const race = updateWorkflowRace(id, sanitizePatch(body.patch));

    if (!race) {
      return NextResponse.json({ error: "Race not found" }, { status: 404 });
    }

    return NextResponse.json({ race });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}

function updateStatus(id: string, status: VerificationStatus) {
  const race = updateWorkflowRaceStatus(id, status);

  if (!race) {
    return NextResponse.json({ error: "Race not found" }, { status: 404 });
  }

  return NextResponse.json({ race });
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
