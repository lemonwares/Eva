"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDashboardTheme } from "@/components/dashboard/DashboardThemeContext";
import {
  MessageSquare,
  CalendarDays,
  Users,
  DollarSign,
  Send,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { logger } from "@/lib/logger";

interface Message {
  sender: string;
  text: string;
  timestamp: string;
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
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  provider: {
    id: string;
    businessName: string;
    coverImage?: string;
    city?: string;
  };
}

export default function InquiriesPage() {
  const {
    darkMode,
    cardBg,
    cardBorder,
    textPrimary,
    textSecondary,
    textMuted,
    inputBg,
    inputBorder,
  } = useDashboardTheme();

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: "50",
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const response = await fetch(`/api/inquiries?${params}`);
      const data = await response.json();
      setInquiries(data.inquiries || []);
    } catch (error) {
      logger.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedInquiry?.messages]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      NEW: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      VIEWED:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      QUOTED:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      ACCEPTED:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      DECLINED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      EXPIRED: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      ARCHIVED: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const sendMessage = async () => {
    if (!selectedInquiry || !newMessage.trim()) return;

    try {
      setSending(true);
      const response = await fetch(
        `/api/inquiries/${selectedInquiry.id}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: newMessage }),
        },
      );

      if (response.ok) {
        setNewMessage("");
        const inquiryRes = await fetch(`/api/inquiries/${selectedInquiry.id}`);
        const inquiryData = await inquiryRes.json();
        setSelectedInquiry(inquiryData.inquiry || inquiryData);
        fetchInquiries();
      }
    } catch (error) {
      logger.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleSelectInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
  };

  const handleBack = () => {
    setSelectedInquiry(null);
  };

  const inputClass = `px-3 py-2 rounded-lg ${inputBg} border ${inputBorder} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-accent`;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-xl sm:text-2xl font-bold ${textPrimary}`}>
          My Inquiries
        </h1>
        <p className={`text-sm sm:text-base ${textSecondary}`}>
          Messages and inquiries sent to vendors
        </p>
      </div>

      {/* Filters */}
      <div className={`${cardBg} ${cardBorder} border rounded-xl p-3 sm:p-4`}>
        <div className="flex gap-2 overflow-x-auto pb-1 -mb-1 scrollbar-hide">
          {["all", "NEW", "VIEWED", "QUOTED", "ACCEPTED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === status
                  ? "bg-accent text-white"
                  : `${
                      darkMode
                        ? "bg-white/5 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                    }`
              }`}
            >
              {status === "all" ? "All" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Content — mobile: show list OR conversation, desktop: side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Inquiries List — hidden on mobile when a conversation is selected */}
        <div
          className={`lg:col-span-1 ${cardBg} ${cardBorder} border rounded-xl overflow-hidden ${
            selectedInquiry ? "hidden lg:block" : "block"
          }`}
        >
          <div className={`p-4 border-b ${cardBorder}`}>
            <h2 className={`font-semibold ${textPrimary}`}>Conversations</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-accent animate-spin" />
            </div>
          ) : inquiries.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className={`w-12 h-12 mx-auto ${textMuted}`} />
              <p className={`mt-2 ${textMuted}`}>No inquiries yet</p>
              <Link
                href="/vendors"
                className="inline-block mt-3 text-sm text-accent hover:underline"
              >
                Browse vendors to get started
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-inherit max-h-[calc(100vh-20rem)] lg:max-h-[600px] overflow-y-auto">
              {inquiries.map((inquiry) => (
                <button
                  key={inquiry.id}
                  onClick={() => handleSelectInquiry(inquiry)}
                  className={`w-full text-left p-3 sm:p-4 transition-colors ${
                    selectedInquiry?.id === inquiry.id
                      ? darkMode
                        ? "bg-white/5"
                        : "bg-teal-50"
                      : darkMode
                        ? "hover:bg-white/5"
                        : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${
                        darkMode ? "bg-gray-600" : "bg-gray-100"
                      } shrink-0 overflow-hidden`}
                    >
                      {inquiry.provider.coverImage ? (
                        <Image
                          src={inquiry.provider.coverImage}
                          alt=""
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className={`text-sm font-medium ${textMuted}`}>
                            {inquiry.provider.businessName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`font-medium truncate text-sm sm:text-base ${textPrimary}`}
                        >
                          {inquiry.provider.businessName}
                        </p>
                        <span
                          className={`text-[10px] sm:text-xs shrink-0 ${textMuted}`}
                        >
                          {formatDate(inquiry.createdAt)}
                        </span>
                      </div>
                      <p
                        className={`text-xs sm:text-sm ${textSecondary} truncate`}
                      >
                        {inquiry.message}
                      </p>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 text-[10px] sm:text-xs rounded-full ${getStatusColor(
                          inquiry.status,
                        )}`}
                      >
                        {inquiry.status}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Conversation View — on mobile, shown only when a conversation is selected */}
        <div
          className={`lg:col-span-2 ${cardBg} ${cardBorder} border rounded-xl overflow-hidden flex flex-col ${
            selectedInquiry ? "block" : "hidden lg:flex"
          }`}
        >
          {selectedInquiry ? (
            <>
              {/* Conversation Header */}
              <div
                className={`p-3 sm:p-4 border-b ${cardBorder} flex items-center justify-between gap-2`}
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  {/* Back button — mobile only */}
                  <button
                    onClick={handleBack}
                    className={`lg:hidden shrink-0 p-1.5 rounded-lg transition-colors ${
                      darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                    }`}
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft className={`w-5 h-5 ${textPrimary}`} />
                  </button>

                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${
                      darkMode ? "bg-white/5" : "bg-gray-100"
                    } overflow-hidden shrink-0`}
                  >
                    {selectedInquiry.provider.coverImage ? (
                      <Image
                        src={selectedInquiry.provider.coverImage}
                        alt=""
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className={`font-medium ${textMuted}`}>
                          {selectedInquiry.provider.businessName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/vendors/${selectedInquiry.provider.id}`}
                      className={`font-semibold text-sm sm:text-base ${textPrimary} hover:text-accent truncate block`}
                    >
                      {selectedInquiry.provider.businessName}
                    </Link>
                    {selectedInquiry.provider.city && (
                      <p className={`text-xs sm:text-sm ${textMuted} truncate`}>
                        {selectedInquiry.provider.city}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={`px-2 sm:px-3 py-1 text-[10px] sm:text-sm rounded-full shrink-0 ${getStatusColor(
                    selectedInquiry.status,
                  )}`}
                >
                  {selectedInquiry.status}
                </span>
              </div>

              {/* Event Info */}
              {(selectedInquiry.eventDate ||
                selectedInquiry.guestsCount ||
                selectedInquiry.budgetRange) && (
                <div
                  className={`px-3 sm:px-4 py-2.5 ${
                    darkMode ? "bg-[#141414]" : "bg-gray-50"
                  } border-b ${cardBorder}`}
                >
                  <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
                    {selectedInquiry.eventDate && (
                      <div className="flex items-center gap-1.5">
                        <CalendarDays
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${textMuted}`}
                        />
                        <span className={textSecondary}>
                          {formatDate(selectedInquiry.eventDate)}
                        </span>
                      </div>
                    )}
                    {selectedInquiry.guestsCount && (
                      <div className="flex items-center gap-1.5">
                        <Users
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${textMuted}`}
                        />
                        <span className={textSecondary}>
                          {selectedInquiry.guestsCount} guests
                        </span>
                      </div>
                    )}
                    {selectedInquiry.budgetRange && (
                      <div className="flex items-center gap-1.5">
                        <DollarSign
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${textMuted}`}
                        />
                        <span className={textSecondary}>
                          {selectedInquiry.budgetRange}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-[300px] max-h-[calc(100vh-24rem)] sm:max-h-[400px]">
                {/* Initial inquiry */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] sm:max-w-[80%]">
                    <div className="bg-accent text-white p-3 rounded-xl rounded-tr-none">
                      <p className="text-sm sm:text-base">
                        {selectedInquiry.message}
                      </p>
                    </div>
                    <p
                      className={`text-[10px] sm:text-xs ${textMuted} mt-1 text-right`}
                    >
                      {formatDate(selectedInquiry.createdAt)} at{" "}
                      {formatTime(selectedInquiry.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Conversation messages */}
                {selectedInquiry.messages &&
                  selectedInquiry.messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.sender === "client"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div className="max-w-[85%] sm:max-w-[80%]">
                        <div
                          className={`p-3 rounded-xl ${
                            msg.sender === "client"
                              ? "bg-accent text-white rounded-tr-none"
                              : darkMode
                                ? "bg-white/5 text-white rounded-tl-none"
                                : "bg-gray-100 text-gray-900 rounded-tl-none"
                          }`}
                        >
                          <p className="text-sm sm:text-base">{msg.text}</p>
                        </div>
                        <p
                          className={`text-[10px] sm:text-xs ${textMuted} mt-1 ${
                            msg.sender === "client" ? "text-right" : ""
                          }`}
                        >
                          {formatDate(msg.timestamp)} at{" "}
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className={`p-3 sm:p-4 border-t ${cardBorder}`}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className={`flex-1 text-sm sm:text-base ${inputClass}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    disabled={sending}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="px-3 sm:px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 transition-colors"
                  >
                    {sending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center py-16 lg:py-0">
              <div className="text-center">
                <MessageSquare
                  className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto ${textMuted}`}
                  strokeWidth={1.5}
                />
                <p className={`mt-3 font-medium ${textMuted}`}>
                  Select a conversation to view
                </p>
                <p className={`mt-1 text-sm ${textMuted}`}>
                  Choose from your inquiries on the left
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
