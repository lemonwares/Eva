"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useDashboardTheme } from "../layout";
import {
  User,
  Shield,
  Bell,
  Camera,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Save,
  Loader2,
  CheckCircle,
  XCircle,
  KeyRound,
  BadgeCheck,
  Fingerprint,
  ShieldCheck,
  Copy,
  Check,
  Trash2,
  Info,
} from "lucide-react";
import { logger } from "@/lib/logger";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  image?: string;
  role?: string;
  emailVerified?: string | null;
  createdAt?: string;
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    marketing: boolean;
    reminders: boolean;
  };
}

const tabs = [
  { id: "profile", label: "Profile", icon: User, description: "Personal info" },
  {
    id: "password",
    label: "Security",
    icon: Shield,
    description: "Password & safety",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Alert preferences",
  },
];

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const {
    darkMode,
    cardBg,
    cardBorder,
    textPrimary,
    textSecondary,
    textMuted,
    inputBg,
    inputBorder,
  } = useDashboardTheme();

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
  });
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    marketing: false,
    reminders: true,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users/me");
      const data = await response.json();

      if (data.user) {
        setProfile(data.user);
        setProfileForm({
          name: data.user.name || "",
          phone: data.user.phone || "",
        });
        if (data.user.notificationPreferences) {
          setNotifications(data.user.notificationPreferences);
        }
      }
    } catch (error) {
      logger.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });

      if (response.ok) {
        showMessage("success", "Profile updated successfully");
        update({ name: profileForm.name });
      } else {
        showMessage("error", "Failed to update profile");
      }
    } catch {
      showMessage("error", "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage("error", "Passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      showMessage("error", "Password must be at least 8 characters");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch("/api/users/me/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (response.ok) {
        showMessage("success", "Password changed successfully");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const data = await response.json();
        showMessage("error", data.error || "Failed to change password");
      }
    } catch {
      showMessage("error", "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const saveNotifications = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationPreferences: notifications }),
      });

      if (response.ok) {
        showMessage("success", "Notification preferences saved");
      } else {
        showMessage("error", "Failed to save preferences");
      }
    } catch {
      showMessage("error", "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("files", file);
    setAvatarUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        await fetchProfile();
        showMessage("success", "Avatar updated!");
      } else {
        showMessage("error", data.message || "Upload failed");
      }
    } catch {
      showMessage("error", "Upload failed");
    } finally {
      setAvatarUploading(false);
    }
  };

  /* ─── Password Strength ─── */
  const passwordStrength = (() => {
    const p = passwordForm.newPassword;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^a-zA-Z0-9]/.test(p)) s++;
    if (p.length >= 12) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Excellent"][
    passwordStrength
  ];
  const strengthColor = [
    "",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ][passwordStrength];

  const passwordsMatch =
    passwordForm.confirmPassword.length > 0 &&
    passwordForm.newPassword === passwordForm.confirmPassword;
  const passwordsMismatch =
    passwordForm.confirmPassword.length > 0 && !passwordsMatch;

  const copyAccountId = () => {
    if (profile?.id) {
      navigator.clipboard.writeText(profile.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
        <p className={`text-sm ${textMuted}`}>Loading settings...</p>
      </div>
    );
  }

  const avatarUrl = profile?.avatar || profile?.image;
  const initials =
    profileForm.name?.charAt(0) || session?.user?.email?.charAt(0) || "?";

  return (
    <div className="space-y-8">
      {/* ─── Header ─── */}
      <div>
        <h1 className={`text-2xl font-bold ${textPrimary}`}>Settings</h1>
        <p className={textSecondary}>Manage your account preferences</p>
      </div>

      {/* ─── Toast Message ─── */}
      {message && (
        <div
          className={`flex items-center gap-3 rounded-xl border p-4 ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800/40 dark:bg-green-900/20 dark:text-green-400"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-5 w-5 shrink-0" />
          ) : (
            <XCircle className="h-5 w-5 shrink-0" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ─── Tab Navigation ─── */}
        <div className="lg:w-64 flex lg:flex-col gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-accent text-white shadow-sm"
                    : `${cardBg} ${cardBorder} border ${textSecondary} hover:border-accent/30`
                }`}
              >
                <Icon className="w-5 h-5" />
                <div className="text-left">
                  <p className="text-sm font-medium">{tab.label}</p>
                  <p
                    className={`text-xs ${
                      isActive ? "text-white/70" : textMuted
                    } hidden lg:block`}
                  >
                    {tab.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ─── Content Area ─── */}
        <div className="flex-1 space-y-6">
          {/* ═══════════════════ PROFILE TAB ═══════════════════ */}
          {activeTab === "profile" && (
            <>
              {/* Avatar Card */}
              <div
                className={`${cardBg} ${cardBorder} border rounded-2xl overflow-hidden`}
              >
                <div className="bg-linear-to-r from-accent/10 via-purple-500/10 to-blue-500/10 h-24" />
                <div className="px-6 pb-6 -mt-10">
                  <div className="flex items-end gap-4">
                    <div className="relative group">
                      <div
                        className={`h-20 w-20 rounded-full border-4 ${
                          darkMode ? "border-[#0a0a0a]" : "border-white"
                        } overflow-hidden ${
                          darkMode ? "bg-white/5" : "bg-gray-100"
                        }`}
                      >
                        {avatarUrl ? (
                          <Image
                            src={avatarUrl}
                            alt="Profile"
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <span className={`text-2xl font-bold ${textMuted}`}>
                              {initials.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={avatarUploading}
                        className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        {avatarUploading ? (
                          <Loader2 className="h-5 w-5 text-white animate-spin" />
                        ) : (
                          <Camera className="h-5 w-5 text-white" />
                        )}
                      </button>
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </div>
                    <div className="pb-1">
                      <h2 className={`text-lg font-bold ${textPrimary}`}>
                        {profileForm.name || "Your Name"}
                      </h2>
                      <p className={`text-sm ${textMuted}`}>
                        {session?.user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information Card */}
              <div className={`${cardBg} ${cardBorder} border rounded-2xl p-6`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${textPrimary}`}>
                      Personal Information
                    </h3>
                    <p className={`text-sm ${textMuted}`}>
                      Update your personal details
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label
                      className={`block text-sm font-medium ${textSecondary} mb-2`}
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${textMuted}`}
                      />
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            name: e.target.value,
                          })
                        }
                        className={`w-full pl-10 pr-4 py-3 rounded-xl ${inputBg} border ${inputBorder} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-accent/50`}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      className={`block text-sm font-medium ${textSecondary} mb-2`}
                    >
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${textMuted}`}
                      />
                      <input
                        type="email"
                        value={session?.user?.email || ""}
                        disabled
                        className={`w-full pl-10 pr-4 py-3 rounded-xl ${inputBg} border ${inputBorder} ${textPrimary} opacity-60 cursor-not-allowed`}
                      />
                      <Lock
                        className={`absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${textMuted}`}
                      />
                    </div>
                    <p
                      className={`text-xs ${textMuted} mt-1 flex items-center gap-1`}
                    >
                      <Info className="h-3 w-3" /> Email cannot be changed
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      className={`block text-sm font-medium ${textSecondary} mb-2`}
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${textMuted}`}
                      />
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            phone: e.target.value,
                          })
                        }
                        placeholder="+1 (555) 000-0000"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl ${inputBg} border ${inputBorder} ${textPrimary} placeholder:${textMuted} focus:outline-none focus:ring-2 focus:ring-accent/50`}
                      />
                    </div>
                  </div>

                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 disabled:opacity-50 transition-colors"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Account Information Card */}
              <div className={`${cardBg} ${cardBorder} border rounded-2xl p-6`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-900/20">
                    <Fingerprint className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${textPrimary}`}>
                      Account Information
                    </h3>
                    <p className={`text-sm ${textMuted}`}>
                      Your account details
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Account ID */}
                  <div
                    className={`rounded-xl p-4 ${
                      darkMode ? "bg-white/3" : "bg-gray-50"
                    }`}
                  >
                    <p className={`text-xs font-medium ${textMuted} mb-1`}>
                      Account ID
                    </p>
                    <div className="flex items-center gap-2">
                      <code
                        className={`text-sm font-mono ${textPrimary} truncate`}
                      >
                        {profile?.id?.slice(0, 12)}...
                      </code>
                      <button
                        onClick={copyAccountId}
                        className={`p-1 rounded-md ${
                          darkMode ? "hover:bg-white/10" : "hover:bg-gray-200"
                        } transition-colors`}
                      >
                        {copiedId ? (
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <Copy className={`h-3.5 w-3.5 ${textMuted}`} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Email Verified */}
                  <div
                    className={`rounded-xl p-4 ${
                      darkMode ? "bg-white/3" : "bg-gray-50"
                    }`}
                  >
                    <p className={`text-xs font-medium ${textMuted} mb-1`}>
                      Email Status
                    </p>
                    <div className="flex items-center gap-2">
                      {profile?.emailVerified ? (
                        <>
                          <ShieldCheck className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            Verified
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-amber-500" />
                          <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                            Unverified
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Role */}
                  <div
                    className={`rounded-xl p-4 ${
                      darkMode ? "bg-white/3" : "bg-gray-50"
                    }`}
                  >
                    <p className={`text-xs font-medium ${textMuted} mb-1`}>
                      Account Role
                    </p>
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-blue-500" />
                      <span className={`text-sm font-medium ${textPrimary}`}>
                        {profile?.role || session?.user?.role || "User"}
                      </span>
                    </div>
                  </div>

                  {/* Member Since */}
                  <div
                    className={`rounded-xl p-4 ${
                      darkMode ? "bg-white/3" : "bg-gray-50"
                    }`}
                  >
                    <p className={`text-xs font-medium ${textMuted} mb-1`}>
                      Member Since
                    </p>
                    <p className={`text-sm font-medium ${textPrimary}`}>
                      {profile?.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "long", day: "numeric", year: "numeric" },
                          )
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="rounded-2xl border border-red-200 dark:border-red-800/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20">
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-600 dark:text-red-400">
                      Danger Zone
                    </h3>
                    <p className={`text-sm ${textMuted}`}>
                      Irreversible account actions
                    </p>
                  </div>
                </div>
                <p className={`text-sm ${textSecondary} mb-4`}>
                  Once you delete your account, all data will be permanently
                  removed. This action cannot be undone.
                </p>
                <button
                  onClick={() =>
                    showMessage(
                      "error",
                      "Please contact support to delete your account.",
                    )
                  }
                  className="px-5 py-2.5 rounded-xl border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </>
          )}

          {/* ═══════════════════ SECURITY TAB ═══════════════════ */}
          {activeTab === "password" && (
            <div className={`${cardBg} ${cardBorder} border rounded-2xl p-6`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                  <KeyRound className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className={`font-semibold ${textPrimary}`}>
                    Change Password
                  </h3>
                  <p className={`text-sm ${textMuted}`}>
                    Update your account password
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Current Password */}
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${textMuted}`}
                    />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      className={`w-full pl-10 pr-12 py-3 rounded-xl ${inputBg} border ${inputBorder} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-accent/50`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${textMuted} hover:${textSecondary}`}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${textMuted}`}
                    />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      className={`w-full pl-10 pr-12 py-3 rounded-xl ${inputBg} border ${inputBorder} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-accent/50`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${textMuted} hover:${textSecondary}`}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {/* Strength Indicator */}
                  {passwordForm.newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              i <= passwordStrength
                                ? strengthColor
                                : darkMode
                                  ? "bg-white/10"
                                  : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs ${textMuted}`}>
                        Strength: {strengthLabel}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${textMuted}`}
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className={`w-full pl-10 pr-12 py-3 rounded-xl ${inputBg} border ${inputBorder} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-accent/50`}
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      {passwordsMatch && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {passwordsMismatch && (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className={`${textMuted} hover:${textSecondary}`}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  {passwordsMismatch && (
                    <p className="text-xs text-red-500 mt-1">
                      Passwords do not match
                    </p>
                  )}
                </div>

                <button
                  onClick={changePassword}
                  disabled={
                    saving ||
                    !passwordForm.currentPassword ||
                    !passwordForm.newPassword ||
                    !passwordForm.confirmPassword
                  }
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 disabled:opacity-50 transition-colors"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4" />
                      Change Password
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════ NOTIFICATIONS TAB ═══════════════════ */}
          {activeTab === "notifications" && (
            <div className={`${cardBg} ${cardBorder} border rounded-2xl p-6`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
                  <Bell className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className={`font-semibold ${textPrimary}`}>
                    Notification Preferences
                  </h3>
                  <p className={`text-sm ${textMuted}`}>
                    Choose how you want to be notified
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: "email" as const,
                    icon: Mail,
                    label: "Email Notifications",
                    desc: "Receive email updates about your bookings and inquiries",
                    color: "text-blue-500",
                  },
                  {
                    key: "sms" as const,
                    icon: Phone,
                    label: "SMS Notifications",
                    desc: "Receive text messages for important updates",
                    color: "text-green-500",
                  },
                  {
                    key: "reminders" as const,
                    icon: Bell,
                    label: "Event Reminders",
                    desc: "Get reminded about upcoming events and bookings",
                    color: "text-amber-500",
                  },
                  {
                    key: "marketing" as const,
                    icon: Fingerprint,
                    label: "Marketing Emails",
                    desc: "Receive tips, special offers, and updates",
                    color: "text-purple-500",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.key}
                      className={`flex items-center justify-between gap-4 p-4 rounded-xl ${
                        darkMode ? "bg-white/3" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${item.color} shrink-0`} />
                        <div>
                          <p className={`font-medium ${textPrimary}`}>
                            {item.label}
                          </p>
                          <p className={`text-sm ${textMuted}`}>{item.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications({
                            ...notifications,
                            [item.key]: !notifications[item.key],
                          })
                        }
                        className={`relative w-12 h-6 shrink-0 rounded-full transition-colors ${
                          notifications[item.key]
                            ? "bg-accent"
                            : darkMode
                              ? "bg-gray-600"
                              : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                            notifications[item.key]
                              ? "translate-x-7"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={saveNotifications}
                disabled={saving}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Preferences
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
