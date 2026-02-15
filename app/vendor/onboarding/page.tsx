"use client";

import {
  Store,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Save,
  Rocket,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { STEPS } from "./types";
import { useOnboarding } from "./use-onboarding";
import {
  BasicsStep,
  LocationStep,
  CategoriesStep,
  SocialStep,
  MediaStep,
  ListingsStep,
  TeamStep,
  ScheduleStep,
  ReviewStep,
} from "./steps";

// ═════════════════════════════════════════════════════════════════════
// Vendor Onboarding Page (thin shell)
// ═════════════════════════════════════════════════════════════════════
export default function VendorOnboardingPage() {
  const {
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
  } = useOnboarding();

  // ── Auth guards ────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#0097b2]" />
          <p className="text-gray-500 text-sm">Loading your account…</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // hook already redirects
  }

  // ── Step rendering ─────────────────────────────────────────────
  const renderStepContent = () => {
    switch (currentStep) {
      case "basics":
        return (
          <BasicsStep formData={formData} updateFormData={updateFormData} />
        );
      case "location":
        return (
          <LocationStep
            formData={formData}
            updateFormData={updateFormData}
            availableCities={availableCities}
          />
        );
      case "categories":
        return (
          <CategoriesStep
            formData={formData}
            categoryOptions={categoryOptions}
            toggleArrayItem={toggleArrayItem}
          />
        );
      case "social":
        return (
          <SocialStep formData={formData} updateFormData={updateFormData} />
        );
      case "media":
        return (
          <MediaStep formData={formData} updateFormData={updateFormData} />
        );
      case "listings":
        return (
          <ListingsStep
            formData={formData}
            listingDraft={listingDraft}
            handleDraftChange={handleDraftChange}
            handleAddListing={handleAddListing}
            handleRemoveListing={handleRemoveListing}
          />
        );
      case "team":
        return (
          <TeamStep
            formData={formData}
            teamMemberDraft={teamMemberDraft}
            setTeamMemberDraft={setTeamMemberDraft}
            handleAddTeamMember={handleAddTeamMember}
            handleRemoveTeamMember={handleRemoveTeamMember}
          />
        );
      case "schedule":
        return (
          <ScheduleStep
            formData={formData}
            handleScheduleChange={handleScheduleChange}
          />
        );
      case "review":
        return <ReviewStep formData={formData} jumpToStep={jumpToStep} />;
    }
  };

  const StepInfo = STEPS[currentStepIndex];
  const StepIcon = StepInfo.icon;

  // ═════════════════════════════════════════════════════════════════
  // Render
  // ═════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-50 pb-32 lg:pb-12">
      {/* ── Submit overlay ──────────────────────────────────────── */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#0097b2]" />
            <p className="text-gray-700 font-medium">{submitProgress}</p>
          </div>
        </div>
      )}

      {/* ── Top branded bar + progress ──────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0097b2] flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-gray-800">
                Vendor Onboarding
              </p>
              <p className="text-xs text-gray-500">
                Step {currentStepIndex + 1} of {STEPS.length}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 sm:hidden">
            {currentStepIndex + 1}/{STEPS.length}
          </p>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-[#0097b2] transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      {/* ── Main layout ────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6 lg:mt-8 flex gap-8">
        {/* Desktop sidebar stepper */}
        <aside className="hidden lg:block w-56 shrink-0">
          <nav className="sticky top-28 space-y-1">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isCurrent = i === currentStepIndex;
              const isComplete = i < currentStepIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => jumpToStep(step.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors text-sm ${
                    isCurrent
                      ? "bg-[#0097b2]/10 text-[#0097b2] font-semibold"
                      : isComplete
                        ? "text-gray-600 hover:bg-gray-100"
                        : "text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isCurrent
                        ? "text-[#0097b2]"
                        : isComplete
                          ? "text-green-500"
                          : "text-gray-300"
                    }`}
                  />
                  <span className="truncate">{step.title}</span>
                  {isComplete && (
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 ml-auto shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content column */}
        <main className="flex-1 min-w-0">
          {/* Error banner */}
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 text-red-700 rounded-xl text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Step card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            {/* Step header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#0097b2]/10 flex items-center justify-center">
                <StepIcon className="w-5 h-5 text-[#0097b2]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {StepInfo.title}
                </h2>
                <p className="text-sm text-gray-500">{StepInfo.description}</p>
              </div>
            </div>

            {/* Step content */}
            {renderStepContent()}
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={isFirstStep}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-0 transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            <div className="flex items-center gap-3">
              {isLastStep && (
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all"
                >
                  <Save className="w-4 h-4" /> Save Draft
                </button>
              )}

              {isLastStep ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#0097b2] text-white hover:bg-[#007f96] disabled:opacity-50 transition-all shadow-sm"
                >
                  <Rocket className="w-4 h-4" /> Publish Profile
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                    isStepValid()
                      ? "bg-[#0097b2] text-white hover:bg-[#007f96]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                  }`}
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ── Mobile bottom nav ──────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-100 p-4 lg:hidden">
        {/* Step dots */}
        <div className="flex justify-center gap-1.5 mb-3">
          {STEPS.map((step, i) => (
            <button
              key={step.id}
              type="button"
              onClick={() => jumpToStep(step.id)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentStepIndex
                  ? "w-6 bg-[#0097b2]"
                  : i < currentStepIndex
                    ? "bg-[#0097b2]/40"
                    : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={isFirstStep}
            className="flex items-center justify-center w-12 h-12 rounded-xl border border-gray-200 text-gray-600 disabled:opacity-0 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 flex gap-2">
            {isLastStep && (
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Draft
              </button>
            )}

            {isLastStep ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-[#0097b2] text-white disabled:opacity-50"
              >
                <Rocket className="w-4 h-4" /> Publish
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isStepValid()
                    ? "bg-[#0097b2] text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
