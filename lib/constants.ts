// Application constants

// App info
export const APP_NAME = "EVA";
export const APP_FULL_NAME = "EVA - Event Vendors Africa";
export const APP_DESCRIPTION =
  "Discover and connect with the best event vendors across Africa";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// File uploads
export const MAX_FILE_SIZE_MB = 10;
export const MAX_IMAGE_SIZE_MB = 5;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];
export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const MAX_IMAGES_PER_LISTING = 10;
export const MAX_IMAGES_PER_PORTFOLIO = 50;

// Event categories
export const EVENT_CATEGORIES = [
  "Wedding",
  "Birthday",
  "Corporate Event",
  "Conference",
  "Concert",
  "Exhibition",
  "Funeral",
  "Graduation",
  "Baby Shower",
  "Anniversary",
  "Religious Ceremony",
  "Festival",
  "Other",
] as const;

// Vendor categories
export const VENDOR_CATEGORIES = [
  "Photography",
  "Videography",
  "Catering",
  "Venue",
  "DJ & Music",
  "Event Planner",
  "Decoration",
  "Cake & Pastries",
  "Makeup Artist",
  "Fashion Designer",
  "MC & Entertainment",
  "Florist",
  "Rentals",
  "Transport",
  "Security",
  "Lighting & Sound",
  "Invitation & Stationery",
  "Live Band",
  "Event Coordination",
  "Other",
] as const;

// Nigerian states
export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

// African countries
export const AFRICAN_COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "Egypt",
  "Morocco",
  "Tanzania",
  "Uganda",
  "Ethiopia",
  "Rwanda",
  "Cameroon",
  "Senegal",
  "Ivory Coast",
  "Zambia",
  "Zimbabwe",
] as const;

// Culture tags
export const CULTURE_TAGS = [
  "Traditional Nigerian",
  "Yoruba",
  "Igbo",
  "Hausa",
  "Edo/Benin",
  "Efik/Ibibio",
  "Ijaw",
  "Tiv",
  "Western",
  "Contemporary",
  "Minimalist",
  "Luxury",
  "Bohemian",
  "Rustic",
  "Garden",
  "Beach",
  "Destination",
  "Religious",
  "Cultural Fusion",
] as const;

// Booking statuses
export const BOOKING_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "DEPOSIT_PAID",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
] as const;

// Inquiry statuses
export const INQUIRY_STATUSES = [
  "NEW",
  "READ",
  "REPLIED",
  "QUOTED",
  "CLOSED",
  "ARCHIVED",
] as const;

// Quote statuses
export const QUOTE_STATUSES = [
  "DRAFT",
  "SENT",
  "VIEWED",
  "ACCEPTED",
  "DECLINED",
  "EXPIRED",
  "REVISED",
] as const;

// Review statuses
export const REVIEW_STATUSES = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "FLAGGED",
] as const;

// Provider statuses
export const PROVIDER_STATUSES = [
  "PENDING",
  "APPROVED",
  "SUSPENDED",
  "REJECTED",
] as const;

// User roles
export const USER_ROLES = ["USER", "VENDOR", "ADMIN"] as const;

// Price ranges (in Naira)
export const PRICE_RANGES = [
  { label: "Under ₦50,000", min: 0, max: 50000 },
  { label: "₦50,000 - ₦100,000", min: 50000, max: 100000 },
  { label: "₦100,000 - ₦250,000", min: 100000, max: 250000 },
  { label: "₦250,000 - ₦500,000", min: 250000, max: 500000 },
  { label: "₦500,000 - ₦1,000,000", min: 500000, max: 1000000 },
  { label: "Above ₦1,000,000", min: 1000000, max: Infinity },
] as const;

// Guest count ranges
export const GUEST_COUNT_RANGES = [
  { label: "Intimate (1-50)", min: 1, max: 50 },
  { label: "Small (51-100)", min: 51, max: 100 },
  { label: "Medium (101-200)", min: 101, max: 200 },
  { label: "Large (201-500)", min: 201, max: 500 },
  { label: "Grand (500+)", min: 500, max: 10000 },
] as const;

// Rating labels
export const RATING_LABELS = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
} as const;

// Notification types
export const NOTIFICATION_TYPES = [
  "INQUIRY_RECEIVED",
  "INQUIRY_REPLIED",
  "QUOTE_RECEIVED",
  "QUOTE_ACCEPTED",
  "QUOTE_DECLINED",
  "BOOKING_CONFIRMED",
  "BOOKING_CANCELLED",
  "BOOKING_COMPLETED",
  "REVIEW_RECEIVED",
  "REVIEW_APPROVED",
  "PROVIDER_APPROVED",
  "PROVIDER_SUSPENDED",
  "PAYMENT_RECEIVED",
  "MESSAGE_RECEIVED",
  "SYSTEM",
] as const;

// Social media platforms
export const SOCIAL_PLATFORMS = [
  { id: "facebook", name: "Facebook", baseUrl: "https://facebook.com/" },
  { id: "instagram", name: "Instagram", baseUrl: "https://instagram.com/" },
  { id: "twitter", name: "Twitter/X", baseUrl: "https://twitter.com/" },
  { id: "linkedin", name: "LinkedIn", baseUrl: "https://linkedin.com/in/" },
  { id: "tiktok", name: "TikTok", baseUrl: "https://tiktok.com/@" },
  { id: "youtube", name: "YouTube", baseUrl: "https://youtube.com/@" },
] as const;

// Days of the week
export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

// Months
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

// Currency
export const DEFAULT_CURRENCY = "NGN";
export const SUPPORTED_CURRENCIES = [
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GHS", symbol: "₵", name: "Ghanaian Cedi" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
] as const;

// Analytics periods
export const ANALYTICS_PERIODS = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "12m", label: "Last 12 months" },
  { value: "all", label: "All time" },
] as const;

// Export formats
export const EXPORT_FORMATS = ["csv", "json", "xlsx"] as const;

// SEO defaults
export const DEFAULT_SEO = {
  title: APP_FULL_NAME,
  description: APP_DESCRIPTION,
  keywords: [
    "event vendors",
    "Nigeria",
    "Africa",
    "wedding vendors",
    "event planning",
    "catering",
    "photography",
    "venue",
  ],
  ogImage: `${APP_URL}/og-image.png`,
};

// Feature flags (can be moved to database/config)
export const FEATURES = {
  REVIEWS_ENABLED: true,
  BOOKINGS_ENABLED: true,
  MESSAGING_ENABLED: true,
  PAYMENTS_ENABLED: false,
  SOCIAL_LOGIN_ENABLED: true,
  EMAIL_VERIFICATION_REQUIRED: true,
  PROVIDER_APPROVAL_REQUIRED: true,
} as const;
