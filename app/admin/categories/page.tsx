"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Toast, ToastType } from "@/components/admin/Toast";
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
  subcategories?: Subcategory[];
  _count?: {
    subcategories: number;
    providers: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

// View Category Modal
function ViewCategoryModal({
  category,
  isOpen,
  onClose,
}: {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { darkMode, textPrimary, textSecondary, textMuted } = useAdminTheme();

  if (!category) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Category Details" size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div
            className={`w-16 h-16 rounded-xl ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            } flex items-center justify-center`}
          >
            <span className="text-2xl">{category.icon || "📁"}</span>
          </div>
          <div className="flex-1">
            <h3 className={`text-xl font-bold ${textPrimary}`}>
              {category.name}
            </h3>
            <p className={`${textMuted} font-mono text-sm`}>/{category.slug}</p>
            <div className="flex items-center gap-2 mt-2">
              {category.isFeatured && (
                <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700">
                  Featured
                </span>
              )}
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {category.description && (
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <p className={`text-xs ${textMuted} mb-1`}>Description</p>
            <p className={textSecondary}>{category.description}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`p-4 rounded-lg text-center ${
              darkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <p className={`text-2xl font-bold ${textPrimary}`}>
              {category._count?.subcategories ||
                category.subcategories?.length ||
                0}
            </p>
            <p className={`text-sm ${textMuted}`}>Subcategories</p>
          </div>
          <div
            className={`p-4 rounded-lg text-center ${
              darkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <p className={`text-2xl font-bold ${textPrimary}`}>
              {category._count?.providers || 0}
            </p>
            <p className={`text-sm ${textMuted}`}>Providers</p>
          </div>
        </div>

        {/* Subcategories */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div>
            <p className={`text-sm font-medium ${textPrimary} mb-2`}>
              Subcategories
            </p>
            <div className="flex flex-wrap gap-2">
              {category.subcategories.map((sub) => (
                <span
                  key={sub.id}
                  className={`px-3 py-1 text-sm rounded-full ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  } ${textSecondary}`}
                >
                  {sub.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SEO Info */}
        {(category.metaTitle || category.metaDescription) && (
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <p className={`text-sm font-medium ${textPrimary} mb-2`}>SEO</p>
            {category.metaTitle && (
              <div className="mb-2">
                <p className={`text-xs ${textMuted}`}>Meta Title</p>
                <p className={textSecondary}>{category.metaTitle}</p>
              </div>
            )}
            {category.metaDescription && (
              <div>
                <p className={`text-xs ${textMuted}`}>Meta Description</p>
                <p className={textSecondary}>{category.metaDescription}</p>
              </div>
            )}
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-100 hover:bg-gray-200"
            } ${textPrimary}`}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
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
  const { darkMode, textPrimary, inputBg, inputBorder } = useAdminTheme();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    displayOrder: 0,
    isFeatured: false,
    metaTitle: "",
    metaDescription: "",
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
      });
    }
  }, [category, mode, isOpen]);

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug:
        mode === "add"
          ? name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")
          : formData.slug,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `w-full px-3 py-2 rounded-lg ${inputBg} ${inputBorder} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-rose-500`;
  const labelClass = `block text-sm font-medium ${textPrimary} mb-1`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Add New Category" : "Edit Category"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                })
              }
              className={inputClass}
              required
              placeholder="e.g., wedding-venues"
              pattern="^[a-z0-9-]+$"
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
            rows={3}
            placeholder="Brief description of this category..."
            maxLength={500}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Icon (Emoji)</label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value })
              }
              className={inputClass}
              placeholder="e.g., 💒 🎂 📸"
              maxLength={10}
            />
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isFeatured"
            checked={formData.isFeatured}
            onChange={(e) =>
              setFormData({ ...formData, isFeatured: e.target.checked })
            }
            className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
          />
          <label htmlFor="isFeatured" className={textPrimary}>
            Feature this category
          </label>
        </div>

        <div
          className={`p-4 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <p className={`text-sm font-medium ${textPrimary} mb-3`}>
            SEO Settings
          </p>
          <div className="space-y-3">
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
              <p
                className={`text-xs ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                } mt-1`}
              >
                {formData.metaTitle.length}/60 characters
              </p>
            </div>
            <div>
              <label className={labelClass}>Meta Description</label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData({ ...formData, metaDescription: e.target.value })
                }
                className={`${inputClass} resize-none`}
                rows={2}
                placeholder="Description for search engines"
                maxLength={160}
              />
              <p
                className={`text-xs ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                } mt-1`}
              >
                {formData.metaDescription.length}/160 characters
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-100 hover:bg-gray-200"
            } ${textPrimary}`}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : mode === "add"
              ? "Create Category"
              : "Save Changes"}
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
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  // Confirm Dialog State
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  // Toast State
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

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

  // Handle view
  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setViewModalOpen(true);
  };

  // Handle edit
  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormMode("edit");
    setFormModalOpen(true);
  };

  // Handle add
  const handleAdd = () => {
    setSelectedCategory(null);
    setFormMode("add");
    setFormModalOpen(true);
  };

  // Handle save
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

  // Handle delete
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

  // Toggle featured
  const handleToggleFeatured = async (category: Category) => {
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !category.isFeatured }),
      });

      if (response.ok) {
        setToast({
          message: `Category ${
            category.isFeatured ? "removed from" : "added to"
          } featured`,
          type: "success",
        });
        fetchCategories();
      } else {
        const result = await response.json();
        setToast({
          message: result.message || "Failed to update category",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error toggling featured:", error);
      setToast({ message: "Failed to update category", type: "error" });
    }
  };

  const inputClass = `px-3 py-2 rounded-lg ${inputBg} ${inputBorder} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-rose-500`;

  return (
    <AdminLayout title="Categories">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className={textSecondary}>
              Manage vendor categories and subcategories
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Add Category</span>
          </button>
        </div>

        {/* Filters */}
        <div className={`${cardBg} ${cardBorder} rounded-xl p-4`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textMuted}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 ${inputClass}`}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterFeatured(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterFeatured === null
                    ? "bg-rose-600 text-white"
                    : `${
                        darkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-100 hover:bg-gray-200"
                      } ${textPrimary}`
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterFeatured(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterFeatured === true
                    ? "bg-rose-600 text-white"
                    : `${
                        darkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-100 hover:bg-gray-200"
                      } ${textPrimary}`
                }`}
              >
                Featured
              </button>
              <button
                onClick={() => setFilterFeatured(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterFeatured === false
                    ? "bg-rose-600 text-white"
                    : `${
                        darkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-100 hover:bg-gray-200"
                      } ${textPrimary}`
                }`}
              >
                Regular
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${cardBg} ${cardBorder} rounded-xl p-4`}>
            <p className={`text-2xl font-bold ${textPrimary}`}>
              {categories.length}
            </p>
            <p className={textMuted}>Total Categories</p>
          </div>
          <div className={`${cardBg} ${cardBorder} rounded-xl p-4`}>
            <p className={`text-2xl font-bold text-amber-500`}>
              {categories.filter((c) => c.isFeatured).length}
            </p>
            <p className={textMuted}>Featured</p>
          </div>
          <div className={`${cardBg} ${cardBorder} rounded-xl p-4`}>
            <p className={`text-2xl font-bold text-blue-500`}>
              {categories.reduce(
                (acc, c) =>
                  acc +
                  (c._count?.subcategories || c.subcategories?.length || 0),
                0
              )}
            </p>
            <p className={textMuted}>Subcategories</p>
          </div>
          <div className={`${cardBg} ${cardBorder} rounded-xl p-4`}>
            <p className={`text-2xl font-bold text-green-500`}>
              {categories.reduce(
                (acc, c) => acc + (c._count?.providers || 0),
                0
              )}
            </p>
            <p className={textMuted}>Total Providers</p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className={`${cardBg} ${cardBorder} rounded-xl overflow-hidden`}>
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full mx-auto"></div>
              <p className={`mt-4 ${textMuted}`}>Loading categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-8 text-center">
              <svg
                className={`w-16 h-16 mx-auto ${textMuted}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className={`mt-4 ${textMuted}`}>No categories found</p>
              <button
                onClick={handleAdd}
                className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
              >
                Add First Category
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className={`p-4 rounded-xl border ${cardBorder} ${
                    darkMode
                      ? "bg-gray-800/50 hover:bg-gray-800"
                      : "bg-gray-50 hover:bg-gray-100"
                  } transition-colors`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-lg ${
                          darkMode ? "bg-gray-700" : "bg-gray-200"
                        } flex items-center justify-center`}
                      >
                        <span className="text-xl">{category.icon || "📁"}</span>
                      </div>
                      <div>
                        <h3 className={`font-semibold ${textPrimary}`}>
                          {category.name}
                        </h3>
                        <p className={`text-sm font-mono ${textMuted}`}>
                          /{category.slug}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleFeatured(category)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        category.isFeatured
                          ? "text-amber-500 bg-amber-100 dark:bg-amber-900/30"
                          : `${textMuted} ${
                              darkMode
                                ? "hover:bg-gray-700"
                                : "hover:bg-gray-200"
                            }`
                      }`}
                      title={
                        category.isFeatured
                          ? "Remove from featured"
                          : "Add to featured"
                      }
                    >
                      <svg
                        className="w-5 h-5"
                        fill={category.isFeatured ? "currentColor" : "none"}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </button>
                  </div>

                  {category.description && (
                    <p className={`text-sm ${textMuted} mb-3 line-clamp-2`}>
                      {category.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <svg
                        className={`w-4 h-4 ${textMuted}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      <span className={`text-sm ${textSecondary}`}>
                        {category._count?.subcategories ||
                          category.subcategories?.length ||
                          0}{" "}
                        subcategories
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        className={`w-4 h-4 ${textMuted}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <span className={`text-sm ${textSecondary}`}>
                        {category._count?.providers || 0} providers
                      </span>
                    </div>
                  </div>

                  {/* Subcategory Tags */}
                  {category.subcategories &&
                    category.subcategories.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {category.subcategories.slice(0, 3).map((sub) => (
                            <span
                              key={sub.id}
                              className={`px-2 py-0.5 text-xs rounded-full ${
                                darkMode ? "bg-gray-700" : "bg-gray-200"
                              } ${textMuted}`}
                            >
                              {sub.name}
                            </span>
                          ))}
                          {category.subcategories.length > 3 && (
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${
                                darkMode ? "bg-gray-700" : "bg-gray-200"
                              } ${textMuted}`}
                            >
                              +{category.subcategories.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleView(category)}
                      className={`flex-1 px-3 py-2 text-sm rounded-lg ${
                        darkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-100 hover:bg-gray-200"
                      } ${textPrimary}`}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteCategory(category)}
                      className="p-2 text-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
                      title="Delete"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modals */}
        <ViewCategoryModal
          category={selectedCategory}
          isOpen={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedCategory(null);
          }}
        />

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

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          isOpen={deleteCategory !== null}
          onClose={() => setDeleteCategory(null)}
          onConfirm={handleDelete}
          title="Delete Category"
          message={`Are you sure you want to delete "${deleteCategory?.name}"? This will also remove all subcategories and may affect vendors using this category.`}
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
      </div>
    </AdminLayout>
  );
}
