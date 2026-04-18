import { NextResponse } from "next/server";
import { getPlatformFeePercent } from "@/lib/platform-settings";

// GET /api/settings/platform-fee — public, used by vendor payments page
export async function GET() {
  const percent = await getPlatformFeePercent();
  return NextResponse.json({ percent });
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
