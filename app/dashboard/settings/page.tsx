"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDashboardTheme } from "../layout";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    marketing: boolean;
    reminders: boolean;
  };
}

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
  // Loader for avatar upload
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
      console.error("Error fetching profile:", error);
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      showMessage("error", "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-lg ${inputBg} border ${inputBorder} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-rose-500`;

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      id: "password",
      label: "Password",
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${textPrimary}`}>Settings</h1>
        <p className={textSecondary}>Manage your account preferences</p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
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
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            {message.text}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className={`lg:w-64 flex lg:flex-col gap-2 overflow-x-auto`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-rose-500 text-white"
                  : `${cardBg} ${cardBorder} border ${textSecondary} hover:bg-opacity-80`
              }`}
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
                  d={tab.icon}
                />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={`flex-1 ${cardBg} ${cardBorder} border rounded-xl p-6`}>
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className={`text-lg font-semibold ${textPrimary}`}>
                  Profile Information
                </h2>
                <p className={`text-sm ${textMuted}`}>
                  Update your personal details
                </p>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-20 h-20 rounded-full ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  } overflow-hidden shrink-0`}
                >
                  {profile && (profile.avatar || profile.image) ? (
                    <img
                      src={profile.avatar || profile.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className={`text-2xl font-medium ${textMuted}`}>
                        {profileForm.name?.charAt(0) ||
                          session?.user?.email?.charAt(0) ||
                          "?"}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex flex-col items-start">
                    <label
                      htmlFor="avatarFile"
                      className="cursor-pointer flex items-center gap-2 text-rose-500 hover:text-rose-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-7 h-7"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10l4.553-2.276A2 2 0 0020 6.382V5a2 2 0 00-2-2H6a2 2 0 00-2 2v1.382a2 2 0 00.447 1.342L9 10m6 0v4m0 0l-4.553 2.276A2 2 0 014 17.618V19a2 2 0 002 2h12a2 2 0 002-2v-1.382a2 2 0 00-.447-1.342L15 14z"
                        />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span className="text-sm font-medium">Change Avatar</span>
                    </label>
                    <input
                      id="avatarFile"
                      type="file"
                      name="avatarFile"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append("files", file); // Use 'files' key to match backend
                        setAvatarUploading(true);
                        try {
                          const res = await fetch("/api/upload", {
                            method: "POST",
                            body: formData,
                          });
                          const data = await res.json();
                          if (res.ok && data.url) {
                            // Avatar upload handled separately, not in profileForm
                          } else {
                            alert(data.message || "Upload failed");
                          }
                        } catch (err) {
                          alert("Upload failed");
                        } finally {
                          setAvatarUploading(false);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Loader for avatar upload */}
                {avatarUploading && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="animate-spin w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full"></div>
                    <span className="text-sm text-rose-500">
                      Uploading avatar...
                    </span>
                  </div>
                )}
              </div>

              {/* Name */}
              <div>
                <label
                  className={`block text-sm font-medium ${textSecondary} mb-2`}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  className={`block text-sm font-medium ${textSecondary} mb-2`}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={session?.user?.email || ""}
                  disabled
                  className={`${inputClass} opacity-60 cursor-not-allowed`}
                />
                <p className={`text-sm ${textMuted} mt-1`}>
                  Email cannot be changed
                </p>
              </div>

              {/* Phone */}
              <div>
                <label
                  className={`block text-sm font-medium ${textSecondary} mb-2`}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                  placeholder="+1 (555) 000-0000"
                  className={inputClass}
                />
              </div>

              <button
                onClick={saveProfile}
                disabled={saving}
                className="px-6 py-3 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 disabled:opacity-50"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <div className="space-y-6">
              <div>
                <h2 className={`text-lg font-semibold ${textPrimary}`}>
                  Change Password
                </h2>
                <p className={`text-sm ${textMuted}`}>
                  Update your account password
                </p>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${textSecondary} mb-2`}
                >
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${textSecondary} mb-2`}
                >
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  className={inputClass}
                />
                <p className={`text-sm ${textMuted} mt-1`}>
                  Must be at least 8 characters
                </p>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${textSecondary} mb-2`}
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </div>

              <button
                onClick={changePassword}
                disabled={
                  saving ||
                  !passwordForm.currentPassword ||
                  !passwordForm.newPassword ||
                  !passwordForm.confirmPassword
                }
                className="px-6 py-3 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 disabled:opacity-50"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Changing...
                  </span>
                ) : (
                  "Change Password"
                )}
              </button>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className={`text-lg font-semibold ${textPrimary}`}>
                  Notification Preferences
                </h2>
                <p className={`text-sm ${textMuted}`}>
                  Choose how you want to be notified
                </p>
              </div>

              <div className="space-y-4">
                <div
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    darkMode ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <div>
                    <p className={`font-medium ${textPrimary}`}>
                      Email Notifications
                    </p>
                    <p className={`text-sm ${textMuted}`}>
                      Receive email updates about your bookings and inquiries
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifications({
                        ...notifications,
                        email: !notifications.email,
                      })
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications.email
                        ? "bg-rose-500"
                        : darkMode
                        ? "bg-gray-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        notifications.email ? "translate-x-7" : "translate-x-1"
                      }`}
                    ></div>
                  </button>
                </div>

                <div
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    darkMode ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <div>
                    <p className={`font-medium ${textPrimary}`}>
                      SMS Notifications
                    </p>
                    <p className={`text-sm ${textMuted}`}>
                      Receive text messages for important updates
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifications({
                        ...notifications,
                        sms: !notifications.sms,
                      })
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications.sms
                        ? "bg-rose-500"
                        : darkMode
                        ? "bg-gray-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        notifications.sms ? "translate-x-7" : "translate-x-1"
                      }`}
                    ></div>
                  </button>
                </div>

                <div
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    darkMode ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <div>
                    <p className={`font-medium ${textPrimary}`}>
                      Event Reminders
                    </p>
                    <p className={`text-sm ${textMuted}`}>
                      Get reminded about upcoming events and bookings
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifications({
                        ...notifications,
                        reminders: !notifications.reminders,
                      })
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications.reminders
                        ? "bg-rose-500"
                        : darkMode
                        ? "bg-gray-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        notifications.reminders
                          ? "translate-x-7"
                          : "translate-x-1"
                      }`}
                    ></div>
                  </button>
                </div>

                <div
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    darkMode ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <div>
                    <p className={`font-medium ${textPrimary}`}>
                      Marketing Emails
                    </p>
                    <p className={`text-sm ${textMuted}`}>
                      Receive tips, special offers, and updates
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifications({
                        ...notifications,
                        marketing: !notifications.marketing,
                      })
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications.marketing
                        ? "bg-rose-500"
                        : darkMode
                        ? "bg-gray-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        notifications.marketing
                          ? "translate-x-7"
                          : "translate-x-1"
                      }`}
                    ></div>
                  </button>
                </div>
              </div>

              <button
                onClick={saveNotifications}
                disabled={saving}
                className="px-6 py-3 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 disabled:opacity-50"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </span>
                ) : (
                  "Save Preferences"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
