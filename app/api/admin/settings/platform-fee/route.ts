import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPlatformFeePercent, setPlatformFeePercent } from "@/lib/platform-settings";
import { logger } from "@/lib/logger";

// GET /api/admin/settings/platform-fee
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const percent = await getPlatformFeePercent();
    return NextResponse.json({ percent });
  } catch (error) {
    logger.error("Error fetching platform fee:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/admin/settings/platform-fee
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { percent } = await request.json();
    const num = parseFloat(percent);

    if (isNaN(num) || num < 0 || num > 100) {
      return NextResponse.json(
        { message: "Fee must be between 0 and 100" },
        { status: 400 }
      );
    }

    await setPlatformFeePercent(num, session.user.id);
    return NextResponse.json({ percent: num, message: `Platform fee updated to ${num}%` });
  } catch (error) {
    logger.error("Error updating platform fee:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
