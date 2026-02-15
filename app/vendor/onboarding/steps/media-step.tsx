"use client";

import dynamic from "next/dynamic";
import { type OnboardingData } from "../types";

const ImageUpload = dynamic(
  () =>
    import("@/components/ui/ImageUpload").then((mod) => ({
      default: mod.default,
    })),
  {
    loading: () => (
      <div className="w-full h-32 bg-gray-100 animate-pulse rounded-xl" />
    ),
    ssr: false,
  },
);

const MultiImageUpload = dynamic(
  () =>
    import("@/components/ui/ImageUpload").then((mod) => ({
      default: mod.MultiImageUpload,
    })),
  {
    loading: () => (
      <div className="w-full h-32 bg-gray-100 animate-pulse rounded-xl" />
    ),
    ssr: false,
  },
);

interface Props {
  formData: OnboardingData;
  updateFormData: (updates: Partial<OnboardingData>) => void;
}

export function MediaStep({ formData, updateFormData }: Props) {
  return (
    <div className="space-y-8">
      {/* Cover Image */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Cover Image <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-3">
          This is the main image shown on your profile card. Use a high-quality
          landscape photo.
        </p>
        <ImageUpload
          value={formData.coverImage}
          onChange={(url: string) => updateFormData({ coverImage: url })}
          folder="vendor-covers"
        />
      </div>

      {/* Gallery */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Gallery Photos
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Add more photos to showcase your work (up to 10).
        </p>
        <MultiImageUpload
          values={formData.photos}
          onChange={(urls: string[]) => updateFormData({ photos: urls })}
          maxImages={10}
          folder="vendor-gallery"
        />
      </div>
    </div>
  );
}
