import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const exportSchema = z.object({
  type: z.enum(["users", "providers", "bookings", "reviews", "inquiries"]),
  format: z.enum(["json", "csv"]).default("json"),
  filters: z.record(z.string(), z.unknown()).optional(),
});

// POST /api/admin/export - Export data (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validation = exportSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: validation.error.issues },
        { status: 400 }
      );
    }

    const { type, format, filters } = validation.data;
    let data: any[] = [];

    switch (type) {
      case "users":
        data = await prisma.user.findMany({
          where: filters,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            emailVerifiedAt: true,
            createdAt: true,
          },
        });
        break;

      case "providers":
        data = await prisma.provider.findMany({
          where: filters,
          include: {
            owner: {
              select: { name: true, email: true },
            },
          },
        });
        break;

      case "bookings":
        data = await prisma.booking.findMany({
          where: filters,
          include: {
            provider: {
              select: { businessName: true },
            },
            quote: {
              select: { totalPrice: true },
            },
          },
        });
        break;

      case "reviews":
        data = await prisma.review.findMany({
          where: filters,
          include: {
            provider: {
              select: { businessName: true },
            },
          },
        });
        break;

      case "inquiries":
        data = await prisma.inquiry.findMany({
          where: filters,
          include: {
            provider: {
              select: { businessName: true },
            },
          },
        });
        break;
    }

    if (format === "csv") {
      const csv = convertToCSV(data);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${type}-export-${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({
      type,
      count: data.length,
      data,
      exportedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    logger.error("Error exporting data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return "";

  const flattenObject = (obj: any, prefix = ""): Record<string, any> => {
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key];
      const newKey = prefix ? `${prefix}_${key}` : key;

      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        !(value instanceof Date)
      ) {
        Object.assign(acc, flattenObject(value, newKey));
      } else if (Array.isArray(value)) {
        acc[newKey] = JSON.stringify(value);
      } else if (value instanceof Date) {
        acc[newKey] = value.toISOString();
      } else {
        acc[newKey] = value;
      }

      return acc;
    }, {} as Record<string, any>);
  };

  const flatData = data.map((item) => flattenObject(item));
  const headers = [...new Set(flatData.flatMap((item) => Object.keys(item)))];

  const escapeCSV = (val: any): string => {
    if (val === null || val === undefined) return "";
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = [
    headers.join(","),
    ...flatData.map((item) =>
      headers.map((header) => escapeCSV(item[header])).join(",")
    ),
  ];

  return rows.join("\n");
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
