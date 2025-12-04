import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// PATCH /api/notifications/:id - Mark notification as read
// Note: Notification model not implemented yet. Returns stub response.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // TODO: Implement when Notification model is added
    return NextResponse.json(
      { message: "Notification feature not implemented yet" },
      { status: 501 }
    );
  } catch (error: any) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications/:id - Delete notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // TODO: Implement when Notification model is added
    return NextResponse.json(
      { message: "Notification feature not implemented yet" },
      { status: 501 }
    );
  } catch (error: any) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
