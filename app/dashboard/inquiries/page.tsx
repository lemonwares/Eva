"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useDashboardTheme } from "../layout";

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
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      NEW: "bg-blue-100 text-blue-700",
      VIEWED: "bg-purple-100 text-purple-700",
      QUOTED: "bg-amber-100 text-amber-700",
      ACCEPTED: "bg-green-100 text-green-700",
      DECLINED: "bg-red-100 text-red-700",
      EXPIRED: "bg-gray-100 text-gray-700",
      ARCHIVED: "bg-gray-100 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
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
        }
      );

      if (response.ok) {
        setNewMessage("");
        // Refresh the inquiry
        const inquiryRes = await fetch(`/api/inquiries/${selectedInquiry.id}`);
        const inquiryData = await inquiryRes.json();
        setSelectedInquiry(inquiryData.inquiry || inquiryData);
        fetchInquiries();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const inputClass = `px-3 py-2 rounded-lg ${inputBg} border ${inputBorder} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-rose-500`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${textPrimary}`}>My Inquiries</h1>
        <p className={textSecondary}>Messages and inquiries sent to vendors</p>
      </div>

      {/* Filters */}
      <div className={`${cardBg} ${cardBorder} border rounded-xl p-4`}>
        <div className="flex flex-wrap gap-2">
          {["all", "NEW", "VIEWED", "QUOTED", "ACCEPTED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? "bg-rose-500 text-white"
                  : `${
                      darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                    }`
              }`}
            >
              {status === "all" ? "All" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiries List */}
        <div
          className={`lg:col-span-1 ${cardBg} ${cardBorder} border rounded-xl overflow-hidden`}
        >
          <div className={`p-4 border-b ${cardBorder}`}>
            <h2 className={`font-semibold ${textPrimary}`}>Conversations</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full"></div>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="p-8 text-center">
              <svg
                className={`w-12 h-12 mx-auto ${textMuted}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className={`mt-2 ${textMuted}`}>No inquiries yet</p>
            </div>
          ) : (
            <div className="divide-y divide-inherit max-h-[600px] overflow-y-auto">
              {inquiries.map((inquiry) => (
                <button
                  key={inquiry.id}
                  onClick={() => setSelectedInquiry(inquiry)}
                  className={`w-full text-left p-4 transition-colors ${
                    selectedInquiry?.id === inquiry.id
                      ? darkMode
                        ? "bg-gray-700"
                        : "bg-rose-50"
                      : darkMode
                      ? "hover:bg-gray-700/50"
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
                        <img
                          src={inquiry.provider.coverImage}
                          alt=""
                          className="w-full h-full object-cover"
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
                      <div className="flex items-center justify-between">
                        <p className={`font-medium truncate ${textPrimary}`}>
                          {inquiry.provider.businessName}
                        </p>
                        <span className={`text-xs ${textMuted}`}>
                          {formatDate(inquiry.createdAt)}
                        </span>
                      </div>
                      <p className={`text-sm ${textSecondary} truncate`}>
                        {inquiry.message}
                      </p>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${getStatusColor(
                          inquiry.status
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

        {/* Conversation View */}
        <div
          className={`lg:col-span-2 ${cardBg} ${cardBorder} border rounded-xl overflow-hidden flex flex-col`}
        >
          {selectedInquiry ? (
            <>
              {/* Header */}
              <div
                className={`p-4 border-b ${cardBorder} flex items-center justify-between`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    } overflow-hidden`}
                  >
                    {selectedInquiry.provider.coverImage ? (
                      <img
                        src={selectedInquiry.provider.coverImage}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className={`font-medium ${textMuted}`}>
                          {selectedInquiry.provider.businessName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <Link
                      href={`/vendors/${selectedInquiry.provider.id}`}
                      className={`font-semibold ${textPrimary} hover:text-rose-500`}
                    >
                      {selectedInquiry.provider.businessName}
                    </Link>
                    {selectedInquiry.provider.city && (
                      <p className={`text-sm ${textMuted}`}>
                        {selectedInquiry.provider.city}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${getStatusColor(
                    selectedInquiry.status
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
                  className={`p-3 ${
                    darkMode ? "bg-gray-800" : "bg-gray-50"
                  } border-b ${cardBorder}`}
                >
                  <div className="flex flex-wrap gap-4 text-sm">
                    {selectedInquiry.eventDate && (
                      <div className="flex items-center gap-1">
                        <svg
                          className={`w-4 h-4 ${textMuted}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className={textSecondary}>
                          {formatDate(selectedInquiry.eventDate)}
                        </span>
                      </div>
                    )}
                    {selectedInquiry.guestsCount && (
                      <div className="flex items-center gap-1">
                        <svg
                          className={`w-4 h-4 ${textMuted}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        <span className={textSecondary}>
                          {selectedInquiry.guestsCount} guests
                        </span>
                      </div>
                    )}
                    {selectedInquiry.budgetRange && (
                      <div className="flex items-center gap-1">
                        <svg
                          className={`w-4 h-4 ${textMuted}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className={textSecondary}>
                          {selectedInquiry.budgetRange}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px] max-h-[400px]">
                {/* Initial inquiry */}
                <div className="flex justify-end">
                  <div className="max-w-[80%]">
                    <div className="bg-rose-500 text-white p-3 rounded-xl rounded-tr-none">
                      <p>{selectedInquiry.message}</p>
                    </div>
                    <p className={`text-xs ${textMuted} mt-1 text-right`}>
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
                      <div className="max-w-[80%]">
                        <div
                          className={`p-3 rounded-xl ${
                            msg.sender === "client"
                              ? "bg-rose-500 text-white rounded-tr-none"
                              : darkMode
                              ? "bg-gray-700 text-white rounded-tl-none"
                              : "bg-gray-100 text-gray-900 rounded-tl-none"
                          }`}
                        >
                          <p>{msg.text}</p>
                        </div>
                        <p
                          className={`text-xs ${textMuted} mt-1 ${
                            msg.sender === "client" ? "text-right" : ""
                          }`}
                        >
                          {formatDate(msg.timestamp)} at{" "}
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Message Input */}
              <div className={`p-4 border-t ${cardBorder}`}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className={`flex-1 ${inputClass}`}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    disabled={sending}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50"
                  >
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <svg
                  className={`w-16 h-16 mx-auto ${textMuted}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className={`mt-2 ${textMuted}`}>
                  Select a conversation to view
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
