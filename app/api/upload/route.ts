// Increase body size limit for uploads (20MB)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

// Helper to convert File to base64 data URL
async function fileToBase64(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  return `data:${file.type};base64,${base64}`;
}

// POST /api/upload - Upload file(s) to Cloudinary
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if Cloudinary is configured
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        {
          message:
            "Image upload service not configured. Please add Cloudinary credentials to environment variables.",
        },
        { status: 500 }
      );
    }

    const contentType = request.headers.get("content-type") || "";

    // Handle FormData (file upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const files = formData.getAll("files") as File[];
      const type = (formData.get("type") as string) || "general"; // "avatar", "cover", "gallery", "listing"

      if (!files || files.length === 0) {
        return NextResponse.json(
          { message: "No files provided" },
          { status: 400 }
        );
      }

      const uploadedFiles: Array<{
        name: string;
        url: string;
        publicId: string;
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

        try {
          // Convert to base64 and upload to Cloudinary
          const base64Image = await fileToBase64(file);
          const folder = `eva/${type}/${session.user.id}`;

          const result = await uploadImage(base64Image, {
            folder,
            transformation:
              type === "avatar"
                ? { width: 400, height: 400, crop: "fill" }
                : type === "cover"
                ? { width: 1200, height: 600, crop: "fill" }
                : undefined,
          });

          uploadedFiles.push({
            name: file.name,
            url: result.secure_url,
            publicId: result.public_id,
            size: file.size,
            type: file.type,
          });
        } catch (uploadError) {
          console.error(`Error uploading ${file.name}:`, uploadError);
          errors.push({
            name: file.name,
            error: "Failed to upload to cloud storage",
          });
        }
      }

      if (uploadedFiles.length === 0 && errors.length > 0) {
        return NextResponse.json(
          { message: "All files failed validation", errors },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `${uploadedFiles.length} file(s) uploaded successfully`,
        files: uploadedFiles,
        // Return single file url for convenience when uploading one file
        url: uploadedFiles.length === 1 ? uploadedFiles[0].url : undefined,
        errors: errors.length > 0 ? errors : undefined,
      });
    }

    // Handle JSON body (base64 image)
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const { image, folder, type, width, height } = body;

      if (!image) {
        return NextResponse.json(
          { message: "No image provided" },
          { status: 400 }
        );
      }

      // Validate base64 image
      const matches = image.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        return NextResponse.json(
          {
            message:
              "Invalid image format. Please provide a base64 encoded image.",
          },
          { status: 400 }
        );
      }

      const mimeType = matches[1];
      const base64Data = matches[2];

      // Check MIME type
      if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
        return NextResponse.json(
          {
            message: `Invalid file type. Allowed: ${ALLOWED_IMAGE_TYPES.join(
              ", "
            )}`,
          },
          { status: 400 }
        );
      }

      // Check file size (base64 is ~33% larger than original)
      const approximateSize = (base64Data.length * 3) / 4;
      if (approximateSize > MAX_FILE_SIZE) {
        return NextResponse.json(
          { message: "File too large. Maximum size is 10MB." },
          { status: 400 }
        );
      }

      const uploadFolder =
        folder || `eva/${type || "general"}/${session.user.id}`;

      const result = await uploadImage(image, {
        folder: uploadFolder,
        transformation:
          width || height
            ? { width, height, crop: "fill", quality: "auto" }
            : undefined,
      });

      return NextResponse.json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      });
    }

    return NextResponse.json(
      { message: "Invalid request format" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/upload - Delete image from Cloudinary
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("publicId");

    if (!publicId) {
      return NextResponse.json(
        { message: "No public ID provided" },
        { status: 400 }
      );
    }

    await deleteImage(publicId);

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { message: "Failed to delete image" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
