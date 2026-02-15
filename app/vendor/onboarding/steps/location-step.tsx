"use client";

import dynamic from "next/dynamic";
import { type City } from "@/components/ui/CitySelect";
import {
  type OnboardingData,
  RADIUS_OPTIONS,
  inputCls,
  chipCls,
} from "../types";

const CitySelect = dynamic(
  () =>
    import("@/components/ui/CitySelect").then((mod) => ({
      default: mod.CitySelect,
    })),
  {
    loading: () => (
      <div className="h-12 bg-gray-100 animate-pulse rounded-xl" />
    ),
    ssr: false,
  },
);

interface Props {
  formData: OnboardingData;
  updateFormData: (updates: Partial<OnboardingData>) => void;
  availableCities: City[];
}

export function LocationStep({
  formData,
  updateFormData,
  availableCities,
}: Props) {
  return (
    <div className="space-y-6">
      {/* City */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          City <span className="text-red-500">*</span>
        </label>
        {availableCities.length > 0 ? (
          <CitySelect
            cities={availableCities}
            value={formData.city}
            onChange={(val: string) => updateFormData({ city: val })}
          />
        ) : (
          <input
            type="text"
            value={formData.city}
            onChange={(e) => updateFormData({ city: e.target.value })}
            placeholder="e.g., London"
            className={inputCls()}
          />
        )}
      </div>

      {/* Postcode */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Postcode <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.postcode}
          onChange={(e) => updateFormData({ postcode: e.target.value })}
          placeholder="e.g., SW1A 1AA"
          className={inputCls(!formData.postcode.trim())}
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Address
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => updateFormData({ address: e.target.value })}
          placeholder="e.g., 123 High Street"
          className={inputCls()}
        />
      </div>

      {/* Service Radius */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Service Radius
        </label>
        <p className="text-xs text-gray-500 mb-2">
          How far are you willing to travel?
        </p>
        <div className="flex flex-wrap gap-2">
          {RADIUS_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => updateFormData({ serviceRadiusMiles: r })}
              className={chipCls(formData.serviceRadiusMiles === r)}
            >
              {r} miles
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
