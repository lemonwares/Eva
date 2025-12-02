"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import {
  User,
  Bell,
  Shield,
  Globe,
  CreditCard,
  Mail,
  Save,
  Upload,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "platform", label: "Platform", icon: Globe },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "email", label: "Email", icon: Mail },
];

const notificationSettings = [
  {
    id: "new_vendor",
    label: "New Vendor Registration",
    description: "Get notified when a new vendor signs up",
    enabled: true,
  },
  {
    id: "new_booking",
    label: "New Booking",
    description: "Get notified for every new booking",
    enabled: true,
  },
  {
    id: "new_review",
    label: "New Review",
    description: "Get notified when a review needs moderation",
    enabled: true,
  },
  {
    id: "payment_received",
    label: "Payment Received",
    description: "Get notified when a payment is processed",
    enabled: false,
  },
  {
    id: "weekly_report",
    label: "Weekly Reports",
    description: "Receive weekly analytics reports via email",
    enabled: true,
  },
  {
    id: "system_alerts",
    label: "System Alerts",
    description: "Critical system notifications and updates",
    enabled: true,
  },
];

const timezones = [
  "Africa/Lagos (WAT)",
  "Africa/Johannesburg (SAST)",
  "Europe/London (GMT/BST)",
  "America/New_York (EST/EDT)",
  "Asia/Dubai (GST)",
];

