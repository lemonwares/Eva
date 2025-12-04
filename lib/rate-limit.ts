// Simple in-memory rate limiter
// In production, use Redis or a proper rate limiting service

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

// Default rate limit presets
export const rateLimitPresets = {
  // General API routes
  standard: { windowMs: 60 * 1000, maxRequests: 60 }, // 60 requests per minute

  // Auth routes (stricter)
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 10 }, // 10 attempts per 15 minutes

  // Password reset (very strict)
  passwordReset: { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 attempts per hour

  // Search/browse (more lenient)
  search: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 requests per minute

  // File upload (strict)
  upload: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 uploads per minute

  // Contact form
  contact: { windowMs: 60 * 60 * 1000, maxRequests: 5 }, // 5 per hour
};

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = rateLimitPresets.standard
): RateLimitResult {
  const now = Date.now();
  const key = identifier;

  // Clean up old entries periodically
  if (Math.random() < 0.01) {
    cleanupExpiredEntries();
  }

  const existing = rateLimitStore.get(key);

  // If no entry or expired, create new one
  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + config.windowMs,
    });

    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs,
    };
  }

  // Check if limit exceeded
  if (existing.count >= config.maxRequests) {
    const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetAt: existing.resetAt,
      retryAfter,
    };
  }

  // Increment count
  existing.count++;
  rateLimitStore.set(key, existing);

  return {
    success: true,
    remaining: config.maxRequests - existing.count,
    resetAt: existing.resetAt,
  };
}

function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

// Helper to get identifier from request
export function getRateLimitIdentifier(
  request: Request,
  userId?: string
): string {
  // Prefer user ID if authenticated
  if (userId) {
    return `user:${userId}`;
  }

  // Fall back to IP address
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return `ip:${ip}`;
}

// Rate limit response helper
export function rateLimitResponse(result: RateLimitResult) {
  return new Response(
    JSON.stringify({
      error: "Too Many Requests",
      message: "Rate limit exceeded. Please try again later.",
      retryAfter: result.retryAfter,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(result.resetAt),
        "Retry-After": String(result.retryAfter || 60),
      },
    }
  );
}

// Middleware-style rate limit check
export async function withRateLimit<T>(
  identifier: string,
  config: RateLimitConfig,
  handler: () => Promise<T>
): Promise<T | Response> {
  const result = checkRateLimit(identifier, config);

  if (!result.success) {
    return rateLimitResponse(result);
  }

  return handler();
}
