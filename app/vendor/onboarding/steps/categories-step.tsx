"use client";

import {
  type OnboardingData,
  type CategoryOption,
  CULTURE_TAGS,
  chipCls,
} from "../types";

interface Props {
  formData: OnboardingData;
  categoryOptions: CategoryOption[];
  toggleArrayItem: (
    field: "categories" | "subcategories" | "cultureTraditionTags",
    item: string,
  ) => void;
}

export function CategoriesStep({
  formData,
  categoryOptions,
  toggleArrayItem,
}: Props) {
  return (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Your Categories <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Choose all categories that describe your services.
        </p>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleArrayItem("categories", cat.id)}
              className={chipCls(formData.categories.includes(cat.id))}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Culture & Tradition Tags */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Culture & Tradition Tags
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Help clients find you based on cultural specialties.
        </p>
        <div className="flex flex-wrap gap-2">
          {CULTURE_TAGS.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleArrayItem("cultureTraditionTags", tag.id)}
              className={chipCls(
                formData.cultureTraditionTags.includes(tag.id),
              )}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
