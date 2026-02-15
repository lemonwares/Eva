"use client";

import {
  Store,
  MapPin,
  Tag,
  Share2,
  ImageIcon,
  ListChecks,
  CalendarClock,
  Users,
  AlertCircle,
} from "lucide-react";
import { type OnboardingData, type OnboardingStep, WEEKDAYS } from "../types";
import { formatCurrency } from "@/lib/formatters";

interface Props {
  formData: OnboardingData;
  jumpToStep: (step: OnboardingStep) => void;
}

function ReviewRow({
  label,
  value,
  step,
  jumpToStep,
}: {
  label: string;
  value: React.ReactNode;
  step?: OnboardingStep;
  jumpToStep?: (step: OnboardingStep) => void;
}) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0 gap-4">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <div className="text-sm font-medium text-gray-800 text-right flex items-center gap-2">
        {value || <span className="text-gray-300">—</span>}
        {step && jumpToStep && (
          <button
            type="button"
            onClick={() => jumpToStep(step)}
            className="text-[#0097b2] hover:underline text-xs shrink-0"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export function ReviewStep({ formData, jumpToStep }: Props) {
  return (
    <div className="space-y-8">
      {/* Basics */}
      <div className="bg-gray-50 rounded-xl p-5 space-y-0">
        <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
          <Store className="w-4 h-4" /> Business Basics
        </h4>
        <ReviewRow
          label="Name"
          value={formData.businessName}
          step="basics"
          jumpToStep={jumpToStep}
        />
        <ReviewRow
          label="Description"
          value={
            formData.description
              ? `${formData.description.slice(0, 80)}…`
              : null
          }
          step="basics"
          jumpToStep={jumpToStep}
        />
        <ReviewRow
          label="Phone"
          value={formData.phonePublic}
          step="basics"
          jumpToStep={jumpToStep}
        />
        <ReviewRow
          label="Website"
          value={formData.website}
          step="basics"
          jumpToStep={jumpToStep}
        />
      </div>

      {/* Location */}
      <div className="bg-gray-50 rounded-xl p-5 space-y-0">
        <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4" /> Location
        </h4>
        <ReviewRow
          label="City"
          value={formData.city}
          step="location"
          jumpToStep={jumpToStep}
        />
        <ReviewRow
          label="Postcode"
          value={formData.postcode}
          step="location"
          jumpToStep={jumpToStep}
        />
        <ReviewRow
          label="Radius"
          value={`${formData.serviceRadiusMiles} miles`}
          step="location"
          jumpToStep={jumpToStep}
        />
      </div>

      {/* Categories */}
      <div className="bg-gray-50 rounded-xl p-5 space-y-0">
        <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
          <Tag className="w-4 h-4" /> Categories
        </h4>
        <ReviewRow
          label="Categories"
          value={
            formData.categories.length > 0
              ? formData.categories.join(", ")
              : null
          }
          step="categories"
          jumpToStep={jumpToStep}
        />
        <ReviewRow
          label="Culture Tags"
          value={
            formData.cultureTraditionTags.length > 0
              ? formData.cultureTraditionTags.join(", ")
              : null
          }
          step="categories"
          jumpToStep={jumpToStep}
        />
      </div>

      {/* Social */}
      <div className="bg-gray-50 rounded-xl p-5 space-y-0">
        <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
          <Share2 className="w-4 h-4" /> Social Media
        </h4>
        <ReviewRow
          label="Instagram"
          value={formData.instagram ? `@${formData.instagram}` : null}
          step="social"
          jumpToStep={jumpToStep}
        />
        <ReviewRow
          label="TikTok"
          value={formData.tiktok ? `@${formData.tiktok}` : null}
          step="social"
          jumpToStep={jumpToStep}
        />
        <ReviewRow
          label="Facebook"
          value={formData.facebook}
          step="social"
          jumpToStep={jumpToStep}
        />
      </div>

      {/* Media */}
      <div className="bg-gray-50 rounded-xl p-5">
        <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" /> Media
        </h4>
        <ReviewRow
          label="Cover"
          value={formData.coverImage ? "Uploaded" : null}
          step="media"
          jumpToStep={jumpToStep}
        />
        <ReviewRow
          label="Gallery"
          value={
            formData.photos.length > 0
              ? `${formData.photos.length} photos`
              : null
          }
          step="media"
          jumpToStep={jumpToStep}
        />
      </div>

      {/* Listings */}
      <div className="bg-gray-50 rounded-xl p-5">
        <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
          <ListChecks className="w-4 h-4" /> Services
        </h4>
        <ReviewRow
          label="Services"
          value={
            formData.listings.length > 0
              ? `${formData.listings.length} service(s)`
              : null
          }
          step="listings"
          jumpToStep={jumpToStep}
        />
        {formData.listings.map((l, i) => (
          <ReviewRow
            key={i}
            label={l.headline}
            value={formatCurrency(l.price ?? 0)}
          />
        ))}
      </div>

      {/* Schedule */}
      <div className="bg-gray-50 rounded-xl p-5">
        <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
          <CalendarClock className="w-4 h-4" /> Schedule
        </h4>
        {formData.weeklySchedule.map((day) => (
          <ReviewRow
            key={day.dayOfWeek}
            label={WEEKDAYS[day.dayOfWeek]}
            value={
              day.isClosed ? "Closed" : `${day.startTime} – ${day.endTime}`
            }
            step="schedule"
            jumpToStep={jumpToStep}
          />
        ))}
      </div>

      {/* Team */}
      {formData.teamMembers.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-5">
          <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" /> Team
          </h4>
          <ReviewRow
            label="Members"
            value={`${formData.teamMembers.length} member(s)`}
            step="team"
            jumpToStep={jumpToStep}
          />
        </div>
      )}

      {/* Validation warnings */}
      {formData.listings.length === 0 && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl text-sm text-amber-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            You haven&apos;t added any services yet.{" "}
            <button
              type="button"
              onClick={() => jumpToStep("listings")}
              className="underline font-medium"
            >
              Add one now
            </button>
          </p>
        </div>
      )}
      {!formData.coverImage && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl text-sm text-amber-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            No cover image uploaded.{" "}
            <button
              type="button"
              onClick={() => jumpToStep("media")}
              className="underline font-medium"
            >
              Upload one
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
