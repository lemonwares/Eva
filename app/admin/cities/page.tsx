"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import {
  Search,
  ChevronDown,
  Edit2,
  MapPin,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Building2,
} from "lucide-react";
import { useState } from "react";

const cities = [
  {
    id: 1,
    name: "Lagos",
    state: "Lagos State",
    country: "Nigeria",
    vendorCount: 1245,
    status: "Active",
    featured: true,
    createdAt: "Jan 10, 2024",
  },
  {
    id: 2,
    name: "Abuja",
    state: "FCT",
    country: "Nigeria",
    vendorCount: 892,
    status: "Active",
    featured: true,
    createdAt: "Jan 10, 2024",
  },
  {
    id: 3,
    name: "Port Harcourt",
    state: "Rivers State",
    country: "Nigeria",
    vendorCount: 567,
    status: "Active",
    featured: false,
    createdAt: "Jan 15, 2024",
  },
  {
    id: 4,
    name: "Ibadan",
    state: "Oyo State",
    country: "Nigeria",
    vendorCount: 423,
    status: "Active",
    featured: false,
    createdAt: "Jan 20, 2024",
  },
  {
    id: 5,
    name: "Kano",
    state: "Kano State",
    country: "Nigeria",
    vendorCount: 398,
    status: "Active",
    featured: false,
    createdAt: "Jan 25, 2024",
  },
  {
    id: 6,
    name: "Enugu",
    state: "Enugu State",
    country: "Nigeria",
    vendorCount: 234,
    status: "Inactive",
    featured: false,
    createdAt: "Feb 01, 2024",
  },
];

const statuses = ["All Status", "Active", "Inactive"];

export default function AdminCitiesPage() {
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
  const [editingCity, setEditingCity] = useState<(typeof cities)[0] | null>(
    null
  );
  const [showAddPanel, setShowAddPanel] = useState(false);

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
      title="Cities"
      actionButton={{
        label: "Add City",
        onClick: () => setShowAddPanel(true),
        icon: <Plus size={18} />,
      }}
    >
      <div className="flex gap-6">
        {/* Main Content */}
        <div
          className={`flex-1 ${editingCity || showAddPanel ? "lg:pr-0" : ""}`}
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
                placeholder="Search cities..."
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

          {/* Cities Table */}
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
                      City
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      State/Region
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Vendors
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Featured
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Status
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
                  {cities.map((city) => (
                    <tr
                      key={city.id}
                      className={`${
                        darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                      } transition-colors ${
                        editingCity?.id === city.id
                          ? darkMode
                            ? "bg-accent/10"
                            : "bg-accent/5"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg ${
                              darkMode ? "bg-white/5" : "bg-gray-100"
                            } flex items-center justify-center`}
                          >
                            <MapPin size={18} className="text-accent" />
                          </div>
                          <div>
                            <p className={`font-medium text-sm ${textPrimary}`}>
                              {city.name}
                            </p>
                            <p className={`text-xs ${textMuted}`}>
                              {city.country}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                        {city.state}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className={textMuted} />
                          <span
                            className={`text-sm font-medium ${textPrimary}`}
                          >
                            {city.vendorCount.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {city.featured ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500">
                            Featured
                          </span>
                        ) : (
                          <span className={`text-sm ${textMuted}`}>—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                            city.status
                          )}`}
                        >
                          {city.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setEditingCity(city);
                            setShowAddPanel(false);
                          }}
                          className="text-accent hover:underline text-sm font-medium"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t ${
                darkMode ? "border-white/5" : "border-gray-100"
              }`}
            >
              <p className={`text-sm ${textMuted}`}>
                Showing 1-{cities.length} of {cities.length} cities
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
                {[1, 2, 3].map((page) => (
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
        </div>

        {/* Edit/Add Panel */}
        {(editingCity || showAddPanel) && (
          <div
            className={`hidden lg:block w-96 shrink-0 ${cardBg} border ${cardBorder} rounded-xl h-fit sticky top-6`}
          >
            <div
              className={`flex items-center justify-between p-4 border-b ${
                darkMode ? "border-white/5" : "border-gray-100"
              }`}
            >
              <h3 className={`font-bold ${textPrimary}`}>
                {editingCity ? "Edit City" : "Add City"}
              </h3>
              <button
                onClick={() => {
                  setEditingCity(null);
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
              {/* City Name */}
              <div>
                <label
                  className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                >
                  City Name
                </label>
                <input
                  type="text"
                  defaultValue={editingCity?.name || ""}
                  placeholder="Enter city name"
                  className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                />
              </div>

              {/* State/Region */}
              <div>
                <label
                  className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                >
                  State/Region
                </label>
                <input
                  type="text"
                  defaultValue={editingCity?.state || ""}
                  placeholder="Enter state or region"
                  className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                />
              </div>

              {/* Country */}
              <div>
                <label
                  className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                >
                  Country
                </label>
                <input
                  type="text"
                  defaultValue={editingCity?.country || "Nigeria"}
                  placeholder="Enter country"
                  className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                />
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
                        editingCity?.status === "Active" || !editingCity
                      }
                      className="accent-accent"
                    />
                    <span className={`text-sm ${textSecondary}`}>Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      defaultChecked={editingCity?.status === "Inactive"}
                      className="accent-accent"
                    />
                    <span className={`text-sm ${textSecondary}`}>Inactive</span>
                  </label>
                </div>
              </div>

              {/* Featured */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={editingCity?.featured || false}
                    className="accent-accent w-4 h-4 rounded"
                  />
                  <span className={`text-sm ${textSecondary}`}>
                    Mark as Featured
                  </span>
                </label>
              </div>

              {/* Meta Info */}
              {editingCity && (
                <div
                  className={`pt-4 border-t ${
                    darkMode ? "border-white/5" : "border-gray-100"
                  }`}
                >
                  <p className={`text-xs ${textMuted}`}>
                    Created: {editingCity.createdAt}
                  </p>
                  <p className={`text-xs ${textMuted}`}>
                    Vendors: {editingCity.vendorCount.toLocaleString()}
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
              {editingCity && (
                <button className="flex items-center gap-2 text-red-500 hover:text-red-400 text-sm font-medium">
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
              <button
                className={`${
                  editingCity ? "" : "w-full"
                } px-6 py-2.5 rounded-lg bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors`}
              >
                {editingCity ? "Save Changes" : "Add City"}
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
