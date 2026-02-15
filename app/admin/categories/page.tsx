"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Loader2 } from "lucide-react";
import { logger } from "@/lib/logger";
import AdminLayout from "@/components/admin/AdminLayout";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Toast, ToastType } from "@/components/admin/Toast";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import CategoryFormModal from "@/components/admin/categories/CategoryFormModal";
import CategoryDetailsModal from "@/components/admin/categories/CategoryDetailsModal";
import CategoriesTable from "@/components/admin/categories/CategoriesTable";
import SearchBar from "@/components/admin/categories/SearchBar";
import Pagination from "@/components/admin/categories/Pagination";

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  coverImage?: string;
  displayOrder?: number;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  seoIntro?: string;
  faqs?: Array<{ question: string; answer: string }>;
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
    null,
  );
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsCategory, setDetailsCategory] = useState<Category | null>(null);

  // Confirm Dialog State
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      logger.error("Error fetching categories:", error);
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
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormMode("edit");
    setFormModalOpen(true);
  };

  const handleView = (category: Category) => {
    setDetailsCategory(category);
    setDetailsModalOpen(true);
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
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const result = await response.json();
          setToast({
            message: "Category updated successfully",
            type: "success",
          });
          setFormModalOpen(false);
          setSelectedCategory(null);
          fetchCategories();
        } else {
          let errorMessage = "Failed to update category";
          try {
            const result = await response.json();
            errorMessage = result.message || errorMessage;
          } catch (e) {
            // If JSON parsing fails, use the status text
            errorMessage = `${response.status}: ${response.statusText}`;
          }
          setToast({
            message: errorMessage,
            type: "error",
          });
        }
      }
    } catch (error) {
      logger.error("Error saving category:", error);
      setToast({ message: "Failed to save category", type: "error" });
    }
  };

  const handleDelete = async () => {
    if (!deleteCategory) return;
    setIsDeleting(true);

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
      logger.error("Error deleting category:", error);
      setToast({ message: "Failed to delete category", type: "error" });
    } finally {
      setIsDeleting(false);
      setDeleteCategory(null);
    }
  };

  const handleToggleFeatured = async (
    category: Category,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    // Optimistic update
    const newStatus = !category.isFeatured;
    setCategories(
      categories.map((c) =>
        c.id === category.id ? { ...c, isFeatured: newStatus } : c,
      ),
    );

    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }

      // Parse response to ensure it was successful
      await response.json();
    } catch (error) {
      logger.error("Error toggling featured:", error);
      // Revert optimistic update
      setCategories(
        categories.map((c) =>
          c.id === category.id ? { ...c, isFeatured: !newStatus } : c,
        ),
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
        <SearchBar
          searchTerm={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
        />

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
          <p className={`text-lg font-medium ${textPrimary} mb-2`}>
            No categories found
          </p>
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
            <CategoriesTable
              categories={paginatedCategories}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={(category) => setDeleteCategory(category)}
              onToggleFeatured={handleToggleFeatured}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={filteredCategories.length}
                onPageChange={setCurrentPage}
              />
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

      <CategoryDetailsModal
        category={detailsCategory}
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setDetailsCategory(null);
        }}
      />

      <ConfirmDialog
        isOpen={!!deleteCategory}
        onClose={() => setDeleteCategory(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteCategory?.name}"? This will also remove all its subcategories.`}
        type="danger"
        confirmText="Delete"
        isLoading={isDeleting}
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
