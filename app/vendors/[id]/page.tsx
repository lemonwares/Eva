"use client";

interface WeeklySchedule {
  id: string;
  providerId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isClosed: boolean;
}

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";
import BookingModal, {
  BookingService,
} from "@/components/vendor/modals/BookingModal";
import {
  ArrowLeft,
  MapPin,
  Award,
  Star,
  Phone,
  Globe,
  Instagram,
  Facebook,
  Calendar,
  MessageSquare,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Send,
  Clock,
} from "lucide-react";
import Header from "@/components/common/Header";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/common/Footer";
import FavoriteButton from "@/components/common/FavoriteButton";
import ShareButton from "@/components/common/ShareButton";
import Image from "next/image";

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
  description: string | null;
  categories: string[];
  subcategories: string[];
  cultureTraditionTags: string[];
  coverImage: string | null;
  photos: string[];
  isVerified: boolean;
  isFeatured: boolean;
  averageRating: number | null;
  reviewCount: number;
  city: string | null;
  address: string | null;
  postcode: string;
  weeklySchedule: WeeklySchedule[];
  serviceRadiusMiles: number;
  priceFrom: number | null;
  phonePublic: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  owner: {
    id: string;
    name: string;
  };
  _count: {
    reviews: number;
    bookings: number;
  };
  teamMembers: { name: string; image: string | null; id: string }[];
}

interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  authorName: string;
  createdAt: string;
  providerReply: string | null;
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

