"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import {
  Search,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  Loader2,
  UserX,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface User {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  _count: {
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

const statuses = ["All Status", "Active", "Inactive"];
const roles = ["All Roles", "USER", "ADMIN", "VENDOR"];

export default function AdminUsersPage() {
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

  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", "10");

      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (roleFilter !== "All Roles") {
        params.append("role", roleFilter);
      }
      if (statusFilter !== "All Status") {
        params.append("isActive", statusFilter === "Active" ? "true" : "false");
      }

      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setPagination(data.pagination || null);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, roleFilter, statusFilter]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(debounce);
  }, [fetchUsers]);

  const getStatusBadge = (isActive: boolean) => {
    return isActive
      ? "bg-green-500/10 text-green-500"
      : "bg-gray-500/10 text-gray-500";
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return { bg: "bg-purple-500/10 text-purple-500", icon: ShieldCheck };
      case "VENDOR":
        return { bg: "bg-blue-500/10 text-blue-500", icon: Shield };
      case "USER":
        return { bg: "bg-gray-500/10 text-gray-500", icon: null };
      default:
        return { bg: "bg-gray-500/10 text-gray-500", icon: null };
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const getAvatarColors = (name: string | null) => {
    const colors = [
      "from-pink-400 to-pink-600",
      "from-purple-400 to-purple-600",
      "from-blue-400 to-blue-600",
      "from-green-400 to-green-600",
      "from-yellow-400 to-yellow-600",
      "from-red-400 to-red-600",
    ];
    const initials = getInitials(name);
    const index = initials.charCodeAt(0) % colors.length;
    return colors[index];
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

    // Show first page
    pages.push(1);

    // Show dots if needed
    if (currentPage > 3) {
      pages.push(-1); // -1 represents dots
    }

    // Show pages around current
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Show dots if needed
    if (currentPage < totalPages - 2) {
      pages.push(-2); // -2 represents dots
    }

    // Show last page
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
      )
    );
  };

  return (
    <AdminLayout
      title="Users"
      actionButton={{
        label: "Add User",
        onClick: () => {},
        icon: <UserPlus size={18} />,
      }}
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
            placeholder="Search users..."
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

        {/* Role Filter */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textSecondary} text-sm min-w-[140px]`}
          >
            {roleFilter}
            <ChevronDown size={16} className="ml-auto" />
          </button>
          {showRoleDropdown && (
            <div
              className={`absolute top-full left-0 right-0 mt-1 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1`}
            >
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setRoleFilter(role);
                    setShowRoleDropdown(false);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    roleFilter === role ? "text-accent" : textSecondary
                  } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                >
                  {role}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div
        className={`${cardBg} border ${cardBorder} rounded-xl overflow-hidden`}
      >
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : users.length === 0 ? (
          <div className={`text-center py-16 ${textMuted}`}>
            <UserX size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No users found</p>
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
                      User
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Contact
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Role
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Status
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Date Joined
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Bookings
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
                  {users.map((user) => {
                    const roleInfo = getRoleBadge(user.role);
                    const initials = getInitials(user.name);
                    return (
                      <tr
                        key={user.id}
                        className={`${
                          darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                        } transition-colors`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full bg-linear-to-br ${getAvatarColors(
                                user.name
                              )} flex items-center justify-center shrink-0`}
                            >
                              <span className="text-white font-semibold text-sm">
                                {initials}
                              </span>
                            </div>
                            <div>
                              <p
                                className={`font-medium text-sm ${textPrimary}`}
                              >
                                {user.name || "No Name"}
                              </p>
                              <p className={`text-xs ${textMuted}`}>
                                ID: #{user.id.slice(-6).toUpperCase()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail size={14} className={textMuted} />
                              <span className={`text-sm ${textSecondary}`}>
                                {user.email}
                              </span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-2">
                                <Phone size={14} className={textMuted} />
                                <span className={`text-sm ${textMuted}`}>
                                  {user.phone}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleInfo.bg}`}
                          >
                            {roleInfo.icon && <roleInfo.icon size={12} />}
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                              user.isActive
                            )}`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-sm ${textMuted}`}>
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-sm font-medium ${textPrimary}`}
                          >
                            {user._count.bookings}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="relative">
                            <button
                              onClick={() =>
                                setOpenActionMenu(
                                  openActionMenu === user.id ? null : user.id
                                )
                              }
                              className={`p-2 rounded-lg ${
                                darkMode
                                  ? "hover:bg-white/10 text-gray-400"
                                  : "hover:bg-gray-100 text-gray-600"
                              }`}
                            >
                              <MoreHorizontal size={18} />
                            </button>
                            {openActionMenu === user.id && (
                              <div
                                className={`absolute top-full right-0 mt-1 w-36 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1`}
                              >
                                <button
                                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm ${textSecondary} ${
                                    darkMode
                                      ? "hover:bg-white/5"
                                      : "hover:bg-gray-50"
                                  }`}
                                >
                                  <Eye size={14} />
                                  View
                                </button>
                                <button
                                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm ${textSecondary} ${
                                    darkMode
                                      ? "hover:bg-white/5"
                                      : "hover:bg-gray-50"
                                  }`}
                                >
                                  <Edit2 size={14} />
                                  Edit
                                </button>
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10">
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && (
              <div
                className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t ${
                  darkMode ? "border-white/5" : "border-gray-100"
                }`}
              >
                <p className={`text-sm ${textMuted}`}>
                  Showing {(pagination.page - 1) * pagination.limit + 1}-
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} users
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`p-2 rounded-lg ${
                      darkMode
                        ? "hover:bg-white/10 text-gray-400"
                        : "hover:bg-gray-100 text-gray-600"
                    } disabled:opacity-50`}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {renderPagination()}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`p-2 rounded-lg ${
                      darkMode
                        ? "hover:bg-white/10 text-gray-400"
                        : "hover:bg-gray-100 text-gray-600"
                    } disabled:opacity-50`}
                    disabled={currentPage === pagination.totalPages}
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
