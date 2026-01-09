"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Toast } from "@/components/admin/Toast";
import {
  Search,
  ChevronDown,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Tag,
  Hash,
  Loader2,
  Edit2,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface CultureTag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TagFormData {
  name: string;
  slug: string;
  description: string;
  icon: string;
  displayOrder: string;
  isActive: boolean;
}

const emptyFormData: TagFormData = {
  name: "",
  slug: "",
  description: "",
  icon: "",
  displayOrder: "0",
  isActive: true,
};

const iconOptions = [
  "🎉",
  "💒",
  "🎂",
  "🎊",
  "🌸",
  "✨",
  "🎵",
  "📸",
  "🌍",
  "👨‍👩‍👧‍👦",
];

export default function AdminTagsPage() {
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

  const [tags, setTags] = useState<CultureTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState<CultureTag | null>(null);
  const [formData, setFormData] = useState<TagFormData>(emptyFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });
  const [confirmDelete, setConfirmDelete] = useState<CultureTag | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const itemsPerPage = 12;

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetch(`/api/admin/tags?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTags(data);
      }
    } catch (err) {
      console.error("Error fetching tags:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // Filter by status
  const filteredTags = tags.filter((tag) => {
    if (statusFilter === null) return true;
    return tag.isActive === statusFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTags.length / itemsPerPage);
  const paginatedTags = filteredTags.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openAddModal = () => {
    setEditingTag(null);
    setFormData(emptyFormData);
    setShowModal(true);
  };

  const openEditModal = (tag: CultureTag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
      description: tag.description || "",
      icon: tag.icon || "",
      displayOrder: tag.displayOrder.toString(),
      isActive: tag.isActive,
    });
    setShowModal(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setToast({ show: true, message: "Tag name is required", type: "error" });
      return;
    }

    if (!formData.slug.trim()) {
      setToast({ show: true, message: "Tag slug is required", type: "error" });
      return;
    }

    setIsSaving(true);
    try {
      const payload: any = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        isActive: formData.isActive,
        displayOrder: parseInt(formData.displayOrder) || 0,
      };

      if (formData.description.trim())
        payload.description = formData.description.trim();
      if (formData.icon.trim()) payload.icon = formData.icon.trim();

      let res: Response;
      if (editingTag) {
        res = await fetch(`/api/admin/tags/${editingTag.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/tags", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setToast({
          show: true,
          message: `Tag ${editingTag ? "updated" : "created"} successfully`,
          type: "success",
        });
        setShowModal(false);
        fetchTags();
      } else {
        const err = await res.json();
        setToast({
          show: true,
          message: err.message || "Failed to save tag",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error saving tag:", err);
      setToast({ show: true, message: "Failed to save tag", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/tags/${confirmDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setToast({
          show: true,
          message: "Tag deleted successfully",
          type: "success",
        });
        fetchTags();
      } else {
        const err = await res.json();
        setToast({
          show: true,
          message: err.message || "Failed to delete tag",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error deleting tag:", err);
      setToast({ show: true, message: "Failed to delete tag", type: "error" });
    } finally {
      setIsDeleting(false);
      setConfirmDelete(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AdminLayout
      title="Culture & Tradition Tags"
      actionButton={{
        label: "Add Tag",
        onClick: openAddModal,
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
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textSecondary} text-sm min-w-[140px]`}
          >
            {statusFilter === null
              ? "All Status"
              : statusFilter
              ? "Active"
              : "Inactive"}
            <ChevronDown size={16} className="ml-auto" />
          </button>
          {showStatusDropdown && (
            <div
              className={`absolute top-full left-0 right-0 mt-1 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1`}
            >
              <button
                onClick={() => {
                  setStatusFilter(null);
                  setShowStatusDropdown(false);
                  setCurrentPage(1);
                }}
                className={`w-full text-left px-4 py-2 text-sm ${
                  statusFilter === null ? "text-accent" : textSecondary
                } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
              >
                All Status
              </button>
              <button
                onClick={() => {
                  setStatusFilter(true);
                  setShowStatusDropdown(false);
                  setCurrentPage(1);
                }}
                className={`w-full text-left px-4 py-2 text-sm ${
                  statusFilter === true ? "text-accent" : textSecondary
                } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
              >
                Active
              </button>
              <button
                onClick={() => {
                  setStatusFilter(false);
                  setShowStatusDropdown(false);
                  setCurrentPage(1);
                }}
                className={`w-full text-left px-4 py-2 text-sm ${
                  statusFilter === false ? "text-accent" : textSecondary
                } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
              >
                Inactive
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : filteredTags.length === 0 ? (
        <div
          className={`${cardBg} border ${cardBorder} rounded-xl p-12 text-center`}
        >
          <Tag className={`w-12 h-12 mx-auto mb-4 ${textMuted}`} />
          <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>
            No tags found
          </h3>
          <p className={textMuted}>
            {searchQuery || statusFilter !== null
              ? "No tags match your search criteria."
              : "No culture & tradition tags have been added yet."}
          </p>
          {!searchQuery && statusFilter === null && (
            <button
              onClick={openAddModal}
              className="mt-4 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            >
              Add First Tag
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Tags Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {paginatedTags.map((tag) => (
              <div
                key={tag.id}
                className={`${cardBg} border ${cardBorder} rounded-xl p-4 transition-all hover:shadow-lg`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                      darkMode ? "bg-white/5" : "bg-gray-100"
                    }`}
                  >
                    {tag.icon || <Tag size={18} className="text-accent" />}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      tag.isActive
                        ? "bg-green-500/10 text-green-500"
                        : "bg-gray-500/10 text-gray-500"
                    }`}
                  >
                    {tag.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <h4 className={`font-semibold ${textPrimary} mb-1`}>
                  {tag.name}
                </h4>
                <p className={`text-xs ${textMuted} mb-2`}>/{tag.slug}</p>

                {tag.description && (
                  <p className={`text-sm ${textSecondary} mb-3 line-clamp-2`}>
                    {tag.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className={`text-xs ${textMuted}`}>
                    Order: {tag.displayOrder}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(tag)}
                      className={`p-1.5 rounded-lg ${
                        darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                      } transition-colors`}
                      title="Edit"
                    >
                      <Edit2 size={14} className={textMuted} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(tag)}
                      className={`p-1.5 rounded-lg ${
                        darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                      } transition-colors text-red-500`}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className={`text-sm ${textMuted}`}>
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredTags.length)} of{" "}
                {filteredTags.length} tags
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
                {Array.from(
                  { length: Math.min(5, totalPages) },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded flex items-center justify-center text-sm transition-colors ${
                      currentPage === page
                        ? "bg-accent text-white"
                        : `${textSecondary} ${
                            darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                          }`
                    }`}
                  >
                    {page}
                  </button>
                ))}
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
        </>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTag ? "Edit Tag" : "Add Tag"}
      >
        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium ${textSecondary} mb-1.5`}
            >
              Tag Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                setFormData({
                  ...formData,
                  name,
                  slug: editingTag ? formData.slug : generateSlug(name),
                });
              }}
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
              placeholder="e.g., Traditional"
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${textSecondary} mb-1.5`}
            >
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
              placeholder="e.g., traditional"
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${textSecondary} mb-1.5`}
            >
              Icon (Emoji)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                    formData.icon === icon
                      ? "ring-2 ring-accent bg-accent/10"
                      : darkMode
                      ? "bg-white/5 hover:bg-white/10"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value })
              }
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
              placeholder="Or type custom emoji/icon"
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${textSecondary} mb-1.5`}
            >
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none`}
              placeholder="Brief description of this tag..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium ${textSecondary} mb-1.5`}
              >
                Display Order
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({ ...formData, displayOrder: e.target.value })
                }
                className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                placeholder="0"
              />
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
                />
                <span className={`text-sm ${textSecondary}`}>Active</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowModal(false)}
            className={`px-4 py-2.5 rounded-lg border ${inputBorder} ${textSecondary} hover:bg-gray-50 dark:hover:bg-white/5 transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            {editingTag ? "Update Tag" : "Add Tag"}
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Delete Tag"
        message={`Are you sure you want to delete "${confirmDelete?.name}"? This action cannot be undone.`}
        type="danger"
        confirmText="Delete"
        isLoading={isDeleting}
      />

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </AdminLayout>
  );
}
