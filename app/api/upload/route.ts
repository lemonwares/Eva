import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadImage, deleteImage } from "@/lib/backblaze";
import {
  checkRateLimit,
  getRateLimitIdentifier,
  rateLimitResponse,
  rateLimitPresets,
} from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const MAX_FILE_SIZE = 500 * 1024; // 500KB

// POST /api/upload — upload file(s) to Backblaze B2
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const identifier = getRateLimitIdentifier(request, session.user.id);
    const rateCheck = checkRateLimit(`upload:${identifier}`, rateLimitPresets.upload);
    if (!rateCheck.success) return rateLimitResponse(rateCheck);

    // Check B2 is configured
    if (!process.env.B2_KEY_ID || !process.env.B2_APPLICATION_KEY || !process.env.B2_BUCKET_NAME) {
      return NextResponse.json(
        { message: "Image storage not configured. Please add Backblaze B2 credentials." },
        { status: 500 }
      );
    }

    const contentType = request.headers.get("content-type") || "";

    // ── FormData (file upload) ──────────────────────────────────────────────
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const files = formData.getAll("files") as File[];
      const type = (formData.get("type") as string) || "general";

      if (!files || files.length === 0) {
        return NextResponse.json({ message: "No files provided" }, { status: 400 });
      }

      const uploadedFiles: Array<{ name: string; url: string; publicId: string; size: number; type: string }> = [];
      const errors: Array<{ name: string; error: string }> = [];

      for (const file of files) {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          errors.push({ name: file.name, error: `Invalid file type. Allowed: JPEG, PNG, WebP, AVIF` });
          continue;
        }

        if (file.size > MAX_FILE_SIZE) {
          errors.push({ name: file.name, error: `File too large. Maximum size is 500KB` });
          continue;
        }

        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          const folder = `eva/${type}/${session.user.id}`;

          const result = await uploadImage(buffer, { folder }, file.type);

          logger.info(`[UPLOAD] File uploaded: ${result.secure_url}`);

          uploadedFiles.push({
            name: file.name,
            url: result.secure_url,
            publicId: result.public_id,
            size: file.size,
            type: file.type,
          });
        } catch (uploadError) {
          logger.error(`Error uploading ${file.name}:`, uploadError);
          errors.push({ name: file.name, error: "Failed to upload to storage" });
        }
      }

      if (uploadedFiles.length === 0 && errors.length > 0) {
        return NextResponse.json({ message: errors[0].error, errors }, { status: 502 });
      }

      return NextResponse.json({
        success: true,
        message: `${uploadedFiles.length} file(s) uploaded successfully`,
        files: uploadedFiles,
        url: uploadedFiles.length === 1 ? uploadedFiles[0].url : undefined,
        errors: errors.length > 0 ? errors : undefined,
      });
    }

    // ── JSON body (base64 image) ────────────────────────────────────────────
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const { image, folder, type } = body;

      if (!image) {
        return NextResponse.json({ message: "No image provided" }, { status: 400 });
      }

      const matches = image.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        return NextResponse.json({ message: "Invalid image format. Provide a base64 encoded image." }, { status: 400 });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];

      if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
        return NextResponse.json({ message: `Invalid file type. Allowed: JPEG, PNG, WebP, AVIF` }, { status: 400 });
      }

      // base64 is ~33% larger than binary
      const approximateSize = (base64Data.length * 3) / 4;
      if (approximateSize > MAX_FILE_SIZE) {
        return NextResponse.json({ message: "File too large. Maximum size is 500KB." }, { status: 400 });
      }

      const uploadFolder = folder || `eva/${type || "general"}/${session.user.id}`;
      const result = await uploadImage(image, { folder: uploadFolder });

      return NextResponse.json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
      });
    }

    return NextResponse.json({ message: "Invalid request format" }, { status: 400 });
  } catch (error: any) {
    logger.error("Error uploading files:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/upload — delete image from Backblaze B2
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("publicId");

    if (!publicId) {
      return NextResponse.json({ message: "No public ID provided" }, { status: 400 });
    }

    await deleteImage(publicId);
    return NextResponse.json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    logger.error("Delete error:", error);
    return NextResponse.json({ message: "Failed to delete image" }, { status: 500 });
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
