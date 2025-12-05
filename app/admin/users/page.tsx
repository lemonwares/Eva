"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import { Toast, ToastType } from "@/components/admin/Toast";
// import Toast, { ToastType } from "@/components/admin/Toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  image?: string;
  emailVerified?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    bookings: number;
    reviews: number;
    inquiries: number;
  };
}

// View User Modal
function ViewUserModal({
  user,
  isOpen,
  onClose,
}: {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { darkMode, cardBg, textPrimary, textSecondary, textMuted } =
    useAdminTheme();

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="lg">
      <div className="space-y-6">
        {/* User Header */}
        <div className="flex items-center gap-4">
          <div
            className={`w-20 h-20 rounded-full ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            } flex items-center justify-center overflow-hidden`}
          >
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className={`text-3xl font-bold ${textSecondary}`}>
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className={`text-xl font-bold ${textPrimary}`}>{user.name}</h3>
            <p className={textSecondary}>{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  user.role === "ADMINISTRATOR"
                    ? "bg-purple-100 text-purple-700"
                    : user.role === "PROFESSIONAL"
                    ? "bg-blue-100 text-blue-700"
                    : user.role === "CLIENT"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {user.role === "PROFESSIONAL"
                  ? "Professional/Vendor"
                  : user.role}
              </span>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  user.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : user.status === "SUSPENDED"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {user.status}
              </span>
            </div>
          </div>
        </div>

        {/* User Info Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <div>
            <p className={`text-xs ${textMuted}`}>Phone</p>
            <p className={`font-medium ${textPrimary}`}>
              {user.phone || "Not provided"}
            </p>
          </div>
          <div>
            <p className={`text-xs ${textMuted}`}>Email Verified</p>
            <p className={`font-medium ${textPrimary}`}>
              {user.emailVerified
                ? new Date(user.emailVerified).toLocaleDateString()
                : "Not verified"}
            </p>
          </div>
          <div>
            <p className={`text-xs ${textMuted}`}>Joined</p>
            <p className={`font-medium ${textPrimary}`}>
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className={`text-xs ${textMuted}`}>Last Updated</p>
            <p className={`font-medium ${textPrimary}`}>
              {new Date(user.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Activity Stats */}
        {user._count && (
          <div className="grid grid-cols-3 gap-4">
            <div
              className={`p-4 rounded-lg text-center ${
                darkMode ? "bg-gray-800" : "bg-gray-50"
              }`}
            >
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {user._count.bookings}
              </p>
              <p className={`text-sm ${textMuted}`}>Bookings</p>
            </div>
            <div
              className={`p-4 rounded-lg text-center ${
                darkMode ? "bg-gray-800" : "bg-gray-50"
              }`}
            >
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {user._count.reviews}
              </p>
              <p className={`text-sm ${textMuted}`}>Reviews</p>
            </div>
            <div
              className={`p-4 rounded-lg text-center ${
                darkMode ? "bg-gray-800" : "bg-gray-50"
              }`}
            >
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {user._count.inquiries}
              </p>
              <p className={`text-sm ${textMuted}`}>Inquiries</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-100 hover:bg-gray-200"
            } ${textPrimary}`}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Edit User Modal
function EditUserModal({
  user,
  isOpen,
  onClose,
  onSave,
}: {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<User>) => void;
}) {
  const { darkMode, textPrimary, inputBg, inputBorder } = useAdminTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "CLIENT",
    status: "ACTIVE",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "CLIENT",
        status: user.status || "ACTIVE",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const inputClass = `w-full px-3 py-2 rounded-lg ${inputBg} ${inputBorder} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-rose-500`;
  const labelClass = `block text-sm font-medium ${textPrimary} mb-1`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className={inputClass}
            placeholder="Optional"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Role</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className={inputClass}
            >
              <option value="CLIENT">Client</option>
              <option value="PROFESSIONAL">Professional/Vendor</option>
              <option value="ADMINISTRATOR">Administrator</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className={inputClass}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-100 hover:bg-gray-200"
            } ${textPrimary}`}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// Add User Modal
function AddUserModal({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<User>) => void;
}) {
  const { darkMode, textPrimary, inputBg, inputBorder } = useAdminTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "CLIENT",
    password: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "CLIENT",
        password: "",
      });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `w-full px-3 py-2 rounded-lg ${inputBg} ${inputBorder} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-rose-500`;
  const labelClass = `block text-sm font-medium ${textPrimary} mb-1`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New User" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Full Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Email Address *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Password *</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className={inputClass}
            required
            minLength={8}
            placeholder="Minimum 8 characters"
          />
        </div>

        <div>
          <label className={labelClass}>Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className={inputClass}
            placeholder="Optional"
          />
        </div>

        <div>
          <label className={labelClass}>Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className={inputClass}
          >
            <option value="CLIENT">Client</option>
            <option value="PROFESSIONAL">Professional/Vendor</option>
            <option value="ADMINISTRATOR">Administrator</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-100 hover:bg-gray-200"
            } ${textPrimary}`}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50"
            disabled={saving}
          >
            {saving ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function UsersPage() {
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

  // State
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Modals State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Confirm Dialogs State
  const [confirmAction, setConfirmAction] = useState<{
    type: "delete" | "suspend" | "activate";
    user: User;
  } | null>(null);

  // Toast State
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchQuery && { search: searchQuery }),
        ...(roleFilter !== "all" && { role: roleFilter }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalUsers(data.pagination?.total || 0);
      } else {
        setToast({
          message: data.error || "Failed to fetch users",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setToast({ message: "Failed to fetch users", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle view user
  const handleView = (user: User) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  // Handle edit user
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  // Handle save user
  const handleSaveUser = async (data: Partial<User>) => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setToast({ message: "User updated successfully", type: "success" });
        setEditModalOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        setToast({
          message: result.error || "Failed to update user",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setToast({ message: "Failed to update user", type: "error" });
    }
  };

  // Handle add user
  const handleAddUser = async (data: Partial<User>) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setToast({ message: "User created successfully", type: "success" });
        setAddModalOpen(false);
        fetchUsers();
      } else {
        setToast({
          message: result.error || "Failed to create user",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setToast({ message: "Failed to create user", type: "error" });
    }
  };

  // Handle suspend user
  const handleSuspend = (user: User) => {
    setConfirmAction({ type: "suspend", user });
  };

  // Handle activate user
  const handleActivate = (user: User) => {
    setConfirmAction({ type: "activate", user });
  };

  // Handle delete user
  const handleDelete = (user: User) => {
    setConfirmAction({ type: "delete", user });
  };

  // Confirm action
  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    const { type, user } = confirmAction;

    try {
      if (type === "delete") {
        const response = await fetch(`/api/admin/users/${user.id}`, {
          method: "DELETE",
        });
        const result = await response.json();

        if (result.success) {
          setToast({ message: "User deleted successfully", type: "success" });
          fetchUsers();
        } else {
          setToast({
            message: result.error || "Failed to delete user",
            type: "error",
          });
        }
      } else {
        const newStatus = type === "suspend" ? "SUSPENDED" : "ACTIVE";
        const response = await fetch(`/api/admin/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });

        const result = await response.json();

        if (result.success) {
          setToast({
            message: `User ${
              type === "suspend" ? "suspended" : "activated"
            } successfully`,
            type: "success",
          });
          fetchUsers();
        } else {
          setToast({
            message: result.error || `Failed to ${type} user`,
            type: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error performing action:", error);
      setToast({ message: "Failed to perform action", type: "error" });
    } finally {
      setConfirmAction(null);
    }
  };

  // Format role for display
  const formatRole = (role: string) => {
    switch (role) {
      case "ADMINISTRATOR":
        return "Administrator";
      case "PROFESSIONAL":
        return "Professional/Vendor";
      case "CLIENT":
        return "Client";
      default:
        return role;
    }
  };

  // Role badge colors
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "ADMINISTRATOR":
        return "bg-purple-100 text-purple-700";
      case "PROFESSIONAL":
        return "bg-blue-100 text-blue-700";
      case "CLIENT":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Status badge colors
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "SUSPENDED":
        return "bg-red-100 text-red-700";
      case "INACTIVE":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const inputClass = `px-3 py-2 rounded-lg ${inputBg} ${inputBorder} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-rose-500`;

  return (
    <AdminLayout title="Users">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className={textSecondary}>
              Manage registered users and their roles
            </p>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Add User</span>
          </button>
        </div>

        {/* Filters */}
        <div className={`${cardBg} ${cardBorder} rounded-xl p-4`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textMuted}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`w-full pl-10 ${inputClass}`}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className={inputClass}
              >
                <option value="all">All Roles</option>
                <option value="CLIENT">Client</option>
                <option value="PROFESSIONAL">Professional/Vendor</option>
                <option value="ADMINISTRATOR">Administrator</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className={inputClass}
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${cardBg} ${cardBorder} rounded-xl p-4`}>
            <p className={`text-2xl font-bold ${textPrimary}`}>{totalUsers}</p>
            <p className={textMuted}>Total Users</p>
          </div>
          <div className={`${cardBg} ${cardBorder} rounded-xl p-4`}>
            <p className={`text-2xl font-bold text-green-500`}>
              {users.filter((u) => u.status === "ACTIVE").length}
            </p>
            <p className={textMuted}>Active</p>
          </div>
          <div className={`${cardBg} ${cardBorder} rounded-xl p-4`}>
            <p className={`text-2xl font-bold text-blue-500`}>
              {users.filter((u) => u.role === "VENDOR").length}
            </p>
            <p className={textMuted}>Vendors</p>
          </div>
          <div className={`${cardBg} ${cardBorder} rounded-xl p-4`}>
            <p className={`text-2xl font-bold text-purple-500`}>
              {users.filter((u) => u.role === "ADMINISTRATOR").length}
            </p>
            <p className={textMuted}>Admins</p>
          </div>
        </div>

        {/* Users Table */}
        <div className={`${cardBg} ${cardBorder} rounded-xl overflow-hidden`}>
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full mx-auto"></div>
              <p className={`mt-4 ${textMuted}`}>Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <svg
                className={`w-16 h-16 mx-auto ${textMuted}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <p className={`mt-4 ${textMuted}`}>No users found</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className={darkMode ? "bg-gray-800" : "bg-gray-50"}>
                    <tr>
                      <th
                        className={`px-6 py-3 text-left text-xs font-medium ${textMuted} uppercase tracking-wider`}
                      >
                        User
                      </th>
                      <th
                        className={`px-6 py-3 text-left text-xs font-medium ${textMuted} uppercase tracking-wider`}
                      >
                        Role
                      </th>
                      <th
                        className={`px-6 py-3 text-left text-xs font-medium ${textMuted} uppercase tracking-wider`}
                      >
                        Status
                      </th>
                      <th
                        className={`px-6 py-3 text-left text-xs font-medium ${textMuted} uppercase tracking-wider`}
                      >
                        Activity
                      </th>
                      <th
                        className={`px-6 py-3 text-left text-xs font-medium ${textMuted} uppercase tracking-wider`}
                      >
                        Joined
                      </th>
                      <th
                        className={`px-6 py-3 text-right text-xs font-medium ${textMuted} uppercase tracking-wider`}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      darkMode ? "divide-gray-700" : "divide-gray-200"
                    }`}
                  >
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className={
                          darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`w-10 h-10 rounded-full ${
                                darkMode ? "bg-gray-700" : "bg-gray-200"
                              } flex items-center justify-center overflow-hidden`}
                            >
                              {user.image ? (
                                <img
                                  src={user.image}
                                  alt={user.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span
                                  className={`font-medium ${textSecondary}`}
                                >
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className={`font-medium ${textPrimary}`}>
                                {user.name}
                              </div>
                              <div className={`text-sm ${textMuted}`}>
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeClass(
                              user.role
                            )}`}
                          >
                            {formatRole(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(
                              user.status
                            )}`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${textSecondary}`}>
                            <span>{user._count?.bookings || 0} bookings</span>
                            <span className="mx-1">•</span>
                            <span>{user._count?.reviews || 0} reviews</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${textMuted}`}>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleView(user)}
                              className={`p-2 rounded-lg ${
                                darkMode
                                  ? "hover:bg-gray-700"
                                  : "hover:bg-gray-100"
                              }`}
                              title="View Details"
                            >
                              <svg
                                className={`w-5 h-5 ${textSecondary}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleEdit(user)}
                              className={`p-2 rounded-lg ${
                                darkMode
                                  ? "hover:bg-gray-700"
                                  : "hover:bg-gray-100"
                              }`}
                              title="Edit User"
                            >
                              <svg
                                className="w-5 h-5 text-blue-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            {user.status === "SUSPENDED" ? (
                              <button
                                onClick={() => handleActivate(user)}
                                className={`p-2 rounded-lg ${
                                  darkMode
                                    ? "hover:bg-gray-700"
                                    : "hover:bg-gray-100"
                                }`}
                                title="Activate User"
                              >
                                <svg
                                  className="w-5 h-5 text-green-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSuspend(user)}
                                className={`p-2 rounded-lg ${
                                  darkMode
                                    ? "hover:bg-gray-700"
                                    : "hover:bg-gray-100"
                                }`}
                                title="Suspend User"
                              >
                                <svg
                                  className="w-5 h-5 text-yellow-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                  />
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(user)}
                              className={`p-2 rounded-lg ${
                                darkMode
                                  ? "hover:bg-gray-700"
                                  : "hover:bg-gray-100"
                              }`}
                              title="Delete User"
                            >
                              <svg
                                className="w-5 h-5 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <div key={user.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-full ${
                            darkMode ? "bg-gray-700" : "bg-gray-200"
                          } flex items-center justify-center overflow-hidden`}
                        >
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span
                              className={`text-lg font-medium ${textSecondary}`}
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className={`font-medium ${textPrimary}`}>
                            {user.name}
                          </p>
                          <p className={`text-sm ${textMuted}`}>{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${getRoleBadgeClass(
                                user.role
                              )}`}
                            >
                              {formatRole(user.role)}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadgeClass(
                                user.status
                              )}`}
                            >
                              {user.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`mt-3 text-sm ${textMuted}`}>
                      <span>{user._count?.bookings || 0} bookings</span>
                      <span className="mx-1">•</span>
                      <span>{user._count?.reviews || 0} reviews</span>
                      <span className="mx-1">•</span>
                      <span>
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => handleView(user)}
                        className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg"
                      >
                        Edit
                      </button>
                      {user.status === "SUSPENDED" ? (
                        <button
                          onClick={() => handleActivate(user)}
                          className="flex-1 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg"
                        >
                          Activate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSuspend(user)}
                          className="flex-1 px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded-lg"
                        >
                          Suspend
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(user)}
                        className="p-2 text-red-500 rounded-lg"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div
              className={`px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <p className={`text-sm ${textMuted}`}>
                Showing page {currentPage} of {totalPages} ({totalUsers} users)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-lg ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  } ${textPrimary} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg ${
                          currentPage === pageNum
                            ? "bg-rose-600 text-white"
                            : darkMode
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gray-100 hover:bg-gray-200"
                        } ${currentPage !== pageNum ? textPrimary : ""}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-lg ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  } ${textPrimary} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <ViewUserModal
          user={selectedUser}
          isOpen={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedUser(null);
          }}
        />

        <EditUserModal
          user={selectedUser}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedUser(null);
          }}
          onSave={handleSaveUser}
        />

        <AddUserModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSave={handleAddUser}
        />

        {/* Confirm Dialogs */}
        <ConfirmDialog
          isOpen={confirmAction?.type === "delete"}
          onClose={() => setConfirmAction(null)}
          onConfirm={handleConfirmAction}
          title="Delete User"
          message={`Are you sure you want to delete "${confirmAction?.user.name}"? This action cannot be undone and will remove all their data.`}
          type="danger"
          confirmText="Delete"
        />

        <ConfirmDialog
          isOpen={confirmAction?.type === "suspend"}
          onClose={() => setConfirmAction(null)}
          onConfirm={handleConfirmAction}
          title="Suspend User"
          message={`Are you sure you want to suspend "${confirmAction?.user.name}"? They will not be able to access their account until reactivated.`}
          type="warning"
          confirmText="Suspend"
        />

        <ConfirmDialog
          isOpen={confirmAction?.type === "activate"}
          onClose={() => setConfirmAction(null)}
          onConfirm={handleConfirmAction}
          title="Activate User"
          message={`Are you sure you want to activate "${confirmAction?.user.name}"? They will regain access to their account.`}
          type="info"
          confirmText="Activate"
        />

        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
}
