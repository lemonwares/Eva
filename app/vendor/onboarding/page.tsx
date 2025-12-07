"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ImageUpload, { MultiImageUpload } from "@/components/ui/ImageUpload";
import { formatCurrency } from "@/lib/formatters";

// Step types
type OnboardingStep =
  | "basics"
  | "location"
  | "categories"
  | "social"
  | "media"
  | "review";

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
  { id: "decor", name: "Decoration" },
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
  });

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

  const renderStepContent = () => {
    switch (currentStep) {
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
                {formData.description.length}/500 characters
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
                Starting Price (€)
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
              <p className="text-sm text-gray-500 mb-3">
                Upload your best work photos (up to 10)
              </p>
              <MultiImageUpload
                values={formData.photos}
                onChange={(urls) => updateFormData({ photos: urls })}
                maxImages={10}
                type="gallery"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> High-quality photos help attract more
                clients. Use images that showcase your best work!
              </p>
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

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case "basics":
        return (
          formData.businessName.trim() !== "" &&
          formData.description.trim() !== ""
        );
      case "location":
        return (
          formData.city.trim() !== "" &&
          formData.postcode.trim() !== "" &&
          formData.serviceRadiusMiles > 0
        );
      case "categories":
        return formData.categories.length > 0;
      case "social":
        return true; // Optional step
      case "media":
        return true; // Optional step
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
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                    index < currentStepIndex
                      ? "bg-accent text-white"
                      : index === currentStepIndex
                      ? "bg-accent text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index < currentStepIndex ? "✓" : index + 1}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-12 sm:w-20 h-1 ${
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
