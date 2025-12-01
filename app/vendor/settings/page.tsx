"use client";

import VendorLayout from "@/components/vendor/VendorLayout";
import { useVendorTheme } from "@/components/vendor/VendorThemeContext";
import {
  User,
  Building,
  Bell,
  CreditCard,
  Shield,
  Globe,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  Check,
  Camera,
} from "lucide-react";
import { useState } from "react";

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "business", label: "Business", icon: Building },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "payments", label: "Payment Methods", icon: CreditCard },
  { id: "security", label: "Security", icon: Shield },
  { id: "preferences", label: "Preferences", icon: Globe },
];

const notificationSettings = [
  {
    category: "Inquiries",
    options: [
      { label: "New inquiry received", email: true, push: true, sms: false },
      { label: "Inquiry reminder (24h)", email: true, push: false, sms: false },
    ],
  },
  {
    category: "Bookings",
    options: [
      { label: "New booking confirmed", email: true, push: true, sms: true },
      {
        label: "Booking reminder (1 day before)",
        email: true,
        push: true,
        sms: true,
      },
      { label: "Booking cancelled", email: true, push: true, sms: false },
    ],
  },
  {
    category: "Payments",
    options: [
      { label: "Payment received", email: true, push: true, sms: false },
      { label: "Withdrawal completed", email: true, push: false, sms: false },
    ],
  },
];

