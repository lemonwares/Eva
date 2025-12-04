import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// This is a placeholder upload endpoint
// In production, you would integrate with:
// - Azure Blob Storage
// - AWS S3
// - Cloudinary
// - Uploadthing
// - or similar file storage service

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// POST /api/upload - Upload file(s)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const type = formData.get("type") as string; // "avatar", "cover", "gallery", "listing"

    if (!files || files.length === 0) {
      return NextResponse.json(
        { message: "No files provided" },
        { status: 400 }
      );
    }

    const uploadedFiles: Array<{
      name: string;
      url: string;
      size: number;
      type: string;
    }> = [];

    const errors: Array<{ name: string; error: string }> = [];

    for (const file of files) {
      // Validate file type
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        errors.push({
          name: file.name,
          error: `Invalid file type. Allowed: ${ALLOWED_IMAGE_TYPES.join(
            ", "
          )}`,
        });
        continue;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push({
          name: file.name,
          error: `File too large. Maximum size: ${
            MAX_FILE_SIZE / (1024 * 1024)
          }MB`,
        });
        continue;
      }

      // In production, upload to cloud storage here
      // For now, generate a placeholder URL
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const placeholderUrl = `/uploads/${type}/${session.user.id}/${timestamp}-${safeName}`;

      uploadedFiles.push({
        name: file.name,
        url: placeholderUrl,
        size: file.size,
        type: file.type,
      });
    }

    if (uploadedFiles.length === 0 && errors.length > 0) {
      return NextResponse.json(
        { message: "All files failed validation", errors },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      files: uploadedFiles,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
