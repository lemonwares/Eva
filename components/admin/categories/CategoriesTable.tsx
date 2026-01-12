"use client";

import * as LucideIcons from "lucide-react";
import { Edit2, Trash2, Eye, Star, Folder } from "lucide-react";
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

interface CategoriesTableProps {
  categories: Category[];
  onView: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onToggleFeatured: (category: Category, e: React.MouseEvent) => void;
}

export default function CategoriesTable({
  categories,
  onView,
  onEdit,
  onDelete,
  onToggleFeatured,
}: CategoriesTableProps) {
  const {
    darkMode,
    textPrimary,
    textSecondary,
    textMuted,
    cardBg,
    cardBorder,
  } = useAdminTheme();

  return (
    <div
      className={`${cardBg} border ${cardBorder} rounded-xl overflow-hidden`}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={darkMode ? "bg-white/5" : "bg-gray-50"}>
              <th
                className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
              >
                Category
              </th>
              <th
                className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
              >
                Subcategories
              </th>
              <th
                className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
              >
                Providers
              </th>
              <th
                className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
              >
                Featured
              </th>
              <th
                className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
              >
                Order
              </th>
              <th
                className={`text-right text-xs font-medium uppercase ${textMuted} px-6 py-4`}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              darkMode ? "divide-white/5" : "divide-gray-100"
            }`}
          >
            {categories.map((category) => (
              <tr
                key={category.id}
                className={`${
                  darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                } transition-colors`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        darkMode ? "bg-white/5" : "bg-gray-100"
                      }`}
                    >
                      {(() => {
                        const iconName =
                          category.icon as keyof typeof LucideIcons;
                        const IconComponent =
                          iconName && LucideIcons[iconName]
                            ? (LucideIcons[iconName] as React.FC<{
                                size?: number;
                              }>)
                            : Folder;
                        return (
                          <IconComponent size={20} className={textSecondary} />
                        );
                      })()}
                    </div>
                    <div>
                      <p className={`font-medium ${textPrimary}`}>
                        {category.name}
                      </p>
                      <p className={`text-xs ${textMuted}`}>/{category.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={`text-sm ${textSecondary}`}>
                      {category._count?.subcategories ||
                        category.subcategories?.length ||
                        0}
                    </span>
                    {category.subcategories &&
                      category.subcategories.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {category.subcategories.slice(0, 3).map((sub) => (
                            <span
                              key={sub.id}
                              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                darkMode ? "bg-white/10" : "bg-gray-100"
                              } ${textMuted}`}
                            >
                              {sub.name}
                            </span>
                          ))}
                          {category.subcategories.length > 3 && (
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                darkMode ? "bg-white/10" : "bg-gray-100"
                              } ${textMuted}`}
                            >
                              +{category.subcategories.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                  </div>
                </td>
                <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                  {typeof category.vendorCount === "number"
                    ? category.vendorCount
                    : typeof category._count?.providers === "number"
                    ? category._count.providers
                    : 0}
                </td>
                <td className="px-6 py-4">
                  {category.isFeatured ? (
                    <button
                      onClick={(e) => onToggleFeatured(category, e)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors"
                    >
                      <Star size={12} className="fill-current" />
                      Featured
                    </button>
                  ) : (
                    <button
                      onClick={(e) => onToggleFeatured(category, e)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${textMuted} hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10`}
                    >
                      <Star size={12} />
                      Standard
                    </button>
                  )}
                </td>
                <td className={`px-6 py-4 text-sm ${textMuted}`}>
                  {category.displayOrder}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(category)}
                      className={`p-2 rounded-lg ${
                        darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                      } transition-colors`}
                      title="View Details"
                    >
                      <Eye size={16} className={textMuted} />
                    </button>
                    <button
                      onClick={() => onEdit(category)}
                      className={`p-2 rounded-lg ${
                        darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                      } transition-colors`}
                      title="Edit"
                    >
                      <Edit2 size={16} className={textMuted} />
                    </button>
                    <button
                      onClick={() => onDelete(category)}
                      className={`p-2 rounded-lg ${
                        darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                      } transition-colors text-red-500`}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
