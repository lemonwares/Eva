"use client";

import * as LucideIcons from "lucide-react";
import { Folder, Star } from "lucide-react";
import Modal from "@/components/admin/Modal";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder?: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  displayOrder?: number;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  aliases?: string[];
  subTags?: string[];
  subcategories?: Subcategory[];
  _count?: {
    subcategories: number;
    providers: number;
  };
  vendorCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoryDetailsModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryDetailsModal({
  category,
  isOpen,
  onClose,
}: CategoryDetailsModalProps) {
  const { darkMode, textPrimary, textSecondary, textMuted } = useAdminTheme();

  if (!category) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Category Details" size="lg">
      <div className="space-y-6">
        {/* Header with Icon */}
        <div className="flex items-start gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div
            className={`w-16 h-16 rounded-xl flex items-center justify-center ${
              darkMode ? "bg-white/5" : "bg-gray-100"
            }`}
          >
            {(() => {
              const iconName = category.icon as keyof typeof LucideIcons;
              const IconComponent =
                iconName && LucideIcons[iconName]
                  ? (LucideIcons[iconName] as React.FC<{ size?: number }>)
                  : Folder;
              return <IconComponent size={32} className={textSecondary} />;
            })()}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`text-2xl font-semibold ${textPrimary} mb-1`}>
                  {category.name}
                </h3>
                <p className={`text-sm ${textMuted}`}>/{category.slug}</p>
              </div>
              {category.isFeatured && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500">
                  <Star size={12} className="fill-current" />
                  Featured
                </span>
              )}
            </div>
            {category.description && (
              <p className={`mt-3 text-sm ${textSecondary}`}>
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div
            className={`p-4 rounded-lg border ${
              darkMode
                ? "bg-white/5 border-white/10"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className={`text-2xl font-bold ${textPrimary}`}>
              {category._count?.subcategories ||
                category.subcategories?.length ||
                0}
            </div>
            <div className={`text-xs ${textMuted} mt-1`}>Subcategories</div>
          </div>
          <div
            className={`p-4 rounded-lg border ${
              darkMode
                ? "bg-white/5 border-white/10"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className={`text-2xl font-bold ${textPrimary}`}>
              {typeof category.vendorCount === "number"
                ? category.vendorCount
                : typeof category._count?.providers === "number"
                ? category._count.providers
                : 0}
            </div>
            <div className={`text-xs ${textMuted} mt-1`}>Providers</div>
          </div>
          <div
            className={`p-4 rounded-lg border ${
              darkMode
                ? "bg-white/5 border-white/10"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className={`text-2xl font-bold ${textPrimary}`}>
              {category.displayOrder}
            </div>
            <div className={`text-xs ${textMuted} mt-1`}>Display Order</div>
          </div>
        </div>

        {/* Aliases & Sub-tags */}
        {(category.aliases?.length || category.subTags?.length) && (
          <div className="space-y-4">
            {category.aliases && category.aliases.length > 0 && (
              <div>
                <h4 className={`text-sm font-medium ${textSecondary} mb-2`}>
                  Aliases
                </h4>
                <div className="flex flex-wrap gap-2">
                  {category.aliases.map((alias, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        darkMode
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {alias}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {category.subTags && category.subTags.length > 0 && (
              <div>
                <h4 className={`text-sm font-medium ${textSecondary} mb-2`}>
                  Sub-tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {category.subTags.map((tag, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        darkMode
                          ? "bg-purple-500/10 text-purple-400"
                          : "bg-purple-50 text-purple-600"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Subcategories List */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div>
            <h4 className={`text-sm font-medium ${textSecondary} mb-3`}>
              Subcategories ({category.subcategories.length})
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {category.subcategories.map((sub) => (
                <div
                  key={sub.id}
                  className={`p-3 rounded-lg border ${
                    darkMode
                      ? "bg-white/5 border-white/10"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${textPrimary}`}>
                        {sub.name}
                      </p>
                      <p className={`text-xs ${textMuted}`}>/{sub.slug}</p>
                    </div>
                    {sub.displayOrder !== undefined && (
                      <span
                        className={`text-xs ${textMuted} px-2 py-1 rounded ${
                          darkMode ? "bg-white/5" : "bg-white"
                        }`}
                      >
                        #{sub.displayOrder}
                      </span>
                    )}
                  </div>
                  {sub.description && (
                    <p className={`text-xs ${textMuted} mt-1`}>
                      {sub.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEO Metadata */}
        {(category.metaTitle || category.metaDescription) && (
          <div
            className={`p-4 rounded-lg border ${
              darkMode
                ? "bg-white/5 border-white/10"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <h4 className={`text-sm font-medium ${textSecondary} mb-3`}>
              SEO Metadata
            </h4>
            <div className="space-y-3">
              {category.metaTitle && (
                <div>
                  <p className={`text-xs ${textMuted} mb-1`}>Meta Title</p>
                  <p className={`text-sm ${textPrimary}`}>
                    {category.metaTitle}
                  </p>
                </div>
              )}
              {category.metaDescription && (
                <div>
                  <p className={`text-xs ${textMuted} mb-1`}>
                    Meta Description
                  </p>
                  <p className={`text-sm ${textPrimary}`}>
                    {category.metaDescription}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timestamps */}
        {(category.createdAt || category.updatedAt) && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-xs">
              {category.createdAt && (
                <div>
                  <span className={textMuted}>Created</span>
                  <p className={`${textSecondary} mt-1`}>
                    {new Date(category.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
              {category.updatedAt && (
                <div>
                  <span className={textMuted}>Last Updated</span>
                  <p className={`${textSecondary} mt-1`}>
                    {new Date(category.updatedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
