"use client";

import { Info } from "lucide-react";
import { type OnboardingData, inputCls } from "../types";

interface Props {
  formData: OnboardingData;
  updateFormData: (updates: Partial<OnboardingData>) => void;
}

export function SocialStep({ formData, updateFormData }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
        <Info className="w-5 h-5 mt-0.5 shrink-0" />
        <p>
          All social fields are optional. Add the ones that are relevant to your
          business.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Instagram Handle
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            @
          </span>
          <input
            type="text"
            value={formData.instagram}
            onChange={(e) =>
              updateFormData({ instagram: e.target.value.replace(/^@/, "") })
            }
            placeholder="your_business"
            className={`${inputCls()} pl-8`}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          TikTok Handle
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            @
          </span>
          <input
            type="text"
            value={formData.tiktok}
            onChange={(e) =>
              updateFormData({ tiktok: e.target.value.replace(/^@/, "") })
            }
            placeholder="your_business"
            className={`${inputCls()} pl-8`}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Facebook Page URL
        </label>
        <input
          type="url"
          value={formData.facebook}
          onChange={(e) => updateFormData({ facebook: e.target.value })}
          placeholder="https://facebook.com/your-business"
          className={inputCls()}
        />
      </div>
    </div>
  );
}
