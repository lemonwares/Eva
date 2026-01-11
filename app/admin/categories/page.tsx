"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Star,
  Folder,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle,
  XCircle,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Toast, ToastType } from "@/components/admin/Toast";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

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

// Edit/Add Category Modal
function CategoryFormModal({
  category,
  isOpen,
  onClose,
  onSave,
  mode,
}: {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Category>) => void;
  mode: "add" | "edit";
}) {
  const {
    darkMode,
    textPrimary,
    textSecondary,
    textMuted,
    inputBg,
    inputBorder,
  } = useAdminTheme();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    displayOrder: 0,
    isFeatured: false,
    metaTitle: "",
    metaDescription: "",
    aliasesText: "",
    subTagsText: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (category && mode === "edit") {
      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        icon: category.icon || "",
        displayOrder: category.displayOrder || 0,
        isFeatured: category.isFeatured || false,
        metaTitle: category.metaTitle || "",
        metaDescription: category.metaDescription || "",
        aliasesText: (category.aliases || []).join(", "),
        subTagsText: (category.subTags || []).join(", "),
      });
    } else if (mode === "add") {
      setFormData({
        name: "",
        slug: "",
        description: "",
        icon: "",
        displayOrder: 0,
        isFeatured: false,
        metaTitle: "",
        metaDescription: "",
        aliasesText: "",
        subTagsText: "",
      });
    }
  }, [category, mode, isOpen]);

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug:
        mode === "add"
          ? name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")
          : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const toArray = (text: string) =>
        text
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter((s) => s.length > 0);

      const payload: Partial<Category> = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        icon: formData.icon,
        displayOrder: formData.displayOrder,
        isFeatured: formData.isFeatured,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        aliases: toArray(formData.aliasesText),
        subTags: toArray(formData.subTagsText),
      };

      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`;
  const labelClass = `block text-sm font-medium ${textSecondary} mb-1.5`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Add New Category" : "Edit Category"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="mt-2">
        <Tabs defaultValue="general">
          <TabsList className="mb-6 w-full grid grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="taxonomy">Taxonomy</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className={inputClass}
                  required
                  placeholder="e.g., Wedding Venues"
                />
              </div>
              <div>
                <label className={labelClass}>Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, ""),
                    })
                  }
                  className={inputClass}
                  required
                  placeholder="e.g., wedding-venues"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={`${inputClass} resize-none`}
                rows={4}
                placeholder="Brief description of this category..."
                maxLength={500}
              />
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Icon Name (Lucide)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className={inputClass}
                  placeholder="e.g., Camera, Music, Home"
                />
                <p className={`text-xs ${textMuted} mt-1.5`}>
                  Use{" "}
                  <a
                    href="https://lucide.dev/icons"
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent hover:underline"
                  >
                    Lucide icon names
                  </a>
                </p>
              </div>

              <div>
                <label className={labelClass}>Display Order</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      displayOrder: parseInt(e.target.value) || 0,
                    })
                  }
                  className={inputClass}
                  min={0}
                />
              </div>
            </div>

            <div className="p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                  className="w-5 h-5 text-accent rounded focus:ring-accent"
                />
                <div>
                  <span className={`block text-sm font-medium ${textPrimary}`}>
                    Feature this category
                  </span>
                  <span className={`block text-xs ${textMuted}`}>
                    Featured categories appear on the homepage and top level
                    places.
                  </span>
                </div>
              </label>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-5">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <span className="font-semibold">Pro Tip:</span> Good SEO titles
                and descriptions help your category pages appear in Google
                search results.
              </p>
            </div>

            <div>
              <label className={labelClass}>Meta Title</label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) =>
                  setFormData({ ...formData, metaTitle: e.target.value })
                }
                className={inputClass}
                placeholder="Page title for search engines"
                maxLength={60}
              />
              <div className="flex justify-between mt-1">
                <p className={`text-xs ${textMuted}`}>
                  Recommended: 50-60 chars
                </p>
                <p
                  className={`text-xs ${
                    formData.metaTitle.length > 60 ? "text-red-500" : textMuted
                  }`}
                >
                  {formData.metaTitle.length}/60
                </p>
              </div>
            </div>

            <div>
              <label className={labelClass}>Meta Description</label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData({ ...formData, metaDescription: e.target.value })
                }
                className={`${inputClass} resize-none`}
                rows={3}
                placeholder="Description for search engines"
                maxLength={160}
              />
              <div className="flex justify-between mt-1">
                <p className={`text-xs ${textMuted}`}>
                  Recommended: 150-160 chars
                </p>
                <p
                  className={`text-xs ${
                    formData.metaDescription.length > 160
                      ? "text-red-500"
                      : textMuted
                  }`}
                >
                  {formData.metaDescription.length}/160
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="taxonomy" className="space-y-5">
            <div>
              <label className={labelClass}>Aliases (comma-separated)</label>
              <input
                type="text"
                value={formData.aliasesText}
                onChange={(e) =>
                  setFormData({ ...formData, aliasesText: e.target.value })
                }
                className={inputClass}
                placeholder="e.g., makeup, beauticians"
              />
              <p className={`text-xs ${textMuted} mt-1.5`}>
                Synonyms and alternative names to improve search and SEO.
              </p>
            </div>

            <div>
              <label className={labelClass}>Sub-Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.subTagsText}
                onChange={(e) =>
                  setFormData({ ...formData, subTagsText: e.target.value })
                }
                className={inputClass}
                placeholder="e.g., bridal-makeup, party-makeup"
              />
              <p className={`text-xs ${textMuted} mt-1.5`}>
                Filterable sub-tags used to refine results and improve SEO.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2.5 rounded-lg border ${inputBorder} ${textSecondary} hover:bg-gray-50 dark:hover:bg-white/5 transition-colors`}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
            disabled={saving}
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {mode === "add" ? "Create Category" : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function CategoriesPage() {
  const {
    darkMode,
    cardBg,
    cardBorder,
    textPrimary,
    textSecondary,
    textMuted,
    inputBg,
    inputBorder,
  } = useAdminTheme();

  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFeatured, setFilterFeatured] = useState<boolean | null>(null);

  // Modals State
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  // Confirm Dialog State
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  // Toast State
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  // Pagination (clientside for now as api might not support it yet, assuming small dataset)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        withSubcategories: "true",
      });

      if (filterFeatured !== null) {
        params.set("featured", filterFeatured.toString());
      }

      const response = await fetch(`/api/categories?${params}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data.categories) {
        setCategories(data.categories);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setToast({ message: "Failed to fetch categories", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [filterFeatured]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Filter categories by search
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormMode("edit");
    setFormModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setFormMode("add");
    setFormModalOpen(true);
  };

  const handleSave = async (data: Partial<Category>) => {
    try {
      if (formMode === "add") {
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          setToast({
            message: "Category created successfully",
            type: "success",
          });
          setFormModalOpen(false);
          fetchCategories();
        } else {
          setToast({
            message: result.message || "Failed to create category",
            type: "error",
          });
        }
      } else if (selectedCategory) {
        const response = await fetch(`/api/categories/${selectedCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          setToast({
            message: "Category updated successfully",
            type: "success",
          });
          setFormModalOpen(false);
          setSelectedCategory(null);
          fetchCategories();
        } else {
          setToast({
            message: result.message || "Failed to update category",
            type: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error saving category:", error);
      setToast({ message: "Failed to save category", type: "error" });
    }
  };

  const handleDelete = async () => {
    if (!deleteCategory) return;

    try {
      const response = await fetch(`/api/categories/${deleteCategory.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setToast({ message: "Category deleted successfully", type: "success" });
        fetchCategories();
      } else {
        const result = await response.json();
        setToast({
          message: result.message || "Failed to delete category",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      setToast({ message: "Failed to delete category", type: "error" });
    } finally {
      setDeleteCategory(null);
    }
  };

  const handleToggleFeatured = async (
    category: Category,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    // Optimistic update
    const newStatus = !category.isFeatured;
    setCategories(
      categories.map((c) =>
        c.id === category.id ? { ...c, isFeatured: newStatus } : c
      )
    );

    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.error("Error toggling featured:", error);
      // Revert optimistic update
      setCategories(
        categories.map((c) =>
          c.id === category.id ? { ...c, isFeatured: !newStatus } : c
        )
      );
      setToast({ message: "Failed to update category", type: "error" });
    }
  };

  return (
    <AdminLayout
      title="Categories"
      actionButton={{
        label: "Add Category",
        onClick: handleAdd,
        icon: <Plus size={18} />,
      }}
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            size={18}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`}
          />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterFeatured(null)}
            className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              filterFeatured === null
                ? "bg-accent text-white border-transparent"
                : `${inputBg} ${inputBorder} ${textSecondary} hover:bg-gray-50 dark:hover:bg-white/5`
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterFeatured(true)}
            className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              filterFeatured === true
                ? "bg-accent text-white border-transparent"
                : `${inputBg} ${inputBorder} ${textSecondary} hover:bg-gray-50 dark:hover:bg-white/5`
            }`}
          >
            Featured
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div
          className={`${cardBg} border ${cardBorder} rounded-xl p-12 text-center`}
        >
          <Folder className={`w-12 h-12 mx-auto mb-4 ${textMuted}`} />
          <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>
            No categories found
          </h3>
          <p className={textMuted}>
            {searchQuery
              ? "No categories match your search criteria."
              : "No categories have been added yet."}
          </p>
          {!searchQuery && (
            <button
              onClick={handleAdd}
              className="mt-4 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            >
              Add First Category
            </button>
          )}
        </div>
      ) : (
        <>
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
                  {paginatedCategories.map((category) => (
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
                                <IconComponent
                                  size={20}
                                  className={textSecondary}
                                />
                              );
                            })()}
                          </div>
                          <div>
                            <p className={`font-medium ${textPrimary}`}>
                              {category.name}
                            </p>
                            <p className={`text-xs ${textMuted}`}>
                              /{category.slug}
                            </p>
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
                                {category.subcategories
                                  .slice(0, 3)
                                  .map((sub) => (
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
                            onClick={(e) => handleToggleFeatured(category, e)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors"
                          >
                            <Star size={12} className="fill-current" />
                            Featured
                          </button>
                        ) : (
                          <button
                            onClick={(e) => handleToggleFeatured(category, e)}
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
                            onClick={() => handleEdit(category)}
                            className={`p-2 rounded-lg ${
                              darkMode
                                ? "hover:bg-white/10"
                                : "hover:bg-gray-100"
                            } transition-colors`}
                            title="Edit"
                          >
                            <Edit2 size={16} className={textMuted} />
                          </button>
                          <button
                            onClick={() => setDeleteCategory(category)}
                            className={`p-2 rounded-lg ${
                              darkMode
                                ? "hover:bg-white/10"
                                : "hover:bg-gray-100"
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t ${
                  darkMode ? "border-white/10" : "border-gray-200"
                }`}
              >
                <p className={`text-sm ${textMuted}`}>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredCategories.length
                  )}{" "}
                  of {filteredCategories.length} results
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded ${
                      darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                    } transition-colors disabled:opacity-50`}
                  >
                    <ChevronLeft size={18} className={textMuted} />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 rounded flex items-center justify-center text-sm transition-colors ${
                          currentPage === pageNum
                            ? "bg-accent text-white"
                            : `${textSecondary} ${
                                darkMode
                                  ? "hover:bg-white/10"
                                  : "hover:bg-gray-100"
                              }`
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded ${
                      darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                    } transition-colors disabled:opacity-50`}
                  >
                    <ChevronRight size={18} className={textMuted} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modals */}
      <CategoryFormModal
        category={selectedCategory}
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setSelectedCategory(null);
        }}
        onSave={handleSave}
        mode={formMode}
      />

      <ConfirmDialog
        isOpen={!!deleteCategory}
        onClose={() => setDeleteCategory(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteCategory?.name}"? This will also remove all its subcategories.`}
        type="danger"
        confirmText="Delete"
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AdminLayout>
  );
}
