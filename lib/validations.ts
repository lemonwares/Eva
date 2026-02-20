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
    "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  );

export const phoneSchema = z
  .string()
  .regex(
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    "Invalid phone number",
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
    "Slug must contain only lowercase letters, numbers, and hyphens",
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
    { message: "Start date must be before end date" },
  );

export const priceSchema = z.object({
  min: z.coerce.number().min(0).optional(),
  max: z.coerce.number().min(0).optional(),
  currency: z.string().length(3).default("GBP"),
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

// Booking schema (simple)
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

// Booking create schema (full POST body)
export const bookingCreateSchema = z.object({
  providerId: z.string().min(1, "Provider ID is required"),
  services: z
    .array(
      z.object({
        id: z.string(),
        headline: z.string(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
      }),
    )
    .min(1, "At least one service is required"),
  clientName: z.string().min(1).max(200).optional(),
  clientEmail: z.string().email().optional(),
  clientPhone: z.string().max(30).optional(),
  eventDate: z.string().min(1, "Event date is required"),
  eventLocation: z.string().max(500).optional(),
  guestsCount: z.coerce.number().min(0).max(10000).optional(),
  specialRequests: z.string().max(2000).optional(),
  paymentMode: z
    .enum(["FULL_PAYMENT", "DEPOSIT_BALANCE", "CASH_ON_DELIVERY"])
    .optional()
    .default("FULL_PAYMENT"),
  pricingTotal: z.number().min(0).optional(),
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
  data: unknown,
): { success: true; data: T } | { success: false; errors: z.ZodIssue[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: result.error.issues };
}

// ---- Auth schemas ----
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email: emailSchema,
  name: z.string().min(1, "Name is required").max(100),
  password: passwordSchema,
  role: z.enum(["CLIENT", "PROFESSIONAL", "ADMINISTRATOR", "VISITOR"]).default("CLIENT"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: passwordSchema,
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const resendVerificationSchema = z.object({
  email: emailSchema,
});

// ---- Contact schema ----
export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: emailSchema,
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000),
});

// ---- User profile update schema ----
export const userProfileUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: phoneSchema,
  image: z.string().url().optional().or(z.literal("")),
  notificationPreferences: z.record(z.string(), z.boolean()).optional(),
});

// ---- Vendor listing schema ----
export const listingCreateSchema = z.object({
  headline: z.string().min(1, "Service name is required").max(200),
  longDescription: z.string().max(5000).optional(),
  price: z.coerce.number().min(0, "Price must be non-negative"),
  timeEstimate: z.string().min(1, "Time estimate is required").max(100),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  galleryUrls: z.array(z.string().url()).max(20).optional(),
});

export const listingUpdateSchema = z.object({
  headline: z.string().min(1).max(200).optional(),
  longDescription: z.string().max(5000).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
});

// ---- Vendor profile schema ----
export const vendorProfileCreateSchema = z.object({
  businessName: z.string().min(1, "Business name is required").max(200),
  description: z.string().max(5000).optional(),
  phonePublic: z.string().max(30).optional(),
  website: z.string().url().optional().or(z.literal("")),
  address: z.string().max(300).optional(),
  city: z.string().max(100).optional(),
  postcode: z.string().min(1, "Postcode is required").max(10),
  serviceRadiusMiles: z.coerce
    .number()
    .min(1, "Service radius is required")
    .max(500),
  categories: z.array(z.string()).optional().default([]),
  subcategories: z.array(z.string()).optional().default([]),
  cultureTraditionTags: z.array(z.string()).optional().default([]),
  instagram: z.string().max(200).optional(),
  tiktok: z.string().max(200).optional(),
  facebook: z.string().max(200).optional(),
  coverImage: z.string().optional(),
  photos: z.array(z.string()).max(20).optional().default([]),
  priceFrom: z.coerce.number().min(0).optional(),
  isPublished: z.boolean().optional().default(false),
});

export const vendorProfileUpdateSchema = z.object({
  businessName: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  phonePublic: z.string().max(30).optional(),
  website: z.string().url().optional().or(z.literal("")),
  address: z.string().max(300).optional(),
  city: z.string().max(100).optional(),
  postcode: z.string().max(10).optional(),
  serviceRadiusMiles: z.coerce.number().min(1).max(500).optional(),
  categories: z.array(z.string()).optional(),
  subcategories: z.array(z.string()).optional(),
  cultureTraditionTags: z.array(z.string()).optional(),
  instagram: z.string().max(200).optional(),
  tiktok: z.string().max(200).optional(),
  facebook: z.string().max(200).optional(),
  coverImage: z.string().optional(),
  photos: z.array(z.string()).max(20).optional(),
  priceFrom: z.coerce.number().min(0).optional().nullable(),
  isPublished: z.boolean().optional(),
});

export function formatValidationErrors(
  errors: z.ZodIssue[],
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
  searchParams: URLSearchParams,
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
  allowedTypes: string[],
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
  maxSizeInMB: number,
): boolean {
  return sizeInBytes <= maxSizeInMB * 1024 * 1024;
}
