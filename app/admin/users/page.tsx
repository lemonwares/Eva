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
  ShieldX,
} from "lucide-react";
import { useState } from "react";

const users = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    role: "Customer",
    status: "Active",
    dateJoined: "Jan 15, 2024",
    totalBookings: 12,
    avatar: null,
    initials: "SJ",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678",
    role: "Customer",
    status: "Active",
    dateJoined: "Feb 20, 2024",
    totalBookings: 8,
    avatar: null,
    initials: "MC",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    phone: "+1 (555) 345-6789",
    role: "Customer",
    status: "Suspended",
    dateJoined: "Mar 10, 2024",
    totalBookings: 3,
    avatar: null,
    initials: "ER",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "+1 (555) 456-7890",
    role: "Admin",
    status: "Active",
    dateJoined: "Jan 05, 2024",
    totalBookings: 0,
    avatar: null,
    initials: "DK",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    email: "lisa.thompson@email.com",
    phone: "+1 (555) 567-8901",
    role: "Moderator",
    status: "Active",
    dateJoined: "Apr 12, 2024",
    totalBookings: 0,
    avatar: null,
    initials: "LT",
  },
  {
    id: 6,
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "+1 (555) 678-9012",
    role: "Customer",
    status: "Inactive",
    dateJoined: "May 08, 2024",
    totalBookings: 1,
    avatar: null,
    initials: "JW",
  },
];

const statuses = ["All Status", "Active", "Inactive", "Suspended"];
const roles = ["All Roles", "Customer", "Admin", "Moderator"];

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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/10 text-green-500";
      case "Inactive":
        return "bg-gray-500/10 text-gray-500";
      case "Suspended":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return { bg: "bg-purple-500/10 text-purple-500", icon: ShieldCheck };
      case "Moderator":
        return { bg: "bg-blue-500/10 text-blue-500", icon: Shield };
      case "Customer":
        return { bg: "bg-gray-500/10 text-gray-500", icon: null };
      default:
        return { bg: "bg-gray-500/10 text-gray-500", icon: null };
    }
  };

  const getAvatarColors = (initials: string) => {
    const colors = [
      "from-pink-400 to-pink-600",
      "from-purple-400 to-purple-600",
      "from-blue-400 to-blue-600",
      "from-green-400 to-green-600",
      "from-yellow-400 to-yellow-600",
      "from-red-400 to-red-600",
    ];
    const index = initials.charCodeAt(0) % colors.length;
    return colors[index];
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
                            user.initials
                          )} flex items-center justify-center shrink-0`}
                        >
                          <span className="text-white font-semibold text-sm">
                            {user.initials}
                          </span>
                        </div>
                        <div>
                          <p className={`font-medium text-sm ${textPrimary}`}>
                            {user.name}
                          </p>
                          <p className={`text-xs ${textMuted}`}>
                            ID: #{user.id.toString().padStart(4, "0")}
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
                        <div className="flex items-center gap-2">
                          <Phone size={14} className={textMuted} />
                          <span className={`text-sm ${textMuted}`}>
                            {user.phone}
                          </span>
                        </div>
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
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm ${textMuted}`}>
                      {user.dateJoined}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${textPrimary}`}>
                        {user.totalBookings}
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
        <div
          className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t ${
            darkMode ? "border-white/5" : "border-gray-100"
          }`}
        >
          <p className={`text-sm ${textMuted}`}>
            Showing 1-{users.length} of {users.length} users
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
            <span className={textMuted}>...</span>
            <button
              className={`w-8 h-8 rounded-lg text-sm font-medium ${
                darkMode
                  ? "text-gray-400 hover:bg-white/10"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              10
            </button>
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
    </AdminLayout>
  );
}
