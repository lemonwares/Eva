import {
  Store,
  MapPin,
  Tag,
  Share2,
  ImageIcon,
  ListChecks,
  Users,
  CalendarClock,
  CheckCircle,
} from "lucide-react";

// ── Step type ───────────────────────────────────────────────────────
export type OnboardingStep =
  | "basics"
  | "location"
  | "categories"
  | "social"
  | "media"
  | "listings"
  | "team"
  | "schedule"
  | "review";

// ── Data types ──────────────────────────────────────────────────────
export interface WeeklyScheduleDay {
  dayOfWeek: number; // 0 = Sunday
  startTime: string;
  endTime: string;
  isClosed: boolean;
}

export interface ListingDraft {
  headline: string;
  longDescription: string;
  price: number | null;
  timeEstimate: string;
  coverImageUrl: string;
  galleryUrls: string[];
}

export interface TeamMember {
  name: string;
  photo?: string;
}

export interface OnboardingData {
  businessName: string;
  description: string;
  phonePublic: string;
  website: string;
  address: string;
  city: string;
  postcode: string;
  serviceRadiusMiles: number;
  categories: string[];
  subcategories: string[];
  cultureTraditionTags: string[];
  instagram: string;
  tiktok: string;
  facebook: string;
  coverImage: string;
  photos: string[];
  priceFrom: number | null;
  listings: ListingDraft[];
  weeklySchedule: WeeklyScheduleDay[];
  teamMembers: TeamMember[];
}

export interface CategoryOption {
  id: string;
  name: string;
}

// ── Step definitions ────────────────────────────────────────────────
export interface StepDefinition {
  id: OnboardingStep;
  title: string;
  description: string;
  icon: React.ElementType;
}

export const STEPS: StepDefinition[] = [
  {
    id: "basics",
    title: "Business Basics",
    description: "Tell us about your business",
    icon: Store,
  },
  {
    id: "location",
    title: "Location & Area",
    description: "Where do you operate?",
    icon: MapPin,
  },
  {
    id: "categories",
    title: "Categories & Tags",
    description: "What services do you offer?",
    icon: Tag,
  },
  {
    id: "social",
    title: "Social Media",
    description: "Connect your social profiles (optional)",
    icon: Share2,
  },
  {
    id: "media",
    title: "Photos & Media",
    description: "Showcase your work",
    icon: ImageIcon,
  },
  {
    id: "listings",
    title: "Services & Packages",
    description: "Add services or packages you offer",
    icon: ListChecks,
  },
  {
    id: "team",
    title: "Team Members",
    description: "Add your team (optional)",
    icon: Users,
  },
  {
    id: "schedule",
    title: "Weekly Schedule",
    description: "Set your working hours",
    icon: CalendarClock,
  },
  {
    id: "review",
    title: "Review & Publish",
    description: "Final review before going live",
    icon: CheckCircle,
  },
];

// ── Constants ───────────────────────────────────────────────────────
export const DEFAULT_CATEGORY_OPTIONS: CategoryOption[] = [
  { id: "venues", name: "Venues" },
  { id: "photographers", name: "Photographers" },
  { id: "caterers", name: "Caterers" },
  { id: "music-djs", name: "Music & DJs" },
  { id: "florists", name: "Florists" },
  { id: "event-planners", name: "Event Planners" },
  { id: "bakers", name: "Bakers" },
  { id: "decorators", name: "Decorators" },
  { id: "makeup", name: "Makeup" },
];

export const CULTURE_TAGS = [
  { id: "nigerian", name: "Nigerian" },
  { id: "ghanaian", name: "Ghanaian" },
  { id: "jamaican", name: "Jamaican" },
  { id: "indian", name: "Indian" },
  { id: "pakistani", name: "Pakistani" },
  { id: "caribbean", name: "Caribbean" },
  { id: "african", name: "African" },
  { id: "asian", name: "Asian" },
  { id: "western", name: "Western/Traditional" },
  { id: "multicultural", name: "Multicultural" },
];

export const RADIUS_OPTIONS = [5, 10, 15, 20, 25, 30, 50, 100];

export const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const STORAGE_KEY = "vendor_onboarding_data";
export const STEP_STORAGE_KEY = "vendor_onboarding_step";
export const BRAND = "#0097b2";

// ── Default form data ───────────────────────────────────────────────
export const DEFAULT_FORM_DATA: OnboardingData = {
  businessName: "",
  description: "",
  phonePublic: "",
  website: "",
  address: "",
  city: "",
  postcode: "",
  serviceRadiusMiles: 15,
  categories: [],
  subcategories: [],
  cultureTraditionTags: [],
  instagram: "",
  tiktok: "",
  facebook: "",
  coverImage: "",
  photos: [],
  priceFrom: null,
  listings: [],
  teamMembers: [],
  weeklySchedule: [
    { dayOfWeek: 0, startTime: "09:00", endTime: "17:00", isClosed: true },
    { dayOfWeek: 1, startTime: "09:00", endTime: "17:00", isClosed: false },
    { dayOfWeek: 2, startTime: "09:00", endTime: "17:00", isClosed: false },
    { dayOfWeek: 3, startTime: "09:00", endTime: "17:00", isClosed: false },
    { dayOfWeek: 4, startTime: "09:00", endTime: "17:00", isClosed: false },
    { dayOfWeek: 5, startTime: "09:00", endTime: "17:00", isClosed: false },
    { dayOfWeek: 6, startTime: "09:00", endTime: "17:00", isClosed: true },
  ],
};

export const DEFAULT_LISTING_DRAFT: ListingDraft = {
  headline: "",
  longDescription: "",
  price: null,
  timeEstimate: "",
  coverImageUrl: "",
  galleryUrls: [],
};

export const DEFAULT_TEAM_MEMBER: TeamMember = {
  name: "",
  photo: "",
};

// ── Utility class builders ──────────────────────────────────────────
export const inputCls = (hasError = false) =>
  `w-full rounded-xl border ${
    hasError ? "border-red-400 ring-2 ring-red-100" : "border-gray-200"
  } bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[#0097b2] focus:ring-2 focus:ring-[#0097b2]/20 disabled:bg-gray-50`;

export const chipCls = (active: boolean) =>
  `inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer select-none ${
    active
      ? "bg-[#0097b2] text-white border-[#0097b2] shadow-sm"
      : "bg-white text-gray-600 border-gray-200 hover:border-[#0097b2]/40 hover:text-[#0097b2]"
  }`;
