import { NextResponse } from "next/server";
import { getRaces } from "@/lib/races";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getRaces();

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ races: result.data });
}
