"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ImageUpload, { MultiImageUpload } from "@/components/ui/ImageUpload";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";

// Step types
type OnboardingStep =
  | "basics"
  | "location"
  | "categories"
  | "social"
  | "media"
  | "listings"
  | "schedule"
  | "team"
  | "review";

interface WeeklyScheduleDay {
  dayOfWeek: number; // 0=Sunday
  startTime: string;
  endTime: string;
  isClosed: boolean;
}

interface ListingDraft {
  headline: string;
  longDescription: string;
  price: number | null;
  timeEstimate: string;
  coverImageUrl: string;
  galleryUrls: string[];
}

interface TeamMember {
  name: string;
  photo?: string;
}

interface OnboardingData {
  // Step 1: Basics
  businessName: string;
  description: string;
  phonePublic: string;
  website: string;

  // Step 2: Location & Radius
  address: string;
  city: string;
  postcode: string;
  serviceRadiusMiles: number;

  // Step 3: Categories
  categories: string[];
  subcategories: string[];
  cultureTraditionTags: string[];

  // Step 4: Social
  instagram: string;
  tiktok: string;
  facebook: string;

  // Step 5: Media
  coverImage: string;
  photos: string[];

  // Step 6: Pricing
  priceFrom: number | null;

  // Step 7: Listings
  listings: ListingDraft[];

  // Step 8: Weekly Schedule
  weeklySchedule: WeeklyScheduleDay[];

  teamMembers: TeamMember[];
}

const STEPS: { id: OnboardingStep; title: string; description: string }[] = [
  {
    id: "basics",
    title: "Business Basics",
    description: "Tell us about your business",
  },
  {
    id: "location",
    title: "Location & Service Area",
    description: "Where do you operate?",
  },
  {
    id: "categories",
    title: "Categories & Tags",
    description: "What services do you offer?",
  },
  {
    id: "social",
    title: "Social Media",
    description: "Connect your social profiles",
  },
  {
    id: "media",
    title: "Photos & Media",
    description: "Showcase your work",
  },
  {
    id: "listings",
    title: "Services & Packages",
    description: "Add at least 3 services or packages you offer",
  },
  {
    id: "team",
    title: "Team Members",
    description: "Add at least one team member (name required, photo optional)",
  },
  {
    id: "schedule",
    title: "Weekly Schedule",
    description: "Set your weekly working hours",
  },
  {
    id: "review",
    title: "Review & Publish",
    description: "Final review before going live",
  },
];

// Category options (would normally come from API)
const CATEGORY_OPTIONS = [
  { id: "photography", name: "Photography" },
  { id: "videography", name: "Videography" },
  { id: "catering", name: "Catering" },
  { id: "venue", name: "Venues" },
  { id: "dj", name: "DJs & Music" },
  { id: "decorators", name: "Decorators" },
  { id: "flowers", name: "Florists" },
  { id: "cake", name: "Cakes & Desserts" },
  { id: "makeup", name: "Hair & Makeup" },
  { id: "planning", name: "Event Planning" },
  { id: "transport", name: "Transportation" },
  { id: "entertainment", name: "Entertainment" },
];

