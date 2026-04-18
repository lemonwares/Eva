import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { logger } from "@/lib/logger";

// GET /api/admin/payouts — list all payout requests
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && status !== "all") where.status = status;
    if (search) {
      where.OR = [
        { bankName: { contains: search, mode: "insensitive" } },
        { accountName: { contains: search, mode: "insensitive" } },
        { accountNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    const [payouts, total] = await Promise.all([
      prisma.payout.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.payout.count({ where }),
    ]);

    // Fetch provider details separately
    const providerIds = [...new Set(payouts.map((p: any) => p.providerId))];
    const providers =
      providerIds.length > 0
        ? await prisma.provider.findMany({
            where: { id: { in: providerIds as string[] } },
            select: { id: true, businessName: true, city: true },
          })
        : [];

    const providerMap = Object.fromEntries(providers.map((p) => [p.id, p]));

    const enriched = payouts.map((p: any) => ({
      ...p,
      provider: providerMap[p.providerId] || {
        id: p.providerId,
        businessName: "Unknown",
        city: null,
      },
    }));

    // If searching by vendor name, filter after enrichment
    const filtered = search
      ? enriched.filter(
          (p: any) =>
            p.provider.businessName
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            p.bankName.toLowerCase().includes(search.toLowerCase()) ||
            p.accountName.toLowerCase().includes(search.toLowerCase()) ||
            p.accountNumber.includes(search),
        )
      : enriched;

    return NextResponse.json({
      payouts: filtered,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    logger.error("Error fetching admin payouts:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
