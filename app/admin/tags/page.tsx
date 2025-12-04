"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
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
} from "lucide-react";
import { useState } from "react";

const tags = [
  {
    id: 1,
    name: "Outdoor",
    slug: "outdoor",
    usageCount: 342,
    status: "Active",
    color: "#22c55e",
    createdAt: "Jan 10, 2024",
  },
  {
    id: 2,
    name: "Indoor",
    slug: "indoor",
    usageCount: 298,
    status: "Active",
    color: "#3b82f6",
    createdAt: "Jan 10, 2024",
  },
  {
    id: 3,
    name: "Luxury",
    slug: "luxury",
    usageCount: 187,
    status: "Active",
    color: "#f59e0b",
    createdAt: "Jan 12, 2024",
  },
  {
    id: 4,
    name: "Budget-Friendly",
    slug: "budget-friendly",
    usageCount: 423,
    status: "Active",
    color: "#10b981",
    createdAt: "Jan 15, 2024",
  },
  {
    id: 5,
    name: "Traditional",
    slug: "traditional",
    usageCount: 156,
    status: "Active",
    color: "#8b5cf6",
    createdAt: "Jan 18, 2024",
  },
  {
    id: 6,
    name: "Modern",
    slug: "modern",
    usageCount: 234,
    status: "Active",
    color: "#ec4899",
    createdAt: "Jan 20, 2024",
  },
  {
    id: 7,
    name: "Eco-Friendly",
    slug: "eco-friendly",
    usageCount: 89,
    status: "Inactive",
    color: "#14b8a6",
    createdAt: "Jan 25, 2024",
  },
  {
    id: 8,
    name: "Family-Friendly",
    slug: "family-friendly",
    usageCount: 312,
    status: "Active",
    color: "#f97316",
    createdAt: "Feb 01, 2024",
  },
];

const statuses = ["All Status", "Active", "Inactive"];
const colorOptions = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#ef4444",
  "#6366f1",
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingTag, setEditingTag] = useState<(typeof tags)[0] | null>(null);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#22c55e");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/10 text-green-500";
      case "Inactive":
        return "bg-gray-500/10 text-gray-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <AdminLayout
      title="Tags"
      actionButton={{
        label: "Add Tag",
        onClick: () => {
          setShowAddPanel(true);
          setEditingTag(null);
          setSelectedColor("#22c55e");
        },
        icon: <Plus size={18} />,
      }}
    >
      <div className="flex gap-6">
        {/* Main Content */}
        <div
          className={`flex-1 ${editingTag || showAddPanel ? "lg:pr-0" : ""}`}
        >
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`}
              />
              <input
                type="text"
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textSecondary} text-sm min-w-[140px]`}
              >
                {statusFilter}
                <ChevronDown size={16} className="ml-auto" />
              </button>
              {showStatusDropdown && (
                <div
                  className={`absolute top-full left-0 right-0 mt-1 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1`}
                >
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setShowStatusDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        statusFilter === status ? "text-accent" : textSecondary
                      } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tags Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {tags.map((tag) => (
              <div
                key={tag.id}
                onClick={() => {
                  setEditingTag(tag);
                  setShowAddPanel(false);
                  setSelectedColor(tag.color);
                }}
                className={`${cardBg} border ${cardBorder} rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${
                  editingTag?.id === tag.id ? "ring-2 ring-accent" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${tag.color}20` }}
                  >
                    <Tag size={18} style={{ color: tag.color }} />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                      tag.status
                    )}`}
                  >
                    {tag.status}
                  </span>
                </div>

                <h4 className={`font-semibold ${textPrimary} mb-1`}>
                  {tag.name}
                </h4>
                <p className={`text-xs ${textMuted} mb-3`}>/{tag.slug}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Hash size={14} className={textMuted} />
                    <span className={`text-sm ${textSecondary}`}>
                      {tag.usageCount} uses
                    </span>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: tag.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-between gap-4`}
          >
            <p className={`text-sm ${textMuted}`}>
              Showing 1-{tags.length} of {tags.length} tags
            </p>
            <div className="flex items-center gap-2">
              <button
                className={`p-2 rounded-lg ${
                  darkMode
                    ? "hover:bg-white/10 text-gray-400"
                    : "hover:bg-gray-100 text-gray-600"
                } disabled:opacity-50`}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={18} />
              </button>
              {[1, 2].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium ${
                    currentPage === page
                      ? "bg-accent text-white"
                      : darkMode
                      ? "text-gray-400 hover:bg-white/10"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                className={`p-2 rounded-lg ${
                  darkMode
                    ? "hover:bg-white/10 text-gray-400"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Edit/Add Panel */}
        {(editingTag || showAddPanel) && (
          <div
            className={`hidden lg:block w-80 shrink-0 ${cardBg} border ${cardBorder} rounded-xl h-fit sticky top-6`}
          >
            <div
              className={`flex items-center justify-between p-4 border-b ${
                darkMode ? "border-white/5" : "border-gray-100"
              }`}
            >
              <h3 className={`font-bold ${textPrimary}`}>
                {editingTag ? "Edit Tag" : "Add Tag"}
              </h3>
              <button
                onClick={() => {
                  setEditingTag(null);
                  setShowAddPanel(false);
                }}
                className={`p-1.5 rounded-lg ${
                  darkMode
                    ? "hover:bg-white/10 text-gray-400"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Tag Name */}
              <div>
                <label
                  className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                >
                  Tag Name
                </label>
                <input
                  type="text"
                  defaultValue={editingTag?.name || ""}
                  placeholder="Enter tag name"
                  className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                />
              </div>

              {/* Slug */}
              <div>
                <label
                  className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                >
                  Slug
                </label>
                <input
                  type="text"
                  defaultValue={editingTag?.slug || ""}
                  placeholder="tag-slug"
                  className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                />
              </div>

              {/* Color */}
              <div>
                <label
                  className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                >
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-lg transition-all ${
                        selectedColor === color
                          ? "ring-2 ring-offset-2 ring-accent"
                          : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label
                  className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                >
                  Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      defaultChecked={
                        editingTag?.status === "Active" || !editingTag
                      }
                      className="accent-accent"
                    />
                    <span className={`text-sm ${textSecondary}`}>Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      defaultChecked={editingTag?.status === "Inactive"}
                      className="accent-accent"
                    />
                    <span className={`text-sm ${textSecondary}`}>Inactive</span>
                  </label>
                </div>
              </div>

              {/* Meta Info */}
              {editingTag && (
                <div
                  className={`pt-4 border-t ${
                    darkMode ? "border-white/5" : "border-gray-100"
                  }`}
                >
                  <p className={`text-xs ${textMuted}`}>
                    Created: {editingTag.createdAt}
                  </p>
                  <p className={`text-xs ${textMuted}`}>
                    Usage: {editingTag.usageCount} vendors
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div
              className={`p-4 border-t ${
                darkMode ? "border-white/5" : "border-gray-100"
              } flex items-center justify-between`}
            >
              {editingTag && (
                <button className="flex items-center gap-2 text-red-500 hover:text-red-400 text-sm font-medium">
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
              <button
                className={`${
                  editingTag ? "" : "w-full"
                } px-6 py-2.5 rounded-lg bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors`}
              >
                {editingTag ? "Save Changes" : "Add Tag"}
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
