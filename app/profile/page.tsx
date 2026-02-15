"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Camera,
  Edit3,
  Check,
  X,
  Loader2,
  Shield,
  Star,
  Heart,
  FileText,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { logger } from "@/lib/logger";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: string;
  emailVerifiedAt: string | null;
  createdAt: string;
  providers: {
    id: string;
    businessName: string;
    isPublished: boolean;
    isVerified: boolean;
  }[];
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth?callbackUrl=/profile");
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
        setProfile(data.user);
        setEditName(data.user.name || "");
        setEditPhone(data.user.phone || "");
      }
    } catch (error) {
      logger.error("Error fetching profile:", error);
      showToast("Failed to load profile", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      showToast("Name is required", "error");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          phone: editPhone.trim() || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile((prev) =>
          prev ? { ...prev, name: editName, phone: editPhone || null } : null,
        );
        setIsEditing(false);
        showToast("Profile updated successfully!", "success");
      } else {
        const error = await res.json();
        showToast(error.message || "Failed to update profile", "error");
      }
    } catch (error) {
      logger.error("Error updating profile:", error);
      showToast("Failed to update profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("type", "avatar");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      const uploadData = await uploadRes.json();
      if (uploadData.url) {
        // Update profile with new avatar
        const updateRes = await fetch("/api/auth/me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatar: uploadData.url }),
        });

        if (updateRes.ok) {
          setProfile((prev) =>
            prev ? { ...prev, avatar: uploadData.url } : null,
          );
          showToast("Avatar updated!", "success");
        }
      }
    } catch (error) {
      logger.error("Error uploading avatar:", error);
      showToast("Failed to upload avatar", "error");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

  if (!profile) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
            <p className="text-muted-foreground">Unable to load profile</p>
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
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          {/* Profile Header Card */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
            {/* Cover/Banner */}
            <div className="h-32 bg-linear-to-r from-accent/30 to-primary/30" />

            {/* Profile Info */}
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-card bg-accent flex items-center justify-center overflow-hidden">
                    {profile.avatar ? (
                      <Image
                        src={profile.avatar}
                        alt={profile.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="text-2xl font-bold text-accent-foreground">
                        {getInitials(profile.name)}
                      </span>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAvatarUpload(file);
                    }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors disabled:opacity-50"
                  >
                    {isUploadingAvatar ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Camera size={14} />
                    )}
                  </button>
                </div>

                {/* Name & Email */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground">
                    {profile.name}
                  </h1>
                  <p className="text-muted-foreground">{profile.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                      {profile.role === "ADMINISTRATOR" && <Shield size={12} />}
                      {profile.role === "PROFESSIONAL" && <Star size={12} />}
                      {profile.role === "CLIENT" && <User size={12} />}
                      {profile.role}
                    </span>
                    {profile.emailVerifiedAt && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        <Check size={12} />
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  {isEditing ? <X size={16} /> : <Edit3 size={16} />}
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Personal Information
                </h2>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditName(profile.name);
                          setEditPhone(profile.phone || "");
                        }}
                        className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User size={18} className="text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Full Name
                        </p>
                        <p className="text-foreground">{profile.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Email Address
                        </p>
                        <p className="text-foreground">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={18} className="text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Phone Number
                        </p>
                        <p className="text-foreground">
                          {profile.phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Member Since
                        </p>
                        <p className="text-foreground">
                          {formatDate(profile.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Vendor Profile (if applicable) */}
              {profile.providers && profile.providers.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Your Vendor Profile
                  </h2>
                  <div className="space-y-3">
                    {profile.providers.map((provider) => (
                      <Link
                        key={provider.id}
                        href="/vendor"
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-accent/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {provider.businessName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {provider.isVerified && (
                              <span className="text-xs text-green-600">
                                Verified
                              </span>
                            )}
                            {provider.isPublished ? (
                              <span className="text-xs text-blue-600">
                                Published
                              </span>
                            ) : (
                              <span className="text-xs text-orange-600">
                                Draft
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-accent">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Quick Links */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Quick Links
                </h2>
                <div className="space-y-2">
                  <Link
                    href="/dashboard/favorites"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Heart size={18} className="text-accent" />
                    <span className="text-foreground">My Favorites</span>
                  </Link>
                  <Link
                    href="/dashboard/bookings"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Calendar size={18} className="text-accent" />
                    <span className="text-foreground">My Bookings</span>
                  </Link>
                  <Link
                    href="/dashboard/inquiries"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <FileText size={18} className="text-accent" />
                    <span className="text-foreground">My Inquiries</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Shield size={18} className="text-accent" />
                    <span className="text-foreground">Account Settings</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
