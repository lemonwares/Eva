import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// Types for import data
interface ProviderImportRow {
  businessName: string;
  description?: string;
  postcode: string;
  city?: string;
  serviceRadiusMiles?: number;
  categories?: string;
  cultureTraditionTags?: string;
  priceFrom?: number;
  phonePublic?: string;
  website?: string;
  instagram?: string;
  email?: string; // Owner email
}

interface ImportResult {
  success: boolean;
  row: number;
  businessName: string;
  error?: string;
  providerId?: string;
}

// POST /api/admin/import - Import data from CSV
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || user.role !== "ADMINISTRATOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { type, data, isDryRun = false } = body;

    if (!type || !data || !Array.isArray(data)) {
      return NextResponse.json(
        { message: "Type and data array are required" },
        { status: 400 }
      );
    }

    let results: ImportResult[] = [];
    let importJobId: string | null = null;

    // Create import job record
    if (!isDryRun) {
      const importJob = await prisma.importJob.create({
        data: {
          type: type.toUpperCase() as
            | "PROVIDERS"
            | "CATEGORIES"
            | "CITIES"
            | "CULTURE_TAGS",
          fileName: "api-import",
          fileUrl: "",
          mapping: {},
          isDryRun,
          status: "PROCESSING",
          totalRows: data.length,
          createdBy: session.user.id,
          startedAt: new Date(),
        },
      });
      importJobId = importJob.id;
    }

    try {
      switch (type.toLowerCase()) {
        case "providers":
          results = await importProviders(data, isDryRun, session.user.id);
          break;
        case "categories":
          results = await importCategories(data, isDryRun);
          break;
        case "cities":
          results = await importCities(data, isDryRun);
          break;
        case "culture_tags":
          results = await importCultureTags(data, isDryRun);
          break;
        default:
          return NextResponse.json(
            { message: `Unsupported import type: ${type}` },
            { status: 400 }
          );
      }

      // Update import job with results
      if (!isDryRun && importJobId) {
        const successCount = results.filter((r) => r.success).length;
        const failedCount = results.filter((r) => !r.success).length;

        await prisma.importJob.update({
          where: { id: importJobId },
          data: {
            status: failedCount === data.length ? "FAILED" : "COMPLETED",
            processedRows: data.length,
            successfulRows: successCount,
            failedRows: failedCount,
            completedAt: new Date(),
            summary: JSON.parse(
              JSON.stringify({
                total: data.length,
                successful: successCount,
                failed: failedCount,
                results: results.slice(0, 100), // Store first 100 for reference
              })
            ),
          },
        });

        // Log errors
        const errors = results.filter((r) => !r.success);
        for (const error of errors.slice(0, 1000)) {
          await prisma.importError.create({
            data: {
              jobId: importJobId,
              rowNumber: error.row,
              rowData: { businessName: error.businessName },
              errorMessage: error.error || "Unknown error",
            },
          });
        }
      }

      const successCount = results.filter((r) => r.success).length;
      const failedCount = results.filter((r) => !r.success).length;

      return NextResponse.json({
        message: isDryRun
          ? "Dry run completed"
          : `Import completed: ${successCount} succeeded, ${failedCount} failed`,
        summary: {
          total: data.length,
          successful: successCount,
          failed: failedCount,
        },
        results: results.slice(0, 100), // Return first 100 results
        importJobId,
      });
    } catch (error) {
      // Update import job on error
      if (!isDryRun && importJobId) {
        await prisma.importJob.update({
          where: { id: importJobId },
          data: {
            status: "FAILED",
            completedAt: new Date(),
          },
        });
      }
      throw error;
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Import error:", errorMessage);
    return NextResponse.json(
      { message: "Import failed", error: errorMessage },
      { status: 500 }
    );
  }
}

