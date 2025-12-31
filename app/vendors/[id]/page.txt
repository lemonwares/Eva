"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";
import {
  ArrowLeft,
  MapPin,
  Award,
  Star,
  Phone,
  Globe,
  Instagram,
  Facebook,
  CircleCheckBig,
  Calendar,
  MessageSquare,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Send,
  Clock,
  Currency,
} from "lucide-react";
import Header from "@/components/common/Header";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/common/Footer";
import FavoriteButton from "@/components/common/FavoriteButton";
import ShareButton from "@/components/common/ShareButton";
import VendorCard from "@/components/vendors/VendorCard";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import { useSearchParams, useRouter } from "next/navigation";

interface WeeklySchedule {
  id: string;
  providerId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isClosed: boolean;
}

interface Listing {
  id: string;
  headline: string;
  longDescription?: string;
  price?: number;
  timeEstimate?: string;
  coverImageUrl?: string;
  galleryUrls?: string[];
}

interface InquiryFormData {
  fromName: string;
  fromEmail: string;
  fromPhone: string;
  eventDate: string;
  guestsCount: string;
  budgetRange: string;
  message: string;
}

interface Provider {
  id: string;
  businessName: string;
  description?: string | null;
  categories: string[];
  subcategories?: string[];
  cultureTraditionTags?: string[];
  coverImage: string | null;
  photos: string[];
  isVerified: boolean;
  isFeatured: boolean;
  averageRating: number | null;
  reviewCount: number;
  city: string | null;
  address: string | null;
  postcode?: string;
  weeklySchedule?: WeeklySchedule[];
  serviceRadiusMiles?: number;
  priceFrom: number | null;
  phonePublic?: string | null;
  website?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  owner?: {
    id: string;
    name: string;
  };
  _count?: {
    reviews: number;
    bookings?: number;
  };
  teamMembers?: { name: string; image: string | null; id: string }[];
  geoLat?: number;
  geoLng?: number;
}

interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  authorName: string;
  createdAt: string;
  providerReply: string | null;
  author?: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

interface ScheduleDisplayProps {
  weeklySchedule: WeeklySchedule[];
  expanded: boolean;
  onToggle: () => void;
}

