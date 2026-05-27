import { NextResponse } from "next/server";
import { getPendingWorkflowRaces } from "@/backend/race-store";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    races: getPendingWorkflowRaces(),
  });
}
