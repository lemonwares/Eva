"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import { logger } from "@/lib/logger";
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
  Camera,
  Lock,
  Mail,
  Phone,
  BadgeCheck,
  KeyRound,
  Fingerprint,
  Info,
  ShieldCheck,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: string;
  emailVerified?: string | null;
  createdAt?: string;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

const tabs = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
    description: "Personal information",
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    description: "Password & safety",
  },
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [copiedId, setCopiedId] = useState(false);

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

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!newPassword) return { score: 0, label: "", color: "" };
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (newPassword.length >= 12) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
    if (score <= 2) return { score: 2, label: "Fair", color: "bg-orange-500" };
    if (score <= 3) return { score: 3, label: "Good", color: "bg-yellow-500" };
    if (score <= 4) return { score: 4, label: "Strong", color: "bg-green-500" };
    return { score: 5, label: "Excellent", color: "bg-emerald-500" };
  }, [newPassword]);

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
        logger.error("Error fetching profile:", err);
        addToast("Failed to load profile", "error");
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAvatarUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      addToast("Please select an image file", "error");
      return;
    }

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
      const message =
        err instanceof Error ? err.message : "Failed to upload avatar";
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
      const message =
        err instanceof Error ? err.message : "Failed to save profile";
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
      const message =
        err instanceof Error ? err.message : "Failed to update password";
      addToast(message, "error");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleCopyId = () => {
    if (profile?.id) {
      navigator.clipboard.writeText(profile.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
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

  const isPasswordFormValid =
    currentPassword &&
    newPassword &&
    confirmPassword &&
    newPassword.length >= 8 &&
    newPassword === confirmPassword;

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
            className={`px-4 py-3 rounded-xl shadow-lg border text-sm flex items-center gap-2.5 animate-in slide-in-from-right ${
              toast.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/80 dark:border-emerald-800 dark:text-emerald-200"
                : "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/80 dark:border-red-800 dark:text-red-200"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle
                size={16}
                className="text-emerald-600 dark:text-emerald-400 shrink-0"
              />
            ) : (
              <XCircle
                size={16}
                className="text-red-600 dark:text-red-400 shrink-0"
              />
            )}
            <span className="font-medium">{toast.message}</span>
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
        <div className="lg:w-60 shrink-0">
          <div
            className={`${cardBg} border ${cardBorder} rounded-2xl p-2 lg:sticky lg:top-6`}
          >
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left w-full transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-accent text-white shadow-sm"
                      : darkMode
                        ? "text-gray-400 hover:bg-white/5 hover:text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg ${
                      activeTab === tab.id
                        ? "bg-white/20"
                        : darkMode
                          ? "bg-white/5"
                          : "bg-gray-100"
                    }`}
                  >
                    <tab.icon size={16} />
                  </div>
                  <div className="hidden lg:block">
                    <div className="text-sm font-semibold">{tab.label}</div>
                    <div
                      className={`text-[11px] ${
                        activeTab === tab.id
                          ? "text-white/70"
                          : darkMode
                            ? "text-gray-500"
                            : "text-gray-400"
                      }`}
                    >
                      {tab.description}
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <>
              {loadingProfile ? (
                <div
                  className={`${cardBg} border ${cardBorder} rounded-2xl p-12 flex items-center justify-center`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className={`w-8 h-8 animate-spin ${textMuted}`} />
                    <span className={`text-sm ${textMuted}`}>
                      Loading profile...
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Avatar Card */}
                  <div
                    className={`${cardBg} border ${cardBorder} rounded-2xl overflow-hidden`}
                  >
                    {/* Banner gradient */}
                    <div className="h-24 bg-linear-to-r from-accent via-accent/80 to-emerald-500 relative" />

                    <div className="px-6 pb-6">
                      {/* Avatar overlapping the banner */}
                      <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
                        <div className="relative group">
                          {avatar ? (
                            <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                              <Image
                                src={avatar}
                                alt="Profile"
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-accent to-emerald-500 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg">
                              <span className="text-white font-bold text-3xl">
                                {getInitials(`${firstName} ${lastName}`)}
                              </span>
                            </div>
                          )}
                          {uploadingAvatar && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl border-4 border-transparent">
                              <Loader2 className="w-6 h-6 animate-spin text-white" />
                            </div>
                          )}
                          {/* Camera overlay on hover */}
                          <button
                            onClick={() => avatarInputRef.current?.click()}
                            disabled={uploadingAvatar}
                            className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 rounded-2xl border-4 border-transparent transition-all cursor-pointer opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                          >
                            <Camera
                              size={20}
                              className="text-white drop-shadow-md"
                            />
                          </button>
                        </div>

                        <div className="flex-1 sm:pb-1">
                          <h3 className={`text-xl font-bold ${textPrimary}`}>
                            {firstName} {lastName}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span
                              className={`text-sm ${textSecondary} flex items-center gap-1.5`}
                            >
                              <Mail size={13} />
                              {email}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent/10 text-accent">
                              <BadgeCheck size={12} />
                              {profile?.role || "ADMIN"}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => avatarInputRef.current?.click()}
                          disabled={uploadingAvatar}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                          {uploadingAvatar ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Upload size={15} />
                          )}
                          {uploadingAvatar ? "Uploading..." : "Change Photo"}
                        </button>
                      </div>
                      <p className={`text-xs ${textMuted} mt-3 ml-0 sm:ml-28`}>
                        Accepted formats: JPG, PNG, GIF. Max file size: 2MB
                      </p>
                    </div>
                  </div>

                  {/* Personal Information Card */}
                  <div
                    className={`${cardBg} border ${cardBorder} rounded-2xl p-6`}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className={`p-2 rounded-xl ${
                          darkMode ? "bg-blue-500/10" : "bg-blue-50"
                        }`}
                      >
                        <User
                          size={18}
                          className={
                            darkMode ? "text-blue-400" : "text-blue-600"
                          }
                        />
                      </div>
                      <div>
                        <h3 className={`text-base font-bold ${textPrimary}`}>
                          Personal Information
                        </h3>
                        <p className={`text-xs ${textMuted}`}>
                          Update your personal details
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label
                          className={`text-sm font-medium ${textPrimary} mb-2 block`}
                        >
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter first name"
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all`}
                          />
                          <User
                            size={15}
                            className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${textMuted}`}
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          className={`text-sm font-medium ${textPrimary} mb-2 block`}
                        >
                          Last Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter last name"
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all`}
                          />
                          <User
                            size={15}
                            className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${textMuted}`}
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          className={`text-sm font-medium ${textPrimary} mb-2 block`}
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={email}
                            disabled
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${inputBg} ${inputBorder} ${textPrimary} text-sm opacity-60 cursor-not-allowed`}
                          />
                          <Mail
                            size={15}
                            className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${textMuted}`}
                          />
                        </div>
                        <p
                          className={`text-[11px] ${textMuted} mt-1.5 flex items-center gap-1`}
                        >
                          <Lock size={10} />
                          Email address cannot be changed
                        </p>
                      </div>
                      <div>
                        <label
                          className={`text-sm font-medium ${textPrimary} mb-2 block`}
                        >
                          Phone Number
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter phone number"
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all`}
                          />
                          <Phone
                            size={15}
                            className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${textMuted}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <>
              {/* Change Password Card */}
              <div className={`${cardBg} border ${cardBorder} rounded-2xl p-6`}>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`p-2 rounded-xl ${
                      darkMode ? "bg-amber-500/10" : "bg-amber-50"
                    }`}
                  >
                    <KeyRound
                      size={18}
                      className={darkMode ? "text-amber-400" : "text-amber-600"}
                    />
                  </div>
                  <div>
                    <h3 className={`text-base font-bold ${textPrimary}`}>
                      Change Password
                    </h3>
                    <p className={`text-xs ${textMuted}`}>
                      Ensure your account stays secure
                    </p>
                  </div>
                </div>

                <div className="space-y-5 max-w-lg">
                  {/* Current Password */}
                  <div>
                    <label
                      className={`text-sm font-medium ${textPrimary} mb-2 block`}
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={`w-full pl-10 pr-12 py-2.5 rounded-xl border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all`}
                      />
                      <Lock
                        size={15}
                        className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${textMuted}`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${textMuted}`}
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label
                      className={`text-sm font-medium ${textPrimary} mb-2 block`}
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`w-full pl-10 pr-12 py-2.5 rounded-xl border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all`}
                      />
                      <KeyRound
                        size={15}
                        className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${textMuted}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${textMuted}`}
                      >
                        {showNewPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {newPassword && (
                      <div className="mt-3 space-y-2">
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-1.5 flex-1 rounded-full transition-all ${
                                level <= passwordStrength.score
                                  ? passwordStrength.color
                                  : darkMode
                                    ? "bg-white/10"
                                    : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] ${textMuted}`}>
                            Password strength
                          </span>
                          <span
                            className={`text-[11px] font-semibold ${
                              passwordStrength.score <= 1
                                ? "text-red-500"
                                : passwordStrength.score <= 2
                                  ? "text-orange-500"
                                  : passwordStrength.score <= 3
                                    ? "text-yellow-600"
                                    : "text-green-500"
                            }`}
                          >
                            {passwordStrength.label}
                          </span>
                        </div>
                        {newPassword.length < 8 && (
                          <p className="text-[11px] text-red-500 flex items-center gap-1">
                            <Info size={10} />
                            Must be at least 8 characters
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label
                      className={`text-sm font-medium ${textPrimary} mb-2 block`}
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full pl-10 pr-12 py-2.5 rounded-xl border ${
                          confirmPassword && newPassword !== confirmPassword
                            ? "border-red-400 focus:ring-red-300"
                            : confirmPassword && newPassword === confirmPassword
                              ? "border-green-400 focus:ring-green-300"
                              : `${inputBorder} focus:ring-accent/40`
                        } ${inputBg} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                      />
                      <KeyRound
                        size={15}
                        className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${textMuted}`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${textMuted}`}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1">
                        <XCircle size={10} />
                        Passwords do not match
                      </p>
                    )}
                    {confirmPassword &&
                      newPassword === confirmPassword &&
                      newPassword.length >= 8 && (
                        <p className="text-[11px] text-green-500 mt-1.5 flex items-center gap-1">
                          <CheckCircle size={10} />
                          Passwords match
                        </p>
                      )}
                  </div>

                  {/* Update Password Button */}
                  <button
                    onClick={handleUpdatePassword}
                    disabled={updatingPassword || !isPasswordFormValid}
                    className={`px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
                      !isPasswordFormValid || updatingPassword
                        ? "bg-accent/40 cursor-not-allowed"
                        : "bg-accent hover:bg-accent/90 shadow-sm hover:shadow-md"
                    } text-white`}
                  >
                    {updatingPassword && (
                      <Loader2 size={15} className="animate-spin" />
                    )}
                    {updatingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>

              {/* Account Information Card */}
              <div className={`${cardBg} border ${cardBorder} rounded-2xl p-6`}>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`p-2 rounded-xl ${
                      darkMode ? "bg-violet-500/10" : "bg-violet-50"
                    }`}
                  >
                    <Fingerprint
                      size={18}
                      className={
                        darkMode ? "text-violet-400" : "text-violet-600"
                      }
                    />
                  </div>
                  <div>
                    <h3 className={`text-base font-bold ${textPrimary}`}>
                      Account Information
                    </h3>
                    <p className={`text-xs ${textMuted}`}>
                      Your account details and verification status
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Account ID */}
                  <div
                    className={`p-4 rounded-xl ${
                      darkMode ? "bg-white/3" : "bg-gray-50"
                    } border ${
                      darkMode ? "border-white/5" : "border-gray-100"
                    }`}
                  >
                    <div
                      className={`text-[11px] font-medium uppercase tracking-wider ${textMuted} mb-2`}
                    >
                      Account ID
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-mono ${textPrimary} truncate`}
                      >
                        {profile?.id || "—"}
                      </span>
                      <button
                        onClick={handleCopyId}
                        className={`p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0 ${textMuted}`}
                        title="Copy ID"
                      >
                        {copiedId ? (
                          <Check size={13} className="text-green-500" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Email Verification */}
                  <div
                    className={`p-4 rounded-xl ${
                      darkMode ? "bg-white/3" : "bg-gray-50"
                    } border ${
                      darkMode ? "border-white/5" : "border-gray-100"
                    }`}
                  >
                    <div
                      className={`text-[11px] font-medium uppercase tracking-wider ${textMuted} mb-2`}
                    >
                      Email Verification
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck size={15} />
                        Verified
                      </span>
                    </div>
                  </div>

                  {/* Role */}
                  <div
                    className={`p-4 rounded-xl ${
                      darkMode ? "bg-white/3" : "bg-gray-50"
                    } border ${
                      darkMode ? "border-white/5" : "border-gray-100"
                    }`}
                  >
                    <div
                      className={`text-[11px] font-medium uppercase tracking-wider ${textMuted} mb-2`}
                    >
                      Account Role
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent">
                      <BadgeCheck size={13} />
                      {profile?.role || "ADMINISTRATOR"}
                    </span>
                  </div>

                  {/* Member Since */}
                  <div
                    className={`p-4 rounded-xl ${
                      darkMode ? "bg-white/3" : "bg-gray-50"
                    } border ${
                      darkMode ? "border-white/5" : "border-gray-100"
                    }`}
                  >
                    <div
                      className={`text-[11px] font-medium uppercase tracking-wider ${textMuted} mb-2`}
                    >
                      Member Since
                    </div>
                    <span className={`text-sm font-medium ${textPrimary}`}>
                      {profile?.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              year: "numeric",
                            },
                          )
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30">
                    <Trash2
                      size={18}
                      className="text-red-600 dark:text-red-400"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-red-700 dark:text-red-400">
                      Danger Zone
                    </h3>
                    <p className="text-xs text-red-500/70 dark:text-red-400/50">
                      Irreversible actions
                    </p>
                  </div>
                </div>
                <p className={`text-sm ${textSecondary} mb-4`}>
                  Once you delete your account, all of your data will be
                  permanently removed. This action cannot be undone.
                </p>
                <button
                  className="px-5 py-2 rounded-xl text-sm font-semibold border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  onClick={() =>
                    addToast(
                      "Please contact support to delete your account",
                      "error",
                    )
                  }
                >
                  Delete Account
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