const languages = ["English", "French", "Spanish", "Portuguese", "Arabic"];
const currencies = ["NGN (₦)", "USD ($)", "GBP (£)", "EUR (€)", "ZAR (R)"];

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
  const [notifications, setNotifications] = useState(notificationSettings);
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [selectedTimezone, setSelectedTimezone] =
    useState("Africa/Lagos (WAT)");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedCurrency, setSelectedCurrency] = useState("NGN (₦)");

  const toggleNotification = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, enabled: !n.enabled } : n
      )
    );
  };

  return (
    <AdminLayout
      title="Settings"
      actionButton={{
        label: "Save Changes",
        onClick: () => {},
        icon: <Save size={18} />,
      }}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs Sidebar */}
        <div className={`lg:w-56 shrink-0`}>
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

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">A</span>
                </div>
                <div>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90">
                    <Upload size={16} />
                    Upload Photo
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
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Admin"
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
                    defaultValue="User"
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
                    defaultValue="admin@eva.com"
                    className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                  />
                </div>
                <div>
                  <label
                    className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue="+234 800 123 4567"
                    className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                  >
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Platform administrator for EVA Events."
                    className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className={`${cardBg} border ${cardBorder} rounded-xl p-6`}>
              <h3 className={`text-lg font-bold ${textPrimary} mb-2`}>
                Notification Preferences
              </h3>
              <p className={`text-sm ${textMuted} mb-6`}>
                Choose how you want to be notified about activity.
              </p>

              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      darkMode ? "bg-white/5" : "bg-gray-50"
                    }`}
                  >
                    <div>
                      <p className={`font-medium text-sm ${textPrimary}`}>
                        {notification.label}
                      </p>
                      <p className={`text-xs ${textMuted}`}>
                        {notification.description}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleNotification(notification.id)}
                      className={`w-11 h-6 rounded-full transition-colors relative ${
                        notification.enabled
                          ? "bg-accent"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${
                          notification.enabled
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
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
                          className={`w-full px-4 py-2.5 pr-10 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                        />
                        <button
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
                          placeholder="Enter new password"
                          className={`w-full px-4 py-2.5 pr-10 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                        />
                        <button
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
                        className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                      />
                    </div>
                    <button className="px-6 py-2.5 rounded-lg bg-accent text-white font-semibold text-sm hover:bg-accent/90">
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Two-Factor Auth */}
                <div
                  className={`pt-6 border-t ${
                    darkMode ? "border-white/5" : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${textPrimary}`}>
                        Two-Factor Authentication
                      </h4>
                      <p className={`text-sm ${textMuted}`}>
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <button className="px-4 py-2 rounded-lg border border-accent text-accent font-medium text-sm hover:bg-accent/10">
                      Enable 2FA
                    </button>
                  </div>
                </div>

                {/* Active Sessions */}
                <div
                  className={`pt-6 border-t ${
                    darkMode ? "border-white/5" : "border-gray-100"
                  }`}
                >
                  <h4 className={`font-medium ${textPrimary} mb-4`}>
                    Active Sessions
                  </h4>
                  <div
                    className={`p-4 rounded-lg ${
                      darkMode ? "bg-white/5" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium text-sm ${textPrimary}`}>
                          Current Session
                        </p>
                        <p className={`text-xs ${textMuted}`}>
                          Windows • Chrome • Lagos, Nigeria
                        </p>
                      </div>
                      <span className="text-xs text-green-500 font-medium">
                        Active now
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Platform Tab */}
          {activeTab === "platform" && (
            <div className={`${cardBg} border ${cardBorder} rounded-xl p-6`}>
              <h3 className={`text-lg font-bold ${textPrimary} mb-6`}>
                Platform Settings
              </h3>

              <div className="space-y-6 max-w-md">
                {/* Timezone */}
                <div>
                  <label
                    className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                  >
                    Timezone
                  </label>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowTimezoneDropdown(!showTimezoneDropdown)
                      }
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm`}
                    >
                      {selectedTimezone}
                      <ChevronDown size={16} />
                    </button>
                    {showTimezoneDropdown && (
                      <div
                        className={`absolute top-full left-0 right-0 mt-1 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1`}
                      >
                        {timezones.map((tz) => (
                          <button
                            key={tz}
                            onClick={() => {
                              setSelectedTimezone(tz);
                              setShowTimezoneDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm ${
                              selectedTimezone === tz
                                ? "text-accent"
                                : textSecondary
                            } ${
                              darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                            }`}
                          >
                            {tz}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label
                    className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                  >
                    Language
                  </label>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowLanguageDropdown(!showLanguageDropdown)
                      }
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm`}
                    >
                      {selectedLanguage}
                      <ChevronDown size={16} />
                    </button>
                    {showLanguageDropdown && (
                      <div
                        className={`absolute top-full left-0 right-0 mt-1 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1`}
                      >
                        {languages.map((lang) => (
                          <button
                            key={lang}
                            onClick={() => {
                              setSelectedLanguage(lang);
                              setShowLanguageDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm ${
                              selectedLanguage === lang
                                ? "text-accent"
                                : textSecondary
                            } ${
                              darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Currency */}
                <div>
                  <label
                    className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                  >
                    Default Currency
                  </label>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowCurrencyDropdown(!showCurrencyDropdown)
                      }
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm`}
                    >
                      {selectedCurrency}
                      <ChevronDown size={16} />
                    </button>
                    {showCurrencyDropdown && (
                      <div
                        className={`absolute top-full left-0 right-0 mt-1 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1`}
                      >
                        {currencies.map((curr) => (
                          <button
                            key={curr}
                            onClick={() => {
                              setSelectedCurrency(curr);
                              setShowCurrencyDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm ${
                              selectedCurrency === curr
                                ? "text-accent"
                                : textSecondary
                            } ${
                              darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                            }`}
                          >
                            {curr}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Platform Name */}
                <div>
                  <label
                    className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                  >
                    Platform Name
                  </label>
                  <input
                    type="text"
                    defaultValue="EVA Events"
                    className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                  />
                </div>

                {/* Support Email */}
                <div>
                  <label
                    className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                  >
                    Support Email
                  </label>
                  <input
                    type="email"
                    defaultValue="support@eva.com"
                    className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <div className={`${cardBg} border ${cardBorder} rounded-xl p-6`}>
              <h3 className={`text-lg font-bold ${textPrimary} mb-6`}>
                Billing & Subscription
              </h3>

              {/* Current Plan */}
              <div
                className={`p-6 rounded-xl ${
                  darkMode ? "bg-white/5" : "bg-gray-50"
                } mb-6`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className={`text-sm ${textMuted}`}>Current Plan</p>
                    <p className={`text-2xl font-bold ${textPrimary}`}>
                      Enterprise Plan
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-500">
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <p className={`text-xs ${textMuted}`}>Billing Cycle</p>
                    <p className={`text-sm font-medium ${textPrimary}`}>
                      Annual (Renews Jan 2025)
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${textMuted}`}>Amount</p>
                    <p className={`text-sm font-medium ${textPrimary}`}>
                      ₦2,500,000/year
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h4 className={`font-medium ${textPrimary} mb-4`}>
                  Payment Method
                </h4>
                <div
                  className={`flex items-center justify-between p-4 rounded-lg border ${cardBorder}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-8 rounded ${
                        darkMode ? "bg-white/10" : "bg-gray-100"
                      } flex items-center justify-center`}
                    >
                      <CreditCard size={20} className={textMuted} />
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${textPrimary}`}>
                        •••• •••• •••• 4242
                      </p>
                      <p className={`text-xs ${textMuted}`}>Expires 12/25</p>
                    </div>
                  </div>
                  <button className="text-accent text-sm font-medium hover:underline">
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Email Tab */}
          {activeTab === "email" && (
            <div className={`${cardBg} border ${cardBorder} rounded-xl p-6`}>
              <h3 className={`text-lg font-bold ${textPrimary} mb-6`}>
                Email Configuration
              </h3>

              <div className="space-y-4 max-w-md">
                <div>
                  <label
                    className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                  >
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    defaultValue="smtp.mailgun.org"
                    className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                    >
                      SMTP Port
                    </label>
                    <input
                      type="text"
                      defaultValue="587"
                      className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                    />
                  </div>
                  <div>
                    <label
                      className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                    >
                      Encryption
                    </label>
                    <input
                      type="text"
                      defaultValue="TLS"
                      className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                    />
                  </div>
                </div>
                <div>
                  <label
                    className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                  >
                    SMTP Username
                  </label>
                  <input
                    type="text"
                    defaultValue="postmaster@eva.com"
                    className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                  />
                </div>
                <div>
                  <label
                    className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                  >
                    SMTP Password
                  </label>
                  <input
                    type="password"
                    defaultValue="••••••••••••"
                    className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                  />
                </div>
                <div>
                  <label
                    className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                  >
                    From Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="noreply@eva.com"
                    className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                  />
                </div>
                <div>
                  <label
                    className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
                  >
                    From Name
                  </label>
                  <input
                    type="text"
                    defaultValue="EVA Events"
                    className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                  />
                </div>

                <button className="w-full px-4 py-2.5 rounded-lg border border-accent text-accent font-medium text-sm hover:bg-accent/10 mt-4">
                  Send Test Email
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
