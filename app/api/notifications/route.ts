import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// GET /api/notifications - Get user's notifications
// Note: Notification model not implemented yet. Returns empty array.
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // TODO: Implement user notifications when model is added
    return NextResponse.json({
      notifications: [],
      unreadCount: 0,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
      },
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
