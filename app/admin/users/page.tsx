"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  CheckCircle,
  Ban,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Phone,
  Mail,
  Calendar,
  Shield,
  Activity,
  Filter
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import { Toast, ToastType } from "@/components/admin/Toast";

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
                <UserIcon size={32} className={textSecondary} />
            )}
          </div>
          <div>
            <h3 className={`text-xl font-bold ${textPrimary}`}>{user.name}</h3>
            <p className={textSecondary}>{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                  user.role === "ADMINISTRATOR"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                    : user.role === "PROFESSIONAL"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : user.role === "CLIENT"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {user.role === "PROFESSIONAL"
                  ? "Professional"
                  : user.role.charAt(0) + user.role.slice(1).toLowerCase()}
              </span>
              <span
                className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                  user.status === "ACTIVE"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : user.status === "SUSPENDED"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                }`}
              >
                {user.status}
              </span>
            </div>
          </div>
        </div>

        {/* User Info Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border ${darkMode ? "bg-white/5 border-gray-700" : "bg-gray-50 border-gray-200"}`}
        >
          <div className="flex items-start gap-3">
             <Phone size={16} className={`mt-0.5 ${textMuted}`} />
             <div>
                <p className={`text-xs ${textMuted}`}>Phone</p>
                <p className={`font-medium ${textPrimary}`}>
                {user.phone || "Not provided"}
                </p>
             </div>
          </div>
          <div className="flex items-start gap-3">
             <Shield size={16} className={`mt-0.5 ${textMuted}`} />
             <div>
                <p className={`text-xs ${textMuted}`}>Email Verified</p>
                <p className={`font-medium ${textPrimary}`}>
                {user.emailVerified
                    ? new Date(user.emailVerified).toLocaleDateString()
                    : "Not verified"}
                </p>
             </div>
          </div>
          <div className="flex items-start gap-3">
             <Calendar size={16} className={`mt-0.5 ${textMuted}`} />
             <div>
                <p className={`text-xs ${textMuted}`}>Joined</p>
                <p className={`font-medium ${textPrimary}`}>
                {new Date(user.createdAt).toLocaleDateString()}
                </p>
             </div>
          </div>
          <div className="flex items-start gap-3">
             <Activity size={16} className={`mt-0.5 ${textMuted}`} />
             <div>
                <p className={`text-xs ${textMuted}`}>Last Updated</p>
                <p className={`font-medium ${textPrimary}`}>
                {new Date(user.updatedAt).toLocaleDateString()}
                </p>
             </div>
          </div>
        </div>

        {/* Activity Stats */}
        {user._count && (
          <div className="grid grid-cols-3 gap-4">
            <div
              className={`p-4 rounded-lg text-center border ${darkMode ? "bg-white/5 border-gray-700" : "bg-gray-50 border-gray-200"}`}
            >
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {user._count.bookings}
              </p>
              <p className={`text-sm ${textMuted}`}>Bookings</p>
            </div>
            <div
              className={`p-4 rounded-lg text-center border ${darkMode ? "bg-white/5 border-gray-700" : "bg-gray-50 border-gray-200"}`}
            >
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {user._count.reviews}
              </p>
              <p className={`text-sm ${textMuted}`}>Reviews</p>
            </div>
            <div
              className={`p-4 rounded-lg text-center border ${darkMode ? "bg-white/5 border-gray-700" : "bg-gray-50 border-gray-200"}`}
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
            className={`px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 ${textPrimary}`}
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
  const { darkMode, textPrimary, textSecondary, inputBg, inputBorder } = useAdminTheme();
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

  const inputClass = `w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`;
  const labelClass = `block text-sm font-medium ${textSecondary} mb-1.5`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User" size="md">
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
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
            <div className="relative">
                <select
                value={formData.role}
                onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                }
                className={`${inputClass} appearance-none`}
                >
                <option value="CLIENT">Client</option>
                <option value="PROFESSIONAL">Professional</option>
                <option value="ADMINISTRATOR">Administrator</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <div className="relative">
                <select
                value={formData.status}
                onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                }
                className={`${inputClass} appearance-none`}
                >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
                </select>
                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${textSecondary}`}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 font-medium"
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
  const { darkMode, textPrimary, textSecondary, inputBg, inputBorder } = useAdminTheme();
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

  const inputClass = `w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`;
  const labelClass = `block text-sm font-medium ${textSecondary} mb-1.5`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New User" size="md">
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div>
          <label className={labelClass}>Full Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClass}
            required
            placeholder="John Doe"
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
            placeholder="john@example.com"
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
           <div className="relative">
                <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={`${inputClass} appearance-none`}
                >
                    <option value="CLIENT">Client</option>
                    <option value="PROFESSIONAL">Professional</option>
                    <option value="ADMINISTRATOR">Administrator</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
           </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${textSecondary}`}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 font-medium"
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

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "ADMINISTRATOR":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      case "PROFESSIONAL":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "CLIENT":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "SUSPENDED":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      case "INACTIVE":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <AdminLayout
      title="Users"
      actionButton={{
        label: "Add User",
        onClick: () => setAddModalOpen(true),
        icon: <Plus size={18} />,
      }}
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
            
            <div className="flex gap-2">
                <div className="relative">
                    <select
                        value={roleFilter}
                        onChange={(e) => {
                        setRoleFilter(e.target.value);
                        setCurrentPage(1);
                        }}
                        className={`appearance-none px-4 py-2.5 pr-8 rounded-lg border ${inputBg} ${inputBorder} ${textSecondary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 min-w-[140px]`}
                    >
                        <option value="all">All Roles</option>
                        <option value="CLIENT">Client</option>
                        <option value="PROFESSIONAL">Professional</option>
                        <option value="ADMINISTRATOR">Administrator</option>
                    </select>
                     <ChevronRight size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 rotate-90 ${textMuted} pointer-events-none`} />
                </div>
                
                 <div className="relative">
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                        }}
                         className={`appearance-none px-4 py-2.5 pr-8 rounded-lg border ${inputBg} ${inputBorder} ${textSecondary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 min-w-[140px]`}
                    >
                        <option value="all">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                         <option value="SUSPENDED">Suspended</option>
                    </select>
                    <ChevronRight size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 rotate-90 ${textMuted} pointer-events-none`} />
                 </div>
            </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${cardBg} border ${cardBorder} rounded-xl p-4`}>
            <p className={`text-2xl font-bold ${textPrimary}`}>{totalUsers}</p>
            <p className={textMuted}>Total Users</p>
          </div>
          <div className={`${cardBg} border ${cardBorder} rounded-xl p-4`}>
            <p className={`text-2xl font-bold text-green-500`}>
              {users.filter((u) => u.status === "ACTIVE").length}
            </p>
            <p className={textMuted}>Active</p>
          </div>
          <div className={`${cardBg} border ${cardBorder} rounded-xl p-4`}>
            <p className={`text-2xl font-bold text-blue-500`}>
              {users.filter((u) => u.role === "PROFESSIONAL").length}
            </p>
            <p className={textMuted}>Vendors</p>
          </div>
          <div className={`${cardBg} border ${cardBorder} rounded-xl p-4`}>
            <p className={`text-2xl font-bold text-purple-500`}>
              {users.filter((u) => u.role === "ADMINISTRATOR").length}
            </p>
            <p className={textMuted}>Admins</p>
          </div>
        </div>

        {/* Users Table */}
        <div className={`${cardBg} border ${cardBorder} rounded-xl overflow-hidden`}>
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto"></div>
              <p className={`mt-4 ${textMuted}`}>Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <UserIcon className={`w-12 h-12 mx-auto mb-4 ${textMuted}`} />
              <p className={`text-lg font-medium ${textPrimary}`}>No users found</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className={darkMode ? "bg-white/5" : "bg-gray-50"}>
                    <tr>
                      <th
                        className={`px-6 py-4 text-left text-xs font-medium ${textMuted} uppercase tracking-wider`}
                      >
                        User
                      </th>
                      <th
                        className={`px-6 py-4 text-left text-xs font-medium ${textMuted} uppercase tracking-wider`}
                      >
                        Role
                      </th>
                      <th
                        className={`px-6 py-4 text-left text-xs font-medium ${textMuted} uppercase tracking-wider`}
                      >
                        Status
                      </th>
                      <th
                        className={`px-6 py-4 text-left text-xs font-medium ${textMuted} uppercase tracking-wider`}
                      >
                        Activity
                      </th>
                      <th
                        className={`px-6 py-4 text-left text-xs font-medium ${textMuted} uppercase tracking-wider`}
                      >
                        Joined
                      </th>
                      <th
                        className={`px-6 py-4 text-right text-xs font-medium ${textMuted} uppercase tracking-wider`}
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
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className={
                          darkMode ? "hover:bg-white/5" : "hover:bg-gray-50 bg-white"
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`w-10 h-10 rounded-full ${
                                darkMode ? "bg-white/10" : "bg-gray-100"
                              } flex items-center justify-center overflow-hidden`}
                            >
                              {user.image ? (
                                <img
                                  src={user.image}
                                  alt={user.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <UserIcon size={18} className={textSecondary} />
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
                            className={`px-2 py-1 text-xs rounded-full font-medium ${getRoleBadgeClass(
                              user.role
                            )}`}
                          >
                             {user.role === "PROFESSIONAL"
                                ? "Professional"
                                : user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadgeClass(
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
                                  ? "hover:bg-white/10"
                                  : "hover:bg-gray-100"
                              } transition-colors`}
                              title="View Details"
                            >
                               <Eye size={16} className={textMuted} />
                            </button>
                            <button
                              onClick={() => handleEdit(user)}
                              className={`p-2 rounded-lg ${
                                darkMode
                                  ? "hover:bg-white/10"
                                  : "hover:bg-gray-100"
                              } transition-colors`}
                              title="Edit User"
                            >
                               <Edit2 size={16} className="text-blue-500" />
                            </button>
                            {user.status === "SUSPENDED" ? (
                              <button
                                onClick={() => handleActivate(user)}
                                className={`p-2 rounded-lg ${
                                  darkMode
                                    ? "hover:bg-white/10"
                                    : "hover:bg-gray-100"
                                } transition-colors`}
                                title="Activate User"
                              >
                                <CheckCircle size={16} className="text-green-500" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSuspend(user)}
                                className={`p-2 rounded-lg ${
                                  darkMode
                                    ? "hover:bg-white/10"
                                    : "hover:bg-gray-100"
                                } transition-colors`}
                                title="Suspend User"
                              >
                                <Ban size={16} className="text-amber-500" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(user)}
                              className={`p-2 rounded-lg ${
                                darkMode
                                  ? "hover:bg-white/10"
                                  : "hover:bg-gray-100"
                              } transition-colors`}
                              title="Delete User"
                            >
                               <Trash2 size={16} className="text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div
              className={`px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t ${
                darkMode ? "border-white/10" : "border-gray-200"
              }`}
            >
              <p className={`text-sm ${textMuted}`}>
                Showing page {currentPage} of {totalPages} ({totalUsers} users)
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded ${
                    darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                  } transition-colors disabled:opacity-50`}
                >
                  <ChevronLeft size={18} className={textMuted} />
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
                        className={`w-9 h-9 rounded flex items-center justify-center text-sm transition-colors ${
                          currentPage === pageNum
                            ? "bg-accent text-white"
                            : `${textSecondary} ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`
                        }`}
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
                  className={`p-2 rounded ${
                    darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                  } transition-colors disabled:opacity-50`}
                >
                   <ChevronRight size={18} className={textMuted} />
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
