import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import {
  userProfileUpdateSchema,
  formatValidationErrors,
} from "@/lib/validations";

// PATCH /api/users/me - Update current user's profile (partial update)
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let data: any = {};
  try {
    data = await request.json();
  } catch (err) {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const parsed = userProfileUpdateSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Validation failed",
        errors: formatValidationErrors(parsed.error.issues),
      },
      { status: 400 },
    );
  }

  const updateData = parsed.data;
  // Filter out undefined fields
  const cleanData = Object.fromEntries(
    Object.entries(updateData).filter(([_, v]) => v !== undefined),
  );

  if (Object.keys(cleanData).length === 0) {
    return NextResponse.json(
      { message: "No valid fields to update" },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: cleanData,
    });
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 },
    );
  }
}

// GET /api/users/me - Get current user's profile
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      //   notificationPreferences: true,
    },
  });
  return NextResponse.json({ user });
}
