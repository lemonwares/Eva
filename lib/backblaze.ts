/**
 * Backblaze B2 upload using the native B2 API (not S3-compatible)
 * Flow: authorize → get upload URL → upload file
 */
import { logger } from "@/lib/logger";
import crypto from "crypto";
import https from "https";
import { URL } from "url";

const BUCKET_NAME = process.env.B2_BUCKET_NAME!;
const PUBLIC_URL = process.env.B2_PUBLIC_URL!;
const KEY_ID = process.env.B2_KEY_ID!;
const APPLICATION_KEY = process.env.B2_APPLICATION_KEY!;

export interface UploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

export interface UploadOptions {
  folder?: string;
}

// ── HTTP helper ───────────────────────────────────────────────────────────────

function httpsRequest(
  url: string,
  options: {
    method: string;
    headers: Record<string, string>;
    body?: Buffer | string;
  }
): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const bodyBuffer =
      options.body instanceof Buffer
        ? options.body
        : options.body
        ? Buffer.from(options.body, "utf8")
        : Buffer.alloc(0);

    const reqOptions: https.RequestOptions = {
      hostname: parsed.hostname,
      port: 443,
      path: parsed.pathname + parsed.search,
      method: options.method,
      headers: {
        ...options.headers,
        "Content-Length": bodyBuffer.length.toString(),
      },
    };

    const req = https.request(reqOptions, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () =>
        resolve({
          status: res.statusCode || 0,
          body: Buffer.concat(chunks).toString("utf8"),
        })
      );
    });

    req.on("error", reject);
    req.end(bodyBuffer);
  });
}

// ── B2 API calls ──────────────────────────────────────────────────────────────

interface B2AuthResult {
  authorizationToken: string;
  apiUrl: string;
  accountId: string;
}

async function authorizeAccount(): Promise<B2AuthResult> {
  const credentials = Buffer.from(`${KEY_ID}:${APPLICATION_KEY}`).toString("base64");

  const res = await httpsRequest(
    "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
    {
      method: "GET",
      headers: { Authorization: `Basic ${credentials}` },
    }
  );

  if (res.status !== 200) {
    throw new Error(`B2 authorize failed: ${res.status} ${res.body}`);
  }

  const data = JSON.parse(res.body);
  return {
    authorizationToken: data.authorizationToken,
    apiUrl: data.apiUrl,
    accountId: data.accountId,
  };
}

// Cache bucket ID so we don't call list_buckets on every upload
let cachedBucketId: string | null = null;

async function getBucketId(apiUrl: string, authToken: string, accountId: string): Promise<string> {
  if (cachedBucketId) return cachedBucketId;

  const res = await httpsRequest(`${apiUrl}/b2api/v2/b2_list_buckets`, {
    method: "POST",
    headers: {
      Authorization: authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ accountId, bucketName: BUCKET_NAME }),
  });

  if (res.status !== 200) {
    throw new Error(`B2 list_buckets failed: ${res.status} ${res.body}`);
  }

  const data = JSON.parse(res.body);
  const bucket = data.buckets?.find((b: any) => b.bucketName === BUCKET_NAME);
  if (!bucket) {
    throw new Error(`Bucket "${BUCKET_NAME}" not found`);
  }

  cachedBucketId = bucket.bucketId;
  return bucket.bucketId;
}

async function getUploadUrl(
  apiUrl: string,
  authToken: string,
  bucketId: string
): Promise<{ uploadUrl: string; authorizationToken: string }> {
  const res = await httpsRequest(`${apiUrl}/b2api/v2/b2_get_upload_url`, {
    method: "POST",
    headers: {
      Authorization: authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bucketId }),
  });

  if (res.status !== 200) {
    throw new Error(`B2 get_upload_url failed: ${res.status} ${res.body}`);
  }

  const data = JSON.parse(res.body);
  return {
    uploadUrl: data.uploadUrl,
    authorizationToken: data.authorizationToken,
  };
}

async function uploadFileToB2(
  uploadUrl: string,
  uploadAuthToken: string,
  fileName: string,
  buffer: Buffer,
  contentType: string
): Promise<void> {
  const sha1 = crypto.createHash("sha1").update(buffer).digest("hex");

  const res = await httpsRequest(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: uploadAuthToken,
      "X-Bz-File-Name": encodeURIComponent(fileName),
      "Content-Type": contentType,
      "X-Bz-Content-Sha1": sha1,
    },
    body: buffer,
  });

  if (res.status !== 200) {
    throw new Error(`B2 upload failed: ${res.status} ${res.body}`);
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function uploadImage(
  input: string | Buffer,
  options: UploadOptions = {},
  originalMimeType?: string
): Promise<UploadResult> {
  const { folder = "eva" } = options;

  let buffer: Buffer;
  let mimeType: string;

  if (typeof input === "string") {
    const matches = input.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) throw new Error("Invalid base64 image format");
    mimeType = matches[1];
    buffer = Buffer.from(matches[2], "base64");
  } else {
    buffer = input;
    mimeType = originalMimeType || "image/jpeg";
  }

  const ext = mimeType.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
  const fileName = `${folder}/${crypto.randomUUID()}.${ext}`;

  try {
    const { authorizationToken, apiUrl, accountId } = await authorizeAccount();
    const bucketId = await getBucketId(apiUrl, authorizationToken, accountId);
    const { uploadUrl, authorizationToken: uploadAuthToken } = await getUploadUrl(apiUrl, authorizationToken, bucketId);
    await uploadFileToB2(uploadUrl, uploadAuthToken, fileName, buffer, mimeType);

    return {
      secure_url: `${PUBLIC_URL}/${fileName}`,
      public_id: fileName,
      width: 0,
      height: 0,
      format: ext,
    };
  } catch (error) {
    logger.error("Backblaze upload error:", error);
    throw new Error("Failed to upload image to storage");
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    const { authorizationToken, apiUrl, accountId } = await authorizeAccount();
    const bucketId = await getBucketId(apiUrl, authorizationToken, accountId);

    // Find the file to get its fileId
    const listRes = await httpsRequest(`${apiUrl}/b2api/v2/b2_list_file_names`, {
      method: "POST",
      headers: {
        Authorization: authorizationToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bucketId, prefix: publicId, maxFileCount: 1 }),
    });

    if (listRes.status !== 200) {
      throw new Error(`B2 list_file_names failed: ${listRes.status} ${listRes.body}`);
    }

    const listData = JSON.parse(listRes.body);
    const file = listData.files?.[0];
    if (!file) {
      logger.warn(`B2 delete: file not found for publicId ${publicId}`);
      return;
    }

    const deleteRes = await httpsRequest(`${apiUrl}/b2api/v2/b2_delete_file_version`, {
      method: "POST",
      headers: {
        Authorization: authorizationToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileName: file.fileName, fileId: file.fileId }),
    });

    if (deleteRes.status !== 200) {
      throw new Error(`B2 delete failed: ${deleteRes.status} ${deleteRes.body}`);
    }
  } catch (error) {
    logger.error("Backblaze delete error:", error);
    throw new Error("Failed to delete image");
  }
}
