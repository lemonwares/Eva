/**
 * Backblaze B2 upload using Node.js https module + AWS Signature V4
 * Uses https directly to avoid fetch's Content-Length restrictions
 */
import { logger } from "@/lib/logger";
import crypto from "crypto";
import https from "https";
import { URL } from "url";

const BUCKET_NAME = process.env.B2_BUCKET_NAME!;
const PUBLIC_URL = process.env.B2_PUBLIC_URL!;
const ENDPOINT = process.env.B2_ENDPOINT!;
const REGION = process.env.B2_REGION || "eu-central-003";
const ACCESS_KEY = process.env.B2_KEY_ID!;
const SECRET_KEY = process.env.B2_APPLICATION_KEY!;

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

// ── AWS Signature V4 helpers ──────────────────────────────────────────────────

function hmac(key: Buffer | string, data: string): Buffer {
  return crypto.createHmac("sha256", key).update(data).digest();
}

function sha256hex(data: Buffer | string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function getSigningKey(dateStamp: string): Buffer {
  const kDate = hmac(`AWS4${SECRET_KEY}`, dateStamp);
  const kRegion = hmac(kDate, REGION);
  const kService = hmac(kRegion, "s3");
  return hmac(kService, "aws4_request");
}

function httpsRequest(options: https.RequestOptions & { url: string }, body: Buffer): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(options.url);
    const reqOptions: https.RequestOptions = {
      hostname: parsed.hostname,
      port: parsed.port || 443,
      path: parsed.pathname + parsed.search,
      method: options.method,
      headers: options.headers,
    };

    const req = https.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => resolve({ status: res.statusCode || 0, body: data }));
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function signedPut(key: string, body: Buffer, contentType: string): Promise<void> {
  const host = ENDPOINT.replace("https://", "");
  const now = new Date();
  const amzDate = now.toISOString().replace(/[-:]|\.\d{3}/g, "").slice(0, 15) + "Z";
  const dateStamp = amzDate.slice(0, 8);

  const payloadHash = sha256hex(body);
  const contentLength = body.length.toString();

  const canonicalHeaders =
    `content-length:${contentLength}\n` +
    `content-type:${contentType}\n` +
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;

  const signedHeaders = "content-length;content-type;host;x-amz-content-sha256;x-amz-date";

  const canonicalRequest = [
    "PUT",
    `/${BUCKET_NAME}/${key}`,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const credentialScope = `${dateStamp}/${REGION}/s3/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256hex(canonicalRequest),
  ].join("\n");

  const signature = hmac(getSigningKey(dateStamp), stringToSign).toString("hex");
  const authorization =
    `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const url = `${ENDPOINT}/${BUCKET_NAME}/${key}`;

  const result = await httpsRequest({
    url,
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      "Content-Length": contentLength,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
      Authorization: authorization,
    },
  }, body);

  if (result.status < 200 || result.status >= 300) {
    throw new Error(`B2 upload failed: ${result.status} ${result.body}`);
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
  const key = `${folder}/${crypto.randomUUID()}.${ext}`;

  try {
    await signedPut(key, buffer, mimeType);
    return {
      secure_url: `${PUBLIC_URL}/${key}`,
      public_id: key,
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
  const host = ENDPOINT.replace("https://", "");
  const now = new Date();
  const amzDate = now.toISOString().replace(/[-:]|\.\d{3}/g, "").slice(0, 15) + "Z";
  const dateStamp = amzDate.slice(0, 8);

  const payloadHash = sha256hex("");
  const canonicalHeaders =
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";

  const canonicalRequest = [
    "DELETE",
    `/${BUCKET_NAME}/${publicId}`,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const credentialScope = `${dateStamp}/${REGION}/s3/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256hex(canonicalRequest),
  ].join("\n");

  const signature = hmac(getSigningKey(dateStamp), stringToSign).toString("hex");
  const authorization =
    `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  try {
    await httpsRequest({
      url: `${ENDPOINT}/${BUCKET_NAME}/${publicId}`,
      method: "DELETE",
      headers: {
        "x-amz-content-sha256": payloadHash,
        "x-amz-date": amzDate,
        Authorization: authorization,
      },
    }, Buffer.alloc(0));
  } catch (error) {
    logger.error("Backblaze delete error:", error);
    throw new Error("Failed to delete image");
  }
}