const CULTURE_TAGS = [
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

const RADIUS_OPTIONS = [5, 10, 15, 20, 25, 30, 50, 100];

export default function VendorOnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("basics");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local draft state for a new listing
  const [listingDraft, setListingDraft] = useState<ListingDraft>({
    headline: "",
    longDescription: "",
    price: null,
    timeEstimate: "",
    coverImageUrl: "",
    galleryUrls: [],
  });

  // Reset draft when step is entered
  useEffect(() => {
    if (currentStep === "listings") {
      setListingDraft({
        headline: "",
        longDescription: "",
        price: null,
        timeEstimate: "",
        coverImageUrl: "",
        galleryUrls: [],
      });
    }
  }, [currentStep]);

  const handleDraftChange = (updates: Partial<ListingDraft>) => {
    setListingDraft((prev) => ({ ...prev, ...updates }));
  };

  const handleAddListing = () => {
    if (
      listingDraft.headline.trim() &&
      listingDraft.price !== null &&
      listingDraft.price > 0 &&
      listingDraft.timeEstimate.trim() &&
      listingDraft.coverImageUrl.trim() &&
      listingDraft.longDescription.trim()
    ) {
      updateFormData({ listings: [...formData.listings, listingDraft] });
      setListingDraft({
        headline: "",
        longDescription: "",
        price: null,
        timeEstimate: "",
        coverImageUrl: "",
        galleryUrls: [],
      });
    }
  };

  const handleRemoveListing = (idx: number) => {
    updateFormData({
      listings: formData.listings.filter((_, i) => i !== idx),
    });
  };

  const [formData, setFormData] = useState<OnboardingData>({
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
      { dayOfWeek: 0, startTime: "09:00", endTime: "17:00", isClosed: false },
      { dayOfWeek: 1, startTime: "09:00", endTime: "17:00", isClosed: false },
      { dayOfWeek: 2, startTime: "09:00", endTime: "17:00", isClosed: false },
      { dayOfWeek: 3, startTime: "09:00", endTime: "17:00", isClosed: false },
      { dayOfWeek: 4, startTime: "09:00", endTime: "17:00", isClosed: false },
      { dayOfWeek: 5, startTime: "09:00", endTime: "17:00", isClosed: false },
      { dayOfWeek: 6, startTime: "09:00", endTime: "17:00", isClosed: false },
    ],
  });

  // For team members
  const [teamMemberDraft, setTeamMemberDraft] = useState<TeamMember>({
    name: "",
    photo: "",
  });

  const handleAddTeamMember = () => {
    if (teamMemberDraft.name.trim()) {
      setFormData((prev) => ({
        ...prev,
        teamMembers: [...prev.teamMembers, { ...teamMemberDraft }],
      }));
      setTeamMemberDraft({ name: "", photo: "" });
    }
  };

  const handleRemoveTeamMember = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== idx),
    }));
  };

  const STORAGE_KEY = "vendor_onboarding_data";
  const STEP_STORAGE_KEY = "vendor_onboarding_step";

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedStep = localStorage.getItem(STEP_STORAGE_KEY);

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (e) {
        console.error("Error loading saved onboarding data:", e);
      }
    }

    if (savedStep && STEPS.some((s) => s.id === savedStep)) {
      setCurrentStep(savedStep as OnboardingStep);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Save current step to localStorage
  useEffect(() => {
    localStorage.setItem(STEP_STORAGE_KEY, currentStep);
  }, [currentStep]);

  // Clear localStorage on successful submit
  const clearSavedData = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STEP_STORAGE_KEY);
  };

  // Check if user already has a provider profile
  useEffect(() => {
    async function checkExistingProfile() {
      if (status === "authenticated") {
        try {
          const res = await fetch("/api/vendor/profile");
          if (res.ok) {
            const data = await res.json();
            if (data.provider) {
              // Already has a profile, redirect to dashboard
              router.push("/vendor");
            }
          }
        } catch {
          // No existing profile, continue with onboarding
        }
      }
    }
    checkExistingProfile();
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin?callbackUrl=/vendor/onboarding");
    return null;
  }

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const updateFormData = (updates: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const toggleArrayItem = (
    field: "categories" | "subcategories" | "cultureTraditionTags",
    item: string
  ) => {
    setFormData((prev) => {
      const arr = prev[field];
      if (arr.includes(item)) {
        return { ...prev, [field]: arr.filter((i) => i !== item) };
      } else {
        return { ...prev, [field]: [...arr, item] };
      }
    });
  };

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Create provider profile
      const res = await fetch("/api/vendor/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          isPublished: true, // Publish immediately after onboarding
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create profile");
      }

      const { provider } = await res.json();
      if (!provider?.id) throw new Error("Provider ID missing after creation");

      // 2. Save weekly schedule for this provider
      const scheduleRes = await Promise.all(
        formData.weeklySchedule.map((day) =>
          fetch("/api/admin/weekly-schedules", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              providerId: provider.id,
              dayOfWeek: day.dayOfWeek,
              startTime: day.startTime,
              endTime: day.endTime,
              isClosed: day.isClosed,
            }),
          })
        )
      );
      const failed = scheduleRes.find((r) => !r.ok);
      if (failed) throw new Error("Failed to save weekly schedule");

      // 3. Save team members for this provider
      if (formData.teamMembers && formData.teamMembers.length > 0) {
        const teamRes = await Promise.all(
          formData.teamMembers
            .filter((m) => m.name && m.name.trim() !== "")
            .map((member) =>
              fetch("/api/admin/team-members", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  providerId: provider.id,
                  name: member.name,
                  imageUrl: member.photo,
                }),
              })
            )
        );
        const failedTeam = teamRes.find((r) => !r.ok);
        if (failedTeam)
          throw new Error("Failed to save one or more team members");
      }

      // 4. Save listings for this provider
      if (formData.listings && formData.listings.length > 0) {
        const listingsRes = await Promise.all(
          formData.listings.map((listing) =>
            fetch("/api/vendor/listings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                providerId: provider.id,
                headline: listing.headline,
                longDescription: listing.longDescription,
                price: listing.price,
                timeEstimate: listing.timeEstimate,
                coverImageUrl: listing.coverImageUrl,
                galleryUrls: listing.galleryUrls,
              }),
            })
          )
        );
        const failedListing = listingsRes.find((r) => !r.ok);
        if (failedListing)
          throw new Error("Failed to save one or more listings");
      }

      // Clear saved data on success
      clearSavedData();

      // Success - redirect to vendor dashboard
      router.push("/vendor?welcome=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/vendor/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          isPublished: false, // Save as draft
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save draft");
      }

      // Clear saved data on success
      clearSavedData();

      // Success - redirect to vendor dashboard
      router.push("/vendor");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const WEEKDAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleScheduleChange = (
    dayIdx: number,
    field: keyof WeeklyScheduleDay,
    value: string | boolean
  ) => {
    setFormData((prev) => {
      const updated = prev.weeklySchedule.map((d, idx) =>
        idx === dayIdx ? { ...d, [field]: value } : d
      );
      return { ...prev, weeklySchedule: updated };
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "schedule":
        return (
          <div className="space-y-6">
            <p className="text-gray-600 mb-2">
              Set your regular working hours for each day. Mark days as closed
              if you do not work.
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border rounded-lg">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 text-left">Day</th>
                    <th className="px-3 py-2 text-left">Open</th>
                    <th className="px-3 py-2 text-left">Start Time</th>
                    <th className="px-3 py-2 text-left">End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.weeklySchedule.map((day, idx) => (
                    <tr key={day.dayOfWeek} className="border-b">
                      <td className="px-3 py-2 font-medium">
                        {WEEKDAYS[day.dayOfWeek]}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={!day.isClosed}
                          onChange={(e) =>
                            handleScheduleChange(
                              idx,
                              "isClosed",
                              !e.target.checked
                            )
                          }
                        />
                        <span className="ml-2 text-sm">
                          {day.isClosed ? "Closed" : "Open"}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="time"
                          value={day.startTime}
                          disabled={day.isClosed}
                          onChange={(e) =>
                            handleScheduleChange(
                              idx,
                              "startTime",
                              e.target.value
                            )
                          }
                          className="border rounded px-2 py-1"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="time"
                          value={day.endTime}
                          disabled={day.isClosed}
                          onChange={(e) =>
                            handleScheduleChange(idx, "endTime", e.target.value)
                          }
                          className="border rounded px-2 py-1"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "basics":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) =>
                  updateFormData({ businessName: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="e.g., Elite Photography Studios"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  updateFormData({ description: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Tell potential clients about your business, experience, and what makes you special..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {/* {formData.description.length}/500 characters */}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Public Phone Number
              </label>
              <input
                type="tel"
                value={formData.phonePublic}
                onChange={(e) =>
                  updateFormData({ phonePublic: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="+44 7XXX XXXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => {
                  let value = e.target.value;
                  // Auto-add https:// if user types a domain without protocol
                  if (
                    value &&
                    !value.startsWith("http://") &&
                    !value.startsWith("https://") &&
                    value.includes(".")
                  ) {
                    value = "https://" + value;
                  }
                  updateFormData({ website: value });
                }}
                onBlur={(e) => {
                  let value = e.target.value.trim();
                  // Ensure https:// prefix on blur if URL is entered
                  if (
                    value &&
                    !value.startsWith("http://") &&
                    !value.startsWith("https://")
                  ) {
                    updateFormData({ website: "https://" + value });
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="https://www.yourwebsite.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Price (£)
              </label>
              <input
                type="number"
                value={formData.priceFrom || ""}
                onChange={(e) =>
                  updateFormData({
                    priceFrom: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="e.g., 50000"
                min="0"
              />
              <p className="text-sm text-gray-500 mt-1">
                Helps clients filter by budget
              </p>
            </div>
          </div>
        );

      case "location":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => updateFormData({ address: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="123 High Street"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateFormData({ city: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="London"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postcode *
                </label>
                <input
                  type="text"
                  value={formData.postcode}
                  onChange={(e) => updateFormData({ postcode: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="SW1A 1AA"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Radius *
              </label>
              <p className="text-sm text-gray-500 mb-3">
                How far are you willing to travel to provide your services?
              </p>
              <div className="grid grid-cols-4 gap-3">
                {RADIUS_OPTIONS.map((miles) => (
                  <button
                    key={miles}
                    type="button"
                    onClick={() =>
                      updateFormData({ serviceRadiusMiles: miles })
                    }
                    className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                      formData.serviceRadiusMiles === miles
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {miles} mi
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Clients searching within your service radius will see your
                profile.
              </p>
            </div>
          </div>
        );

      case "categories":
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Service Categories *
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Select all categories that apply to your business
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CATEGORY_OPTIONS.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleArrayItem("categories", cat.id)}
                    className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors text-left ${
                      formData.categories.includes(cat.id)
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Culture & Tradition Specializations
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Do you specialize in any cultural traditions? (Optional)
              </p>
              <div className="flex flex-wrap gap-2">
                {CULTURE_TAGS.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() =>
                      toggleArrayItem("cultureTraditionTags", tag.id)
                    }
                    className={`py-2 px-4 rounded-full border-2 font-medium transition-colors ${
                      formData.cultureTraditionTags.includes(tag.id)
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "social":
        return (
          <div className="space-y-6">
            <p className="text-gray-600">
              Connect your social media profiles to help clients learn more
              about your work.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  @
                </span>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) =>
                    updateFormData({ instagram: e.target.value })
                  }
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="yourhandle"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TikTok
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  @
                </span>
                <input
                  type="text"
                  value={formData.tiktok}
                  onChange={(e) => updateFormData({ tiktok: e.target.value })}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="yourhandle"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook
              </label>
              <input
                type="text"
                value={formData.facebook}
                onChange={(e) => updateFormData({ facebook: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="facebook.com/yourpage"
              />
            </div>
          </div>
        );

      case "media":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image
              </label>
              <p className="text-sm text-gray-500 mb-3">
                This will be the main image on your profile card
              </p>
              <ImageUpload
                value={formData.coverImage}
                onChange={(url) => updateFormData({ coverImage: url })}
                type="cover"
                aspectRatio="video"
                placeholder="Click or drag to upload your cover image"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio Photos
              </label>
              <p className="text-sm text-gray-500 mb-1">
                Upload your best work photos (minimum 4, up to 10)
              </p>
              <p className="text-xs text-gray-600 mb-3">
                Please upload at least 4 images. All image formats are accepted.
                Each image must not exceed 3MB.
              </p>
              <MultiImageUpload
                values={formData.photos}
                onChange={(urls) => updateFormData({ photos: urls })}
                maxImages={10}
                type="gallery"
                maxSizeMB={3}
              />
              {formData.photos.length > 0 && formData.photos.length < 4 && (
                <p className="text-sm text-red-500 mt-2">
                  Please upload at least 4 images to continue.
                </p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> High-quality photos help attract more
                clients. Use images that showcase your best work!
              </p>
            </div>
          </div>
        );

      case "team":
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Team Members
            </h2>
            <p className="text-gray-600 mb-4">
              Add at least one team member. Name is required, photo is optional.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex flex-col items-center gap-2">
                <ImageUpload
                  value={teamMemberDraft.photo}
                  onChange={(url) =>
                    setTeamMemberDraft({ ...teamMemberDraft, photo: url })
                  }
                  type="avatar"
                  aspectRatio="square"
                  placeholder="Upload photo"
                  className="w-20 h-20 rounded-full border object-cover"
                />
                <span className="text-xs text-gray-500">Photo (optional)</span>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={teamMemberDraft.name}
                  onChange={(e) =>
                    setTeamMemberDraft({
                      ...teamMemberDraft,
                      name: e.target.value,
                    })
                  }
                  placeholder="Team member name"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  required
                />
              </div>
              <button
                type="button"
                className={`btn btn-accent h-10 px-6 rounded-lg font-medium ${
                  !teamMemberDraft.name.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={handleAddTeamMember}
                disabled={!teamMemberDraft.name.trim()}
              >
                Add
              </button>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Current Team</h3>
              {formData.teamMembers.length === 0 ? (
                <p className="text-gray-500">No team members added yet.</p>
              ) : (
                <ul className="space-y-3">
                  {formData.teamMembers.map((member, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-4 bg-white border border-gray-100 rounded-lg p-3"
                    >
                      {member.photo ? (
                        <Image
                          src={member.photo}
                          alt={member.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                      ) : (
                        <Image
                          width={48}
                          height={48}
                          src="/profile-dummy.png"
                          alt="Default profile"
                          className="w-12 h-12 rounded-full object-cover border bg-gray-200"
                        />
                      )}
                      <span className="font-medium text-gray-900">
                        {member.name}
                      </span>
                      <button
                        type="button"
                        className="ml-auto btn btn-xs btn-error"
                        onClick={() => handleRemoveTeamMember(idx)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );

      case "review":
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">
                🎉 Almost there!
              </h3>
              <p className="text-green-700">
                Review your profile information before publishing. You can edit
                these details anytime from your vendor dashboard.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Business Name
                </h4>
                <p className="text-gray-900">{formData.businessName || "-"}</p>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Location
                </h4>
                <p className="text-gray-900">
                  {formData.city}, {formData.postcode}
                </p>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Service Radius
                </h4>
                <p className="text-gray-900">
                  {formData.serviceRadiusMiles} miles
                </p>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {formData.categories.length > 0 ? (
                    formData.categories.map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-1 bg-accent/10 text-accent text-sm rounded"
                      >
                        {CATEGORY_OPTIONS.find((c) => c.id === cat)?.name ||
                          cat}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">
                      No categories selected
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Culture Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {formData.cultureTraditionTags.length > 0 ? (
                    formData.cultureTraditionTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-amber-100 text-amber-700 text-sm rounded"
                      >
                        {CULTURE_TAGS.find((t) => t.id === tag)?.name || tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">None selected</span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Starting Price
                </h4>
                <p className="text-gray-900">
                  {formData.priceFrom
                    ? formatCurrency(formData.priceFrom)
                    : "Not specified"}
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>
        );

      case "listings":
        return (
          <div className="space-y-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Add Your Services/Packages
            </h2>
            <p className="text-gray-600 mb-4">
              Add at least 3 services or packages you offer. These will be shown
              to clients and can be booked.
            </p>
            {/* Listing form */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Headline *
                </label>
                <input
                  type="text"
                  value={listingDraft.headline}
                  maxLength={50}
                  onChange={(e) =>
                    handleDraftChange({ headline: e.target.value.slice(0, 50) })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., Gold Wedding Photography Package"
                />
                <div className="text-xs text-gray-500 text-right mt-1">
                  {50 - listingDraft.headline.length} characters left
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (£) *
                </label>
                <input
                  type="number"
                  value={listingDraft.price ?? ""}
                  onChange={(e) =>
                    handleDraftChange({
                      price: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., 100"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Estimate *
                </label>
                <input
                  type="text"
                  value={listingDraft.timeEstimate}
                  onChange={(e) =>
                    handleDraftChange({ timeEstimate: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., 6 hours, 1 day, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image *
                </label>
                <ImageUpload
                  value={listingDraft.coverImageUrl}
                  onChange={(url) => handleDraftChange({ coverImageUrl: url })}
                  type="cover"
                  aspectRatio="video"
                  placeholder="Click or drag to upload"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={listingDraft.longDescription}
                  onChange={(e) =>
                    handleDraftChange({
                      longDescription: e.target.value.slice(0, 150),
                    })
                  }
                  rows={3}
                  maxLength={150}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Describe this service/package in detail"
                />
                <div className="text-xs text-gray-500 text-right mt-1">
                  {150 - listingDraft.longDescription.length} characters left
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddListing}
                disabled={
                  !listingDraft.headline.trim() ||
                  !listingDraft.price ||
                  listingDraft.price <= 0 ||
                  !listingDraft.timeEstimate.trim() ||
                  !listingDraft.coverImageUrl.trim() ||
                  !listingDraft.longDescription.trim()
                }
                className={`mt-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                  listingDraft.headline.trim() &&
                  listingDraft.price &&
                  listingDraft.price > 0 &&
                  listingDraft.timeEstimate.trim() &&
                  listingDraft.coverImageUrl.trim() &&
                  listingDraft.longDescription.trim()
                    ? "bg-accent text-white hover:bg-accent"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Add Listing
              </button>
            </div>

            {/* List of added listings */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-2">
                Your Listings
              </h3>
              {formData.listings.length === 0 ? (
                <p className="text-gray-500">No listings added yet.</p>
              ) : (
                <ul className="space-y-4">
                  {formData.listings.map((listing, idx) => (
                    <li
                      key={idx}
                      className="border rounded-lg p-4 flex items-start gap-4 bg-white"
                    >
                      {listing.coverImageUrl && (
                        <img
                          src={listing.coverImageUrl}
                          alt="Cover"
                          className="w-20 h-20 object-cover rounded-md border"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">
                            {listing.headline}
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleRemoveListing(idx)}
                            className="ml-2 text-red-600 hover:underline text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="text-gray-700 mt-1">
                          {listing.longDescription}
                        </div>
                        <div className="text-gray-500 text-sm mt-2 flex gap-4">
                          <span>
                            Price:{" "}
                            {listing.price
                              ? formatCurrency(listing.price)
                              : "-"}
                          </span>
                          <span>Time: {listing.timeEstimate}</span>
                        </div>
                        {listing.galleryUrls &&
                          listing.galleryUrls.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {listing.galleryUrls.slice(0, 3).map((url, i) => (
                                <img
                                  key={i}
                                  src={url}
                                  alt="Gallery"
                                  className="w-12 h-12 object-cover rounded border"
                                />
                              ))}
                            </div>
                          )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {formData.listings.length < 3 && (
                <p className="text-red-500 mt-2 text-sm">
                  Please add at least 3 listings to continue.
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case "basics":
        return (
          formData.businessName.trim() !== "" &&
          formData.description.trim() !== "" &&
          formData.phonePublic.trim() !== "" &&
          formData.website.trim() !== "" &&
          formData.priceFrom !== null &&
          formData.priceFrom > 0
        );
      case "location":
        return (
          formData.address.trim() !== "" &&
          formData.city.trim() !== "" &&
          formData.postcode.trim() !== "" &&
          formData.serviceRadiusMiles > 0
        );
      case "categories":
        // Only require at least one category to continue
        return formData.categories.length > 0;
      case "social":
        return (
          formData.instagram.trim() !== "" &&
          formData.tiktok.trim() !== "" &&
          formData.facebook.trim() !== ""
        );
      case "media":
        return formData.coverImage.trim() !== "" && formData.photos.length >= 4;
      case "listings":
        return formData.listings.length >= 3;
      case "schedule":
        // All days must be filled (not closed) and have valid times
        return (
          formData.weeklySchedule.every(
            (d) => d.isClosed || (d.startTime && d.endTime)
          ) && formData.weeklySchedule.some((d) => !d.isClosed)
        );

      case "team":
        return formData.teamMembers.some((m) => m.name && m.name.trim() !== "");
      case "review":
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Create Your Vendor Profile
          </h1>
          <p className="text-gray-600 mt-1">
            Complete your profile to start receiving inquiries from clients
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-0">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-colors duration-200 ${
                    index < currentStepIndex
                      ? "bg-accent text-white"
                      : index === currentStepIndex
                      ? "bg-accent text-white ring-2 ring-accent/40"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index < currentStepIndex ? "✓" : index + 1}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-1 ${
                      index < currentStepIndex ? "bg-accent" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 text-center">
            <span className="text-sm font-medium text-accent">
              {STEPS[currentStepIndex].title}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              - {STEPS[currentStepIndex].description}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={isFirstStep}
            className={`px-6 py-3 rounded-lg font-medium ${
              isFirstStep
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Back
          </button>

          <div className="flex gap-3">
            {isLastStep && (
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50"
              >
                Save as Draft
              </button>
            )}

            {isLastStep ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Profile 🚀"
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`px-8 py-3 rounded-lg font-medium ${
                  isStepValid()
                    ? "bg-accent text-white hover:bg-accent"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
