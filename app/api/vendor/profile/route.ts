import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/vendor/profile - Get vendor's provider profile
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const provider = await prisma.provider.findFirst({
      where: { ownerUserId: session.user.id },
      include: {
        listings: {
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            reviews: true,
            bookings: true,
            inquiries: true,
            listings: true,
          },
        },
      },
    });

    if (!provider) {
      return NextResponse.json(
        { message: "No provider profile found", provider: null },
        { status: 200 }
      );
    }

    return NextResponse.json({ provider });
  } catch (error: unknown) {
    console.error("Error fetching vendor profile:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/vendor/profile - Create a new vendor profile (onboarding)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if user already has a provider profile
    const existingProvider = await prisma.provider.findFirst({
      where: { ownerUserId: session.user.id },
    });

    if (existingProvider) {
      return NextResponse.json(
        { message: "You already have a vendor profile" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      businessName,
      description,
      phonePublic,
      website,
      address,
      city,
      postcode,
      serviceRadiusMiles,
      categories,
      subcategories,
      cultureTraditionTags,
      instagram,
      tiktok,
      facebook,
      coverImage,
      photos,
      priceFrom,
      isPublished,
    } = body;

    // Validation
    if (!businessName || !postcode || !serviceRadiusMiles) {
      return NextResponse.json(
        { message: "Business name, postcode, and service radius are required" },
        { status: 400 }
      );
    }

    // Geocode the postcode
    let geoLat: number | null = null;
    let geoLng: number | null = null;

    try {
      // Check cache first
      const cached = await prisma.postcodeCache.findUnique({
        where: { postcode: postcode.toUpperCase().replace(/\s/g, "") },
      });

      if (cached) {
        geoLat = cached.latitude;
        geoLng = cached.longitude;
      } else {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            postcode
          )}&countrycodes=gb`,
          {
            headers: {
              "User-Agent": "EVA-EventVendorApp/1.0",
            },
          }
        );
        const geoData = await geoRes.json();
        if (geoData && geoData.length > 0) {
          geoLat = parseFloat(geoData[0].lat);
          geoLng = parseFloat(geoData[0].lon);

          // Cache the result
          await prisma.postcodeCache.create({
            data: {
              postcode: postcode.toUpperCase().replace(/\s/g, ""),
              latitude: geoLat,
              longitude: geoLng,
              city: city || null,
            },
          });
        }
      }
    } catch {
      // Geocoding failed, continue without coordinates
    }

    // Create the provider profile
    const provider = await prisma.provider.create({
      data: {
        ownerUserId: session.user.id,
        businessName,
        description: description || null,
        phonePublic: phonePublic || null,
        website: website || null,
        address: address || null,
        city: city || null,
        postcode,
        serviceRadiusMiles: Number(serviceRadiusMiles),
        geoLat,
        geoLng,
        categories: categories || [],
        subcategories: subcategories || [],
        cultureTraditionTags: cultureTraditionTags || [],
        instagram: instagram || null,
        tiktok: tiktok || null,
        facebook: facebook || null,
        coverImage: coverImage || null,
        photos: photos || [],
        priceFrom: priceFrom ? Number(priceFrom) : null,
        isPublished: isPublished ?? false,
        isVerified: false,
        planTier: "FREE",
      },
    });

    // Update user role to PROFESSIONAL if not already
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "PROFESSIONAL" },
    });

    return NextResponse.json(
      { message: "Profile created successfully", provider },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating vendor profile:", message);

    // Check for specific Prisma errors
    if (message.includes("Unique constraint")) {
      return NextResponse.json(
        { message: "A vendor profile with this information already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create vendor profile. Please try again." },
      { status: 500 }
    );
  }
}

// PUT /api/vendor/profile - Update vendor profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const provider = await prisma.provider.findFirst({
      where: { ownerUserId: session.user.id },
    });

    if (!provider) {
      return NextResponse.json(
        { message: "No provider profile found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      businessName,
      description,
      phonePublic,
      website,
      address,
      city,
      postcode,
      serviceRadiusMiles,
      categories,
      subcategories,
      cultureTraditionTags,
      instagram,
      tiktok,
      facebook,
      coverImage,
      photos,
      priceFrom,
      isPublished,
    } = body;

    // Re-geocode if postcode changed
    let geoLat = provider.geoLat;
    let geoLng = provider.geoLng;

    if (postcode && postcode !== provider.postcode) {
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            postcode
          )}&countrycodes=gb`,
          {
            headers: {
              "User-Agent": "EVA-EventVendorApp/1.0",
            },
          }
        );
        const geoData = await geoRes.json();
        if (geoData && geoData.length > 0) {
          geoLat = parseFloat(geoData[0].lat);
          geoLng = parseFloat(geoData[0].lon);
        }
      } catch {
        // Geocoding failed, keep existing coordinates
      }
    }

    const updatedProvider = await prisma.provider.update({
      where: { id: provider.id },
      data: {
        ...(businessName !== undefined && { businessName }),
        ...(description !== undefined && { description }),
        ...(phonePublic !== undefined && { phonePublic }),
        ...(website !== undefined && { website }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(postcode !== undefined && { postcode, geoLat, geoLng }),
        ...(serviceRadiusMiles !== undefined && {
          serviceRadiusMiles: Number(serviceRadiusMiles),
        }),
        ...(categories !== undefined && { categories }),
        ...(subcategories !== undefined && { subcategories }),
        ...(cultureTraditionTags !== undefined && { cultureTraditionTags }),
        ...(instagram !== undefined && { instagram }),
        ...(tiktok !== undefined && { tiktok }),
        ...(facebook !== undefined && { facebook }),
        ...(coverImage !== undefined && { coverImage }),
        ...(photos !== undefined && { photos }),
        ...(priceFrom !== undefined && {
          priceFrom: priceFrom ? Number(priceFrom) : null,
        }),
        ...(isPublished !== undefined && { isPublished }),
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      provider: updatedProvider,
    });
  } catch (error: unknown) {
    console.error("Error updating vendor profile:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
