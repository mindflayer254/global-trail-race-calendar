import { NextResponse } from "next/server";
import { getRaces } from "@/lib/races";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    races: getRaces(),
  });
}
