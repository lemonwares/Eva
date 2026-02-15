"use client";

import {
  Eye,
  Pencil,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
  Loader2,
  StoreIcon,
  CheckCircle,
  Award,
} from "lucide-react";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";

interface Provider {
  id: string;
  businessName: string;
  description: string | null;
  address: string | null;
  postcode: string | null;
  phonePublic: string | null;
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
  serviceRadiusMiles: number | null;
  owner: {
    id: string;
    name: string | null;
    email: string;
  };
  categories?: string[];
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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface VendorTableProps {
  providers: Provider[];
  pagination: Pagination | null;
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onView: (provider: Provider) => void;
  onEdit: (provider: Provider) => void;
  onDelete: (provider: Provider) => void;
  categories?: Category[];
}

export default function VendorTable({
  providers,
  pagination,
  isLoading,
  currentPage,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  categories = [],
}: VendorTableProps) {
  const {
    darkMode,
    cardBg,
    cardBorder,
    textPrimary,
    textSecondary,
    textMuted,
  } = useAdminTheme();

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
      "from-purple-400 to-violet-500",
      "from-blue-400 to-indigo-500",
      "from-amber-400 to-orange-500",
      "from-teal-400 to-cyan-500",
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
    return new Date(dateString).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

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
        <span key={`ellipsis-${idx}`} className={textMuted}>
          ...
        </span>
      ) : (
        <button
          key={page}
          onClick={() => onPageChange(page)}
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
      ),
    );
  };

  return (
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
                            provider.businessName,
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
                      {/* Map first category ID to name from categories list if available */}
                      {(() => {
                        const cats = categories ?? [];
                        const catIds = provider.categories ?? [];
                        if (
                          Array.isArray(catIds) &&
                          catIds.length > 0 &&
                          Array.isArray(cats) &&
                          cats.length > 0
                        ) {
                          const match = cats.find(
                            (cat) => cat.id === catIds[0],
                          );
                          const rawName = match?.name || catIds[0] || "N/A";
                          return typeof rawName === "string" &&
                            rawName.length > 0
                            ? rawName.charAt(0).toUpperCase() +
                                rawName.slice(1).toLowerCase()
                            : rawName;
                        }
                        return "N/A";
                      })()}
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
                          provider.status,
                        )}`}
                      >
                        {provider.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onView(provider)}
                          className={`p-2 rounded-lg ${
                            darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                          } transition-colors`}
                          title="View"
                        >
                          <Eye size={16} className={textMuted} />
                        </button>
                        <button
                          onClick={() => onEdit(provider)}
                          className={`p-2 rounded-lg ${
                            darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                          } transition-colors`}
                          title="Edit"
                        >
                          <Pencil size={16} className={textMuted} />
                        </button>
                        <button
                          onClick={() => onDelete(provider)}
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
                        provider.businessName,
                      )} flex items-center justify-center text-white font-semibold`}
                    >
                      {getInitials(provider.businessName)}
                    </div>
                    <div>
                      <p className={`font-medium ${textPrimary}`}>
                        {provider.businessName}
                      </p>
                      <p className={`text-sm ${textMuted}`}>
                        {(() => {
                          const cats = categories ?? [];
                          const catIds = provider.categories ?? [];
                          if (
                            Array.isArray(catIds) &&
                            catIds.length > 0 &&
                            Array.isArray(cats) &&
                            cats.length > 0
                          ) {
                            const match = cats.find(
                              (cat) => cat.id === catIds[0],
                            );
                            const rawName = match?.name || catIds[0] || "N/A";
                            return typeof rawName === "string" &&
                              rawName.length > 0
                              ? rawName.charAt(0).toUpperCase() +
                                  rawName.slice(1).toLowerCase()
                              : rawName;
                          }
                          return "N/A";
                        })()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                      provider.status,
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
                    onClick={() => onView(provider)}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg ${
                      darkMode
                        ? "bg-white/10 hover:bg-white/20"
                        : "bg-gray-100 hover:bg-gray-200"
                    } ${textPrimary} transition-colors`}
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(provider)}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg ${
                      darkMode
                        ? "bg-white/10 hover:bg-white/20"
                        : "bg-gray-100 hover:bg-gray-200"
                    } ${textPrimary} transition-colors`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(provider)}
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
                    pagination.total,
                  )}
                </span>{" "}
                of <span className={textPrimary}>{pagination.total}</span>
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
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
                  onClick={() => onPageChange(currentPage + 1)}
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
  );
}
