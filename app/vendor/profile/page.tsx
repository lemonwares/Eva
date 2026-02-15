"use client";

import VendorLayout from "@/components/vendor/VendorLayout";
import { useVendorTheme } from "@/components/vendor/VendorThemeContext";
import { formatCurrency } from "@/lib/formatters";
import ServiceModal, {
  type ServiceData,
} from "@/components/vendor/modals/ServiceModal";
import BookingModal, {
  BookingService,
} from "@/components/vendor/modals/BookingModal";
import PhotoModal, {
  type PhotoItem,
} from "@/components/vendor/modals/PhotoModal";
import DescriptionModal from "@/components/vendor/modals/DescriptionModal";
import InfoModal, {
  type BusinessInfoData,
} from "@/components/vendor/modals/InfoModal";
import {
  Camera,
  Star,
  MapPin,
  Mail,
  Phone,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Award,
  Calendar,
  Edit3,
  Plus,
  X,
  ChevronRight,
  Loader2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SocialMediaModal, {
  type SocialMediaData,
} from "@/components/vendor/modals/SocialMediaModal";
import { logger } from "@/lib/logger";
interface Provider {
  id: string;
  businessName: string;
  description: string | null;
  categories: string[];
  subcategories: string[];
  city: string | null;
  postcode: string;
  address: string | null;
  website: string | null;
  phonePublic: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  photos: string[];
  coverImage: string | null;
  isVerified: boolean;
  averageRating: number | null;
  reviewCount: number;
  priceFrom: number | null;
  listings: Listing[];
  _count: {
    reviews: number;
    bookings: number;
    inquiries: number;
    listings: number;
  };
  owner?: {
    email: string;
  };
}

interface Listing {
  id: string;
  headline: string;
  longDescription: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  coverImageUrl: string | null;
  price: number;
  timeEstimate: string | null;
}

export default function VendorProfilePage() {
  const { darkMode } = useVendorTheme();
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState<"cover" | "logo" | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Modal states
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Listing | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingPrefill, setBookingPrefill] = useState<BookingService[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [socialModalOpen, setSocialModalOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/vendor/profile");
      if (res.ok) {
        const data = await res.json();
        setProvider(data.provider || null);
      }
    } catch (err) {
      logger.error("Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // Booking modal handlers
  const handleBookService = (service: Listing) => {
    setBookingPrefill([
      {
        id: service.id,
        headline: service.headline,
        minPrice: service.minPrice,
        maxPrice: service.maxPrice,
      },
    ]);
    setBookingModalOpen(true);
  };

  const handleBookMultiple = () => {
    if (!provider?.listings) return;
    setBookingPrefill(
      provider.listings.map((s) => ({
        id: s.id,
        headline: s.headline,
        minPrice: s.minPrice,
        maxPrice: s.maxPrice,
      })),
    );
    setBookingModalOpen(true);
  };

  const handleBookingSubmit = (selected: BookingService[]) => {
    // TODO: Implement booking logic (open booking flow, etc.)
  };
  const handleAddService = async (data: ServiceData) => {
    try {
      const res = await fetch("/api/vendor/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create service");

      // Refresh profile to show new service
      await fetchProfile();
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to create service",
      );
    }
  };

  const handleEditService = async (data: ServiceData) => {
    if (!editingService) return;
    try {
      const res = await fetch(`/api/vendor/listings/${editingService.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to update service");

      // Refresh profile to show updated service
      await fetchProfile();
      setEditingService(null);
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to update service",
      );
    }
  };

  const handleServiceSubmit = async (data: ServiceData) => {
    if (editingService) {
      await handleEditService(data);
    } else {
      await handleAddService(data);
    }
  };

  // Social Modal handler
  const handleSaveSocialMedia = async (data: SocialMediaData) => {
    try {
      const res = await fetch("/api/vendor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instagram: data.instagram,
          facebook: data.facebook,
          tiktok: data.tiktok,
        }),
      });
      if (!res.ok) throw new Error("Failed to save social media links");
      await fetchProfile();
    } catch (err) {
      throw new Error(
        err instanceof Error
          ? err.message
          : "Failed to save social media links",
      );
    }
  };

  // Photo modal handlers
  const handleAddPhoto = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("files", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.message);

      // Add photo to vendor profile
      const res = await fetch("/api/vendor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photos: [...(provider?.photos || []), uploadData.url],
        }),
      });

      if (!res.ok) throw new Error("Failed to save photo");

      // Refresh profile
      await fetchProfile();
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to upload photo",
      );
    }
  };

  const handleDeletePhoto = async (photoUrl: string) => {
    try {
      const newPhotos = provider?.photos.filter((p) => p !== photoUrl) || [];

      const res = await fetch("/api/vendor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos: newPhotos }),
      });

      if (!res.ok) throw new Error("Failed to delete photo");

      // Refresh profile
      await fetchProfile();
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to delete photo",
      );
    }
  };

  // Description modal handler
  const handleSaveDescription = async (description: string) => {
    try {
      const res = await fetch("/api/vendor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      if (!res.ok) throw new Error("Failed to save description");

      // Refresh profile
      await fetchProfile();
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to save description",
      );
    }
  };

  // Info modal handler
  const handleSaveInfo = async (data: BusinessInfoData) => {
    try {
      const res = await fetch("/api/vendor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: data.location,
          phonePublic: data.phone,
          website: data.website,
          // email is not updated here since it's not editable
        }),
      });

      if (!res.ok) throw new Error("Failed to save information");

      // Refresh profile
      await fetchProfile();
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to save information",
      );
    }
  };

  async function handleImageUpload(file: File, type: "cover" | "logo") {
    setIsUploading(type);
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("type", type === "cover" ? "cover" : "avatar");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (data.url && provider) {
        // Update the profile with the new image
        const updateRes = await fetch("/api/vendor/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            [type === "cover" ? "coverImage" : "logo"]: data.url,
          }),
        });

        if (updateRes.ok) {
          // Update local state
          setProvider({
            ...provider,
            coverImage: type === "cover" ? data.url : provider.coverImage,
          });
        }
      }
    } catch (err) {
      logger.error("Upload failed:", err);
    } finally {
      setIsUploading(null);
    }
  }

  const getInitials = (name: string) => {
    // Guard against undefined/null name to prevent split error
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Capitalize/Uppercase function for categories
  const formatCategories = (cats?: string) => {
    const str = (cats ?? "").trim();

    if (!str) return ""; // avoid null/undefined

    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  if (isLoading) {
    return (
      <VendorLayout title="My Profile">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </VendorLayout>
    );
  }

  if (!provider) {
    return (
      <VendorLayout title="My Profile">
        <div
          className={`rounded-xl border p-12 text-center ${
            darkMode
              ? "bg-[#141414] border-white/10"
              : "bg-white border-gray-200"
          }`}
        >
          <Camera
            size={48}
            className={`mx-auto mb-4 ${
              darkMode ? "text-gray-600" : "text-gray-400"
            }`}
          />
          <h3
            className={`text-lg font-medium mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            No profile found
          </h3>
          <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
            Please complete your vendor registration to create your profile.
          </p>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout
      title="My Profile"
      actionButton={{
        label: "Edit Profile",
        onClick: () => router.push("/vendor/settings"),
      }}
    >
      {/* Profile Header */}
      <div
        className={`${
          darkMode ? "bg-[#141414] border-white/10" : "bg-white border-gray-200"
        } rounded-xl border overflow-hidden mb-6`}
      >
        {/* Cover Image */}
        <div className="relative h-32 sm:h-48 bg-linear-to-r from-accent/30 to-green-600/30">
          {provider.coverImage && (
            <Image
              src={provider.coverImage}
              alt="Cover"
              fill
              unoptimized
              className="object-cover"
            />
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file, "cover");
            }}
          />
          <button
            onClick={() => coverInputRef.current?.click()}
            disabled={isUploading === "cover"}
            className={`absolute top-4 right-4 p-2 rounded-lg ${
              darkMode
                ? "bg-black/50 text-white hover:bg-black/70"
                : "bg-white/80 text-gray-700 hover:bg-white"
            } transition-colors disabled:opacity-50`}
          >
            {isUploading === "cover" ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Camera size={18} />
            )}
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-4 sm:px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-16">
            <div className="relative">
              <div
                className={`w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-linear-to-br from-accent to-green-600 border-4 ${
                  darkMode ? "border-[#141414]" : "border-white"
                } overflow-hidden`}
              >
                <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                  {getInitials(provider.businessName)}
                </div>
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, "logo");
                }}
              />
              <button
                onClick={() => logoInputRef.current?.click()}
                disabled={isUploading === "logo"}
                className="absolute bottom-2 right-2 p-1.5 rounded-full bg-accent text-white disabled:opacity-50"
              >
                {isUploading === "logo" ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Edit3 size={12} />
                )}
              </button>
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2
                    className={`text-xl sm:text-2xl mt-20 max-md:mt-0 font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {provider.businessName}
                  </h2>
                  <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    {/* {provider.categories?.join(", ") || "Vendor"} */}
                    {formatCategories(provider.categories.join(", ")) ||
                      "Vendor"}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    {provider.averageRating !== null && (
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star size={16} fill="currentColor" />
                        <span className="font-medium">
                          {provider.averageRating?.toFixed(1) || "0.0"}
                        </span>
                        <span className="text-gray-500">
                          ({provider.reviewCount} reviews)
                        </span>
                      </div>
                    )}
                    {provider.city && (
                      <div
                        className={`flex items-center gap-1 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        <MapPin size={16} />
                        <span>
                          {provider.address}, {provider.city},{" "}
                          {provider.postcode}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {provider.isVerified && (
                    <span className="px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm font-medium border border-green-500/30">
                      Verified Vendor
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <div
            className={`${
              darkMode
                ? "bg-[#141414] border-white/10"
                : "bg-white border-gray-200"
            } rounded-xl border p-5`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`${
                  darkMode ? "text-white" : "text-gray-900"
                } font-semibold`}
              >
                About
              </h3>
              <button
                onClick={() => setDescriptionModalOpen(true)}
                className={`p-2 rounded-lg ${
                  darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                } transition-colors`}
              >
                <Edit3 size={16} className="text-gray-400" />
              </button>
            </div>
            <p
              className={`${
                darkMode ? "text-gray-400" : "text-gray-600"
              } leading-relaxed`}
            >
              {provider.description ||
                "No description provided. Add a compelling description to attract more clients."}
            </p>
          </div>

          {/* Services Section */}
          <div
            className={`$${
              darkMode
                ? "bg-[#141414] border-white/10"
                : "bg-white border-gray-200"
            } rounded-xl border p-5`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`$${
                  darkMode ? "text-white" : "text-gray-900"
                } font-semibold`}
              >
                Services & Packages
              </h3>
              <button
                onClick={() => {
                  setEditingService(null);
                  setServiceModalOpen(true);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/20 text-accent text-sm hover:bg-accent/30 transition-colors"
              >
                <Plus size={16} />
                Add Service
              </button>
            </div>
            {/* Category Tabs (below section title) */}
            {provider.categories && provider.categories.length > 1 && (
              <div className="flex gap-2 mb-6">
                <button
                  className={`px-4 py-1.5 rounded-lg font-medium border transition-colors ${
                    selectedCategory === "all"
                      ? "bg-accent text-white border-accent"
                      : darkMode
                        ? "bg-white/5 border-white/10 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-700"
                  }`}
                  onClick={() => setSelectedCategory("all")}
                >
                  All
                </button>
                {provider.categories.map((cat) => (
                  <button
                    key={cat}
                    className={`px-4 py-1.5 rounded-lg font-medium border transition-colors ${
                      selectedCategory === cat
                        ? "bg-accent text-white border-accent"
                        : darkMode
                          ? "bg-white/5 border-white/10 text-white"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
            {/* Services List */}
            {!provider.listings || provider.listings.length === 0 ? (
              <div
                className={`text-center py-8 $${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {" "}
                <p>
                  No services listed yet. Add your first service or package.
                </p>{" "}
              </div>
            ) : (
              <div className="space-y-2">
                {provider.listings
                  .filter((listing) =>
                    selectedCategory === "all"
                      ? true
                      : provider.categories.includes(selectedCategory),
                  )
                  .map((listing) => (
                    <div
                      key={listing.id}
                      className={`flex gap-4 p-4 rounded-lg ${
                        darkMode
                          ? "bg-white/5 border-white/10 hover:border-accent/50"
                          : "bg-gray-50 border-gray-200 hover:border-accent/50"
                      } border transition-colors group`}
                    >
                      {/* Cover Image */}
                      <div className="relative w-20 h-20 sm:w-32 sm:h-32 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                        {listing.coverImageUrl ? (
                          <Image
                            src={listing.coverImageUrl}
                            alt={listing.headline}
                            fill
                            className="object-cover"
                            sizes="128px"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h4
                              className={`font-medium ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {listing.headline}
                            </h4>
                            <button
                              onClick={() => {
                                setEditingService(listing);
                                setServiceModalOpen(true);
                              }}
                              className={`p-1.5 rounded ${
                                darkMode
                                  ? "hover:bg-white/10"
                                  : "hover:bg-gray-200"
                              } transition-all`}
                            >
                              <Edit3 size={14} className="text-gray-400" />
                            </button>
                          </div>
                          <p className="text-accent font-bold text-lg mt-1">
                            Price:{" "}
                            {listing.price
                              ? `${formatCurrency(listing.price)}`
                              : "Price on request"}
                          </p>
                          {listing.timeEstimate && (
                            <p className="text-sm text-gray-500 mt-1">
                              <span className="font-semibold">
                                Estimated time:
                              </span>{" "}
                              {listing.timeEstimate}
                            </p>
                          )}
                          <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                            {listing.longDescription || "No description"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Booking Modal */}
                <BookingModal
                  isOpen={bookingModalOpen}
                  onClose={() => setBookingModalOpen(false)}
                  services={bookingPrefill}
                  onBook={handleBookingSubmit}
                  darkMode={darkMode}
                />
              </div>
            )}
          </div>

          {/* Gallery Section */}
          <div
            className={`${
              darkMode
                ? "bg-[#141414] border-white/10"
                : "bg-white border-gray-200"
            } rounded-xl border p-5`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`${
                  darkMode ? "text-white" : "text-gray-900"
                } font-semibold`}
              >
                Portfolio Gallery
              </h3>
              <button
                onClick={() => setPhotoModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/20 text-accent text-sm hover:bg-accent/30 transition-colors"
              >
                <Plus size={16} />
                Add Photos
              </button>
            </div>
            {!provider.photos || provider.photos.length === 0 ? (
              <div
                className={`text-center py-8 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                <Camera size={32} className="mx-auto mb-2 opacity-50" />
                <p>No photos uploaded yet. Add photos to showcase your work.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {provider.photos.map((photo, idx) => (
                  <div
                    key={idx}
                    className={`relative aspect-square rounded-lg overflow-hidden group`}
                  >
                    <Image
                      src={photo}
                      alt={`Portfolio ${idx + 1}`}
                      fill
                      unoptimized={true}
                      loading="lazy"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                        <Edit3 size={16} className="text-white" />
                      </button>
                      <button className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors">
                        <X size={16} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats Section */}
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
              Performance Stats
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-white/5" : "bg-gray-50"
                }`}
              >
                <p className="text-2xl font-bold text-accent">
                  {provider._count?.inquiries || 0}
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Total Inquiries
                </p>
              </div>
              <div
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-white/5" : "bg-gray-50"
                }`}
              >
                <p className="text-2xl font-bold text-accent">
                  {provider._count?.bookings || 0}
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Bookings
                </p>
              </div>
              <div
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-white/5" : "bg-gray-50"
                }`}
              >
                <p className="text-2xl font-bold text-accent">
                  {provider._count?.reviews || 0}
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Reviews
                </p>
              </div>
              <div
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-white/5" : "bg-gray-50"
                }`}
              >
                <p className="text-2xl font-bold text-accent">
                  {provider._count?.listings || 0}
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Services
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div
            className={`${
              darkMode
                ? "bg-[#141414] border-white/10"
                : "bg-white border-gray-200"
            } rounded-xl border p-5`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`${
                  darkMode ? "text-white" : "text-gray-900"
                } font-semibold`}
              >
                Contact Information
              </h3>
              <button
                onClick={() => setInfoModalOpen(true)}
                className={`p-2 rounded-lg ${
                  darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                } transition-colors`}
              >
                <Edit3 size={16} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              {provider.phonePublic && (
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      darkMode ? "bg-white/5" : "bg-gray-100"
                    }`}
                  >
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Phone</p>
                    <p className={darkMode ? "text-white" : "text-gray-900"}>
                      {provider.phonePublic}
                    </p>
                  </div>
                </div>
              )}
              {provider.website && (
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      darkMode ? "bg-white/5" : "bg-gray-100"
                    }`}
                  >
                    <Globe size={18} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Website</p>
                    <a
                      href={provider.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      {provider.website}
                    </a>
                  </div>
                </div>
              )}
              {provider.address && (
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      darkMode ? "bg-white/5" : "bg-gray-100"
                    }`}
                  >
                    <MapPin size={18} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Address</p>
                    <p className={darkMode ? "text-white" : "text-gray-900"}>
                      {provider.address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div
            className={`${
              darkMode
                ? "bg-[#141414] border-white/10"
                : "bg-white border-gray-200"
            } rounded-xl border p-5`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`${
                  darkMode ? "text-white" : "text-gray-900"
                } font-semibold`}
              >
                Social Media
              </h3>
              <button
                onClick={() => setSocialModalOpen(true)}
                className={`p-2 rounded-lg ${
                  darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                } transition-colors`}
              >
                <Edit3 size={16} className="text-gray-400" />
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {provider.instagram && (
                <a
                  href={`https://instagram.com/${provider.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-lg ${
                    darkMode
                      ? "bg-white/5 hover:bg-white/10"
                      : "bg-gray-100 hover:bg-gray-200"
                  } transition-colors`}
                >
                  <Instagram size={20} className="text-accent" />
                </a>
              )}
              {provider.facebook && (
                <a
                  href={provider.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-lg ${
                    darkMode
                      ? "bg-white/5 hover:bg-white/10"
                      : "bg-gray-100 hover:bg-gray-200"
                  } transition-colors`}
                >
                  <Facebook size={20} className="text-blue-400" />
                </a>
              )}
              {provider.tiktok && (
                <a
                  href={`https://tiktok.com/@${provider.tiktok}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-lg ${
                    darkMode
                      ? "bg-white/5 hover:bg-white/10"
                      : "bg-gray-100 hover:bg-gray-200"
                  } transition-colors`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="text-gray-400"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
              )}
              {!provider.instagram &&
                !provider.facebook &&
                !provider.tiktok && (
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    No social media links added yet.
                  </p>
                )}
            </div>
          </div>

          {/* Achievements */}
          {/* <div
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
              Achievements
            </h3>
            <div className="space-y-3">
              {provider.isVerified && (
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    darkMode ? "bg-white/5" : "bg-gray-50"
                  }`}
                >
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <Award size={18} className="text-green-400" />
                  </div>
                  <div>
                    <p
                      className={`${
                        darkMode ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      Verified Vendor
                    </p>
                    <p className="text-gray-500 text-sm">Trusted & Verified</p>
                  </div>
                </div>
              )}
              {(provider._count?.bookings || 0) >= 10 && (
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    darkMode ? "bg-white/5" : "bg-gray-50"
                  }`}
                >
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Calendar size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <p
                      className={`${
                        darkMode ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      {provider._count?.bookings || 0}+ Events
                    </p>
                    <p className="text-gray-500 text-sm">Events Completed</p>
                  </div>
                </div>
              )}
              {(provider.averageRating || 0) >= 4.5 && (
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    darkMode ? "bg-white/5" : "bg-gray-50"
                  }`}
                >
                  <div className="p-2 rounded-lg bg-yellow-500/20">
                    <Star size={18} className="text-yellow-400" />
                  </div>
                  <div>
                    <p
                      className={`${
                        darkMode ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      Top Rated
                    </p>
                    <p className="text-gray-500 text-sm">
                      {provider.averageRating?.toFixed(1)} Average Rating
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div> */}

          {/* Pricing */}
          {provider.priceFrom && (
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
                } font-semibold mb-2`}
              >
                Starting Price
              </h3>
              <p className="text-accent text-2xl font-bold">
                {formatCurrency(provider.priceFrom)}
              </p>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                From
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ServiceModal
        isOpen={serviceModalOpen}
        onClose={() => {
          setServiceModalOpen(false);
          setEditingService(null);
        }}
        onSubmit={handleServiceSubmit}
        initialData={
          editingService
            ? {
                headline: editingService.headline,
                longDescription: editingService.longDescription || "",
                minPrice: editingService.minPrice,
                maxPrice: editingService.maxPrice,
                price: editingService.price,
                timeEstimate: editingService.timeEstimate || "",
                coverImageUrl: editingService.coverImageUrl || "",
              }
            : undefined
        }
        darkMode={darkMode}
      />

      <PhotoModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        onSubmit={handleAddPhoto}
        existingPhotos={
          provider?.photos?.map((photo) => ({ url: photo })) || []
        }
        onDeletePhoto={handleDeletePhoto}
        darkMode={darkMode}
      />

      <DescriptionModal
        isOpen={descriptionModalOpen}
        onClose={() => setDescriptionModalOpen(false)}
        onSubmit={handleSaveDescription}
        initialValue={provider?.description || ""}
        darkMode={darkMode}
      />

      <InfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        onSubmit={handleSaveInfo}
        initialData={
          provider
            ? {
                location: provider.address || "",
                phone: provider.phonePublic || "",
                email: provider.owner?.email || "",
                website: provider.website || "",
                // experience: provider.experience || "",
              }
            : undefined
        }
        darkMode={darkMode}
      />

      <SocialMediaModal
        isOpen={socialModalOpen}
        onClose={() => setSocialModalOpen(false)}
        onSubmit={handleSaveSocialMedia}
        initialData={
          provider
            ? {
                instagram: provider.instagram || "",
                facebook: provider.facebook || "",
                tiktok: provider.tiktok || "",
              }
            : undefined
        }
        darkMode={darkMode}
      />
    </VendorLayout>
  );
}
