"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useDashboardTheme } from "@/components/dashboard/DashboardThemeContext";
import { InquiryChat } from "@/components/chat/InquiryChat";
import {
  ArrowLeft,
  CalendarDays,
  Users,
  DollarSign,
  MapPin,
  Phone,
  Loader2,
  FileText,
  ExternalLink,
} from "lucide-react";
import { logger } from "@/lib/logger";

interface Quote {
  id: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  booking?: { id: string; status: string } | null;
}

interface Inquiry {
  id: string;
  status: string;
  message: string;
  fromName: string;
  fromEmail: string;
  fromPhone?: string;
  eventDate?: string;
  guestsCount?: number;
  budgetRange?: string;
  messages: any[];
  createdAt: string;
  updatedAt: string;
  provider: {
    id: string;
    businessName: string;
    coverImage?: string;
    city?: string;
    phonePublic?: string;
  };
  quotes?: Quote[];
}

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  VIEWED: "bg-purple-100 text-purple-700",
  QUOTED: "bg-amber-100 text-amber-700",
  ACCEPTED: "bg-green-100 text-green-700",
  DECLINED: "bg-red-100 text-red-700",
  EXPIRED: "bg-gray-100 text-gray-600",
  ARCHIVED: "bg-gray-100 text-gray-600",
};

const quoteStatusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  SENT: "bg-blue-100 text-blue-700",
  VIEWED: "bg-purple-100 text-purple-700",
  ACCEPTED: "bg-green-100 text-green-700",
  DECLINED: "bg-red-100 text-red-700",
  EXPIRED: "bg-gray-100 text-gray-600",
};

