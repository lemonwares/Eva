"use client";

import { Phone, Globe } from "lucide-react";
import { type OnboardingData, inputCls } from "../types";

interface Props {
  formData: OnboardingData;
  updateFormData: (updates: Partial<OnboardingData>) => void;
}

export function BasicsStep({ formData, updateFormData }: Props) {
  return (
    <div className="space-y-6">
      {/* Business Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.businessName}
          onChange={(e) => updateFormData({ businessName: e.target.value })}
          placeholder="e.g., Ade's Event Photography"
          className={inputCls(!formData.businessName.trim())}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder="Tell potential clients what makes your business special…"
          rows={4}
          maxLength={500}
          className={inputCls(!formData.description.trim())}
        />
        <p className="text-xs text-gray-400 mt-1 text-right">
          {formData.description.length}/500
        </p>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          <Phone className="inline w-4 h-4 mr-1 -mt-0.5" />
          Public Phone Number
        </label>
        <input
          type="tel"
          value={formData.phonePublic}
          onChange={(e) => updateFormData({ phonePublic: e.target.value })}
          placeholder="e.g., 07400 123456"
          className={inputCls()}
        />
      </div>

      {/* Website */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          <Globe className="inline w-4 h-4 mr-1 -mt-0.5" />
          Website
        </label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => updateFormData({ website: e.target.value })}
          placeholder="https://www.example.com"
          className={inputCls()}
        />
      </div>
    </div>
  );
}