// Import providers
async function importProviders(
  data: ProviderImportRow[],
  isDryRun: boolean,
  adminUserId: string
): Promise<ImportResult[]> {
  const results: ImportResult[] = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowNum = i + 1;

    try {
      // Validate required fields
      if (!row.businessName) {
        results.push({
          success: false,
          row: rowNum,
          businessName: row.businessName || "Unknown",
          error: "Missing business name",
        });
        continue;
      }

      if (!row.postcode) {
        results.push({
          success: false,
          row: rowNum,
          businessName: row.businessName,
          error: "Missing postcode",
        });
        continue;
      }

      // Parse categories and culture tags
      const categories = row.categories
        ? row.categories.split(",").map((c: string) => c.trim().toLowerCase())
        : [];
      const cultureTags = row.cultureTraditionTags
        ? row.cultureTraditionTags
            .split(",")
            .map((t: string) => t.trim().toLowerCase())
        : [];

      if (isDryRun) {
        results.push({
          success: true,
          row: rowNum,
          businessName: row.businessName,
        });
        continue;
      }

      // Find or create owner user (if email provided)
      let ownerId = adminUserId;
      if (row.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: row.email.toLowerCase() },
        });

        if (existingUser) {
          ownerId = existingUser.id;
        } else {
          // Create a placeholder user
          const newUser = await prisma.user.create({
            data: {
              email: row.email.toLowerCase(),
              name: row.businessName,
              password: "", // They'll need to reset password
              role: "PROFESSIONAL",
            },
          });
          ownerId = newUser.id;
        }
      }

      // Geocode postcode
      let geoLat: number | null = null;
      let geoLng: number | null = null;

      try {
        const cached = await prisma.postcodeCache.findUnique({
          where: { postcode: row.postcode.toUpperCase().replace(/\s/g, "") },
        });

        if (cached) {
          geoLat = cached.latitude;
          geoLng = cached.longitude;
        } else {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              row.postcode
            )}&countrycodes=gb`,
            {
              headers: { "User-Agent": "EVA-EventVendorApp/1.0" },
            }
          );
          const geoData = await geoRes.json();
          if (geoData && geoData.length > 0) {
            geoLat = parseFloat(geoData[0].lat);
            geoLng = parseFloat(geoData[0].lon);

            // Cache the result
            await prisma.postcodeCache.create({
              data: {
                postcode: row.postcode.toUpperCase().replace(/\s/g, ""),
                latitude: geoLat,
                longitude: geoLng,
                city: row.city || null,
              },
            });
          }
        }
      } catch {
        // Geocoding failed, continue without coordinates
      }

      // Check for existing provider
      const existing = await prisma.provider.findFirst({
        where: {
          businessName: row.businessName,
          postcode: row.postcode,
        },
      });

      if (existing) {
        results.push({
          success: false,
          row: rowNum,
          businessName: row.businessName,
          error: "Provider already exists with same name and postcode",
        });
        continue;
      }

      // Create provider
      const provider = await prisma.provider.create({
        data: {
          ownerUserId: ownerId,
          businessName: row.businessName,
          description: row.description || null,
          postcode: row.postcode.toUpperCase(),
          city: row.city || null,
          serviceRadiusMiles: row.serviceRadiusMiles || 15,
          geoLat,
          geoLng,
          categories,
          cultureTraditionTags: cultureTags,
          priceFrom: row.priceFrom || null,
          phonePublic: row.phonePublic || null,
          website: row.website || null,
          instagram: row.instagram || null,
          isPublished: true,
          isVerified: false,
          planTier: "FREE",
        },
      });

      results.push({
        success: true,
        row: rowNum,
        businessName: row.businessName,
        providerId: provider.id,
      });

      // Rate limit geocoding (1 request per second for Nominatim)
      await new Promise((resolve) => setTimeout(resolve, 1100));
    } catch (error) {
      results.push({
        success: false,
        row: rowNum,
        businessName: row.businessName || "Unknown",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return results;
}

// Import categories
async function importCategories(
  data: Array<{
    name: string;
    slug?: string;
    description?: string;
    icon?: string;
  }>,
  isDryRun: boolean
): Promise<ImportResult[]> {
  const results: ImportResult[] = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowNum = i + 1;

    try {
      if (!row.name) {
        results.push({
          success: false,
          row: rowNum,
          businessName: row.name || "Unknown",
          error: "Missing category name",
        });
        continue;
      }

      if (isDryRun) {
        results.push({
          success: true,
          row: rowNum,
          businessName: row.name,
        });
        continue;
      }

      const slug = row.slug || row.name.toLowerCase().replace(/\s+/g, "-");

      // Check for existing
      const existing = await prisma.category.findFirst({
        where: { OR: [{ slug }, { name: row.name }] },
      });

      if (existing) {
        results.push({
          success: false,
          row: rowNum,
          businessName: row.name,
          error: "Category already exists",
        });
        continue;
      }

      await prisma.category.create({
        data: {
          name: row.name,
          slug,
          description: row.description || null,
          icon: row.icon || null,
        },
      });

      results.push({
        success: true,
        row: rowNum,
        businessName: row.name,
      });
    } catch (error) {
      results.push({
        success: false,
        row: rowNum,
        businessName: row.name || "Unknown",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return results;
}

// Import cities
async function importCities(
  data: Array<{
    name: string;
    slug?: string;
    county?: string;
    region?: string;
    latitude?: number;
    longitude?: number;
  }>,
  isDryRun: boolean
): Promise<ImportResult[]> {
  const results: ImportResult[] = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowNum = i + 1;

    try {
      if (!row.name) {
        results.push({
          success: false,
          row: rowNum,
          businessName: row.name || "Unknown",
          error: "Missing city name",
        });
        continue;
      }

      if (isDryRun) {
        results.push({
          success: true,
          row: rowNum,
          businessName: row.name,
        });
        continue;
      }

      const slug = row.slug || row.name.toLowerCase().replace(/\s+/g, "-");

      // Check for existing
      const existing = await prisma.city.findFirst({
        where: { OR: [{ slug }, { name: row.name }] },
      });

      if (existing) {
        results.push({
          success: false,
          row: rowNum,
          businessName: row.name,
          error: "City already exists",
        });
        continue;
      }

      await prisma.city.create({
        data: {
          name: row.name,
          slug,
          county: row.county || null,
          region: row.region || null,
          latitude: row.latitude || null,
          longitude: row.longitude || null,
        },
      });

      results.push({
        success: true,
        row: rowNum,
        businessName: row.name,
      });
    } catch (error) {
      results.push({
        success: false,
        row: rowNum,
        businessName: row.name || "Unknown",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return results;
}

// Import culture/tradition tags
async function importCultureTags(
  data: Array<{
    name: string;
    slug?: string;
    description?: string;
    icon?: string;
  }>,
  isDryRun: boolean
): Promise<ImportResult[]> {
  const results: ImportResult[] = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowNum = i + 1;

    try {
      if (!row.name) {
        results.push({
          success: false,
          row: rowNum,
          businessName: row.name || "Unknown",
          error: "Missing tag name",
        });
        continue;
      }

      if (isDryRun) {
        results.push({
          success: true,
          row: rowNum,
          businessName: row.name,
        });
        continue;
      }

      const slug = row.slug || row.name.toLowerCase().replace(/\s+/g, "-");

      // Check for existing
      const existing = await prisma.cultureTraditionTag.findFirst({
        where: { OR: [{ slug }, { name: row.name }] },
      });

      if (existing) {
        results.push({
          success: false,
          row: rowNum,
          businessName: row.name,
          error: "Culture tag already exists",
        });
        continue;
      }

      await prisma.cultureTraditionTag.create({
        data: {
          name: row.name,
          slug,
          description: row.description || null,
          icon: row.icon || null,
          isActive: true,
        },
      });

      results.push({
        success: true,
        row: rowNum,
        businessName: row.name,
      });
    } catch (error) {
      results.push({
        success: false,
        row: rowNum,
        businessName: row.name || "Unknown",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return results;
}

// GET /api/admin/import - Get import jobs history
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || user.role !== "ADMINISTRATOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const [jobs, total] = await Promise.all([
      prisma.importJob.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: {
            select: { errors: true },
          },
        },
      }),
      prisma.importJob.count(),
    ]);

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching import jobs:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
