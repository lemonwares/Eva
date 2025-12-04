import { z } from "zod";

// Common validation schemas
export const emailSchema = z
  .string()
  .email("Invalid email address")
  .min(1, "Email is required")
  .max(255, "Email must be less than 255 characters")
  .toLowerCase();

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be less than 100 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

export const phoneSchema = z
  .string()
  .regex(
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    "Invalid phone number"
  )
  .optional();

export const urlSchema = z
  .string()
  .url("Invalid URL")
  .optional()
  .or(z.literal(""));

export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .max(100, "Slug must be less than 100 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain only lowercase letters, numbers, and hyphens"
  );

export const uuidSchema = z.string().uuid("Invalid ID format");

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const dateRangeSchema = z
  .object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    { message: "Start date must be before end date" }
  );

export const priceSchema = z.object({
  min: z.coerce.number().min(0).optional(),
  max: z.coerce.number().min(0).optional(),
  currency: z.string().length(3).default("NGN"),
});

// Address schema
export const addressSchema = z.object({
  street: z.string().min(1, "Street address is required").optional(),
  city: z.string().min(1, "City is required").optional(),
  state: z.string().min(1, "State is required").optional(),
  country: z.string().default("Nigeria"),
  zipCode: z.string().optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
});

// Provider/Business schema
export const businessInfoSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(5000),
  email: emailSchema,
  phone: phoneSchema,
  website: urlSchema,
  address: addressSchema.optional(),
  socialLinks: z
    .object({
      facebook: urlSchema,
      instagram: urlSchema,
      twitter: urlSchema,
      linkedin: urlSchema,
      tiktok: urlSchema,
    })
    .optional(),
});

// Review schema
export const reviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  title: z.string().min(3).max(100).optional(),
  content: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(2000),
  providerId: uuidSchema,
  bookingId: uuidSchema.optional(),
});

// Booking schema
export const bookingSchema = z.object({
  providerId: uuidSchema,
  eventDate: z.coerce.date().refine((date) => date > new Date(), {
    message: "Event date must be in the future",
  }),
  eventType: z.string().min(1),
  guestCount: z.coerce.number().min(1).max(10000),
  location: z.string().min(1),
  notes: z.string().max(2000).optional(),
});

// Inquiry schema
export const inquirySchema = z.object({
  providerId: uuidSchema,
  eventDate: z.coerce.date().refine((date) => date > new Date(), {
    message: "Event date must be in the future",
  }),
  eventType: z.string().min(1),
  guestCount: z.coerce.number().min(1).max(10000).optional(),
  budget: z.string().optional(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000),
});

// Quote item schema
export const quoteItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.coerce.number().min(1),
  unitPrice: z.coerce.number().min(0),
  notes: z.string().optional(),
});

export const quoteSchema = z.object({
  inquiryId: uuidSchema,
  items: z.array(quoteItemSchema).min(1, "At least one item is required"),
  notes: z.string().max(2000).optional(),
  validUntil: z.coerce.date().optional(),
  termsAndConditions: z.string().optional(),
});

// Validation helper functions
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodIssue[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: result.error.issues };
}

export function formatValidationErrors(
  errors: z.ZodIssue[]
): Record<string, string> {
  const formatted: Record<string, string> = {};

  for (const error of errors) {
    const path = error.path.join(".");
    if (!formatted[path]) {
      formatted[path] = error.message;
    }
  }

  return formatted;
}

// Safe JSON parse
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

// Parse search params to object
export function parseSearchParams(
  searchParams: URLSearchParams
): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = {};

  for (const [key, value] of searchParams.entries()) {
    const existing = params[key];
    if (existing) {
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        params[key] = [existing, value];
      }
    } else {
      params[key] = value;
    }
  }

  return params;
}

// Sanitize user input
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[<>]/g, ""); // Remove angle brackets
}

// Validate file type
export function isValidFileType(
  mimeType: string,
  allowedTypes: string[]
): boolean {
  return allowedTypes.some((type) => {
    if (type.endsWith("/*")) {
      const prefix = type.slice(0, -1);
      return mimeType.startsWith(prefix);
    }
    return mimeType === type;
  });
}

// Validate file size
export function isValidFileSize(
  sizeInBytes: number,
  maxSizeInMB: number
): boolean {
  return sizeInBytes <= maxSizeInMB * 1024 * 1024;
}