export default function VendorDetailPage() {
  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const params = useParams();
  const { data: session } = useSession();
  const [vendor, setVendor] = useState<Provider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [listings, setListings] = useState<BookingService[]>([]);
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
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingPrefill, setBookingPrefill] = useState<BookingService[]>([]);


  // Auto-fill form when user is logged in
  useEffect(() => {
    if (session?.user) {
      setInquiryForm((prev: InquiryFormData) => ({
        ...prev,
        fromName: session.user.name || prev.fromName,
        fromEmail: session.user.email || prev.fromEmail,
      }));
    }
  }, [session]);



  async function fetchListings() {
    try {
      const response = await fetch(`/api/listings?providerId=${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch listings");
      const data = await response.json();
      setListings(
        (data.listings || []).map((l: any) => ({
          id: l.id,
          headline: l.headline,
          minPrice: l.minPrice,
          maxPrice: l.maxPrice,
        }))
      );
    } catch (err) {
      console.error("Error fetching listings:", err);
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
      setVendor(data.provider || data);

      // console.log(`Data`, data);
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

  async function fetchReviews() {
    try {
      const response = await fetch(
        `/api/reviews?providerId=${params.id}&approved=true&limit=5`
      );
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
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
  useEffect(() => {
    if (params.id) {
      fetchVendor();
      fetchReviews();
      fetchListings();
      fetchTeamMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  // Booking modal handlers
  const handleBookService = (service: BookingService) => {
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
    if (!Array.isArray(listings) || listings.length === 0) return;
    setBookingPrefill(
      listings.map((s: BookingService) => ({
        id: s.id,
        headline: s.headline,
        minPrice: s.minPrice,
        maxPrice: s.maxPrice,
      }))
    );
    setBookingModalOpen(true);
  };

  const [bookingStatus, setBookingStatus] = useState<
    null | "success" | "error" | "loading"
  >(null);
  const [bookingError, setBookingError] = useState<string>("");

  const handleBookingSubmit = async (selected: BookingService[]) => {
    if (!vendor) return;
    setBookingStatus("loading");
    setBookingError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: vendor.id,
          services: selected,
          clientName: session?.user?.name || "",
          clientEmail: session?.user?.email || "",
          clientPhone: "",
          eventDate: "", // You may want to collect this from user
          eventLocation: "",
          guestsCount: null,
          specialRequests: "",
          paymentMode: "FULL_PAYMENT",
          pricingTotal: selected.reduce((sum, s) => sum + (s.minPrice || 0), 0),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setBookingStatus("error");
        setBookingError(data.message || "Failed to create booking");
        return;
      }
      setBookingStatus("success");
      setBookingModalOpen(false);
    } catch (err) {
      setBookingStatus("error");
      setBookingError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  };

  function closeInquiryModal() {
    setShowInquiryForm(false);
    setSubmitSuccess(false);
    setSubmitError("");
  }

  const images = vendor
    ? ([vendor.coverImage, ...vendor.photos].filter(Boolean) as string[])
    : [];

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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero / Gallery */}
      <section className="relative pt-20">
        {images.length > 0 ? (
          <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-500"
              style={{ backgroundImage: `url(${images[activeImageIndex]})` }}
            />
            <div className="absolute inset-0 bg-foreground/30" />
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev: number) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 hover:bg-background transition"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev: number) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 hover:bg-background transition"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            {/* Image Indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
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
        ) : (
          <div className="h-64 bg-muted" />
        )}
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
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
                  <h1 className="text-3xl md:text-4xl font-bold">
                    {vendor.businessName}
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
                    {vendor.categories.join(", ")}
                  </span>
                  {vendor.city && (
                    <span className="flex items-center gap-1">
                      <MapPin size={16} />
                      {vendor.city}
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
                  <div className="text-accent hover:cursor-pointer">
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
                  alt="Vendor main"
                  width={900}
                  height={300}
                  unoptimized={true}
                  className="object-cover w-full h-full rounded-2xl shadow-lg"
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
                          className="absolute bottom-3 right-0 -translate-x-1/2 bg-gray-400/60 hover:transition-all duration-300 hover:cursor-pointer text-accent-foreground px-4 py-2 rounded-full font-medium shadow hover:underline"
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
            <div className="relative flex flex-col w-full h-full max-h-screen bg-background rounded-none md:rounded-2xl p-0 md:p-8 shadow-xl overflow-y-auto">
              <button
                onClick={() => setShowImagesModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition z-50"
                aria-label="Close"
              >
                <X size={28} />
              </button>
              <div className="w-full max-w-5xl mx-auto flex flex-col items-center pt-12 md:pt-16 px-4 md:px-0">
                <h2 className="text-3xl font-bold mb-1">Image gallery</h2>
                <p className="text-muted-foreground mb-6 text-lg">
                  {vendor?.businessName}
                </p>
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
            {/* Description */}
            {vendor.description && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {vendor.description}
                </p>
                {/* Google Maps Embed */}
                <div
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

            {/* Services */}
            {listings.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4">
                  Services & Packages
                </h2>
                {/* Category Tabs (below section title) */}
                {vendor.categories && vendor.categories.length > 1 && (
                  <div className="flex gap-2 mb-6">
                    <button
                      className={`px-4 py-1.5 rounded-lg font-medium border transition-colors ${
                        selectedCategory === "all"
                          ? "bg-accent text-white border-accent"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                      onClick={() => setSelectedCategory("all")}
                    >
                      All
                    </button>
                    {vendor.categories.map((cat: string) => (
                      <button
                        key={cat}
                        className={`px-4 py-1.5 rounded-lg font-medium border transition-colors ${
                          selectedCategory === cat
                            ? "bg-accent text-white border-accent"
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
                {(() => {
                  // Filter listings by selected category
                  let filteredListings = listings;
                  if (
                    selectedCategory !== "all" &&
                    vendor.categories.includes(selectedCategory)
                  ) {
                    // If listings had category info, filter here. For now, show all for 'all'.
                    // If you add category info to listings, filter by it here.
                  }
                  return filteredListings.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <p>No services listed yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredListings.map((listing: BookingService) => (
                        <div
                          key={listing.id}
                          className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-accent/50 transition-colors group flex flex-col gap-2"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {listing.headline}
                              </h4>
                              {/* Add description if available */}
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                              <button
                                onClick={() => handleBookService(listing)}
                                className="mt-2 px-4 py-1.5 rounded bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors"
                              >
                                Book
                              </button>
                            </div>
                          </div>
                          <p className="text-accent font-bold text-lg">
                            {listing.minPrice
                              ? `${formatCurrency(listing.minPrice)}${
                                  listing.maxPrice
                                    ? ` - ${formatCurrency(listing.maxPrice)}`
                                    : "+"
                                }`
                              : "Price on request"}
                          </p>
                        </div>
                      ))}
                      <button
                        onClick={handleBookMultiple}
                        className="w-full mt-4 py-2 rounded-lg bg-accent/10 text-accent font-semibold hover:bg-accent/20 transition-colors"
                      >
                        Book Multiple Services
                      </button>
                      {/* Booking Modal */}
                      <BookingModal
                        isOpen={bookingModalOpen}
                        onClose={() => setBookingModalOpen(false)}
                        services={bookingPrefill}
                        onBook={handleBookingSubmit}
                        darkMode={false}
                      />
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Culture Tags */}
            {vendor.cultureTraditionTags.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4">Specializations</h2>
                <div className="flex flex-wrap gap-2">
                  {vendor.cultureTraditionTags.map(
                    (tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium"
                      >
                        {tag}
                      </span>
                    )
                  )}
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
                  {reviews.map((review: Review) => (
                    <div
                      key={review.id}
                      className="p-6 rounded-2xl border border-border"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold">
                          {review.authorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold">{review.authorName}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(review.rating)].map((_, i: number) => (
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
                  {teamMembers.map((member, idx) => {
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
          </div>

          {/* Sidebar */}
          <div className="lg:w-96">
            <div className="sticky top-24 p-6 rounded-2xl border border-border bg-card shadow-lg">
              {/* Price */}
              {vendor.priceFrom && (
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">Starting from</p>
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
                  <Clock size={18} className="text-accent" /> Weekly Schedule
                </h3>
                {/* Collapsible schedule similar to provided design */}
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
                  {vendor.city || vendor.postcode} • {vendor.serviceRadiusMiles}{" "}
                  miles radius
                </p>
              </div>
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


      <Footer />
    </div>
  );
}