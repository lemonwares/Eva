import { logger } from '@/lib/logger';
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export interface UploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export interface UploadOptions {
  folder?: string;
  transformation?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  };
}

/**
 * Upload a base64 image to Cloudinary
 */
export async function uploadImage(
  base64Image: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const { folder = "eva", transformation } = options;

  const uploadOptions: Record<string, unknown> = {
    folder,
    resource_type: "auto",
  };

  if (transformation) {
    uploadOptions.transformation = [
      {
        width: transformation.width,
        height: transformation.height,
        crop: transformation.crop || "fill",
        quality: transformation.quality || "auto",
      },
    ];
  }

  try {
    const result = await cloudinary.uploader.upload(base64Image, uploadOptions);

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
    };
  } catch (error) {
    logger.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete image");
  }
}

/**
 * Get optimized URL for an image
 */
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  } = {}
): string {
  const { width, height, crop = "fill", quality = "auto" } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    fetch_format: "auto",
    secure: true,
  });
}

export { cloudinary };
