"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  Pencil,
  Eye,
  Trash2,
  MoreVertical,
  Store,
} from "lucide-react";
import { useState } from "react";

const vendors = [
  {
    id: "1",
    name: "Floral Dreams",
    avatar: "🌸",
    avatarBg: "from-green-400 to-emerald-500",
    category: "Decor",
    location: "San Francisco, CA",
    dateJoined: "2023-10-26",
    status: "Approved",
    statusColor: "bg-green-500",
  },
  {
    id: "2",
    name: "Savor Bites Catering",
    avatar: "🍽️",
    avatarBg: "from-orange-400 to-red-500",
    category: "Food",
    location: "New York, NY",
    dateJoined: "2023-10-24",
    status: "Pending",
    statusColor: "bg-amber-500",
  },
  {
    id: "3",
    name: "Rhythm Makers",
    avatar: "🎵",
    avatarBg: "from-purple-400 to-pink-500",
    category: "Music",
    location: "Chicago, IL",
    dateJoined: "2023-09-15",
    status: "Deactivated",
    statusColor: "bg-gray-500",
  },
  {
    id: "4",
    name: "Lens Magic Photography",
    avatar: "📷",
    avatarBg: "from-blue-400 to-indigo-500",
    category: "Photography",
    location: "Los Angeles, CA",
    dateJoined: "2023-11-01",
    status: "Approved",
    statusColor: "bg-green-500",
  },
  {
    id: "5",
    name: "Elegant Venues",
    avatar: "🏛️",
    avatarBg: "from-amber-400 to-orange-500",
    category: "Venues",
    location: "Miami, FL",
    dateJoined: "2023-08-20",
    status: "Approved",
    statusColor: "bg-green-500",
  },
];

const statusFilters = ["All", "Approved", "Pending", "Deactivated"];
const categoryFilters = [
  "All",
  "Photography",
  "Catering",
  "Venues",
  "Music",
  "Decor",
];

export default function AdminVendorsPage() {
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
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  return (
    <AdminLayout
      title="Vendor Management"
      actionButton={{
        label: "Add New Vendor",
        icon: <Plus size={18} />,
        onClick: () => {},
      }}
      searchPlaceholder="Search by name, category, or location..."
    >
      {/* Page Description */}
      <p className={`${textSecondary} mb-6`}>
        View, edit, and manage all vendor accounts on the platform.
      </p>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Status Filter */}
        <div className="relative">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm font-medium transition-colors ${
              darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
            }`}
          >
            <Filter size={16} />
            Status: {statusFilter}
            <ChevronDown size={16} />
          </button>
          {showStatusDropdown && (
            <div
              className={`absolute top-full left-0 mt-2 w-40 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1`}
            >
              {statusFilters.map((status) => (
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

        {/* Category Filter */}
        <div className="relative">
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm font-medium transition-colors ${
              darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
            }`}
          >
            <Store size={16} />
            Category: {categoryFilter}
            <ChevronDown size={16} />
          </button>
          {showCategoryDropdown && (
            <div
              className={`absolute top-full left-0 mt-2 w-44 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1`}
            >
              {categoryFilters.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setCategoryFilter(category);
                    setShowCategoryDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    categoryFilter === category ? "text-accent" : textSecondary
                  } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Vendors Table */}
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
                  <input type="checkbox" className="rounded" />
                </th>
                <th
                  className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                >
                  Vendor
                </th>
                <th
                  className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                >
                  Category
                </th>
                <th
                  className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                >
                  Location
                </th>
                <th
                  className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                >
                  Date Joined
                </th>
                <th
                  className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                >
                  Status
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
              {vendors.map((vendor) => (
                <tr
                  key={vendor.id}
                  className={`${
                    darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                  } transition-colors`}
                >
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full bg-linear-to-br ${vendor.avatarBg} flex items-center justify-center text-lg`}
                      >
                        {vendor.avatar}
                      </div>
                      <span className={`font-medium ${textPrimary}`}>
                        {vendor.name}
                      </span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                    {vendor.category}
                  </td>
                  <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                    {vendor.location}
                  </td>
                  <td className={`px-6 py-4 text-sm ${textMuted}`}>
                    {vendor.dateJoined}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium text-white ${vendor.statusColor}`}
                    >
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className={`p-2 rounded-lg ${
                          darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                        } transition-colors`}
                        title="Edit"
                      >
                        <Pencil size={16} className={textMuted} />
                      </button>
                      <button
                        className={`p-2 rounded-lg ${
                          darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                        } transition-colors`}
                        title="View"
                      >
                        <Eye size={16} className={textMuted} />
                      </button>
                      <button
                        className={`p-2 rounded-lg hover:bg-red-500/10 transition-colors`}
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-t ${
            darkMode ? "border-white/10" : "border-gray-200"
          }`}
        >
          <p className={`text-sm ${textMuted}`}>
            Showing <span className={textPrimary}>1-3</span> of{" "}
            <span className={textPrimary}>100</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              className={`px-3 py-1.5 rounded text-sm ${textSecondary} ${
                darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
              } transition-colors`}
            >
              Previous
            </button>
            <button className="px-3 py-1.5 rounded text-sm bg-accent text-white">
              1
            </button>
            <button
              className={`px-3 py-1.5 rounded text-sm ${textSecondary} ${
                darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
              } transition-colors`}
            >
              2
            </button>
            <button
              className={`px-3 py-1.5 rounded text-sm ${textSecondary} ${
                darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
              } transition-colors`}
            >
              3
            </button>
            <button
              className={`px-3 py-1.5 rounded text-sm ${textSecondary} ${
                darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
              } transition-colors`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
