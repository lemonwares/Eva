// Shared TypeScript types for the EVA platform
// Note: Prisma types are generated after running `npx prisma generate`
// Use Prisma.* types directly in your code after generation

// Auth types
export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "VENDOR" | "ADMIN";
  image?: string | null;
  providerId?: string | null;
}

export interface AuthSession {
  user: SessionUser;
  expires: string;
}

// Extended types with relations (to be used after Prisma generate)
export interface ProviderWithRelations {
  id: string;
  businessName: string;
  slug: string;
  description?: string | null;
  averageRating?: number | null;
  reviewCount: number;
  isVerified: boolean;
  isFeatured: boolean;
  user: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  city: {
    id: string;
    name: string;
    slug: string;
  };
  cultureTags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  _count?: {
    reviews: number;
    bookings: number;
    inquiries: number;
  };
}

export interface InquiryWithRelations {
  id: string;
  status: string;
  eventDate?: Date | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  };
  provider: {
    id: string;
    businessName: string;
    slug: string;
    user: {
      id: string;
      name: string | null;
      email: string;
    };
  };
  quotes?: Array<{
    id: string;
    status: string;
    totalPrice: number;
  }>;
}

export interface QuoteWithRelations {
  id: string;
  status: string;
  totalPrice: number;
  validUntil: Date;
  inquiry: InquiryWithRelations;
  provider: {
    id: string;
    businessName: string;
    slug: string;
  };
}

export interface BookingWithRelations {
  id: string;
  status: string;
  eventDate: Date;
  pricingTotal: number;
  user: {
    id: string;
    name: string | null;
    email: string;
    phone?: string | null;
  };
  provider: ProviderWithRelations;
  review?: {
    id: string;
    rating: number;
    content?: string | null;
  } | null;
}

export interface ReviewWithRelations {
  id: string;
  rating: number;
  title?: string | null;
  content?: string | null;
  status: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image?: string | null;
  };
  provider: {
    id: string;
    businessName: string;
    slug: string;
  };
  booking?: {
    id: string;
    eventDate: Date;
  } | null;
}

export interface NotificationWithRelations {
  id: string;
  type: string;
  title: string;
  message?: string | null;
  isRead: boolean;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
  };
}

// API Request/Response types
export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchFilters {
  category?: string;
  city?: string;
  state?: string;
  cultureTags?: string[];
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  verified?: boolean;
  featured?: boolean;
  search?: string;
}

// Form types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface InquiryFormData {
  providerId: string;
  eventDate: Date;
  eventType: string;
  guestCount?: number;
  budget?: string;
  message: string;
}

export interface ReviewFormData {
  providerId: string;
  bookingId?: string;
  rating: number;
  title?: string;
  content: string;
  images?: string[];
}

export interface ProviderFormData {
  businessName: string;
  description: string;
  categoryId: string;
  cityId: string;
  cultureTagIds?: string[];
  phone?: string;
  email: string;
  website?: string;
  address?: string;
  priceRangeMin?: number;
  priceRangeMax?: number;
  socialLinks?: SocialLinks;
}

// Utility types
export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
  youtube?: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface ImageUpload {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
  alt?: string;
}

// Analytics types
export interface AnalyticsSummary {
  totalProviders: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  activeInquiries: number;
  pendingReviews: number;
}

export interface AnalyticsChartData {
  label: string;
  value: number;
  date?: string;
  category?: string;
}

export interface VendorAnalytics {
  totalViews: number;
  totalInquiries: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  reviewCount: number;
  conversionRate: number;
  viewsByDay: AnalyticsChartData[];
  inquiriesByMonth: AnalyticsChartData[];
  bookingsByStatus: AnalyticsChartData[];
}

// Dashboard types
export interface AdminDashboardStats {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  totalRevenue: number;
  pendingProviders: number;
  pendingReviews: number;
  newInquiries: number;
  userGrowth: number;
  revenueGrowth: number;
}

export interface VendorDashboardStats {
  totalViews: number;
  totalInquiries: number;
  totalBookings: number;
  totalEarnings: number;
  pendingQuotes: number;
  upcomingBookings: number;
  averageRating: number;
  responseRate: number;
}

// Notification payload types
export interface NotificationPayload {
  type: string;
  title: string;
  message: string;
  link?: string;
  data?: Record<string, unknown>;
}

// Export/Import types
export interface ExportOptions {
  format: "csv" | "json" | "xlsx";
  dateRange?: {
    start: Date;
    end: Date;
  };
  fields?: string[];
}

// Status types with labels
export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "DEPOSIT_PAID"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export type InquiryStatus =
  | "NEW"
  | "READ"
  | "REPLIED"
  | "QUOTED"
  | "CLOSED"
  | "ARCHIVED";

export type QuoteStatus =
  | "DRAFT"
  | "SENT"
  | "VIEWED"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED"
  | "REVISED";

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED" | "FLAGGED";

export type ProviderStatus = "PENDING" | "APPROVED" | "SUSPENDED" | "REJECTED";

export type UserRole = "USER" | "VENDOR" | "ADMIN";

// Map for status display
export const STATUS_LABELS: Record<string, Record<string, string>> = {
  booking: {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    DEPOSIT_PAID: "Deposit Paid",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    REFUNDED: "Refunded",
  },
  inquiry: {
    NEW: "New",
    READ: "Read",
    REPLIED: "Replied",
    QUOTED: "Quoted",
    CLOSED: "Closed",
    ARCHIVED: "Archived",
  },
  quote: {
    DRAFT: "Draft",
    SENT: "Sent",
    VIEWED: "Viewed",
    ACCEPTED: "Accepted",
    DECLINED: "Declined",
    EXPIRED: "Expired",
    REVISED: "Revised",
  },
  review: {
    PENDING: "Pending Review",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    FLAGGED: "Flagged",
  },
  provider: {
    PENDING: "Pending Approval",
    APPROVED: "Approved",
    SUSPENDED: "Suspended",
    REJECTED: "Rejected",
  },
};

// Color mappings for status badges
export const STATUS_COLORS: Record<string, string> = {
  PENDING: "yellow",
  CONFIRMED: "blue",
  DEPOSIT_PAID: "purple",
  IN_PROGRESS: "indigo",
  COMPLETED: "green",
  CANCELLED: "red",
  REFUNDED: "gray",
  NEW: "blue",
  READ: "gray",
  REPLIED: "green",
  QUOTED: "purple",
  CLOSED: "gray",
  ARCHIVED: "gray",
  DRAFT: "gray",
  SENT: "blue",
  VIEWED: "yellow",
  ACCEPTED: "green",
  DECLINED: "red",
  EXPIRED: "gray",
  REVISED: "purple",
  APPROVED: "green",
  REJECTED: "red",
  FLAGGED: "orange",
  SUSPENDED: "red",
};