export default function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const {
    darkMode,
    cardBg,
    cardBorder,
    textPrimary,
    textSecondary,
    textMuted,
  } = useDashboardTheme();

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchInquiry() {
      try {
        const res = await fetch(`/api/inquiries/${id}`);
        if (res.status === 404) { setNotFound(true); return; }
        if (!res.ok) { setNotFound(true); return; }
        const data = await res.json();
        setInquiry(data.inquiry);
      } catch (err) {
        logger.error("Error fetching inquiry:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchInquiry();
  }, [id]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (notFound || !inquiry) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/inquiries"
          className={`inline-flex items-center gap-2 text-sm ${textMuted} hover:text-accent transition-colors`}
        >
          <ArrowLeft size={16} /> Back to Inquiries
        </Link>
        <div className={`${cardBg} ${cardBorder} border rounded-xl p-12 text-center`}>
          <FileText className={`w-12 h-12 mx-auto mb-3 ${textMuted}`} strokeWidth={1.5} />
          <p className={`font-semibold ${textPrimary}`}>Inquiry not found</p>
          <p className={`text-sm mt-1 ${textMuted}`}>This inquiry may have been removed or you don't have access.</p>
          <Link href="/dashboard/inquiries" className="inline-block mt-4 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
            View all inquiries
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back + Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/inquiries"
            className={`inline-flex items-center gap-2 text-sm ${textMuted} hover:text-accent transition-colors mb-2`}
          >
            <ArrowLeft size={16} /> Back to Inquiries
          </Link>
          <h1 className={`text-xl sm:text-2xl font-bold ${textPrimary}`}>
            Inquiry with {inquiry.provider.businessName}
          </h1>
          <p className={`text-sm ${textSecondary}`}>
            Sent on {formatDate(inquiry.createdAt)}
          </p>
        </div>
        <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${statusColors[inquiry.status] || "bg-gray-100 text-gray-600"}`}>
          {inquiry.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left: Vendor info + Event details + Quotes */}
        <div className="space-y-4">
          {/* Vendor Card */}
          <div className={`${cardBg} ${cardBorder} border rounded-xl overflow-hidden`}>
            {inquiry.provider.coverImage && (
              <div className="h-28 overflow-hidden">
                <Image
                  src={inquiry.provider.coverImage}
                  alt={inquiry.provider.businessName}
                  width={400}
                  height={112}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            )}
            <div className="p-4">
              <h3 className={`font-semibold ${textPrimary} mb-1`}>{inquiry.provider.businessName}</h3>
              {inquiry.provider.city && (
                <div className={`flex items-center gap-1.5 text-sm ${textMuted} mb-3`}>
                  <MapPin size={14} />
                  <span>{inquiry.provider.city}</span>
                </div>
              )}
              {inquiry.provider.phonePublic && (
                <div className={`flex items-center gap-1.5 text-sm ${textMuted} mb-3`}>
                  <Phone size={14} />
                  <a href={`tel:${inquiry.provider.phonePublic}`} className="hover:text-accent transition-colors">
                    {inquiry.provider.phonePublic}
                  </a>
                </div>
              )}
              <Link
                href={`/vendors/${inquiry.provider.id}`}
                className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline font-medium"
              >
                View Profile <ExternalLink size={13} />
              </Link>
            </div>
          </div>

          {/* Event Details */}
          {(inquiry.eventDate || inquiry.guestsCount || inquiry.budgetRange) && (
            <div className={`${cardBg} ${cardBorder} border rounded-xl p-4`}>
              <h3 className={`font-semibold ${textPrimary} mb-3`}>Event Details</h3>
              <div className="space-y-2.5">
                {inquiry.eventDate && (
                  <div className="flex items-center gap-2.5">
                    <CalendarDays size={16} className={textMuted} />
                    <div>
                      <p className={`text-xs ${textMuted}`}>Event Date</p>
                      <p className={`text-sm font-medium ${textPrimary}`}>{formatDate(inquiry.eventDate)}</p>
                    </div>
                  </div>
                )}
                {inquiry.guestsCount && (
                  <div className="flex items-center gap-2.5">
                    <Users size={16} className={textMuted} />
                    <div>
                      <p className={`text-xs ${textMuted}`}>Guests</p>
                      <p className={`text-sm font-medium ${textPrimary}`}>{inquiry.guestsCount} guests</p>
                    </div>
                  </div>
                )}
                {inquiry.budgetRange && (
                  <div className="flex items-center gap-2.5">
                    <DollarSign size={16} className={textMuted} />
                    <div>
                      <p className={`text-xs ${textMuted}`}>Budget</p>
                      <p className={`text-sm font-medium ${textPrimary}`}>{inquiry.budgetRange}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Original Message */}
          <div className={`${cardBg} ${cardBorder} border rounded-xl p-4`}>
            <h3 className={`font-semibold ${textPrimary} mb-2`}>Your Message</h3>
            <p className={`text-sm ${textSecondary} leading-relaxed`}>{inquiry.message}</p>
          </div>

          {/* Quotes */}
          {inquiry.quotes && inquiry.quotes.length > 0 && (
            <div className={`${cardBg} ${cardBorder} border rounded-xl p-4`}>
              <h3 className={`font-semibold ${textPrimary} mb-3`}>Quotes</h3>
              <div className="space-y-3">
                {inquiry.quotes.map((quote) => (
                  <div key={quote.id} className={`p-3 rounded-lg border ${darkMode ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-semibold ${textPrimary}`}>
                        {formatCurrency(quote.totalPrice)}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${quoteStatusColors[quote.status] || "bg-gray-100 text-gray-600"}`}>
                        {quote.status}
                      </span>
                    </div>
                    <p className={`text-xs ${textMuted} mb-2`}>
                      {new Date(quote.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/quotes`}
                        className="text-xs text-accent hover:underline font-medium"
                      >
                        View Quote →
                      </Link>
                      {quote.booking && (
                        <Link
                          href={`/dashboard/bookings/${quote.booking.id}`}
                          className="text-xs text-green-600 hover:underline font-medium"
                        >
                          View Booking →
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Chat */}
        <div className="lg:col-span-2">
          <div className={`${cardBg} ${cardBorder} border rounded-xl overflow-hidden`}>
            <div className={`p-4 border-b ${cardBorder} flex items-center justify-between`}>
              <h3 className={`font-semibold ${textPrimary}`}>Conversation</h3>
              <span className={`text-xs ${textMuted}`}>
                {inquiry.messages?.length || 0} message{(inquiry.messages?.length || 0) !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="p-4">
              <InquiryChat
                inquiryId={inquiry.id}
                currentUserId={session?.user?.id || ""}
                currentUserRole="client"
                darkMode={darkMode}
                disabled={inquiry.status === "ARCHIVED"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
