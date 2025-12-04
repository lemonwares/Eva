"use client";

import { X, ChevronDown, Calendar } from "lucide-react";
import { useState } from "react";

interface ContactVendorModalProps {
  vendorName?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function ContactVendorModal({
  vendorName = "[Vendor Name]",
  isOpen = true,
  onClose,
}: ContactVendorModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    message: "",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-[#1a1a1a] rounded-2xl border border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-gray-800">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Contact {vendorName}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Let&apos;s start planning your event. Fill out the details below.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-[#252525] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-gray-500"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-[#252525] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="(123) 456-7890"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-[#252525] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Event Type
            </label>
            <div className="relative">
              <select
                value={formData.eventType}
                onChange={(e) =>
                  setFormData({ ...formData, eventType: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-[#252525] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none cursor-pointer"
              >
                <option value="" className="text-gray-500">
                  Select an event type
                </option>
                <option value="wedding">Wedding</option>
                <option value="corporate">Corporate Event</option>
                <option value="birthday">Birthday Party</option>
                <option value="anniversary">Anniversary</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>

          {/* Event Date & Guests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Event Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  placeholder="mm/dd/yyyy"
                  value={formData.eventDate}
                  onChange={(e) =>
                    setFormData({ ...formData, eventDate: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-[#252525] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm scheme-dark"
                />
                <Calendar
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Number of Guests
              </label>
              <input
                type="text"
                placeholder="e.g., 150"
                value={formData.guestCount}
                onChange={(e) =>
                  setFormData({ ...formData, guestCount: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-[#252525] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Message
            </label>
            <textarea
              rows={4}
              placeholder="Add any specific questions or details about your event here."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-[#252525] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-gray-500 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-3.5 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
          >
            Send Inquiry
          </button>

          {/* Footer Text */}
          <p className="text-center text-gray-500 text-xs sm:text-sm">
            We&apos;ll do our best to respond within 24 hours. By submitting
            this form, you agree to our{" "}
            <a href="#" className="text-blue-400 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
}
