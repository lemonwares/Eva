"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import { Plus, Search, ChevronDown, X } from "lucide-react";
import { useState } from "react";

const categories = [
  {
    id: "1",
    name: "Wedding Venues",
    slug: "wedding-venues",
    subcategories: 12,
    status: "Active",
    statusColor: "bg-green-500",
    lastUpdated: "2 days ago",
  },
  {
    id: "2",
    name: "Photographers",
    slug: "photographers",
    subcategories: 8,
    status: "Active",
    statusColor: "bg-green-500",
    lastUpdated: "5 days ago",
  },
  {
    id: "3",
    name: "Catering Services",
    slug: "catering-services",
    subcategories: 21,
    status: "Draft",
    statusColor: "bg-amber-500",
    lastUpdated: "1 hour ago",
  },
  {
    id: "4",
    name: "Florists",
    slug: "florists",
    subcategories: 5,
    status: "Archived",
    statusColor: "bg-gray-500",
    lastUpdated: "3 months ago",
  },
];

const statusFilters = ["All Status", "Active", "Draft", "Archived"];

export default function AdminCategoriesPage() {
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
  const [activeFilter, setActiveFilter] = useState("All Status");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [showEditPanel, setShowEditPanel] = useState(true);

  // Form state
  const [categoryName, setCategoryName] = useState(
    selectedCategory?.name || ""
  );
  const [categorySlug, setCategorySlug] = useState(
    selectedCategory?.slug || ""
  );
  const [parentCategory, setParentCategory] = useState("No Parent");
  const [description, setDescription] = useState("");
  const [categoryStatus, setCategoryStatus] = useState("Active");

  const handleSelectCategory = (category: (typeof categories)[0]) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setCategorySlug(category.slug);
    setShowEditPanel(true);
  };

  return (
    <AdminLayout title="All Categories" showSearch={false}>
      <p className={`${textSecondary} mb-6`}>
        Manage and organize content categories for EVA.
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Add Button */}
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-colors mb-6">
            <Plus size={18} />
            Add New Category
          </button>

          {/* Search */}
          <div className="relative mb-4">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`}
              size={18}
            />
            <input
              type="text"
              placeholder="Search categories..."
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  activeFilter !== "All Status"
                    ? "bg-accent/10 border-accent/30 text-accent"
                    : `${inputBg} ${inputBorder} ${textPrimary}`
                } text-sm font-medium`}
              >
                {activeFilter}
                <ChevronDown size={16} />
              </button>
              {showFilterDropdown && (
                <div
                  className={`absolute top-full left-0 mt-1 w-40 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1`}
                >
                  {statusFilters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setActiveFilter(filter);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        activeFilter === filter ? "text-accent" : textSecondary
                      } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {["Active", "Draft", "Archived"].map((filter) => (
              <button
                key={filter}
                onClick={() =>
                  setActiveFilter(
                    filter === activeFilter ? "All Status" : filter
                  )
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? "bg-accent/10 text-accent border border-accent/30"
                    : `${
                        darkMode
                          ? "bg-white/5 hover:bg-white/10"
                          : "bg-gray-100 hover:bg-gray-200"
                      } ${textSecondary}`
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Categories Table */}
          <div
            className={`${cardBg} border ${cardBorder} rounded-xl overflow-hidden`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Category Name
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Sub-Categories
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Status
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Last Updated
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
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
                        selectedCategory?.id === category.id
                          ? darkMode
                            ? "bg-accent/10"
                            : "bg-accent/5"
                          : darkMode
                          ? "hover:bg-white/5"
                          : "hover:bg-gray-50"
                      } transition-colors cursor-pointer`}
                      onClick={() => handleSelectCategory(category)}
                    >
                      <td className={`px-6 py-4 font-medium ${textPrimary}`}>
                        {category.name}
                      </td>
                      <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                        {category.subcategories}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white ${category.statusColor}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                          {category.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm ${textMuted}`}>
                        {category.lastUpdated}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-accent text-sm font-medium hover:underline">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Edit Panel */}
        {showEditPanel && selectedCategory && (
          <div
            className={`w-full lg:w-[340px] shrink-0 ${cardBg} border ${cardBorder} rounded-xl p-6`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className={`font-semibold ${textPrimary}`}>
                Editing "{selectedCategory.name}"
              </h3>
              <button
                onClick={() => setShowEditPanel(false)}
                className={`p-1.5 rounded-lg ${
                  darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                }`}
              >
                <X size={18} className={textMuted} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Category Name */}
              <div>
                <label
                  className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                >
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
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
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                />
              </div>

              {/* Parent Category */}
              <div>
                <label
                  className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                >
                  Parent Category
                </label>
                <select
                  value={parentCategory}
                  onChange={(e) => setParentCategory(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                >
                  <option>No Parent</option>
                  <option>Wedding Venues</option>
                  <option>Photographers</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label
                  className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                >
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a short description..."
                  className={`w-full h-24 px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none`}
                />
              </div>

              {/* Status */}
              <div>
                <label
                  className={`text-sm font-medium ${textPrimary} mb-2 block`}
                >
                  Status
                </label>
                <div className="flex gap-4">
                  {["Active", "Draft"].map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          categoryStatus === status
                            ? "border-accent"
                            : darkMode
                            ? "border-white/30"
                            : "border-gray-300"
                        }`}
                      >
                        {categoryStatus === status && (
                          <div className="w-2 h-2 rounded-full bg-accent" />
                        )}
                      </div>
                      <span className={`text-sm ${textSecondary}`}>
                        {status}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Meta Info */}
            <div
              className={`mt-8 pt-4 border-t ${
                darkMode ? "border-white/10" : "border-gray-200"
              }`}
            >
              <p className={`text-xs ${textMuted} mb-1`}>
                Created: Jan 12, 2023 by Admin
              </p>
              <p className={`text-xs ${textMuted}`}>
                Last Modified: 2 days ago by You
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button className="text-red-400 text-sm font-medium hover:underline">
                Delete Category
              </button>
              <button className="flex-1 px-4 py-2.5 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-colors text-sm">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
