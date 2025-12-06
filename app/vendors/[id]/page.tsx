"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
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
  X,
  Send,
} from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import FavoriteButton from "@/components/common/FavoriteButton";
import ShareButton from "@/components/common/ShareButton";

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

export default function VendorDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [vendor, setVendor] = useState<Provider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
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
      fetchReviews();
    }
  }, [params.id]);

  async function fetchVendor() {
    try {
      const response = await fetch(`/api/providers/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch vendor");
      const data = await response.json();
      // API returns { provider: {...} }
      setVendor(data.provider || data);
    } catch (err) {
      console.error("Error fetching vendor:", err);
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
                    setActiveImageIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 hover:bg-background transition"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) =>
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
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <FavoriteButton providerId={vendor.id} />
                <ShareButton
                  title={vendor.businessName}
                  description={
                    vendor.description ||
                    `Check out ${vendor.businessName} on EVA`
                  }
                />
              </div>
            </div>

            {/* Description */}
            {vendor.description && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {vendor.description}
                </p>
              </div>
            )}

            {/* Services */}
            {vendor.subcategories.length > 0 && (
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

            {/* Culture Tags */}
            {vendor.cultureTraditionTags.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4">Specializations</h2>
                <div className="flex flex-wrap gap-2">
                  {vendor.cultureTraditionTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-4">
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
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold">
                          {review.authorName.charAt(0).toUpperCase()}
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
          </div>

          {/* Sidebar */}
          <div className="lg:w-96">
            <div className="sticky top-24 p-6 rounded-2xl border border-border bg-card shadow-lg">
              {/* Price */}
              {vendor.priceFrom && (
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">Starting from</p>
                  <p className="text-3xl font-bold">
                    ₦{vendor.priceFrom.toLocaleString()}
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
                        <option value="Under ₦1,000">Under ₦1,000</option>
                        <option value="₦1,000 - ₦2,500">₦1,000 - ₦2,500</option>
                        <option value="₦2,500 - ₦5,000">₦2,500 - ₦5,000</option>
                        <option value="₦5,000 - ₦10,000">
                          ₦5,000 - ₦10,000
                        </option>
                        <option value="Over ₦10,000">Over ₦10,000</option>
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
