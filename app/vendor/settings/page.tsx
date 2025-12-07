"use client";

import VendorLayout from "@/components/vendor/VendorLayout";
import { useVendorTheme } from "@/components/vendor/VendorThemeContext";
import ImageUpload from "@/components/ui/ImageUpload";
import {
  User,
  Building,
  Shield,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Loader2,
  Globe,
} from "lucide-react";
import { useState, useEffect } from "react";

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "business", label: "Business", icon: Building },
  { id: "security", label: "Security", icon: Shield },
];

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

interface BusinessData {
  businessName: string;
  description: string;
  phonePublic: string;
  website: string;
  address: string;
  city: string;
  postcode: string;
  serviceRadiusMiles: number;
  categories: string[];
}

export default function VendorSettingsPage() {
  const { darkMode, toggleDarkMode } = useVendorTheme();
  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Safe JSON helper to avoid crashes on empty/error responses
  const safeJson = async (res: Response) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  // Profile state
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });

  // Business state
  const [business, setBusiness] = useState<BusinessData>({
    businessName: "",
    description: "",
    phonePublic: "",
    website: "",
    address: "",
    city: "",
    postcode: "",
    serviceRadiusMiles: 25,
    categories: [],
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  async function fetchProfileData() {
    setIsLoading(true);
    try {
      // Fetch user profile
      const profileRes = await fetch("/api/auth/me");
      if (profileRes.ok) {
        const userData = (await safeJson(profileRes)) || {};
        const user = userData.user || userData;
        setProfile({
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          avatar: user?.avatar || user?.image || "",
        });
      }

      // Fetch business profile
      const businessRes = await fetch("/api/vendor/profile");
      if (businessRes.ok) {
        const data = (await safeJson(businessRes)) || {};
        const provider = data.provider;
        if (provider) {
          setBusiness({
            businessName: provider.businessName || "",
            description: provider.description || "",
            phonePublic: provider.phonePublic || "",
            website: provider.website || "",
            address: provider.address || "",
            city: provider.city || "",
            postcode: provider.postcode || "",
            serviceRadiusMiles: provider.serviceRadiusMiles || 25,
            categories: provider.categories || [],
          });
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveProfile() {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        const data = (await safeJson(res)) || {};
        setMessage({
          type: "error",
          text: data.error || "Failed to update profile",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  }

  async function saveBusiness() {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/vendor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(business),
      });

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Business info updated successfully!",
        });
      } else {
        const data = (await safeJson(res)) || {};
        setMessage({
          type: "error",
          text: data.message || "Failed to update business info",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  }

  async function changePassword() {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters",
      });
      return;
    }

    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const data = (await safeJson(res)) || {};
        setMessage({
          type: "error",
          text: data.error || "Failed to change password",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <VendorLayout title="Settings">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 shrink-0">
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

            {/* Dark Mode Toggle */}
            <div
              className={`p-4 ${
                darkMode ? "border-white/10" : "border-gray-200"
              } border-t`}
            >
              <div className="flex items-center justify-between">
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Dark Mode
                </span>
                <button
                  onClick={toggleDarkMode}
                  className={`w-11 h-6 rounded-full ${
                    darkMode ? "bg-accent" : "bg-gray-300"
                  } transition-colors relative`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                      darkMode ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {/* Message Toast */}
          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {message.text}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2
                className={`w-8 h-8 animate-spin ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              />
            </div>
          ) : (
            <>
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
                      <div className="relative w-20 h-20">
                        {profile.avatar ? (
                          <ImageUpload
                            value={profile.avatar}
                            onChange={(url) =>
                              setProfile({ ...profile, avatar: url })
                            }
                            type="avatar"
                            aspectRatio="square"
                            className="w-20 h-20 rounded-xl overflow-hidden"
                          />
                        ) : (
                          <div
                            className="w-20 h-20 rounded-xl bg-linear-to-br from-accent to-green-600 flex items-center justify-center text-white text-2xl font-bold cursor-pointer relative"
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "image/*";
                              input.onchange = async (e) => {
                                const file = (e.target as HTMLInputElement)
                                  .files?.[0];
                                if (file) {
                                  const formData = new FormData();
                                  formData.append("files", file);
                                  formData.append("type", "avatar");
                                  try {
                                    const res = await fetch("/api/upload", {
                                      method: "POST",
                                      body: formData,
                                    });
                                    const data = await res.json();
                                    if (data.url) {
                                      setProfile({
                                        ...profile,
                                        avatar: data.url,
                                      });
                                    }
                                  } catch (err) {
                                    console.error("Upload failed:", err);
                                  }
                                }
                              };
                              input.click();
                            }}
                          >
                            {getInitials(profile.name)}
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                              <Camera size={20} className="text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <p
                          className={`${
                            darkMode ? "text-white" : "text-gray-900"
                          } font-medium`}
                        >
                          {profile.name || "Vendor"}
                        </p>
                        <p className="text-gray-500 text-sm">Account Owner</p>
                        {profile.avatar && (
                          <button
                            onClick={() =>
                              setProfile({ ...profile, avatar: "" })
                            }
                            className="text-sm text-red-500 hover:text-red-400 mt-1"
                          >
                            Remove photo
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label
                          className={`block ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          } text-sm mb-2`}
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) =>
                            setProfile({ ...profile, name: e.target.value })
                          }
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
                            value={profile.email}
                            disabled
                            className={`w-full pl-11 pr-4 py-3 rounded-lg ${
                              darkMode
                                ? "bg-white/5 text-gray-400 border-white/10"
                                : "bg-gray-100 text-gray-500 border-gray-200"
                            } border cursor-not-allowed`}
                          />
                        </div>
                        <p className="text-gray-500 text-xs mt-1">
                          Email cannot be changed
                        </p>
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
                            value={profile.phone}
                            onChange={(e) =>
                              setProfile({ ...profile, phone: e.target.value })
                            }
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
                      onClick={() => fetchProfileData()}
                      className={`px-4 py-2 rounded-lg border ${
                        darkMode
                          ? "border-white/10 text-white hover:bg-white/10"
                          : "border-gray-200 text-gray-900 hover:bg-gray-50"
                      } transition-colors`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveProfile}
                      disabled={isSaving}
                      className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/80 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
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
                            value={business.businessName}
                            onChange={(e) =>
                              setBusiness({
                                ...business,
                                businessName: e.target.value,
                              })
                            }
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
                          Description
                        </label>
                        <textarea
                          value={business.description}
                          onChange={(e) =>
                            setBusiness({
                              ...business,
                              description: e.target.value,
                            })
                          }
                          rows={4}
                          className={`w-full px-4 py-3 rounded-lg ${
                            darkMode
                              ? "bg-white/5 text-white border-white/10"
                              : "bg-gray-50 text-gray-900 border-gray-200"
                          } border focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none`}
                        />
                      </div>

                      <div>
                        <label
                          className={`block ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          } text-sm mb-2`}
                        >
                          Public Phone
                        </label>
                        <div className="relative">
                          <Phone
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                            size={18}
                          />
                          <input
                            type="tel"
                            value={business.phonePublic}
                            onChange={(e) =>
                              setBusiness({
                                ...business,
                                phonePublic: e.target.value,
                              })
                            }
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
                          Website
                        </label>
                        <div className="relative">
                          <Globe
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                            size={18}
                          />
                          <input
                            type="url"
                            value={business.website}
                            onChange={(e) =>
                              setBusiness({
                                ...business,
                                website: e.target.value,
                              })
                            }
                            placeholder="https://example.com"
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
                          Address
                        </label>
                        <div className="relative">
                          <MapPin
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                            size={18}
                          />
                          <input
                            type="text"
                            value={business.address}
                            onChange={(e) =>
                              setBusiness({
                                ...business,
                                address: e.target.value,
                              })
                            }
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
                          City
                        </label>
                        <input
                          type="text"
                          value={business.city}
                          onChange={(e) =>
                            setBusiness({
                              ...business,
                              city: e.target.value,
                            })
                          }
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
                          Postcode
                        </label>
                        <input
                          type="text"
                          value={business.postcode}
                          onChange={(e) =>
                            setBusiness({
                              ...business,
                              postcode: e.target.value,
                            })
                          }
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
                          Service Radius (miles)
                        </label>
                        <input
                          type="number"
                          value={business.serviceRadiusMiles}
                          onChange={(e) =>
                            setBusiness({
                              ...business,
                              serviceRadiusMiles: parseInt(e.target.value) || 0,
                            })
                          }
                          min={1}
                          max={500}
                          className={`w-full px-4 py-3 rounded-lg ${
                            darkMode
                              ? "bg-white/5 text-white border-white/10"
                              : "bg-gray-50 text-gray-900 border-gray-200"
                          } border focus:outline-none focus:ring-2 focus:ring-accent/50`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => fetchProfileData()}
                      className={`px-4 py-2 rounded-lg border ${
                        darkMode
                          ? "border-white/10 text-white hover:bg-white/10"
                          : "border-gray-200 text-gray-900 hover:bg-gray-50"
                      } transition-colors`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveBusiness}
                      disabled={isSaving}
                      className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/80 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                      Save Changes
                    </button>
                  </div>
                </>
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
                      Change Password
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
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                currentPassword: e.target.value,
                              })
                            }
                            placeholder="••••••••"
                            className={`w-full pl-11 pr-12 py-3 rounded-lg ${
                              darkMode
                                ? "bg-white/5 text-white border-white/10"
                                : "bg-gray-50 text-gray-900 border-gray-200"
                            } border focus:outline-none focus:ring-2 focus:ring-accent/50`}
                          />
                          <button
                            type="button"
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
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                newPassword: e.target.value,
                              })
                            }
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
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                confirmPassword: e.target.value,
                              })
                            }
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

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() =>
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        })
                      }
                      className={`px-4 py-2 rounded-lg border ${
                        darkMode
                          ? "border-white/10 text-white hover:bg-white/10"
                          : "border-gray-200 text-gray-900 hover:bg-gray-50"
                      } transition-colors`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={changePassword}
                      disabled={isSaving}
                      className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/80 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                      Update Password
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </VendorLayout>
  );
}