export default function VendorSettingsPage() {
  const { darkMode, toggleDarkMode } = useVendorTheme();
  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <VendorLayout title="Settings">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div
            className={`${
              darkMode
                ? "bg-[#141414] border-white/10"
                : "bg-white border-gray-200"
            } rounded-xl border overflow-hidden`}
          >
            <div
              className={`p-4 ${
                darkMode ? "border-white/10" : "border-gray-200"
              } border-b`}
            >
              <h3
                className={`${
                  darkMode ? "text-white" : "text-gray-900"
                } font-semibold`}
              >
                Settings
              </h3>
            </div>
            <nav className="p-2">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? "bg-accent/20 text-accent"
                      : `${
                          darkMode
                            ? "text-gray-400 hover:bg-white/5 hover:text-white"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`
                  }`}
                >
                  <section.icon size={18} />
                  <span>{section.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {/* Profile Section */}
          {activeSection === "profile" && (
            <>
              <div
                className={`${
                  darkMode
                    ? "bg-[#141414] border-white/10"
                    : "bg-white border-gray-200"
                } rounded-xl border p-5`}
              >
                <h3
                  className={`${
                    darkMode ? "text-white" : "text-gray-900"
                  } font-semibold mb-6`}
                >
                  Personal Information
                </h3>

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-accent to-green-600 flex items-center justify-center text-white text-2xl font-bold">
                      JD
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-2 rounded-full bg-accent text-white hover:bg-accent/80 transition-colors">
                      <Camera size={14} />
                    </button>
                  </div>
                  <div>
                    <p
                      className={`${
                        darkMode ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      John Doe
                    </p>
                    <p className="text-gray-500 text-sm">Account Owner</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } text-sm mb-2`}
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      defaultValue="John"
                      className={`w-full px-4 py-3 rounded-lg ${
                        darkMode
                          ? "bg-white/5 text-white border-white/10"
                          : "bg-gray-50 text-gray-900 border-gray-200"
                      } border focus:outline-none focus:ring-2 focus:ring-accent/50`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } text-sm mb-2`}
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Doe"
                      className={`w-full px-4 py-3 rounded-lg ${
                        darkMode
                          ? "bg-white/5 text-white border-white/10"
                          : "bg-gray-50 text-gray-900 border-gray-200"
                      } border focus:outline-none focus:ring-2 focus:ring-accent/50`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } text-sm mb-2`}
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                        size={18}
                      />
                      <input
                        type="email"
                        defaultValue="john@elegantprod.com"
                        className={`w-full pl-11 pr-4 py-3 rounded-lg ${
                          darkMode
                            ? "bg-white/5 text-white border-white/10"
                            : "bg-gray-50 text-gray-900 border-gray-200"
                        } border focus:outline-none focus:ring-2 focus:ring-accent/50`}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className={`block ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } text-sm mb-2`}
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                        size={18}
                      />
                      <input
                        type="tel"
                        defaultValue="(555) 123-4567"
                        className={`w-full pl-11 pr-4 py-3 rounded-lg ${
                          darkMode
                            ? "bg-white/5 text-white border-white/10"
                            : "bg-gray-50 text-gray-900 border-gray-200"
                        } border focus:outline-none focus:ring-2 focus:ring-accent/50`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  className={`px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "border-white/10 text-white hover:bg-white/10"
                      : "border-gray-200 text-gray-900 hover:bg-gray-50"
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/80 transition-colors">
                  Save Changes
                </button>
              </div>
            </>
          )}

          {/* Business Section */}
          {activeSection === "business" && (
            <>
              <div
                className={`${
                  darkMode
                    ? "bg-[#141414] border-white/10"
                    : "bg-white border-gray-200"
                } rounded-xl border p-5`}
              >
                <h3
                  className={`${
                    darkMode ? "text-white" : "text-gray-900"
                  } font-semibold mb-6`}
                >
                  Business Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label
                      className={`block ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } text-sm mb-2`}
                    >
                      Business Name
                    </label>
                    <div className="relative">
                      <Building
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                        size={18}
                      />
                      <input
                        type="text"
                        defaultValue="Elegant Productions"
                        className={`w-full pl-11 pr-4 py-3 rounded-lg ${
                          darkMode
                            ? "bg-white/5 text-white border-white/10"
                            : "bg-gray-50 text-gray-900 border-gray-200"
                        } border focus:outline-none focus:ring-2 focus:ring-accent/50`}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      className={`block ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } text-sm mb-2`}
                    >
                      Business Address
                    </label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                        size={18}
                      />
                      <input
                        type="text"
                        defaultValue="123 Creative Ave, Los Angeles, CA 90001"
                        className={`w-full pl-11 pr-4 py-3 rounded-lg ${
                          darkMode
                            ? "bg-white/5 text-white border-white/10"
                            : "bg-gray-50 text-gray-900 border-gray-200"
                        } border focus:outline-none focus:ring-2 focus:ring-accent/50`}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className={`block ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } text-sm mb-2`}
                    >
                      Service Category
                    </label>
                    <select
                      className={`w-full px-4 py-3 rounded-lg ${
                        darkMode
                          ? "bg-white/5 text-white border-white/10"
                          : "bg-gray-50 text-gray-900 border-gray-200"
                      } border focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none`}
                    >
                      <option value="photography">Photography</option>
                      <option value="dj">DJ Services</option>
                      <option value="catering">Catering</option>
                      <option value="venue">Venue</option>
                    </select>
                  </div>
                  <div>
                    <label
                      className={`block ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } text-sm mb-2`}
                    >
                      Years in Business
                    </label>
                    <input
                      type="number"
                      defaultValue="10"
                      className={`w-full px-4 py-3 rounded-lg ${
                        darkMode
                          ? "bg-white/5 text-white border-white/10"
                          : "bg-gray-50 text-gray-900 border-gray-200"
                      } border focus:outline-none focus:ring-2 focus:ring-accent/50`}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      className={`block ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } text-sm mb-2`}
                    >
                      Business Description
                    </label>
                    <textarea
                      rows={4}
                      defaultValue="Elegant Productions is a premier event services company..."
                      className={`w-full px-4 py-3 rounded-lg ${
                        darkMode
                          ? "bg-white/5 text-white border-white/10"
                          : "bg-gray-50 text-gray-900 border-gray-200"
                      } border focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  className={`px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "border-white/10 text-white hover:bg-white/10"
                      : "border-gray-200 text-gray-900 hover:bg-gray-50"
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/80 transition-colors">
                  Save Changes
                </button>
              </div>
            </>
          )}

          {/* Notifications Section */}
          {activeSection === "notifications" && (
            <div
              className={`${
                darkMode
                  ? "bg-[#141414] border-white/10"
                  : "bg-white border-gray-200"
              } rounded-xl border p-5`}
            >
              <h3
                className={`${
                  darkMode ? "text-white" : "text-gray-900"
                } font-semibold mb-6`}
              >
                Notification Preferences
              </h3>

              {notificationSettings.map((category, idx) => (
                <div
                  key={idx}
                  className={
                    idx > 0
                      ? `mt-6 pt-6 ${
                          darkMode ? "border-white/10" : "border-gray-200"
                        } border-t`
                      : ""
                  }
                >
                  <h4 className="text-accent font-medium mb-4">
                    {category.category}
                  </h4>
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="hidden sm:grid grid-cols-4 gap-4 text-gray-500 text-sm px-4">
                      <span className="col-span-1"></span>
                      <span className="text-center">Email</span>
                      <span className="text-center">Push</span>
                      <span className="text-center">SMS</span>
                    </div>
                    {/* Options */}
                    {category.options.map((option, optIdx) => (
                      <div
                        key={optIdx}
                        className={`grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-lg ${
                          darkMode ? "bg-white/5" : "bg-gray-50"
                        } items-center`}
                      >
                        <span
                          className={darkMode ? "text-white" : "text-gray-900"}
                        >
                          {option.label}
                        </span>
                        <div className="flex sm:justify-center items-center gap-2 sm:gap-0">
                          <span className="sm:hidden text-gray-500 text-sm w-12">
                            Email
                          </span>
                          <button
                            className={`w-10 h-6 rounded-full transition-colors ${
                              option.email ? "bg-accent" : "bg-gray-700"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                option.email ? "translate-x-5" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex sm:justify-center items-center gap-2 sm:gap-0">
                          <span className="sm:hidden text-gray-500 text-sm w-12">
                            Push
                          </span>
                          <button
                            className={`w-10 h-6 rounded-full transition-colors ${
                              option.push ? "bg-accent" : "bg-gray-700"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                option.push ? "translate-x-5" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex sm:justify-center items-center gap-2 sm:gap-0">
                          <span className="sm:hidden text-gray-500 text-sm w-12">
                            SMS
                          </span>
                          <button
                            className={`w-10 h-6 rounded-full transition-colors ${
                              option.sms ? "bg-accent" : "bg-gray-700"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                option.sms ? "translate-x-5" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Security Section */}
          {activeSection === "security" && (
            <>
              <div
                className={`${
                  darkMode
                    ? "bg-[#141414] border-white/10"
                    : "bg-white border-gray-200"
                } rounded-xl border p-5`}
              >
                <h3
                  className={`${
                    darkMode ? "text-white" : "text-gray-900"
                  } font-semibold mb-6`}
                >
                  Password
                </h3>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label
                      className={`block ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } text-sm mb-2`}
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                        size={18}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`w-full pl-11 pr-12 py-3 rounded-lg ${
                          darkMode
                            ? "bg-white/5 text-white border-white/10"
                            : "bg-gray-50 text-gray-900 border-gray-200"
                        } border focus:outline-none focus:ring-2 focus:ring-accent/50`}
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label
                      className={`block ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } text-sm mb-2`}
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                        size={18}
                      />
                      <input
                        type="password"
                        placeholder="••••••••"
                        className={`w-full pl-11 pr-4 py-3 rounded-lg ${
                          darkMode
                            ? "bg-white/5 text-white border-white/10"
                            : "bg-gray-50 text-gray-900 border-gray-200"
                        } border focus:outline-none focus:ring-2 focus:ring-accent/50`}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className={`block ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } text-sm mb-2`}
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                        size={18}
                      />
                      <input
                        type="password"
                        placeholder="••••••••"
                        className={`w-full pl-11 pr-4 py-3 rounded-lg ${
                          darkMode
                            ? "bg-white/5 text-white border-white/10"
                            : "bg-gray-50 text-gray-900 border-gray-200"
                        } border focus:outline-none focus:ring-2 focus:ring-accent/50`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`${
                  darkMode
                    ? "bg-[#141414] border-white/10"
                    : "bg-white border-gray-200"
                } rounded-xl border p-5`}
              >
                <h3
                  className={`${
                    darkMode ? "text-white" : "text-gray-900"
                  } font-semibold mb-4`}
                >
                  Two-Factor Authentication
                </h3>
                <p
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } text-sm mb-4`}
                >
                  Add an extra layer of security to your account by enabling
                  2FA.
                </p>
                <button className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/80 transition-colors">
                  Enable 2FA
                </button>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  className={`px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "border-white/10 text-white hover:bg-white/10"
                      : "border-gray-200 text-gray-900 hover:bg-gray-50"
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/80 transition-colors">
                  Update Password
                </button>
              </div>
            </>
          )}

          {/* Payment Methods Section */}
          {activeSection === "payments" && (
            <div
              className={`${
                darkMode
                  ? "bg-[#141414] border-white/10"
                  : "bg-white border-gray-200"
              } rounded-xl border p-5`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  className={`${
                    darkMode ? "text-white" : "text-gray-900"
                  } font-semibold`}
                >
                  Payment Methods
                </h3>
                <button className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/80 transition-colors text-sm">
                  Add New
                </button>
              </div>

              <div className="space-y-4">
                <div
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    darkMode
                      ? "bg-white/5 border-white/10"
                      : "bg-gray-50 border-gray-200"
                  } border`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-500/20">
                      <CreditCard size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <p
                        className={`${
                          darkMode ? "text-white" : "text-gray-900"
                        } font-medium`}
                      >
                        •••• •••• •••• 4521
                      </p>
                      <p className="text-gray-500 text-sm">
                        Chase Bank - Checking
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">
                      Default
                    </span>
                    <button
                      className={`${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-500 hover:text-gray-900"
                      } transition-colors`}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Section */}
          {activeSection === "preferences" && (
            <div
              className={`${
                darkMode
                  ? "bg-[#141414] border-white/10"
                  : "bg-white border-gray-200"
              } rounded-xl border p-5`}
            >
              <h3
                className={`${
                  darkMode ? "text-white" : "text-gray-900"
                } font-semibold mb-6`}
              >
                Preferences
              </h3>

              <div className="space-y-6">
                <div>
                  <label
                    className={`block ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } text-sm mb-2`}
                  >
                    Language
                  </label>
                  <select
                    className={`w-full max-w-xs px-4 py-3 rounded-lg ${
                      darkMode
                        ? "bg-white/5 text-white border-white/10"
                        : "bg-gray-50 text-gray-900 border-gray-200"
                    } border focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none`}
                  >
                    <option value="en">English (US)</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } text-sm mb-2`}
                  >
                    Timezone
                  </label>
                  <select
                    className={`w-full max-w-xs px-4 py-3 rounded-lg ${
                      darkMode
                        ? "bg-white/5 text-white border-white/10"
                        : "bg-gray-50 text-gray-900 border-gray-200"
                    } border focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none`}
                  >
                    <option value="pst">Pacific Time (PST)</option>
                    <option value="mst">Mountain Time (MST)</option>
                    <option value="cst">Central Time (CST)</option>
                    <option value="est">Eastern Time (EST)</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } text-sm mb-2`}
                  >
                    Currency
                  </label>
                  <select
                    className={`w-full max-w-xs px-4 py-3 rounded-lg ${
                      darkMode
                        ? "bg-white/5 text-white border-white/10"
                        : "bg-gray-50 text-gray-900 border-gray-200"
                    } border focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none`}
                  >
                    <option value="usd">USD ($)</option>
                    <option value="eur">EUR (€)</option>
                    <option value="gbp">GBP (£)</option>
                  </select>
                </div>

                <div
                  className={`pt-4 ${
                    darkMode ? "border-white/10" : "border-gray-200"
                  } border-t`}
                >
                  <div
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      darkMode ? "bg-white/5" : "bg-gray-50"
                    }`}
                  >
                    <div>
                      <p
                        className={`${
                          darkMode ? "text-white" : "text-gray-900"
                        } font-medium`}
                      >
                        Dark Mode
                      </p>
                      <p className="text-gray-500 text-sm">
                        Use dark theme for the dashboard
                      </p>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={`w-12 h-7 rounded-full ${
                        darkMode ? "bg-accent" : "bg-gray-300"
                      } transition-colors`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          darkMode ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </VendorLayout>
  );
}
