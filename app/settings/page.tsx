"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import SignOutModal from "@/components/modals/sign-out-modal";
import {
  User,
  Shield,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  Check,
  Trash2,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { logger } from "@/lib/logger";

type SettingsTab = "account" | "security" | "notifications";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  // Account form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [bookingReminders, setBookingReminders] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth?callbackUrl=/settings");
    } else if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000,
    );
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setName(data.user.name || "");
        setEmail(data.user.email || "");
        setPhone(data.user.phone || "");
      }
    } catch (error) {
      logger.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAccount = async () => {
    if (!name.trim()) {
      showToast("Name is required", "error");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || null,
        }),
      });

      if (res.ok) {
        showToast("Account updated successfully!", "success");
      } else {
        const error = await res.json();
        showToast(error.message || "Failed to update account", "error");
      }
    } catch (error) {
      logger.error("Error updating account:", error);
      showToast("Failed to update account", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword) {
      showToast("Current password is required", "error");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      showToast("New password must be at least 8 characters", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (res.ok) {
        showToast("Password changed successfully!", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const error = await res.json();
        showToast(error.message || "Failed to change password", "error");
      }
    } catch (error) {
      logger.error("Error changing password:", error);
      showToast("Failed to change password", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const handleSignOut = () => {
    setIsSignOutModalOpen(true);
  };

  const confirmSignOut = async () => {
    setIsSignOutModalOpen(false);
    await signOut({ callbackUrl: "/" });
  };

  const tabs = [
    { id: "account" as const, label: "Account", icon: User },
    { id: "security" as const, label: "Security", icon: Lock },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
  ];

  if (status === "loading" || isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        {/* Toast */}
        {toast.show && (
          <div
            className={`fixed top-24 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
              toast.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {toast.message}
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Profile
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Sign Out Button */}
              <div className="mt-8 pt-6 border-t border-border">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-xl p-6">
                {/* Account Tab */}
                {activeTab === "account" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-1">
                        Account Information
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Update your personal details
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          disabled
                          className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Email cannot be changed. Contact support if you need
                          help.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter your phone number"
                          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={handleSaveAccount}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Check size={16} />
                        )}
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-1">
                        Change Password
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Update your password regularly to keep your account
                        secure
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-2 pr-10 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                        <label className="block text-sm font-medium text-foreground mb-1">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 pr-10 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showNewPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Must be at least 8 characters long
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={handleChangePassword}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Shield size={16} />
                        )}
                        Update Password
                      </button>
                    </div>

                    {/* Danger Zone */}
                    <div className="mt-8 pt-6 border-t border-border">
                      <h3 className="text-lg font-semibold text-destructive mb-2">
                        Danger Zone
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Once you delete your account, there is no going back.
                        Please be certain.
                      </p>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-destructive text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 size={16} />
                        Delete Account
                      </button>

                      {/* Delete Account Confirmation Modal */}
                      {showDeleteModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                          <div className="w-full max-w-md mx-4 rounded-2xl border border-border bg-card p-6 shadow-xl">
                            <h3 className="text-lg font-semibold text-destructive mb-2">
                              Delete Your Account?
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              This action is{" "}
                              <strong>permanent and irreversible</strong>. All
                              your data, bookings, reviews, and provider
                              profiles will be deleted.
                            </p>
                            <label className="block text-sm font-medium text-foreground mb-1">
                              Enter your password to confirm
                            </label>
                            <div className="relative mb-4">
                              <input
                                type={showDeletePassword ? "text" : "password"}
                                value={deletePassword}
                                onChange={(e) =>
                                  setDeletePassword(e.target.value)
                                }
                                placeholder="Your current password"
                                className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowDeletePassword(!showDeletePassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              >
                                {showDeletePassword ? (
                                  <EyeOff size={16} />
                                ) : (
                                  <Eye size={16} />
                                )}
                              </button>
                            </div>
                            <div className="flex items-center gap-3 justify-end">
                              <button
                                onClick={() => {
                                  setShowDeleteModal(false);
                                  setDeletePassword("");
                                }}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                disabled={!deletePassword || isDeleting}
                                onClick={async () => {
                                  setIsDeleting(true);
                                  try {
                                    const res = await fetch(
                                      "/api/auth/delete-account",
                                      {
                                        method: "DELETE",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                          password: deletePassword,
                                        }),
                                      },
                                    );
                                    const data = await res.json();
                                    if (!res.ok) {
                                      setToast({
                                        show: true,
                                        message:
                                          data.message ||
                                          "Failed to delete account",
                                        type: "error",
                                      });
                                      return;
                                    }
                                    // Sign out and redirect to home
                                    await signOut({ callbackUrl: "/" });
                                  } catch {
                                    setToast({
                                      show: true,
                                      message:
                                        "An error occurred. Please try again.",
                                      type: "error",
                                    });
                                  } finally {
                                    setIsDeleting(false);
                                    setShowDeleteModal(false);
                                    setDeletePassword("");
                                  }
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-white text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isDeleting ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                                Permanently Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-1">
                        Notification Preferences
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Choose what notifications you want to receive
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div>
                          <p className="font-medium text-foreground">
                            Email Notifications
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Receive email updates about your account
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setEmailNotifications(!emailNotifications)
                          }
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            emailNotifications ? "bg-accent" : "bg-muted"
                          }`}
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                              emailNotifications
                                ? "translate-x-7"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div>
                          <p className="font-medium text-foreground">
                            Booking Reminders
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Get reminded about upcoming bookings
                          </p>
                        </div>
                        <button
                          onClick={() => setBookingReminders(!bookingReminders)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            bookingReminders ? "bg-accent" : "bg-muted"
                          }`}
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                              bookingReminders
                                ? "translate-x-7"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div>
                          <p className="font-medium text-foreground">
                            Marketing Emails
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Receive news, promotions, and special offers
                          </p>
                        </div>
                        <button
                          onClick={() => setMarketingEmails(!marketingEmails)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            marketingEmails ? "bg-accent" : "bg-muted"
                          }`}
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                              marketingEmails
                                ? "translate-x-7"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() =>
                          showToast("Preferences saved!", "success")
                        }
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
                      >
                        <Check size={16} />
                        Save Preferences
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={confirmSignOut}
      />
    </>
  );
}
