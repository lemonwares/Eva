import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// POST /api/notifications/seed - Create sample notifications for testing
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Create sample notifications
    const sampleNotifications = [
      {
        userId: session.user.id,
        title: "Welcome to EVA!",
        message: "Your vendor profile has been successfully created. Start adding your services to attract more clients.",
        type: "success",
        isRead: false,
      },
      {
        userId: session.user.id,
        title: "New Inquiry Received",
        message: "You have received a new inquiry for your catering services. Check your inquiries to respond.",
        type: "info",
        isRead: false,
      },
      {
        userId: session.user.id,
        title: "Profile Verification Pending",
        message: "Your profile is under review for verification. This usually takes 1-2 business days.",
        type: "warning",
        isRead: true,
      },
      {
        userId: session.user.id,
        title: "Payment Received",
        message: "You have received a payment of £250.00 for booking #BK123456.",
        type: "success",
        isRead: true,
      },
      {
        userId: session.user.id,
        title: "Update Your Business Hours",
        message: "Don't forget to set your business hours so clients know when you're available.",
        type: "info",
        isRead: false,
      },
    ];

    // Delete existing notifications for this user (for testing)
    await prisma.notification.deleteMany({
      where: { userId: session.user.id },
    });

    // Create new notifications
    await prisma.notification.createMany({
      data: sampleNotifications,
    });

    return NextResponse.json({ 
      message: "Sample notifications created successfully",
      count: sampleNotifications.length 
    });
  } catch (error: any) {
    console.error("Error creating sample notifications:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";