function ScheduleDisplay({
  weeklySchedule,
  expanded,
  onToggle,
}: ScheduleDisplayProps) {
  const days = [
    { name: "Monday", idx: 1 },
    { name: "Tuesday", idx: 2 },
    { name: "Wednesday", idx: 3 },
    { name: "Thursday", idx: 4 },
    { name: "Friday", idx: 5 },
    { name: "Saturday", idx: 6 },
    { name: "Sunday", idx: 0 },
  ];

  const now = new Date();
  // Remap JS getDay() (0=Sunday, 1=Monday, ...) to idx (1=Monday, ..., 0=Sunday)
  const jsDay = now.getDay();
  const currentDay = jsDay === 0 ? 0 : jsDay;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const parseTimeToMinutes = (t?: string) => {
    if (!t) return 0;
    const parts = t.split(":");
    const h = parseInt(parts[0] || "0", 10);
    const m = parseInt(parts[1] || "0", 10);
    return h * 60 + m;
  };

  // Find today's schedule
  const todaySched = weeklySchedule.find(
    (s) => s.dayOfWeek === currentDay && !s.isClosed
  );
  const openUntil = todaySched ? todaySched.endTime.slice(0, 5) : null;

  // Is open now?
  const isOpenNow = () => {
    if (!todaySched) return false;
    const start = parseTimeToMinutes(todaySched.startTime);
    const end = parseTimeToMinutes(todaySched.endTime);
    return nowMinutes >= start && nowMinutes <= end;
  };

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-accent" />
          <div className="text-left">
            <p className="font-semibold">
              {isOpenNow() ? (
                <span className="text-accent flex items-center gap-2">
                  Open until <span className="text-black">{openUntil}</span>
                </span>
              ) : (
                <span className="text-muted-foreground">Closed</span>
              )}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="schedule-list"
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: "0.75rem" }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden space-y-2"
          >
            {days.map((d) => {
              const sched = weeklySchedule.find((s) => s.dayOfWeek === d.idx);
              let dotClass = "bg-gray-300";
              let timeDisplay = "Closed";

              if (sched && !sched.isClosed) {
                const start = parseTimeToMinutes(sched.startTime);
                const end = parseTimeToMinutes(sched.endTime);
                // Format the time display
                timeDisplay = `${sched.startTime.slice(
                  0,
                  5
                )} - ${sched.endTime.slice(0, 5)}`;

                if (d.idx === currentDay) {
                  dotClass = nowMinutes > end ? "bg-red-500" : "bg-green-500";
                } else {
                  dotClass = "bg-green-500";
                }
              }

              return (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${dotClass}`} />
                    <span
                      className={`font-medium ${
                        d.idx === currentDay
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {d.name}
                    </span>
                  </div>
                  <div
                    className={`text-sm ${
                      sched && !sched.isClosed
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {timeDisplay}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Utility to truncate text to a max length with ellipsis
function truncate(str: string = "", max: number = 150) {
  if (!str) return "";
  return str.length > max ? str.slice(0, max) + "..." : str;
}

export default function VendorDetailPage() {
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [confettiDimensions, setConfettiDimensions] = useState({
    width: 0,
    height: 0,
  });
  const confettiRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setConfettiDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    if (searchParams) {
      if (searchParams.get("booking") === "success") {
        setShowSuccessModal(true);
      } else if (searchParams.get("booking") === "cancel") {
        setShowErrorModal(true);
      }
    }
  }, []);
  // Listings state
  const [listings, setListings] = useState<Listing[]>([]);
  const [isListingsLoading, setIsListingsLoading] = useState(true);
  // Ref for the Google Maps iframe section (must be first hook!)
  const mapRef = useRef<HTMLDivElement>(null);

  const params = useParams();
  const { data: session } = useSession();
  const [vendor, setVendor] = useState<Provider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [teamMembers, setTeamMembers] = useState<
    { id: string; name: string; imageUrl: string | null }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule[]>([]);
  const [scheduleExpanded, setScheduleExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [inquiryForm, setInquiryForm] = useState<InquiryFormData>({
    fromName: "",
    fromEmail: "",
    fromPhone: "",
    eventDate: "",
    guestsCount: "",
    budgetRange: "",
    message: "",
  });
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    eventDate: "",
    guests: "",
    eventLocation: "",
    notes: "",
  });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Recommendations state
  const [recommendations, setRecommendations] = useState<Provider[]>([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] =
    useState(false);

  function handleListingToggle(listingId: string) {
    setSelectedListings((prev) =>
      prev.includes(listingId)
        ? prev.filter((id) => id !== listingId)
        : [...prev, listingId]
    );
  }

  // Helper to get selected listing objects
  const selectedListingObjects = listings.filter((l) =>
    selectedListings.includes(l.id)
  );

  // Helper to get total price
  const totalSelectedPrice = selectedListingObjects.reduce(
    (sum, l) => sum + (l.price || 0),
    0
  );

  // Booking mobile scroll function
  const bookingRef = useRef<HTMLDivElement | null>(null);
  const handleBookClick = () => {
    setShowBookingForm(true);
  };

  // Scroll to booking form after it is shown on mobile
  useEffect(() => {
    if (showBookingForm && window.innerWidth <= 768 && bookingRef.current) {
      // Timeout ensures the form is rendered before scrolling
      setTimeout(() => {
        bookingRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [showBookingForm]);

  // Handler to select/deselect listings
  function handleListingSelect(listingId: string) {
    setSelectedListings((prev) =>
      prev.includes(listingId)
        ? prev.filter((id) => id !== listingId)
        : [...prev, listingId]
    );
  }

  // Handler for booking button
  async function handleMultiListingBooking(e: React.FormEvent) {
    e.preventDefault();

    if (selectedListings.length === 0) {
      alert("Please select at least one service to book.");
      return;
    }

    // Check if user is authenticated
    if (!session?.user) {
      saveBookingProgress();
      setShowAuthModal(true);
      return;
    }

    // Show the booking form
    setShowBookingForm(true);

    // Scroll to booking form on mobile
    if (window.innerWidth <= 768 && bookingRef.current) {
      setTimeout(() => {
        bookingRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }

  // Submit booking form
  const handleBookingFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError("");
    try {
      if (!vendor) throw new Error("Vendor not loaded");
      if (!session?.user) throw new Error("User not authenticated");
      // Build services array from selected listings
      const services = selectedListingObjects.map((l) => ({
        id: l.id,
        headline: l.headline,
        minPrice: l.price || 0,
        maxPrice: l.price || 0,
      }));
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: vendor.id,
          services,
          clientName: session.user.name || "",
          clientEmail: session.user.email || "",
          clientPhone: "", // phone not available on session.user, send empty string or collect in form if needed
          eventDate: bookingForm.eventDate,
          eventLocation: bookingForm.eventLocation,
          guestsCount: Number(bookingForm.guests),
          specialRequests: bookingForm.notes,
          paymentMode: "FULL_PAYMENT",
          pricingTotal: totalSelectedPrice,
        }),
      });
      if (res.status === 401) {
        saveBookingProgress();
        setShowAuthModal(true);
        setBookingLoading(false);
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Booking failed");
      }
      const data = await res.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setShowBookingForm(false);
      }
    } catch (err: any) {
      setBookingError(err.message || "Booking failed");
    }
    setBookingLoading(false);
  };

  // Auto-fill form when user is logged in
  useEffect(() => {
    if (session?.user) {
      setInquiryForm((prev) => ({
        ...prev,
        fromName: session.user.name || prev.fromName,
        fromEmail: session.user.email || prev.fromEmail,
      }));
    }
  }, [session]);

  useEffect(() => {
    if (params.id) {
      fetchVendor();
      fetchTeamMembers();
      fetchListings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function fetchListings() {
    setIsListingsLoading(true);
    try {
      const response = await fetch(`/api/providers/${params.id}/listings`);
      if (!response.ok) throw new Error("Failed to fetch listings");
      const data = await response.json();
      setListings(data.listings || []);
    } catch (err) {
      setListings([]);
    } finally {
      setIsListingsLoading(false);
    }
  }

  async function fetchTeamMembers() {
    try {
      const response = await fetch(
        `/api/admin/team-members?providerId=${params.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch team members");
      const data = await response.json();
      setTeamMembers(data.teamMembers || []);
    } catch (err) {
      setTeamMembers([]);
    }
  }

  async function fetchVendor() {
    try {
      const response = await fetch(`/api/providers/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch vendor");
      const data = await response.json();
      // API returns { provider: {...} }
      const providerData = data.provider || data;
      setVendor(providerData);

      // Set reviews from provider data (includes author information)
      if (providerData.reviews) {
        setReviews(providerData.reviews);
      }

      // console.log(`Data`, data);
      // console.log(`Vendor:`, vendor);
      // take weekly schedule from provider payload when available
      if (data.provider && data.provider.weeklySchedules) {
        setWeeklySchedule(data.provider.weeklySchedules);
      } else if (data.weeklySchedules) {
        setWeeklySchedule(data.weeklySchedules);
      } else {
        setWeeklySchedule([]);
      }
    } catch (err) {
      console.error("Error fetching vendor:", err);
      setWeeklySchedule([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleInquirySubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: vendor?.id,
          fromName: inquiryForm.fromName,
          fromEmail: inquiryForm.fromEmail,
          fromPhone: inquiryForm.fromPhone || null,
          eventDate: inquiryForm.eventDate || null,
          guestsCount: inquiryForm.guestsCount
            ? parseInt(inquiryForm.guestsCount)
            : null,
          budgetRange: inquiryForm.budgetRange || null,
          message: inquiryForm.message,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send inquiry");
      }

      setSubmitSuccess(true);
      setInquiryForm({
        fromName: "",
        fromEmail: "",
        fromPhone: "",
        eventDate: "",
        guestsCount: "",
        budgetRange: "",
        message: "",
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function closeInquiryModal() {
    setShowInquiryForm(false);
    setSubmitSuccess(false);
    setSubmitError("");
  }

  const formatCategories = (cats?: string[]) => {
    if (!cats || cats.length === 0) return "";
    return cats
      .filter(Boolean)
      .map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase())
      .join(", ");
  };

  const images = vendor
    ? ([vendor.coverImage, ...vendor.photos].filter(Boolean) as string[])
    : [];

  // Save booking progress to localStorage
  function saveBookingProgress() {
    if (!vendor) return;
    const progress = {
      vendorId: vendor.id,
      selectedListings,
      bookingForm,
    };
    localStorage.setItem("eva_booking_progress", JSON.stringify(progress));
  }

  // Restore booking progress from localStorage
  function restoreBookingProgress() {
    // Only restore if user is authenticated and vendor is loaded
    if (session?.user && vendor) {
      const raw = localStorage.getItem("eva_booking_progress");
      if (raw) {
        try {
          const progress = JSON.parse(raw);
          if (progress.vendorId === vendor.id) {
            setSelectedListings(progress.selectedListings || []);
            setBookingForm(
              progress.bookingForm || {
                eventDate: "",
                guests: "",
                eventLocation: "",
                notes: "",
              }
            );
            setShowBookingForm(true);
          }
        } catch {}
        localStorage.removeItem("eva_booking_progress");
      }
    }
  }

  useEffect(() => {
    restoreBookingProgress();
    // Fetch recommendations if we have geocodes OR address information
    if (
      vendor &&
      ((vendor.geoLat && vendor.geoLng) || vendor.city || vendor.address)
    ) {
      fetchRecommendations();
    }
    // eslint-disable-next-line
  }, [vendor?.id]);

  async function fetchRecommendations() {
    if (!vendor) return;

    setIsRecommendationsLoading(true);
    try {
      const params = new URLSearchParams({
        excludeId: vendor.id,
        limit: "4",
      });

      // Try geocode-based recommendations first
      if (vendor.geoLat && vendor.geoLng) {
        params.set("lat", vendor.geoLat.toString());
        params.set("lng", vendor.geoLng.toString());
      } else {
        // Fallback to address-based recommendations
        if (vendor.city) {
          params.set("city", vendor.city);
        }
        if (vendor.address) {
          params.set("address", vendor.address);
        }
      }

      const res = await fetch(
        `/api/providers/recommendations?${params.toString()}`
      );
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data.providers || []);
      }
    } catch (err) {
      console.error("Failed to fetch recommendations", err);
    } finally {
      setIsRecommendationsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Vendor Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The vendor you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/vendors"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground hover:opacity-90 transition"
          >
            <ArrowLeft size={18} />
            Back to Vendors
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Open Google Maps with vendor address
  const handleGetDirectionsClick = () => {
    if (!vendor) return;
    const addressParts = [
      vendor.address,
      vendor.postcode,
      vendor.city,
      "England",
    ];
    const address = addressParts.filter(Boolean).join(", ");
    if (!address) return;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      address
    )}`;
    window.open(mapsUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Booking Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-white rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center">
            <div
              ref={confettiRef}
              style={{ position: "absolute", inset: 0, zIndex: 1 }}
            >
              <Confetti
                width={confettiDimensions.width}
                height={confettiDimensions.height}
                numberOfPieces={300}
                recycle={false}
              />
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-green-600 mb-4">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="12" fill="#D1FAE5" />
                  <path
                    d="M7 13l3 3 7-7"
                    stroke="#059669"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h2 className="text-2xl font-bold mb-2">Booking Successful!</h2>
              <p className="mb-4 text-center">
                Your payment was received and your booking is confirmed. Thank
                you for booking with {vendor?.businessName}!
              </p>
              <button
                className="px-6 py-3 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition"
                onClick={() => {
                  setShowSuccessModal(false);
                  if (typeof window !== "undefined") {
                    const url = new URL(window.location.href);
                    url.searchParams.delete("booking");
                    window.history.replaceState(
                      {},
                      document.title,
                      url.pathname + url.search
                    );
                  }
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Booking Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-white rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center">
            <span className="text-red-600 mb-4">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" fill="#FEE2E2" />
                <path
                  d="M15 9l-6 6M9 9l6 6"
                  stroke="#DC2626"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h2 className="text-2xl font-bold mb-2">Payment Cancelled</h2>
            <p className="mb-4 text-center">
              Your payment was not completed. Please try again to confirm your
              booking.
            </p>
            <button
              className="px-6 py-3 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition"
              onClick={() => {
                setShowErrorModal(false);
                if (typeof window !== "undefined") {
                  const url = new URL(window.location.href);
                  url.searchParams.delete("booking");
                  window.history.replaceState(
                    {},
                    document.title,
                    url.pathname + url.search
                  );
                }
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Header />

      <section className="max-w-7xl mx-auto px-4 mt-24">
        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="flex-1">
            {/* Back Link */}
            <Link
              href="/vendors"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition mb-6"
            >
              <ArrowLeft size={18} />
              Back to Vendors
            </Link>

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                    {vendor.businessName}
                    <FavoriteButton providerId={vendor.id} />
                    <ShareButton
                      title={vendor.businessName}
                      url={`${
                        typeof window !== "undefined"
                          ? window.location.origin
                          : ""
                      }/vendors/${vendor.id}`}
                    />
                  </h1>
                  {vendor.isVerified && (
                    <div className="flex items-center gap-1 text-accent">
                      <Award size={20} />
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {formatCategories(vendor.categories)}
                  </span>
                  {vendor.address && (
                    <span className="flex items-center gap-1">
                      <MapPin size={16} />
                      {vendor.address}, {vendor.city}
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    <Star
                      size={16}
                      className="text-accent"
                      fill="currentColor"
                    />
                    <span className="font-medium text-foreground">
                      {vendor.averageRating?.toFixed(1) || "New"}
                    </span>
                    <span>({vendor._count?.reviews || 0} reviews)</span>
                  </div>
                  <div
                    className="text-accent hover:cursor-pointer"
                    onClick={handleGetDirectionsClick}
                  >
                    Get Directions
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero / Gallery */}
      <section className="relative min-h-50">
        {/* Desktop: grid gallery, Mobile: carousel */}
        {images.length > 0 ? (
          <>
            <div className="hidden md:grid grid-cols-3 gap-4 max-w-7xl mx-auto h-[450px] mb-8">
              <div className="col-span-2 border border-gray-300 rounded-2xl h-full overflow-hidden">
                <Image
                  src={images[0]}
                  onClick={() => {
                    setShowImagesModal(true);
                  }}
                  alt="Vendor main"
                  width={900}
                  height={300}
                  unoptimized={true}
                  className="object-cover w-full h-full rounded-2xl shadow-lg hover:cursor-pointer"
                  style={{ height: "100%", width: "100%" }}
                  sizes="(max-width: 1200px) 100vw, 900px"
                  priority
                />
              </div>
              <div className="flex flex-col gap-4 h-full">
                {images.slice(1, 3).map((img, idx) => {
                  const isLast = idx === 1 && images.length > 3;
                  return (
                    <div
                      key={idx}
                      className="h-1/2 w-full rounded-2xl border border-gray-300 shadow overflow-hidden relative"
                    >
                      <Image
                        src={img}
                        alt={`Vendor side ${idx + 1}`}
                        fill
                        unoptimized={true}
                        sizes="(max-width: 1200px) 100vw, 450px"
                        className="object-cover rounded-2xl"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setShowImagesModal(true);
                          setModalImageIndex(idx + 1);
                        }}
                      />
                      {isLast && (
                        <button
                          className="absolute bottom-3 right-0 -translate-x-1/2 bg-gray-400/50 hover:transition-all duration-300 hover:cursor-pointer text-accent-foreground px-4 py-2 rounded-full font-medium shadow hover:underline"
                          onClick={() => {
                            setShowImagesModal(true);
                            setModalImageIndex(0);
                          }}
                        >
                          See all images
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Mobile: carousel */}
            <div
              className="md:hidden flex items-center justify-center mb-8"
              style={{ width: "100%" }}
            >
              <div
                style={{
                  width: "92vw",
                  aspectRatio: "16/9",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "1rem",
                  background: "#f3f4f6",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIndex}
                    src={images[activeImageIndex]}
                    alt="Vendor"
                    className="object-cover w-full h-full"
                    style={{
                      borderRadius: "1rem",
                      display: "block",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </AnimatePresence>
                {/* Carousel navigation inside image */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev === 0 ? images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition z-10"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev === images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition z-10"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
                {/* Dots */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition ${
                          index === activeImageIndex
                            ? "bg-background w-6"
                            : "bg-background/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="md:hidden h-64 bg-muted rounded-2xl mb-8" />
        )}
        {/* See all images modal (desktop only) */}
        {showImagesModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col">
            <div className="relative flex flex-col w-full h-full max-h-screen bg-background rounded-none p-0 md:p-8 shadow-xl overflow-y-auto">
              <button
                onClick={() => setShowImagesModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition z-50"
                aria-label="Close"
              >
                <X size={28} />
              </button>
              <div className="w-full max-w-5xl mx-auto flex flex-col items-center pt-12 md:pt-16 px-4 md:px-0">
                <div className="w-full ">
                  <h2 className="text-4xl max-md:text-3xl font-bold mb-1">
                    Image gallery
                  </h2>
                  <p className="text-muted-foreground mb-6 text-2xl max-md:text-lg">
                    {vendor?.businessName}
                  </p>
                </div>
                {/* Large image at the top, full width */}
                {images[0] && (
                  <div className="w-full mb-8">
                    <Image
                      src={images[0]}
                      alt="Gallery main image"
                      width={1200}
                      height={500}
                      unoptimized={true}
                      className="object-cover w-full h-[350px] md:h-[400px] rounded-2xl shadow-lg"
                      style={{ background: "#f3f4f6" }}
                    />
                  </div>
                )}
                {/* Grid of smaller images below, 2 columns */}
                <div className="w-full overflow-y-auto pb-8">
                  <div className="grid grid-cols-2 gap-6">
                    {images.slice(1).map((img, idx) => (
                      <div key={idx} className="relative">
                        <Image
                          src={img}
                          alt={`Gallery image ${idx + 2}`}
                          width={600}
                          height={350}
                          unoptimized={true}
                          className="object-cover w-full h-[200px] md:h-[250px] rounded-2xl shadow"
                          style={{ background: "#f3f4f6" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1">
            {/* Services */}
            {vendor.subcategories && vendor.subcategories.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4">Services</h2>
                <div className="flex flex-wrap gap-2">
                  {vendor.subcategories.map((service, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full bg-muted text-sm font-medium"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Specializations & Listings */}
            {(vendor.cultureTraditionTags?.length || 0) > 0 && (
              <div className="mb-12">
                {/* <h2 className="text-xl font-semibold mb-4">Specializations</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {vendor.cultureTraditionTags?.map((tag, index) => {
                    const capTag =
                      tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
                    return (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium"
                      >
                        {capTag}
                      </span>
                    );
                  })}
                </div> */}
                {/* Listings Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Services & Packages
                  </h3>
                  {isListingsLoading ? (
                    <p className="text-muted-foreground">Loading listings...</p>
                  ) : listings.length === 0 ? (
                    <p className="text-muted-foreground">
                      No listings available.
                    </p>
                  ) : (
                    <form
                      onSubmit={handleMultiListingBooking}
                      className="space-y-4"
                    >
                      <ul className="space-y-4">
                        {listings.map((listing) => {
                          const isSelected = selectedListings.includes(
                            listing.id
                          );
                          return (
                            <li
                              key={listing.id}
                              className="border rounded-lg p-4 flex items-center gap-4 bg-white"
                            >
                              {listing.coverImageUrl && (
                                <Image
                                  width={80}
                                  height={80}
                                  loading="lazy"
                                  src={listing.coverImageUrl}
                                  alt="Cover"
                                  className="w-20 h-20 object-cover object-center rounded-md border"
                                />
                              )}
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-gray-900">
                                    {listing.headline}
                                  </h4>
                                </div>
                                <div className="text-gray-700 mt-1 text-[14px]">
                                  {truncate(listing.longDescription, 150)}
                                </div>
                                <div className="text-gray-500 text-sm mt-2 flex gap-4">
                                  <span className="flex items-center gap-1">
                                    <span className="inline-flex items-center gap-1 font-medium text-accent">
                                      {/* Lucide DollarSign icon for price */}
                                      <Currency
                                        size={16}
                                        className="inline-block align-middle"
                                      />
                                      {listing.price ? (
                                        formatCurrency(listing.price)
                                      ) : (
                                        <span className="text-gray-400">
                                          Not listed
                                        </span>
                                      )}
                                    </span>
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <span className="inline-flex items-center gap-1 font-medium text-black">
                                      {/* Time SVG icon */}
                                      <svg
                                        width="16"
                                        height="16"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="inline-block align-middle"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 8v4l3 1m6-1a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                      </svg>
                                      {listing.timeEstimate ? (
                                        listing.timeEstimate
                                      ) : (
                                        <span className="text-gray-400">
                                          No estimate
                                        </span>
                                      )}
                                    </span>
                                  </span>
                                </div>
                                {listing.galleryUrls &&
                                  listing.galleryUrls.length > 0 && (
                                    <div className="flex gap-2 mt-2">
                                      {listing.galleryUrls
                                        .slice(0, 3)
                                        .map((url, i) => (
                                          <Image
                                            key={i}
                                            width={48}
                                            height={48}
                                            loading="lazy"
                                            src={url}
                                            alt="Gallery"
                                            className="w-12 h-12 object-cover rounded border"
                                          />
                                        ))}
                                    </div>
                                  )}
                              </div>
                              <div>
                                {!isSelected ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleListingToggle(listing.id)
                                    }
                                    className="text-accent text-[14px] font-bold hover:underline hover:cursor-pointer transition"
                                  >
                                    Book Now
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleListingToggle(listing.id)
                                    }
                                    className="px-4 py-2 rounded-full text-accent flex items-center justify-center"
                                    title="Deselect"
                                  >
                                    <CircleCheckBig />
                                  </button>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>

                      {/* Show booking button when listings are selected */}
                      {selectedListings.length > 0 && (
                        <div className="mt-6 p-4 border rounded-lg bg-accent/5">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold">
                              {selectedListings.length} service
                              {selectedListings.length > 1 ? "s" : ""} selected
                            </span>
                            <span className="font-bold text-lg">
                              Total: {formatCurrency(totalSelectedPrice)}
                            </span>
                          </div>
                          <button
                            type="submit"
                            className="w-full py-3 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
                          >
                            <Calendar size={18} />
                            Book Selected Services
                          </button>
                        </div>
                      )}
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* Services */}
            {(vendor.subcategories?.length || 0) > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4">Services</h2>
                <div className="flex flex-wrap gap-2">
                  {vendor.subcategories?.map((service, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full bg-muted text-sm font-medium"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold   mb-4">
                Reviews ({vendor._count?.reviews || 0})
              </h2>

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-6 rounded-2xl border border-border"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted border overflow-hidden">
                          {review.author?.avatar ? (
                            <Image
                              src={review.author.avatar}
                              alt={review.authorName}
                              width={48}
                              height={48}
                              unoptimized={true}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                // Fallback to default avatar if user avatar fails to load
                                const target = e.target as HTMLImageElement;
                                target.src = "/images/default-avatar.svg";
                                target.onerror = null; // Prevent infinite loop
                              }}
                            />
                          ) : (
                            // Default dummy profile image
                            <Image
                              src="/images/default-avatar.svg"
                              alt="Default profile"
                              width={48}
                              height={48}
                              unoptimized={true}
                              className="object-cover w-full h-full"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{review.authorName}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className="text-accent"
                                  fill="currentColor"
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      {review.title && (
                        <p className="font-semibold mb-2">{review.title}</p>
                      )}
                      <p className="text-muted-foreground">{review.body}</p>
                      {review.providerReply && (
                        <div className="mt-4 p-4 rounded-lg bg-muted">
                          <p className="text-sm font-semibold mb-1">
                            Response from {vendor.businessName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {review.providerReply}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </div>

            {/* Team members */}
            {/* Team Members Section - show if teamMembers exist and not empty */}
            {teamMembers && teamMembers.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4">Team Members</h2>
                <div className="flex flex-wrap gap-6">
                  {teamMembers.map((member) => {
                    const hasImage =
                      member.imageUrl &&
                      typeof member.imageUrl === "string" &&
                      member.imageUrl.trim() !== "";

                    return (
                      <div
                        key={member.id}
                        className="flex flex-col items-center w-24"
                      >
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border overflow-hidden mb-2">
                          {hasImage ? (
                            <Image
                              src={member.imageUrl!}
                              alt={member.name}
                              width={80}
                              unoptimized={true}
                              height={80}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-3xl font-bold text-accent">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-medium text-center truncate w-full">
                          {member.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description */}
            {vendor.description && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {showFullDescription || vendor.description.length <= 300
                    ? vendor.description
                    : vendor.description.slice(0, 300) + "..."}
                </p>
                {vendor.description.length > 300 && (
                  <button
                    className="mt-2 text-accent text-[14px] font-medium hover:underline hover:cursor-pointer focus:outline-none"
                    onClick={() => setShowFullDescription((prev) => !prev)}
                  >
                    {showFullDescription ? "Show less" : "Read more"}
                  </button>
                )}
                {/* Google Maps Embed */}
                <div
                  ref={mapRef}
                  className="mt-6 rounded-lg overflow-hidden"
                  style={{ height: "350px" }}
                >
                  {(() => {
                    const parts = [];
                    if (vendor.address) parts.push(vendor.address);
                    if (vendor.postcode) parts.push(vendor.postcode);
                    if (vendor.city) parts.push(vendor.city);
                    parts.push("England");
                    const mapQuery = parts.filter(Boolean).join(", ");
                    return mapQuery ? (
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{
                          border: "1px solid gray",
                          overflow: "hidden",
                          borderRadius: "5px",
                        }}
                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                          mapQuery
                        )}&hl=en&z=15&output=embed`}
                        allowFullScreen
                        aria-hidden="false"
                        tabIndex={0}
                        title="Google Map Location"
                      />
                    ) : null;
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-96">
            <div className="sticky top-24 p-6 rounded-2xl border border-border bg-card shadow-lg">
              {/* Price */}
              {selectedListings.length === 0 && (
                <>
                  {vendor.priceFrom && (
                    <div className="mb-6">
                      <p className="text-sm text-muted-foreground">
                        Starting from
                      </p>
                      <p className="text-3xl font-bold">
                        {formatCurrency(vendor.priceFrom)}
                      </p>
                    </div>
                  )}

                  {/* CTA */}
                  <button
                    onClick={() => setShowInquiryForm(true)}
                    className="w-full py-4 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition mb-4"
                  >
                    <MessageSquare className="inline-block mr-2" size={18} />
                    Send Inquiry
                  </button>

                  {/* Contact Info */}
                  <div className="space-y-4 pt-6 border-t border-border">
                    {vendor.phonePublic && (
                      <a
                        href={`tel:${vendor.phonePublic}`}
                        className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition"
                      >
                        <Phone size={18} />
                        <span>{vendor.phonePublic}</span>
                      </a>
                    )}
                    {vendor.website && (
                      <a
                        href={vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition"
                      >
                        <Globe size={18} />
                        <span>Visit Website</span>
                      </a>
                    )}
                  </div>

                  {/* Weekly Schedule */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Clock size={18} className="text-accent" /> Weekly
                      Schedule
                    </h3>

                    <ScheduleDisplay
                      weeklySchedule={weeklySchedule}
                      expanded={scheduleExpanded}
                      onToggle={() => setScheduleExpanded((s) => !s)}
                    />
                  </div>

                  {/* Social Media */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="font-semibold mb-2">Social Media</h3>
                    <div className="space-y-2">
                      {vendor.instagram && (
                        <a
                          href={`https://instagram.com/${vendor.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition"
                        >
                          <Instagram size={18} />
                          <span>@{vendor.instagram}</span>
                        </a>
                      )}
                      {vendor.facebook && (
                        <a
                          href={vendor.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition"
                        >
                          <Facebook size={18} />
                          <span>Facebook</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="font-semibold mb-2">Service Area</h3>
                    <p className="text-muted-foreground">
                      {vendor.city || vendor.postcode} •{" "}
                      {vendor.serviceRadiusMiles} miles radius
                    </p>
                  </div>
                </>
              )}
              {selectedListings.length > 0 && !showBookingForm && (
                <div
                  ref={bookingRef}
                  className="flex flex-col mt-6 p-4 border rounded-lg bg-white"
                >
                  <h3 className="text-lg font-bold mb-4">Selected Listings</h3>
                  <ul className="mb-4">
                    {selectedListingObjects.map((l) => (
                      <li
                        key={l.id}
                        className="flex justify-between py-2 border-b"
                      >
                        <span>{l.headline}</span>
                        <span>{l.price ? formatCurrency(l.price) : "-"}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className="w-full py-4 rounded-full bg-black text-white font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleBookClick}
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>Book ({formatCurrency(totalSelectedPrice)})</>
                    )}
                  </button>
                </div>
              )}

              {/* Booking form modal/section */}
              {showBookingForm && (
                <div ref={bookingRef}>
                  <h3 className="text-lg font-bold mb-4">Booking Details</h3>
                  {bookingError && (
                    <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-700 text-sm">
                      {bookingError}
                    </div>
                  )}
                  <form
                    onSubmit={handleBookingFormSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Event Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingForm.eventDate}
                        onChange={(e) =>
                          setBookingForm((f) => ({
                            ...f,
                            eventDate: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 rounded-xl border border-border bg-input focus:border-accent focus:ring-2 focus:ring-accent/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Guests <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        value={bookingForm.guests}
                        onChange={(e) =>
                          setBookingForm((f) => ({
                            ...f,
                            guests: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 rounded-xl border border-border bg-input focus:border-accent focus:ring-2 focus:ring-accent/30"
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Event Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingForm.eventLocation}
                        onChange={(e) =>
                          setBookingForm((f) => ({
                            ...f,
                            eventLocation: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 rounded-xl border border-border bg-input focus:border-accent focus:ring-2 focus:ring-accent/30"
                        placeholder="Venue, address, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Notes <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={bookingForm.notes}
                        onChange={(e) =>
                          setBookingForm((f) => ({
                            ...f,
                            notes: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 rounded-xl border border-border bg-input focus:border-accent focus:ring-2 focus:ring-accent/30 resize-none"
                        placeholder="Any special requests or info..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={bookingLoading || isBooking}
                      className="w-full py-4 rounded-full bg-black text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {bookingLoading ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Processing...
                        </>
                      ) : isBooking ? (
                        "Processing..."
                      ) : (
                        "Proceed to Payment"
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      {showInquiryForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-background p-6 shadow-xl">
            <button
              onClick={closeInquiryModal}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition"
            >
              <X size={20} />
            </button>

            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <Send className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Inquiry Sent!</h3>
                <p className="text-muted-foreground mb-6">
                  Your message has been sent to {vendor.businessName}. They'll
                  get back to you soon.
                </p>
                <button
                  onClick={closeInquiryModal}
                  className="px-6 py-3 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-2">
                  Contact {vendor.businessName}
                </h3>
                <p className="text-muted-foreground mb-6">
                  Fill out the form below and the vendor will respond to your
                  inquiry.
                </p>

                {submitError && (
                  <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-700 text-sm">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={inquiryForm.fromName}
                        onChange={(e) =>
                          setInquiryForm({
                            ...inquiryForm,
                            fromName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-border bg-input focus:border-accent focus:ring-2 focus:ring-accent/30"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={inquiryForm.fromEmail}
                        onChange={(e) =>
                          setInquiryForm({
                            ...inquiryForm,
                            fromEmail: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-border bg-input focus:border-accent focus:ring-2 focus:ring-accent/30"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={inquiryForm.fromPhone}
                        onChange={(e) =>
                          setInquiryForm({
                            ...inquiryForm,
                            fromPhone: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-border bg-input focus:border-accent focus:ring-2 focus:ring-accent/30"
                        placeholder="+44 7XXX XXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Event Date
                      </label>
                      <input
                        type="date"
                        value={inquiryForm.eventDate}
                        onChange={(e) =>
                          setInquiryForm({
                            ...inquiryForm,
                            eventDate: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-border bg-input focus:border-accent focus:ring-2 focus:ring-accent/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Expected Guests
                      </label>
                      <input
                        type="number"
                        value={inquiryForm.guestsCount}
                        onChange={(e) =>
                          setInquiryForm({
                            ...inquiryForm,
                            guestsCount: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-border bg-input focus:border-accent focus:ring-2 focus:ring-accent/30"
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Budget Range
                      </label>
                      <select
                        value={inquiryForm.budgetRange}
                        onChange={(e) =>
                          setInquiryForm({
                            ...inquiryForm,
                            budgetRange: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-border bg-input focus:border-accent focus:ring-2 focus:ring-accent/30"
                      >
                        <option value="">Select budget</option>
                        <option value={`Under ${formatCurrency(1000)}`}>
                          Under {formatCurrency(1000)}
                        </option>
                        <option
                          value={`${formatCurrency(1000)} - ${formatCurrency(
                            2500
                          )}`}
                        >
                          {`${formatCurrency(1000)} - ${formatCurrency(2500)}`}
                        </option>
                        <option
                          value={`${formatCurrency(2500)} - ${formatCurrency(
                            5000
                          )}`}
                        >
                          {`${formatCurrency(2500)} - ${formatCurrency(5000)}`}
                        </option>
                        <option
                          value={`${formatCurrency(5000)} - ${formatCurrency(
                            10000
                          )}`}
                        >
                          {`${formatCurrency(5000)} - ${formatCurrency(10000)}`}
                        </option>
                        <option value={`Over ${formatCurrency(10000)}`}>
                          Over {formatCurrency(10000)}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={inquiryForm.message}
                      onChange={(e) =>
                        setInquiryForm({
                          ...inquiryForm,
                          message: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-border bg-input focus:border-accent focus:ring-2 focus:ring-accent/30 resize-none"
                      placeholder="Tell the vendor about your event, any specific requirements, or questions you have..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Inquiry
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-2">Sign in required</h2>
            <p className="mb-4">
              You need to sign in to complete your booking. Your progress will
              be saved and restored after login.
            </p>
            <button
              className="w-full bg-accent text-white py-2 rounded hover:bg-accent-dark transition"
              onClick={() => {
                window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent(
                  window.location.pathname
                )}`;
              }}
            >
              Sign in
            </button>
            <button
              className="w-full mt-2 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
              onClick={() => setShowAuthModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <section className="bg-muted/30 py-16 border-t border-border">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Similar Vendors</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((rec) => (
                <VendorCard key={rec.id} vendor={rec} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
