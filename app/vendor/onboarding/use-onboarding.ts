"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { logger } from "@/lib/logger";
import { type City } from "@/components/ui/CitySelect";
import {
  type OnboardingStep,
  type OnboardingData,
  type ListingDraft,
  type TeamMember,
  type WeeklyScheduleDay,
  type CategoryOption,
  STEPS,
  DEFAULT_CATEGORY_OPTIONS,
  DEFAULT_FORM_DATA,
  DEFAULT_LISTING_DRAFT,
  DEFAULT_TEAM_MEMBER,
  STORAGE_KEY,
  STEP_STORAGE_KEY,
} from "./types";

// ═════════════════════════════════════════════════════════════════════
// Hook return type
// ═════════════════════════════════════════════════════════════════════
export interface UseOnboardingReturn {
  // Auth
  status: "loading" | "authenticated" | "unauthenticated";

  // Navigation
  currentStep: OnboardingStep;
  currentStepIndex: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  progressPct: number;
  handleNext: () => void;
  handleBack: () => void;
  jumpToStep: (step: OnboardingStep) => void;

  // Form data
  formData: OnboardingData;
  updateFormData: (updates: Partial<OnboardingData>) => void;
  toggleArrayItem: (
    field: "categories" | "subcategories" | "cultureTraditionTags",
    item: string,
  ) => void;
  handleScheduleChange: (
    dayIdx: number,
    field: keyof WeeklyScheduleDay,
    value: string | boolean,
  ) => void;

  // Listing draft
  listingDraft: ListingDraft;
  handleDraftChange: (updates: Partial<ListingDraft>) => void;
  handleAddListing: () => void;
  handleRemoveListing: (idx: number) => void;

  // Team draft
  teamMemberDraft: TeamMember;
  setTeamMemberDraft: React.Dispatch<React.SetStateAction<TeamMember>>;
  handleAddTeamMember: () => void;
  handleRemoveTeamMember: (idx: number) => void;

  // Reference data
  availableCities: City[];
  categoryOptions: CategoryOption[];

  // Validation
  isStepValid: () => boolean;

  // Submit
  isSubmitting: boolean;
  submitProgress: string;
  error: string | null;
  handleSubmit: () => Promise<void>;
  handleSaveDraft: () => Promise<void>;
}

