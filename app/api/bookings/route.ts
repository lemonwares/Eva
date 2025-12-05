import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/bookings - List bookings (for authenticated vendor, client, or admin)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const providerId = searchParams.get("providerId");
    const upcoming = searchParams.get("upcoming");
    const skip = (page - 1) * limit;

    const filters: any = {};

    // Role-based filtering
    if (session.user.role === "PROFESSIONAL") {
      const provider = await prisma.provider.findFirst({
        where: { ownerUserId: session.user.id },
        select: { id: true },
      });

      if (!provider) {
        // Return empty array if vendor hasn't created provider profile yet
        return NextResponse.json({
          bookings: [],
          pagination: { page, limit, total: 0, pages: 0 },
        });
      }
      filters.providerId = provider.id;
    } else if (session.user.role === "ADMINISTRATOR") {
      if (providerId) filters.providerId = providerId;
    } else if (session.user.role === "CLIENT") {
      // Clients can see their own bookings (by email)
      filters.clientEmail = session.user.email;
    } else {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (status) {
      filters.status = status;
    }

    // Filter for upcoming events
    if (upcoming === "true") {
      filters.eventDate = { gte: new Date() };
    }

    const orderBy: any[] = [{ eventDate: "asc" }];

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where: filters,
        skip,
        take: limit,
        include: {
          provider: {
            select: {
              id: true,
              businessName: true,
              coverImage: true,
              city: true,
              phonePublic: true,
            },
          },
          quote: {
            select: {
              id: true,
              items: true,
              totalPrice: true,
              inquiry: {
                select: {
                  fromName: true,
                  fromEmail: true,
                },
              },
            },
          },
        },
        orderBy,
      }),
      prisma.booking.count({ where: filters }),
    ]);

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
