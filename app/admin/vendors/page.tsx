"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import {
  Plus,
  Filter,
  ChevronDown,
  Pencil,
  Eye,
  Trash2,
  Store,
  ChevronLeft,
  ChevronRight,
  Loader2,
  StoreIcon,
  Search,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface Provider {
  id: string;
  businessName: string;
  description: string | null;
  address: string | null;
  status: string;
  isVerified: boolean;
  averageRating: number | null;
  createdAt: string;
  owner: {
    id: string;
    name: string | null;
    email: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  subcategory: {
    id: string;
    name: string;
    slug: string;
  } | null;
  _count: {
    reviews: number;
    inquiries: number;
    bookings: number;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface StatusCounts {
  ACTIVE: number;
  PENDING: number;
  SUSPENDED: number;
}

const statusFilters = ["All", "ACTIVE", "PENDING", "SUSPENDED"];

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

  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [statusCounts, setStatusCounts] = useState<StatusCounts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data || []);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchCategories();
  }, []);

  const fetchProviders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", "10");

      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (statusFilter !== "All") {
        params.append("status", statusFilter);
      }
      if (categoryFilter !== "All") {
        const cat = categories.find((c) => c.name === categoryFilter);
        if (cat) {
          params.append("categoryId", cat.id);
        }
      }

      const res = await fetch(`/api/admin/providers?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProviders(data.providers || []);
        setPagination(data.pagination || null);
        setStatusCounts(data.statusCounts || null);
      }
    } catch (err) {
      console.error("Error fetching providers:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter, categoryFilter, categories]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchProviders();
    }, 300);
    return () => clearTimeout(debounce);
  }, [fetchProviders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500";
      case "PENDING":
        return "bg-amber-500";
      case "SUSPENDED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getAvatarColors = (name: string) => {
    const colors = [
      "from-green-400 to-emerald-500",
      "from-orange-400 to-red-500",
      "from-purple-400 to-pink-500",
      "from-blue-400 to-indigo-500",
      "from-amber-400 to-orange-500",
      "from-pink-400 to-rose-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const pages = [];
    const { totalPages } = pagination;

    pages.push(1);

    if (currentPage > 3) {
      pages.push(-1);
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push(-2);
    }

    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages.map((page, idx) =>
      page < 0 ? (
        <span key={idx} className={textMuted}>
          ...
        </span>
      ) : (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-3 py-1.5 rounded text-sm ${
            currentPage === page
              ? "bg-accent text-white"
              : `${textSecondary} ${
                  darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                }`
          } transition-colors`}
        >
          {page}
        </button>
      )
    );
  };

  return (
    <AdminLayout
      title="Vendor Management"
      actionButton={{
        label: "Add New Vendor",
        icon: <Plus size={18} />,
        onClick: () => {},
      }}
    >
      {/* Page Description */}
      <p className={`${textSecondary} mb-6`}>
        View, edit, and manage all vendor accounts on the platform.
        {statusCounts && (
          <span className={`ml-2 ${textMuted}`}>
            ({statusCounts.ACTIVE} active, {statusCounts.PENDING} pending,{" "}
            {statusCounts.SUSPENDED} suspended)
          </span>
        )}
      </p>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={18}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`}
          />
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
          />
        </div>

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
                    setCurrentPage(1);
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
              className={`absolute top-full left-0 mt-2 w-48 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1 max-h-64 overflow-y-auto`}
            >
              <button
                onClick={() => {
                  setCategoryFilter("All");
                  setShowCategoryDropdown(false);
                  setCurrentPage(1);
                }}
                className={`w-full text-left px-4 py-2 text-sm ${
                  categoryFilter === "All" ? "text-accent" : textSecondary
                } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setCategoryFilter(category.name);
                    setShowCategoryDropdown(false);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    categoryFilter === category.name
                      ? "text-accent"
                      : textSecondary
                  } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                >
                  {category.name}
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
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : providers.length === 0 ? (
          <div className={`text-center py-16 ${textMuted}`}>
            <StoreIcon size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No vendors found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
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
                      Owner
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Date Joined
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Rating
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
                  {providers.map((provider) => (
                    <tr
                      key={provider.id}
                      className={`${
                        darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full bg-linear-to-br ${getAvatarColors(
                              provider.businessName
                            )} flex items-center justify-center text-white font-semibold text-sm`}
                          >
                            {getInitials(provider.businessName)}
                          </div>
                          <div>
                            <span className={`font-medium ${textPrimary}`}>
                              {provider.businessName}
                            </span>
                            {provider.isVerified && (
                              <span className="ml-2 text-xs text-blue-500">
                                ✓ Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                        {provider.category?.name ||
                          provider.subcategory?.name ||
                          "N/A"}
                      </td>
                      <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                        <div>
                          <p className={textPrimary}>
                            {provider.owner.name || "No Name"}
                          </p>
                          <p className={`text-xs ${textMuted}`}>
                            {provider.owner.email}
                          </p>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm ${textMuted}`}>
                        {formatDate(provider.createdAt)}
                      </td>
                      <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                        {provider.averageRating ? (
                          <span className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            {provider.averageRating.toFixed(1)}
                            <span className={`${textMuted} text-xs`}>
                              ({provider._count.reviews})
                            </span>
                          </span>
                        ) : (
                          <span className={textMuted}>No ratings</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                            provider.status
                          )}`}
                        >
                          {provider.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className={`p-2 rounded-lg ${
                              darkMode
                                ? "hover:bg-white/10"
                                : "hover:bg-gray-100"
                            } transition-colors`}
                            title="Edit"
                          >
                            <Pencil size={16} className={textMuted} />
                          </button>
                          <button
                            className={`p-2 rounded-lg ${
                              darkMode
                                ? "hover:bg-white/10"
                                : "hover:bg-gray-100"
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
            {pagination && pagination.totalPages > 1 && (
              <div
                className={`flex items-center justify-between px-6 py-4 border-t ${
                  darkMode ? "border-white/10" : "border-gray-200"
                }`}
              >
                <p className={`text-sm ${textMuted}`}>
                  Showing{" "}
                  <span className={textPrimary}>
                    {(pagination.page - 1) * pagination.limit + 1}-
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}
                  </span>{" "}
                  of <span className={textPrimary}>{pagination.total}</span>
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 rounded text-sm ${textSecondary} ${
                      darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                    } transition-colors disabled:opacity-50`}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {renderPagination()}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                    className={`px-3 py-1.5 rounded text-sm ${textSecondary} ${
                      darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                    } transition-colors disabled:opacity-50`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
