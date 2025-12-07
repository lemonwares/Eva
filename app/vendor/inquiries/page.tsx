"use client";

import VendorLayout from "@/components/vendor/VendorLayout";
import { useVendorTheme } from "@/components/vendor/VendorThemeContext";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency } from "@/lib/formatters";
import {
  Search,
  ChevronDown,
  Mail,
  SlidersHorizontal,
  Loader2,
  X,
  User,
  Calendar,
  Users,
  DollarSign,
  Phone,
  MessageSquare,
  Send,
  FileText,
  Clock,
  Archive,
  Plus,
  Minus,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const statusFilters = ["All", "NEW", "VIEWED", "QUOTED", "ARCHIVED"];

interface Inquiry {
  id: string;
  fromName: string;
  fromEmail: string;
  fromPhone: string | null;
  eventDate: string | null;
  guestsCount: number | null;
  budgetRange: string | null;
  message: string;
  status: string;
  createdAt: string;
  messages: { sender: string; text: string; timestamp: string }[];
  provider: {
    id: string;
    businessName: string;
  };
  quotes?: {
    id: string;
    status: string;
    totalPrice: number;
  }[];
}

interface QuoteItem {
  name: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
}

// View Inquiry Modal Component
function ViewInquiryModal({
  inquiry,
  isOpen,
  onClose,
  onReply,
  onArchive,
  onCreateQuote,
  darkMode,
}: {
  inquiry: Inquiry | null;
  isOpen: boolean;
  onClose: () => void;
  onReply: (message: string) => Promise<void>;
  onArchive: () => void;
  onCreateQuote: () => void;
  darkMode: boolean;
}) {
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);

  if (!inquiry) return null;

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;
    setSending(true);
    try {
      await onReply(replyMessage);
      setReplyMessage("");
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-NG", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-500/20 text-blue-600 border border-blue-500/30";
      case "VIEWED":
        return "bg-yellow-500/20 text-yellow-600 border border-yellow-500/30";
      case "QUOTED":
        return "bg-green-500/20 text-green-600 border border-green-500/30";
      case "ARCHIVED":
        return "bg-gray-500/20 text-gray-600 border border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-600 border border-gray-500/30";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Inquiry Details" size="lg">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{inquiry.fromName}</h3>
            <p className="text-sm text-gray-500">
              Received {formatDate(inquiry.createdAt)}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
              inquiry.status
            )}`}
          >
            {inquiry.status}
          </span>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <User size={16} /> Contact Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-gray-400" />
              <a
                href={`mailto:${inquiry.fromEmail}`}
                className="text-accent hover:underline"
              >
                {inquiry.fromEmail}
              </a>
            </div>
            {inquiry.fromPhone && (
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gray-400" />
                <a
                  href={`tel:${inquiry.fromPhone}`}
                  className="text-accent hover:underline"
                >
                  {inquiry.fromPhone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Calendar size={16} /> Event Details
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {inquiry.eventDate && (
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{formatDate(inquiry.eventDate)}</p>
              </div>
            )}
            {inquiry.guestsCount && (
              <div>
                <p className="text-sm text-gray-500">Guests</p>
                <p className="font-medium flex items-center gap-1">
                  <Users size={14} /> {inquiry.guestsCount}
                </p>
              </div>
            )}
            {inquiry.budgetRange && (
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p className="font-medium flex items-center gap-1">
                  <DollarSign size={14} /> {inquiry.budgetRange}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Message */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <MessageSquare size={16} /> Message
          </h4>
          <p className="text-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
        </div>

        {/* Conversation History */}
        {inquiry.messages && inquiry.messages.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Clock size={16} /> Conversation
            </h4>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {inquiry.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    msg.sender === "vendor"
                      ? "bg-accent/10 ml-4"
                      : "bg-white mr-4"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-500">
                      {msg.sender === "vendor" ? "You" : inquiry.fromName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reply Section */}
        {inquiry.status !== "ARCHIVED" && (
          <div className="border-t pt-4">
            <label className="block text-sm font-medium mb-2">
              Send a Reply
            </label>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your message..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={onArchive}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
              >
                <Archive size={16} /> Archive
              </button>
              <button
                onClick={onCreateQuote}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
              >
                <FileText size={16} /> Create Quote
              </button>
              <button
                onClick={handleSendReply}
                disabled={!replyMessage.trim() || sending}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent/90 text-white font-medium transition-colors disabled:opacity-50"
              >
                <Send size={16} /> {sending ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

// Create Quote Modal Component
function CreateQuoteModal({
  inquiry,
  isOpen,
  onClose,
  onSubmit,
}: {
  inquiry: Inquiry | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    items: QuoteItem[],
    validDays: number,
    notes: string
  ) => Promise<void>;
}) {
  const [items, setItems] = useState<QuoteItem[]>([
    { name: "", qty: 1, unitPrice: 0, totalPrice: 0 },
  ]);
  const [validDays, setValidDays] = useState(14);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const addItem = () => {
    setItems([...items, { name: "", qty: 1, unitPrice: 0, totalPrice: 0 }]);
  };

  const removeItem = (idx: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== idx));
    }
  };

  const updateItem = (
    idx: number,
    field: keyof QuoteItem,
    value: string | number
  ) => {
    const updated = [...items];
    if (field === "name") {
      updated[idx].name = value as string;
    } else if (field === "qty") {
      updated[idx].qty = Number(value) || 1;
      updated[idx].totalPrice = updated[idx].qty * updated[idx].unitPrice;
    } else if (field === "unitPrice") {
      updated[idx].unitPrice = Number(value) || 0;
      updated[idx].totalPrice = updated[idx].qty * updated[idx].unitPrice;
    }
    setItems(updated);
  };

  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleSubmit = async () => {
    if (items.some((item) => !item.name || item.unitPrice <= 0)) {
      alert("Please fill in all item details");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(items, validDays, notes);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!inquiry) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Quote" size="lg">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Client Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Creating quote for</p>
          <p className="font-semibold">{inquiry.fromName}</p>
          {inquiry.eventDate && (
            <p className="text-sm text-gray-600">
              Event: {new Date(inquiry.eventDate).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Quote Items */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Services / Items
          </label>
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(idx, "name", e.target.value)}
                    placeholder="Service name"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                  />
                </div>
                <div className="w-20">
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateItem(idx, "qty", e.target.value)}
                    min="1"
                    placeholder="Qty"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm text-center"
                  />
                </div>
                <div className="w-28">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      €
                    </span>
                    <input
                      type="number"
                      value={item.unitPrice || ""}
                      onChange={(e) =>
                        updateItem(idx, "unitPrice", e.target.value)
                      }
                      min="0"
                      step="0.01"
                      placeholder="Price"
                      className="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                    />
                  </div>
                </div>
                <div className="w-24 text-right">
                  <p className="py-2 font-medium">
                    {formatCurrency(item.totalPrice)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(idx)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  disabled={items.length === 1}
                >
                  <Minus size={16} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addItem}
            className="mt-3 flex items-center gap-2 text-sm text-accent hover:text-accent/80"
          >
            <Plus size={16} /> Add Item
          </button>
        </div>

        {/* Total */}
        <div className="bg-accent/10 rounded-lg p-4 flex justify-between items-center">
          <span className="font-semibold">Total Price</span>
          <span className="text-2xl font-bold text-accent">
            {formatCurrency(totalPrice)}
          </span>
        </div>

        {/* Validity */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Quote Valid For
          </label>
          <select
            value={validDays}
            onChange={(e) => setValidDays(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes or terms..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || items.every((i) => !i.name)}
            className="flex-1 px-4 py-3 rounded-lg bg-accent text-white hover:bg-accent/90 font-medium transition-colors disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create & Send Quote"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function InquiriesContent() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  const {
    darkMode,
    cardBg,
    cardBorder,
    textPrimary,
    textSecondary,
    textMuted,
    inputBg,
    inputBorder,
  } = useVendorTheme();

  useEffect(() => {
    fetchInquiries();
  }, [activeFilter]);

  async function fetchInquiries() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (activeFilter !== "All") {
        params.append("status", activeFilter);
      }
      const response = await fetch(`/api/inquiries?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch inquiries");
      const data = await response.json();
      setInquiries(data.inquiries || []);
    } catch (err) {
      console.error("Error fetching inquiries:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  async function handleReply(message: string) {
    if (!selectedInquiry) return;

    try {
      const response = await fetch(
        `/api/inquiries/${selectedInquiry.id}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: message }),
        }
      );

      if (response.ok) {
        showToast("Reply sent successfully", "success");
        fetchInquiries();
        // Update selected inquiry with new message
        const updatedInquiry = await response.json();
        setSelectedInquiry(updatedInquiry.inquiry || selectedInquiry);
      } else {
        showToast("Failed to send reply", "error");
      }
    } catch (err) {
      showToast("An error occurred", "error");
    }
  }

  async function handleArchive() {
    if (!selectedInquiry) return;

    try {
      const response = await fetch(`/api/inquiries/${selectedInquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ARCHIVED" }),
      });

      if (response.ok) {
        showToast("Inquiry archived", "success");
        setViewModalOpen(false);
        fetchInquiries();
      } else {
        showToast("Failed to archive inquiry", "error");
      }
    } catch (err) {
      showToast("An error occurred", "error");
    }
  }

  async function handleCreateQuote(
    items: QuoteItem[],
    validDays: number,
    notes: string
  ) {
    if (!selectedInquiry) return;

    try {
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + validDays);

      const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId: selectedInquiry.id,
          items,
          subtotal,
          totalPrice: subtotal,
          validUntil: validUntil.toISOString(),
          notes,
          allowedPaymentModes: ["FULL_PAYMENT", "DEPOSIT_BALANCE"],
          depositPercentage: 50,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        showToast("Quote created successfully", "success");
        setQuoteModalOpen(false);
        setViewModalOpen(false);
        fetchInquiries();

        // Optionally send the quote
        if (data.quote?.id) {
          await fetch(`/api/quotes/${data.quote.id}/send`, { method: "POST" });
        }
      } else {
        const error = await response.json();
        showToast(error.message || "Failed to create quote", "error");
      }
    } catch (err) {
      showToast("An error occurred", "error");
    }
  }

  const filteredInquiries = inquiries.filter(
    (inquiry) =>
      inquiry.fromName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.fromEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getInitialsColor = (name: string) => {
    const colors = [
      "from-orange-400 to-pink-500",
      "from-blue-400 to-blue-600",
      "from-green-400 to-teal-500",
      "from-purple-400 to-purple-600",
      "from-yellow-400 to-orange-500",
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return past.toLocaleDateString();
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-500/20 text-blue-600 border border-blue-500/30";
      case "VIEWED":
        return "bg-yellow-500/20 text-yellow-600 border border-yellow-500/30";
      case "QUOTED":
        return "bg-green-500/20 text-green-600 border border-green-500/30";
      case "ARCHIVED":
        return "bg-gray-500/20 text-gray-600 border border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-600 border border-gray-500/30";
    }
  };

  return (
    <div className="flex gap-6">
      {/* Filter Sidebar Overlay - Mobile */}
      {filterSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setFilterSidebarOpen(false)}
        />
      )}

      {/* Filter Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 lg:w-48 shrink-0 ${
          darkMode ? "bg-[#0f0f0f]" : "bg-white"
        } lg:bg-transparent p-4 sm:p-6 lg:p-0 transform transition-transform duration-300 lg:transform-none ${
          filterSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <h3 className={`font-bold text-sm mb-4 ${textPrimary}`}>
          Filter Inquiries
        </h3>

        {/* Status Filter */}
        <div className="mb-5">
          <p className={`text-sm mb-2 ${textMuted}`}>Status</p>
          <div className="flex flex-wrap gap-1.5">
            {statusFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeFilter === filter
                    ? "bg-accent/20 text-accent border border-accent/30"
                    : `${textSecondary} ${
                        darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                      }`
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Mobile Filter Toggle */}
        <div className="flex items-center gap-4 mb-6 lg:hidden">
          <button
            onClick={() => setFilterSidebarOpen(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm ${inputBg} ${inputBorder} ${textPrimary}`}
          >
            <SlidersHorizontal size={18} />
            <span>Filters</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMuted}`}
            size={18}
          />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm ${cardBg} ${cardBorder} ${textPrimary}`}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        )}

        {/* Inquiries List */}
        {!isLoading && filteredInquiries.length > 0 && (
          <div className="space-y-4">
            {filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className={`rounded-xl border p-4 sm:p-6 cursor-pointer transition-all hover:shadow-md ${cardBg} ${cardBorder}`}
                onClick={() => {
                  setSelectedInquiry(inquiry);
                  setViewModalOpen(true);
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br ${getInitialsColor(
                        inquiry.fromName
                      )} flex items-center justify-center text-white font-bold text-sm`}
                    >
                      {getInitials(inquiry.fromName)}
                    </div>
                    <div>
                      <p className={`font-medium ${textPrimary}`}>
                        {inquiry.fromName}
                      </p>
                      <p className={`text-xs sm:text-sm ${textMuted}`}>
                        {formatTimeAgo(inquiry.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      inquiry.status
                    )}`}
                  >
                    {inquiry.status}
                  </span>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {inquiry.eventDate && (
                      <span className={`text-sm ${textMuted}`}>
                        📅 {new Date(inquiry.eventDate).toLocaleDateString()}
                      </span>
                    )}
                    {inquiry.guestsCount && (
                      <span className={`text-sm ${textMuted}`}>
                        👥 {inquiry.guestsCount} guests
                      </span>
                    )}
                    {inquiry.budgetRange && (
                      <span className={`text-sm ${textMuted}`}>
                        💰 {inquiry.budgetRange}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${textSecondary} line-clamp-2`}
                  >
                    {inquiry.message}
                  </p>
                </div>

                {/* Quick Actions */}
                <div
                  className="flex gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      setSelectedInquiry(inquiry);
                      setViewModalOpen(true);
                    }}
                    className="flex-1 bg-accent text-white font-semibold py-2.5 rounded-lg hover:bg-accent/90 transition-colors text-sm"
                  >
                    View & Reply
                  </button>
                  <button
                    onClick={() => {
                      setSelectedInquiry(inquiry);
                      setQuoteModalOpen(true);
                    }}
                    className={`flex-1 font-semibold py-2.5 rounded-lg border transition-colors text-sm ${
                      darkMode
                        ? "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    Create Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredInquiries.length === 0 && (
          <div
            className={`rounded-xl border border-dashed p-8 sm:p-12 mt-6 text-center ${cardBg} ${cardBorder}`}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                darkMode ? "bg-white/5" : "bg-gray-100"
              }`}
            >
              <Mail size={28} className={textMuted} />
            </div>
            <h3 className={`font-bold mb-2 ${textPrimary}`}>
              No inquiries found
            </h3>
            <p className={`text-sm ${textMuted}`}>
              {searchQuery
                ? "Try adjusting your search or filters."
                : "When customers contact you, their inquiries will appear here."}
            </p>
          </div>
        )}
      </div>

      {/* View Inquiry Modal */}
      <ViewInquiryModal
        inquiry={selectedInquiry}
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        onReply={handleReply}
        onArchive={handleArchive}
        onCreateQuote={() => {
          setViewModalOpen(false);
          setQuoteModalOpen(true);
        }}
        darkMode={darkMode}
      />

      {/* Create Quote Modal */}
      <CreateQuoteModal
        inquiry={selectedInquiry}
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        onSubmit={handleCreateQuote}
      />

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {toast.message}
          <button
            onClick={() => setToast({ ...toast, show: false })}
            className="ml-2"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function VendorInquiriesPage() {
  return (
    <VendorLayout title="Inquiries">
      <InquiriesContent />
    </VendorLayout>
  );
}
