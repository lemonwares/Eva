import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { getPlatformFee } from "@/lib/platform-settings";

const payoutSchema = z.object({
  amount: z.union([z.number(), z.string()]).transform((val) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    if (isNaN(num) || num <= 0) throw new Error("Amount must be greater than 0");
    return num;
  }),
  bankName: z.string().min(2, "Bank name is required"),
  accountName: z.string().min(2, "Account name is required"),
  accountNumber: z.string().min(6, "Account number is required"),
  sortCode: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/vendor/payouts — list vendor's payout requests
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "PROFESSIONAL") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const provider = await prisma.provider.findFirst({
      where: { ownerUserId: session.user.id },
      select: { id: true },
    });
    if (!provider) {
      return NextResponse.json({
        payouts: [],
        pagination: { total: 0, page: 1, limit: 20, totalPages: 1 },
      });
    }

    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [payouts, total] = await Promise.all([
      prisma.payout.findMany({
        where: { providerId: provider.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.payout.count({ where: { providerId: provider.id } }),
    ]);

    return NextResponse.json({
      payouts,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    logger.error("Error fetching payouts:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// POST /api/vendor/payouts — request a payout
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "PROFESSIONAL") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = payoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { amount, bankName, accountName, accountNumber, sortCode, notes } = parsed.data;

    const provider = await prisma.provider.findFirst({
      where: { ownerUserId: session.user.id },
      select: { id: true },
    });
    if (!provider) {
      return NextResponse.json({ message: "Provider profile not found" }, { status: 404 });
    }

    const availableBalance = await getAvailableBalance(provider.id);

    if (amount > availableBalance) {
      return NextResponse.json(
        { message: `Insufficient balance. Available: £${availableBalance.toFixed(2)}` },
        { status: 400 }
      );
    }

    const payout = await prisma.payout.create({
      data: {
        providerId: provider.id,
        amount,
        bankName,
        accountName,
        accountNumber,
        sortCode,
        notes,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { payout, message: "Payout request submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Error creating payout:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

async function getAvailableBalance(providerId: string): Promise<number> {
  const platformFee = await getPlatformFee();

  const [bookings, payouts] = await Promise.all([
    prisma.booking.findMany({
      where: {
        providerId,
        status: { in: ["CONFIRMED", "DEPOSIT_PAID", "COMPLETED"] },
      },
      select: { pricingTotal: true },
    }),
    prisma.payout.findMany({
      where: {
        providerId,
        status: { in: ["PENDING", "APPROVED", "PROCESSING", "PAID"] },
      },
      select: { amount: true },
    }),
  ]);

  const totalCollected = bookings.reduce((sum, b) => sum + (b.pricingTotal || 0), 0);
  const afterFees = totalCollected * (1 - platformFee);
  const alreadyRequested = payouts.reduce((sum, p) => sum + p.amount, 0);

  return Math.max(0, afterFees - alreadyRequested);
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
