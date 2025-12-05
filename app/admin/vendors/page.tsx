"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { ToastContainer, useToast } from "@/components/admin/Toast";
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
  Star,
  MapPin,
  Mail,
  Phone,
  CheckCircle,
  Award,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface Provider {
  id: string;
  businessName: string;
  description: string | null;
  address: string | null;
  postcode: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  status: string;
  isVerified: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  averageRating: number | null;
  reviewCount: number;
  priceFrom: number | null;
  createdAt: string;
  serviceRadius: number | null;
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
  city: {
    id: string;
    name: string;
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
  active: number;
  pending: number;
  suspended: number;
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

  const { toasts, addToast, removeToast } = useToast();

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

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [actionType, setActionType] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editForm, setEditForm] = useState({
    businessName: "",
    description: "",
    address: "",
    postcode: "",
    phone: "",
    email: "",
    website: "",
    priceFrom: "",
    serviceRadius: "",
    categoryId: "",
    isVerified: false,
    isFeatured: false,
    isPublished: false,
  });

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

      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter !== "All")
        params.append("status", statusFilter.toLowerCase());
      if (categoryFilter !== "All") {
        const cat = categories.find((c) => c.name === categoryFilter);
        if (cat) params.append("categoryId", cat.id);
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
      addToast("Failed to fetch vendors", "error");
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    searchQuery,
    statusFilter,
    categoryFilter,
    categories,
    addToast,
  ]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchProviders();
    }, 300);
    return () => clearTimeout(debounce);
  }, [fetchProviders]);

  const handleView = (provider: Provider) => {
    setSelectedProvider(provider);
    setViewModalOpen(true);
  };

  const handleEdit = (provider: Provider) => {
    setSelectedProvider(provider);
    setEditForm({
      businessName: provider.businessName || "",
      description: provider.description || "",
      address: provider.address || "",
      postcode: provider.postcode || "",
      phone: provider.phone || "",
      email: provider.email || "",
      website: provider.website || "",
      priceFrom: provider.priceFrom?.toString() || "",
      serviceRadius: provider.serviceRadius?.toString() || "",
      categoryId: provider.category?.id || "",
      isVerified: provider.isVerified,
      isFeatured: provider.isFeatured,
      isPublished: provider.isPublished,
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedProvider) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `/api/admin/providers/${selectedProvider.id}/moderate`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessName: editForm.businessName,
            description: editForm.description,
            address: editForm.address,
            postcode: editForm.postcode,
            phone: editForm.phone,
            email: editForm.email,
            website: editForm.website,
            priceFrom: editForm.priceFrom
              ? parseFloat(editForm.priceFrom)
              : null,
            serviceRadius: editForm.serviceRadius
              ? parseInt(editForm.serviceRadius)
              : null,
            categoryId: editForm.categoryId || null,
            isVerified: editForm.isVerified,
            isFeatured: editForm.isFeatured,
            isPublished: editForm.isPublished,
          }),
        }
      );

      if (res.ok) {
        addToast("Vendor updated successfully", "success");
        setEditModalOpen(false);
        fetchProviders();
      } else {
        const data = await res.json();
        addToast(data.message || "Failed to update vendor", "error");
      }
    } catch (err) {
      addToast("Failed to update vendor", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (provider: Provider) => {
    setSelectedProvider(provider);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProvider) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `/api/admin/providers/${selectedProvider.id}/moderate`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        addToast("Vendor deleted successfully", "success");
        setDeleteDialogOpen(false);
        fetchProviders();
      } else {
        const data = await res.json();
        addToast(data.message || "Failed to delete vendor", "error");
      }
    } catch (err) {
      addToast("Failed to delete vendor", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAction = (provider: Provider, action: string) => {
    setSelectedProvider(provider);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedProvider || !actionType) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `/api/admin/providers/${selectedProvider.id}/moderate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: actionType }),
        }
      );

      if (res.ok) {
        addToast(`Vendor ${actionType.toLowerCase()} successfully`, "success");
        setActionDialogOpen(false);
        fetchProviders();
      } else {
        const data = await res.json();
        addToast(
          data.message || `Failed to ${actionType.toLowerCase()} vendor`,
          "error"
        );
      }
    } catch (err) {
      addToast(`Failed to ${actionType.toLowerCase()} vendor`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
    return colors[name.charCodeAt(0) % colors.length];
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

  const handlePageChange = (page: number) => setCurrentPage(page);

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;
    const pages: number[] = [];
    const { totalPages } = pagination;
    pages.push(1);
    if (currentPage > 3) pages.push(-1);
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push(-2);
    if (totalPages > 1 && !pages.includes(totalPages)) pages.push(totalPages);

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
        onClick: () => addToast("Add vendor feature coming soon", "info"),
      }}
    >
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <p className={`${textSecondary} mb-6`}>
        View, edit, and manage all vendor accounts on the platform.
        {statusCounts && (
          <span className={`ml-2 ${textMuted}`}>
            ({statusCounts.active} active, {statusCounts.pending} pending,{" "}
            {statusCounts.suspended} suspended)
          </span>
        )}
      </p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
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

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <button
              onClick={() => {
                setShowStatusDropdown(!showStatusDropdown);
                setShowCategoryDropdown(false);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm font-medium transition-colors ${
                darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
              }`}
            >
              <Filter size={16} />
              <span className="hidden sm:inline">Status:</span> {statusFilter}
              <ChevronDown size={16} />
            </button>
            {showStatusDropdown && (
              <div
                className={`absolute top-full left-0 mt-2 w-40 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-20 py-1`}
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

          <div className="relative">
            <button
              onClick={() => {
                setShowCategoryDropdown(!showCategoryDropdown);
                setShowStatusDropdown(false);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm font-medium transition-colors ${
                darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
              }`}
            >
              <Store size={16} />
              <span className="hidden sm:inline">Category:</span>{" "}
              {categoryFilter === "All"
                ? "All"
                : categoryFilter.substring(0, 10) +
                  (categoryFilter.length > 10 ? "..." : "")}
              <ChevronDown size={16} />
            </button>
            {showCategoryDropdown && (
              <div
                className={`absolute top-full right-0 sm:left-0 mt-2 w-48 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-20 py-1 max-h-64 overflow-y-auto`}
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
                  All Categories
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
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
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
                            <div className="flex items-center gap-2 mt-0.5">
                              {provider.isVerified && (
                                <span className="text-xs text-blue-500 flex items-center gap-1">
                                  <CheckCircle size={12} /> Verified
                                </span>
                              )}
                              {provider.isFeatured && (
                                <span className="text-xs text-amber-500 flex items-center gap-1">
                                  <Award size={12} /> Featured
                                </span>
                              )}
                            </div>
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
                            <Star
                              size={14}
                              className="text-yellow-500 fill-yellow-500"
                            />
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
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleView(provider)}
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
                            onClick={() => handleEdit(provider)}
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
                            onClick={() => handleDelete(provider)}
                            className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
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

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-200 dark:divide-white/10">
              {providers.map((provider) => (
                <div key={provider.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full bg-linear-to-br ${getAvatarColors(
                          provider.businessName
                        )} flex items-center justify-center text-white font-semibold`}
                      >
                        {getInitials(provider.businessName)}
                      </div>
                      <div>
                        <p className={`font-medium ${textPrimary}`}>
                          {provider.businessName}
                        </p>
                        <p className={`text-sm ${textMuted}`}>
                          {provider.category?.name || "N/A"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                        provider.status
                      )}`}
                    >
                      {provider.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div className={textSecondary}>
                      <span className={textMuted}>Owner:</span>{" "}
                      {provider.owner.name || "N/A"}
                    </div>
                    <div className={textSecondary}>
                      <span className={textMuted}>Joined:</span>{" "}
                      {formatDate(provider.createdAt)}
                    </div>
                    <div className={textSecondary}>
                      <span className={textMuted}>Rating:</span>{" "}
                      {provider.averageRating?.toFixed(1) || "N/A"}
                    </div>
                    <div className={textSecondary}>
                      <span className={textMuted}>Reviews:</span>{" "}
                      {provider._count.reviews}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-white/10">
                    <button
                      onClick={() => handleView(provider)}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg ${
                        darkMode
                          ? "bg-white/10 hover:bg-white/20"
                          : "bg-gray-100 hover:bg-gray-200"
                      } ${textPrimary} transition-colors`}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(provider)}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg ${
                        darkMode
                          ? "bg-white/10 hover:bg-white/20"
                          : "bg-gray-100 hover:bg-gray-200"
                      } ${textPrimary} transition-colors`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(provider)}
                      className="py-2 px-4 text-sm font-medium rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div
                className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t ${
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
                  <div className="hidden sm:flex items-center gap-1">
                    {renderPagination()}
                  </div>
                  <span className={`sm:hidden text-sm ${textMuted}`}>
                    {currentPage} / {pagination.totalPages}
                  </span>
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

      {/* View Vendor Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Vendor Details"
        size="xl"
      >
        {selectedProvider && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div
                className={`w-16 h-16 rounded-xl bg-linear-to-br ${getAvatarColors(
                  selectedProvider.businessName
                )} flex items-center justify-center text-white font-bold text-xl`}
              >
                {getInitials(selectedProvider.businessName)}
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-semibold ${textPrimary}`}>
                  {selectedProvider.businessName}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                      selectedProvider.status
                    )}`}
                  >
                    {selectedProvider.status}
                  </span>
                  {selectedProvider.isVerified && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">
                      Verified
                    </span>
                  )}
                  {selectedProvider.isFeatured && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div
                className={`p-4 rounded-xl ${
                  darkMode ? "bg-white/5" : "bg-gray-50"
                }`}
              >
                <p className={`text-2xl font-bold ${textPrimary}`}>
                  {selectedProvider._count.bookings}
                </p>
                <p className={`text-sm ${textMuted}`}>Bookings</p>
              </div>
              <div
                className={`p-4 rounded-xl ${
                  darkMode ? "bg-white/5" : "bg-gray-50"
                }`}
              >
                <p className={`text-2xl font-bold ${textPrimary}`}>
                  {selectedProvider._count.inquiries}
                </p>
                <p className={`text-sm ${textMuted}`}>Inquiries</p>
              </div>
              <div
                className={`p-4 rounded-xl ${
                  darkMode ? "bg-white/5" : "bg-gray-50"
                }`}
              >
                <p className={`text-2xl font-bold ${textPrimary}`}>
                  {selectedProvider._count.reviews}
                </p>
                <p className={`text-sm ${textMuted}`}>Reviews</p>
              </div>
              <div
                className={`p-4 rounded-xl ${
                  darkMode ? "bg-white/5" : "bg-gray-50"
                }`}
              >
                <p className={`text-2xl font-bold ${textPrimary}`}>
                  {selectedProvider.averageRating?.toFixed(1) || "N/A"}
                </p>
                <p className={`text-sm ${textMuted}`}>Rating</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className={`font-medium ${textPrimary}`}>
                  Contact Information
                </h4>
                <div className="space-y-2">
                  <p
                    className={`flex items-center gap-2 text-sm ${textSecondary}`}
                  >
                    <Mail size={16} className={textMuted} />
                    {selectedProvider.email || selectedProvider.owner.email}
                  </p>
                  {selectedProvider.phone && (
                    <p
                      className={`flex items-center gap-2 text-sm ${textSecondary}`}
                    >
                      <Phone size={16} className={textMuted} />
                      {selectedProvider.phone}
                    </p>
                  )}
                  {selectedProvider.address && (
                    <p
                      className={`flex items-center gap-2 text-sm ${textSecondary}`}
                    >
                      <MapPin size={16} className={textMuted} />
                      {selectedProvider.address}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <h4 className={`font-medium ${textPrimary}`}>
                  Business Details
                </h4>
                <div className="space-y-2">
                  <p className={`text-sm ${textSecondary}`}>
                    <span className={textMuted}>Category:</span>{" "}
                    {selectedProvider.category?.name || "N/A"}
                  </p>
                  <p className={`text-sm ${textSecondary}`}>
                    <span className={textMuted}>Joined:</span>{" "}
                    {formatDate(selectedProvider.createdAt)}
                  </p>
                  {selectedProvider.priceFrom && (
                    <p className={`text-sm ${textSecondary}`}>
                      <span className={textMuted}>Starting Price:</span> £
                      {selectedProvider.priceFrom}
                    </p>
                  )}
                  {selectedProvider.serviceRadius && (
                    <p className={`text-sm ${textSecondary}`}>
                      <span className={textMuted}>Service Radius:</span>{" "}
                      {selectedProvider.serviceRadius} miles
                    </p>
                  )}
                </div>
              </div>
            </div>

            {selectedProvider.description && (
              <div>
                <h4 className={`font-medium ${textPrimary} mb-2`}>
                  Description
                </h4>
                <p className={`text-sm ${textSecondary}`}>
                  {selectedProvider.description}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
              {!selectedProvider.isVerified && (
                <button
                  onClick={() => {
                    setViewModalOpen(false);
                    handleAction(selectedProvider, "APPROVE");
                  }}
                  className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
                >
                  Approve & Verify
                </button>
              )}
              {selectedProvider.status !== "SUSPENDED" && (
                <button
                  onClick={() => {
                    setViewModalOpen(false);
                    handleAction(selectedProvider, "SUSPEND");
                  }}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                >
                  Suspend
                </button>
              )}
              {selectedProvider.status === "SUSPENDED" && (
                <button
                  onClick={() => {
                    setViewModalOpen(false);
                    handleAction(selectedProvider, "ACTIVATE");
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
                >
                  Reactivate
                </button>
              )}
              {!selectedProvider.isFeatured ? (
                <button
                  onClick={() => {
                    setViewModalOpen(false);
                    handleAction(selectedProvider, "FEATURE");
                  }}
                  className="px-4 py-2 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors"
                >
                  Feature
                </button>
              ) : (
                <button
                  onClick={() => {
                    setViewModalOpen(false);
                    handleAction(selectedProvider, "UNFEATURE");
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    darkMode
                      ? "bg-white/10 hover:bg-white/20 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  Remove Feature
                </button>
              )}
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  handleEdit(selectedProvider);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  darkMode
                    ? "bg-white/10 hover:bg-white/20 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
              >
                Edit Details
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Vendor Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Vendor"
        size="xl"
      >
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium ${textPrimary} mb-1`}
              >
                Business Name
              </label>
              <input
                type="text"
                value={editForm.businessName}
                onChange={(e) =>
                  setEditForm({ ...editForm, businessName: e.target.value })
                }
                className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium ${textPrimary} mb-1`}
              >
                Email
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium ${textPrimary} mb-1`}
              >
                Phone
              </label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium ${textPrimary} mb-1`}
              >
                Website
              </label>
              <input
                type="url"
                value={editForm.website}
                onChange={(e) =>
                  setEditForm({ ...editForm, website: e.target.value })
                }
                className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-1`}>
              Address
            </label>
            <input
              type="text"
              value={editForm.address}
              onChange={(e) =>
                setEditForm({ ...editForm, address: e.target.value })
              }
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label
                className={`block text-sm font-medium ${textPrimary} mb-1`}
              >
                Postcode
              </label>
              <input
                type="text"
                value={editForm.postcode}
                onChange={(e) =>
                  setEditForm({ ...editForm, postcode: e.target.value })
                }
                className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium ${textPrimary} mb-1`}
              >
                Starting Price (£)
              </label>
              <input
                type="number"
                value={editForm.priceFrom}
                onChange={(e) =>
                  setEditForm({ ...editForm, priceFrom: e.target.value })
                }
                className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium ${textPrimary} mb-1`}
              >
                Service Radius (miles)
              </label>
              <input
                type="number"
                value={editForm.serviceRadius}
                onChange={(e) =>
                  setEditForm({ ...editForm, serviceRadius: e.target.value })
                }
                className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-1`}>
              Category
            </label>
            <select
              value={editForm.categoryId}
              onChange={(e) =>
                setEditForm({ ...editForm, categoryId: e.target.value })
              }
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-1`}>
              Description
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              rows={4}
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none`}
            />
          </div>

          <div className="flex flex-wrap gap-6 py-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editForm.isVerified}
                onChange={(e) =>
                  setEditForm({ ...editForm, isVerified: e.target.checked })
                }
                className="w-4 h-4 rounded accent-accent"
              />
              <span className={`text-sm ${textPrimary}`}>Verified</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editForm.isFeatured}
                onChange={(e) =>
                  setEditForm({ ...editForm, isFeatured: e.target.checked })
                }
                className="w-4 h-4 rounded accent-accent"
              />
              <span className={`text-sm ${textPrimary}`}>Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editForm.isPublished}
                onChange={(e) =>
                  setEditForm({ ...editForm, isPublished: e.target.checked })
                }
                className="w-4 h-4 rounded accent-accent"
              />
              <span className={`text-sm ${textPrimary}`}>Published</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
            <button
              onClick={() => setEditModalOpen(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                darkMode
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Vendor"
        message={`Are you sure you want to delete "${selectedProvider?.businessName}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        isLoading={isSubmitting}
      />
      <ConfirmDialog
        isOpen={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
        onConfirm={confirmAction}
        title={`${actionType} Vendor`}
        message={`Are you sure you want to ${actionType.toLowerCase()} "${
          selectedProvider?.businessName
        }"?`}
        confirmText={actionType}
        type={
          actionType === "SUSPEND" || actionType === "REJECT"
            ? "danger"
            : actionType === "APPROVE" || actionType === "ACTIVATE"
            ? "success"
            : "info"
        }
        isLoading={isSubmitting}
      />
    </AdminLayout>
  );
}
