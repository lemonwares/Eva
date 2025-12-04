/**
 * File Upload Utilities
 *
 * This module provides file upload functionality with support for:
 * - Local storage (development)
 * - AWS S3
 * - Cloudinary
 * - Supabase Storage
 *
 * Configure by setting environment variables:
 * - UPLOAD_PROVIDER: 'local' | 's3' | 'cloudinary' | 'supabase'
 * - AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET, AWS_REGION (for S3)
 * - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET (for Cloudinary)
 * - SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_STORAGE_BUCKET (for Supabase)
 */

import { randomUUID } from "crypto";
import path from "path";

export type UploadProvider = "local" | "s3" | "cloudinary" | "supabase";

export interface UploadResult {
  url: string;
  publicId: string;
  filename: string;
  size: number;
  mimeType: string;
  provider: UploadProvider;
}

export interface UploadOptions {
  folder?: string;
  allowedTypes?: string[];
  maxSize?: number; // in bytes
  generateThumbnail?: boolean;
  transformations?: Record<string, any>;
}

const DEFAULT_OPTIONS: UploadOptions = {
  folder: "uploads",
  allowedTypes: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
  ],
  maxSize: 10 * 1024 * 1024, // 10MB
  generateThumbnail: false,
};

/**
 * Get the current upload provider from environment
 */
export function getUploadProvider(): UploadProvider {
  const provider = process.env.UPLOAD_PROVIDER || "local";
  return provider as UploadProvider;
}

/**
 * Validate file before upload
 */
export function validateFile(
  file: File | { type: string; size: number },
  options: UploadOptions = {}
): { valid: boolean; error?: string } {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Check file type
  if (opts.allowedTypes && !opts.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${
        file.type
      } is not allowed. Allowed types: ${opts.allowedTypes.join(", ")}`,
    };
  }

  // Check file size
  if (opts.maxSize && file.size > opts.maxSize) {
    const maxSizeMB = opts.maxSize / (1024 * 1024);
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Generate a unique filename
 */
export function generateUniqueFilename(originalFilename: string): string {
  const ext = path.extname(originalFilename);
  const uuid = randomUUID();
  const timestamp = Date.now();
  return `${timestamp}-${uuid}${ext}`;
}

/**
 * Generate signed upload URL for S3 direct upload
 * Client-side can upload directly to S3 without going through the server
 */
export async function getS3SignedUploadUrl(
  filename: string,
  contentType: string,
  folder: string = "uploads"
): Promise<{ uploadUrl: string; publicUrl: string }> {
  // This is a placeholder - implement with AWS SDK v3
  // import { S3Client, PutObjectCommand, getSignedUrl } from "@aws-sdk/client-s3";
  // import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION;
  const key = `${folder}/${generateUniqueFilename(filename)}`;

  // Placeholder URLs
  const uploadUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}?signedUrl=placeholder`;
  const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  return { uploadUrl, publicUrl };
}

/**
 * Generate Cloudinary upload signature for direct upload
 */
export function getCloudinarySignature(folder: string = "uploads"): {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
} {
  // This is a placeholder - implement with Cloudinary SDK
  // import { v2 as cloudinary } from "cloudinary";

  const timestamp = Math.floor(Date.now() / 1000);
  const apiKey = process.env.CLOUDINARY_API_KEY || "";
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";

  // Generate signature using Cloudinary API secret
  // const signature = cloudinary.utils.api_sign_request(
  //   { timestamp, folder },
  //   process.env.CLOUDINARY_API_SECRET
  // );

  return {
    signature: "placeholder-signature",
    timestamp,
    apiKey,
    cloudName,
  };
}

/**
 * Get Supabase storage upload URL
 */
export async function getSupabaseUploadUrl(
  filename: string,
  folder: string = "uploads"
): Promise<{ uploadUrl: string; publicUrl: string }> {
  // This is a placeholder - implement with Supabase client
  // import { createClient } from "@supabase/supabase-js";

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "eva-uploads";
  const path = `${folder}/${generateUniqueFilename(filename)}`;
  const supabaseUrl = process.env.SUPABASE_URL || "";

  return {
    uploadUrl: `${supabaseUrl}/storage/v1/object/${bucket}/${path}`,
    publicUrl: `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`,
  };
}

/**
 * Delete file from storage
 */
export async function deleteFile(
  publicId: string,
  provider?: UploadProvider
): Promise<boolean> {
  const uploadProvider = provider || getUploadProvider();

  try {
    switch (uploadProvider) {
      case "s3":
        // Implement S3 deletion
        // const s3 = new S3Client({ ... });
        // await s3.send(new DeleteObjectCommand({ Bucket, Key: publicId }));
        break;
      case "cloudinary":
        // Implement Cloudinary deletion
        // await cloudinary.uploader.destroy(publicId);
        break;
      case "supabase":
        // Implement Supabase deletion
        // await supabase.storage.from(bucket).remove([publicId]);
        break;
      case "local":
        // Implement local deletion
        // await fs.unlink(path.join(uploadDir, publicId));
        break;
    }
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}

/**
 * Image transformation utilities
 */
export const ImageTransformations = {
  // Avatar sizes
  avatar: {
    small: { width: 50, height: 50, crop: "fill" },
    medium: { width: 150, height: 150, crop: "fill" },
    large: { width: 300, height: 300, crop: "fill" },
  },

  // Provider gallery
  gallery: {
    thumbnail: { width: 200, height: 200, crop: "fill" },
    medium: { width: 600, height: 400, crop: "fill" },
    large: { width: 1200, height: 800, crop: "fill" },
  },

  // Provider cover image
  cover: {
    desktop: { width: 1920, height: 600, crop: "fill" },
    mobile: { width: 768, height: 400, crop: "fill" },
  },
};

/**
 * Get Cloudinary transformation URL
 */
export function getCloudinaryTransformUrl(
  publicId: string,
  transformation: { width?: number; height?: number; crop?: string }
): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const { width, height, crop } = transformation;

  let transformString = "";
  if (width) transformString += `w_${width},`;
  if (height) transformString += `h_${height},`;
  if (crop) transformString += `c_${crop},`;

  // Remove trailing comma
  transformString = transformString.replace(/,$/, "");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicId}`;
}

/**
 * Upload configuration for different file types
 */
export const UploadPresets = {
  avatar: {
    folder: "avatars",
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    maxSize: 5 * 1024 * 1024, // 5MB
    generateThumbnail: true,
  },
  gallery: {
    folder: "gallery",
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    maxSize: 10 * 1024 * 1024, // 10MB
    generateThumbnail: true,
  },
  document: {
    folder: "documents",
    allowedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxSize: 20 * 1024 * 1024, // 20MB
    generateThumbnail: false,
  },
  portfolio: {
    folder: "portfolio",
    allowedTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/quicktime",
    ],
    maxSize: 50 * 1024 * 1024, // 50MB
    generateThumbnail: true,
  },
};
