import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// DELETE /api/admin/providers/:id - Delete a provider (vendor) by admin
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 }
    );
  }

  const providerId = params.id;
  try {
    await prisma.provider.delete({
      where: { id: providerId },
    });
    return NextResponse.json({
      success: true,
      message: "Provider deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete provider" },
      { status: 500 }
    );
  }
}
