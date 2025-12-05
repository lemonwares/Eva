"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import {
  User,
  Shield,
  Save,
  Upload,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: string;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
];

export default function AdminSettingsPage() {
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

  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: "success" | "error") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
          const nameParts = (data.user.name || "").split(" ");
          setFirstName(nameParts[0] || "");
          setLastName(nameParts.slice(1).join(" ") || "");
          setEmail(data.user.email || "");
          setPhone(data.user.phone || "");
          setAvatar(data.user.avatar || null);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        addToast("Failed to load profile", "error");
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const handleAvatarUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      addToast("Please select an image file", "error");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      addToast("Image must be less than 2MB", "error");
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("type", "avatar");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData.message || "Upload failed");
      }

      // Update profile with new avatar URL
      const updateRes = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: uploadData.url }),
      });

      if (!updateRes.ok) {
        throw new Error("Failed to update avatar");
      }

      setAvatar(uploadData.url);
      addToast("Avatar updated successfully", "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload avatar";
      addToast(message, "error");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!firstName.trim()) {
      addToast("First name is required", "error");
      return;
    }

    setSavingProfile(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          phone: phone || null,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save profile");
      }

      addToast("Profile saved successfully", "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save profile";
      addToast(message, "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword) {
      addToast("Current password is required", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast("New passwords do not match", "error");
      return;
    }

    if (newPassword.length < 8) {
      addToast("Password must be at least 8 characters", "error");
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update password");
      }

      addToast("Password updated successfully", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update password";
      addToast(message, "error");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AdminLayout
      title="Settings"
      actionButton={
        activeTab === "profile"
          ? {
              label: savingProfile ? "Saving..." : "Save Changes",
              onClick: handleSaveProfile,
              icon: savingProfile ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              ),
            }
          : undefined
      }
    >
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm flex items-center gap-2 animate-in slide-in-from-right ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle size={16} />
            ) : (
              <XCircle size={16} />
            )}
            {toast.message}
          </div>
        ))}
      </div>

      {/* Hidden file input */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleAvatarUpload(file);
          e.target.value = "";
        }}
        className="hidden"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:w-56 shrink-0">
          <div
            className={`${cardBg} border ${cardBorder} rounded-xl p-2 lg:sticky lg:top-6`}
          >
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-accent text-white"
                      : darkMode
                        ? "text-gray-400 hover:bg-white/5 hover:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className={`${cardBg} border ${cardBorder} rounded-xl p-6`}>
              <h3 className={`text-lg font-bold ${textPrimary} mb-6`}>
                Profile Settings
              </h3>

              {loadingProfile ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className={`w-8 h-8 animate-spin ${textMuted}`} />
                </div>
              ) : (
                <>
                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      {avatar ? (
                        <div className="w-20 h-20 rounded-full overflow-hidden relative">
                          <Image
                            src={avatar}
                            alt="Profile"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-green-600 flex items-center justify-center">
                          <span className="text-white font-bold text-2xl">
                            {getInitials(`${firstName} ${lastName}`)}
                          </span>
                        </div>
                      )}
                      {uploadingAvatar && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                          <Loader2 className="w-6 h-6 animate-spin text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <button
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={uploadingAvatar}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploadingAvatar ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Upload size={16} />
                        )}
                        {uploadingAvatar ? "Uploading..." : "Upload Photo"}
                      </button>
                      <p className={`text-xs ${textMuted} mt-1`}>
                        JPG, PNG or GIF. Max size 2MB
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                      >
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter first name"
                        className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                      />
                    </div>
                    <div>
                      <label
                        className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter last name"
                        className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                      />
                    </div>
                    <div>
                      <label
                        className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        disabled
                        className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm opacity-60 cursor-not-allowed`}
                      />
                      <p className={`text-xs ${textMuted} mt-1`}>
                        Email cannot be changed
                      </p>
                    </div>
                    <div>
                      <label
                        className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number"
                        className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                      />
                    </div>
                  </div>

                  {/* Role Badge */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${textSecondary}`}>Role:</span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                        {profile?.role || "ADMINISTRATOR"}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className={`${cardBg} border ${cardBorder} rounded-xl p-6`}>
              <h3 className={`text-lg font-bold ${textPrimary} mb-6`}>
                Security Settings
              </h3>

              <div className="space-y-6">
                {/* Change Password */}
                <div>
                  <h4 className={`font-medium ${textPrimary} mb-4`}>
                    Change Password
                  </h4>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label
                        className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                      >
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Enter current password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className={`w-full px-4 py-2.5 pr-10 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className={`absolute right-3 top-1/2 -translate-y-1/2 ${textMuted}`}
                        >
                          {showCurrentPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label
                        className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password (min. 8 characters)"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className={`w-full px-4 py-2.5 pr-10 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className={`absolute right-3 top-1/2 -translate-y-1/2 ${textMuted}`}
                        >
                          {showNewPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {newPassword && newPassword.length < 8 && (
                        <p className="text-xs text-red-500 mt-1">
                          Password must be at least 8 characters
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                      >
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                      />
                      {confirmPassword &&
                        newPassword !== confirmPassword && (
                          <p className="text-xs text-red-500 mt-1">
                            Passwords do not match
                          </p>
                        )}
                    </div>
                    <button
                      onClick={handleUpdatePassword}
                      disabled={
                        updatingPassword ||
                        !currentPassword ||
                        !newPassword ||
                        !confirmPassword ||
                        newPassword.length < 8 ||
                        newPassword !== confirmPassword
                      }
                      className={`px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors ${
                        updatingPassword ||
                        !currentPassword ||
                        !newPassword ||
                        !confirmPassword ||
                        newPassword.length < 8 ||
                        newPassword !== confirmPassword
                          ? "bg-accent/50 cursor-not-allowed"
                          : "bg-accent hover:bg-accent/90"
                      } text-white`}
                    >
                      {updatingPassword && (
                        <Loader2 size={16} className="animate-spin" />
                      )}
                      {updatingPassword ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </div>

                {/* Account Info */}
                <div
                  className={`pt-6 border-t ${
                    darkMode ? "border-white/10" : "border-gray-200"
                  }`}
                >
                  <h4 className={`font-medium ${textPrimary} mb-4`}>
                    Account Information
                  </h4>
                  <div
                    className={`p-4 rounded-lg ${
                      darkMode ? "bg-white/5" : "bg-gray-50"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${textSecondary}`}>
                          Account ID
                        </span>
                        <span
                          className={`text-sm font-mono ${textPrimary}`}
                        >
                          {profile?.id?.slice(0, 12) || "—"}...
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${textSecondary}`}>
                          Email Verified
                        </span>
                        <span className="text-sm text-green-500 font-medium">
                          ✓ Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