// ═════════════════════════════════════════════════════════════════════
// Hook
// ═════════════════════════════════════════════════════════════════════
export function useOnboarding(): UseOnboardingReturn {
  const router = useRouter();
  const { status } = useSession();

  // ── Core state ──────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("basics");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState("");
  const [error, setError] = useState<string | null>(null);

  // ── Reference data ──────────────────────────────────────────────
  const [availableCities, setAvailableCities] = useState<City[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>(
    DEFAULT_CATEGORY_OPTIONS,
  );

  // ── Form data ───────────────────────────────────────────────────
  const [formData, setFormData] = useState<OnboardingData>(DEFAULT_FORM_DATA);

  const [listingDraft, setListingDraft] = useState<ListingDraft>(
    DEFAULT_LISTING_DRAFT,
  );
  const [teamMemberDraft, setTeamMemberDraft] =
    useState<TeamMember>(DEFAULT_TEAM_MEMBER);

  // ── Derived ─────────────────────────────────────────────────────
  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;
  const progressPct = ((currentStepIndex + 1) / STEPS.length) * 100;

  // ── Fetch cities & categories ─────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [citiesRes, categoriesRes] = await Promise.all([
          fetch("/api/cities"),
          fetch("/api/categories"),
        ]);
        if (cancelled) return;
        if (citiesRes.ok) setAvailableCities(await citiesRes.json());
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          if (data.categories?.length > 0) {
            setCategoryOptions(
              data.categories.map(
                (c: { id: string; slug: string; name: string }) => ({
                  id: c.slug || c.id,
                  name: c.name,
                }),
              ),
            );
          }
        }
      } catch (err) {
        logger.error("Failed to fetch initial data:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── LocalStorage persistence ──────────────────────────────────
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedStep = localStorage.getItem(STEP_STORAGE_KEY);
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (e) {
        logger.error("Error loading saved onboarding data:", e);
      }
    }
    if (savedStep && STEPS.some((s) => s.id === savedStep)) {
      setCurrentStep(savedStep as OnboardingStep);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem(STEP_STORAGE_KEY, currentStep);
  }, [currentStep]);

  const clearSavedData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STEP_STORAGE_KEY);
  }, []);

  // ── Redirect if already onboarded ─────────────────────────────
  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/vendor/profile");
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (data.provider) router.push("/vendor");
        }
      } catch {
        /* no profile yet */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, router]);

  // ── Form helpers ──────────────────────────────────────────────
  const updateFormData = useCallback(
    (updates: Partial<OnboardingData>) =>
      setFormData((prev) => ({ ...prev, ...updates })),
    [],
  );

  const toggleArrayItem = useCallback(
    (
      field: "categories" | "subcategories" | "cultureTraditionTags",
      item: string,
    ) =>
      setFormData((prev) => {
        const arr = prev[field];
        return {
          ...prev,
          [field]: arr.includes(item)
            ? arr.filter((i) => i !== item)
            : [...arr, item],
        };
      }),
    [],
  );

  const handleScheduleChange = useCallback(
    (dayIdx: number, field: keyof WeeklyScheduleDay, value: string | boolean) =>
      setFormData((prev) => ({
        ...prev,
        weeklySchedule: prev.weeklySchedule.map((d, idx) =>
          idx === dayIdx ? { ...d, [field]: value } : d,
        ),
      })),
    [],
  );

  // ── Listing draft ─────────────────────────────────────────────
  const handleDraftChange = useCallback(
    (updates: Partial<ListingDraft>) =>
      setListingDraft((prev) => ({ ...prev, ...updates })),
    [],
  );

  const handleAddListing = useCallback(() => {
    setListingDraft((draft) => {
      if (
        !draft.headline.trim() ||
        !draft.price ||
        draft.price <= 0 ||
        !draft.timeEstimate.trim() ||
        !draft.coverImageUrl.trim() ||
        !draft.longDescription.trim()
      )
        return draft;

      setFormData((prev) => ({
        ...prev,
        listings: [...prev.listings, draft],
      }));

      return DEFAULT_LISTING_DRAFT;
    });
  }, []);

  const handleRemoveListing = useCallback(
    (idx: number) =>
      setFormData((prev) => ({
        ...prev,
        listings: prev.listings.filter((_, i) => i !== idx),
      })),
    [],
  );

  // ── Team member draft ─────────────────────────────────────────
  const handleAddTeamMember = useCallback(() => {
    setTeamMemberDraft((draft) => {
      if (!draft.name.trim()) return draft;

      setFormData((prev) => ({
        ...prev,
        teamMembers: [...prev.teamMembers, { ...draft }],
      }));

      return DEFAULT_TEAM_MEMBER;
    });
  }, []);

  const handleRemoveTeamMember = useCallback(
    (idx: number) =>
      setFormData((prev) => ({
        ...prev,
        teamMembers: prev.teamMembers.filter((_, i) => i !== idx),
      })),
    [],
  );

  // ── Step validation ───────────────────────────────────────────
  const isStepValid = useCallback((): boolean => {
    switch (currentStep) {
      case "basics":
        return (
          formData.businessName.trim().length > 0 &&
          formData.description.trim().length > 0
        );
      case "location":
        return (
          formData.city.trim().length > 0 && formData.postcode.trim().length > 0
        );
      case "categories":
        return formData.categories.length > 0;
      case "social":
        return true;
      case "media":
        return formData.coverImage.trim().length > 0;
      case "listings":
        return formData.listings.length >= 1;
      case "team":
        return true;
      case "schedule":
        return formData.weeklySchedule.length === 7;
      case "review":
        return true;
      default:
        return true;
    }
  }, [currentStep, formData]);

  // ── Navigation ────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    const idx = STEPS.findIndex((s) => s.id === currentStep);
    if (idx + 1 < STEPS.length) {
      setCurrentStep(STEPS[idx + 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    const idx = STEPS.findIndex((s) => s.id === currentStep);
    if (idx - 1 >= 0) {
      setCurrentStep(STEPS[idx - 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const jumpToStep = useCallback((step: OnboardingStep) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ── Submit (publish) ──────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);
    setSubmitProgress("Creating your business profile…");

    try {
      // 1. Create provider profile
      const res = await fetch("/api/vendor/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, isPublished: true }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create profile");
      }
      const { provider } = await res.json();
      if (!provider?.id) throw new Error("Provider ID missing after creation");

      // 2. Save weekly schedule (bulk)
      setSubmitProgress("Setting up your schedule…");
      const scheduleRes = await fetch("/api/vendor/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: provider.id,
          schedules: formData.weeklySchedule,
        }),
      });
      if (!scheduleRes.ok) throw new Error("Failed to save weekly schedule");

      // 3. Save team members (bulk)
      if (formData.teamMembers.length > 0) {
        setSubmitProgress("Adding your team…");
        const teamRes = await fetch("/api/vendor/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            providerId: provider.id,
            members: formData.teamMembers
              .filter((m) => m.name.trim())
              .map((m) => ({ name: m.name, imageUrl: m.photo })),
          }),
        });
        if (!teamRes.ok) throw new Error("Failed to save team members");
      }

      // 4. Save listings
      if (formData.listings.length > 0) {
        setSubmitProgress("Publishing your services…");
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
            }),
          ),
        );
        if (listingsRes.find((r) => !r.ok))
          throw new Error("Failed to save one or more listings");
      }

      clearSavedData();
      router.push("/vendor?welcome=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
      setSubmitProgress("");
    }
  }, [formData, clearSavedData, router]);

  // ── Save draft ────────────────────────────────────────────────
  const handleSaveDraft = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);
    setSubmitProgress("Saving draft…");

    try {
      const res = await fetch("/api/vendor/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, isPublished: false }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save draft");
      }
      clearSavedData();
      router.push("/vendor");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
      setSubmitProgress("");
    }
  }, [formData, clearSavedData, router]);

  return {
    status,
    currentStep,
    currentStepIndex,
    isFirstStep,
    isLastStep,
    progressPct,
    handleNext,
    handleBack,
    jumpToStep,
    formData,
    updateFormData,
    toggleArrayItem,
    handleScheduleChange,
    listingDraft,
    handleDraftChange,
    handleAddListing,
    handleRemoveListing,
    teamMemberDraft,
    setTeamMemberDraft,
    handleAddTeamMember,
    handleRemoveTeamMember,
    availableCities,
    categoryOptions,
    isStepValid,
    isSubmitting,
    submitProgress,
    error,
    handleSubmit,
    handleSaveDraft,
  };
}
