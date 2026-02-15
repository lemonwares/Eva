"use client";

import {
  Building2,
  FileText,
  Image,
  Tag,
  Settings,
  Menu,
  X,
  User,
  Check,
} from "lucide-react";
import { useState } from "react";

const sidebarItems = [
  { icon: Building2, label: "Business Information", active: true },
  { icon: FileText, label: "Services", active: false },
  { icon: Image, label: "Gallery", active: false },
  { icon: Tag, label: "Tags & Categories", active: false },
  { icon: Settings, label: "Account Settings", active: false },
];

export default function VendorSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileVisible, setProfileVisible] = useState(true);
  const [formData, setFormData] = useState({
    businessName: "The Artisan Baker",
    contactEmail: "contact@artisanbaker.com",
    phoneNumber: "+1 (555) 123-4567",
    location: "123 Main Street, Culinary City, 45678",
    tagline: "",
    longDescription: "",
  });

  return (
    <div className="min-h-screen bg-[#0d1a12] text-white font-sans flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0d1a12] border-r border-green-900/30 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo & Business */}
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold">EVA</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-green-900/20 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">VEN</span>
            </div>
            <div>
              <p className="font-bold text-sm">The Artisan Baker</p>
              <p className="text-gray-500 text-xs">Vendor Dashboard</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4">
          {sidebarItems.map((item, idx) => (
            <a
              key={idx}
              href="#"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                item.active
                  ? "bg-green-500/10 text-green-400"
                  : "text-gray-400 hover:bg-green-900/20 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#0d1a12] border-b border-green-900/30 px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-green-900/20 rounded-lg"
            >
              <Menu size={24} />
            </button>

            <div className="flex-1" />

            <div className="flex items-center gap-2 sm:gap-3">
              <button className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg border border-green-500 text-green-400 font-medium hover:bg-green-500/10 transition-colors text-sm whitespace-nowrap">
                View Live Profile
              </button>
              <button className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors text-sm whitespace-nowrap">
                Save Changes
              </button>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-600 flex items-center justify-center">
                <User size={20} className="text-gray-300" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold italic mb-6 sm:mb-8">
            Business Information
          </h1>

          {/* Form */}
          <form className="space-y-5 sm:space-y-6">
            {/* Business Name */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Business Name
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-[#1a2e22] text-white border border-green-900/30 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>

            {/* Contact Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, contactEmail: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-[#1a2e22] text-white border border-green-900/30 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-[#1a2e22] text-white border border-green-900/30 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Location / Address
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-[#1a2e22] text-white border border-green-900/30 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Short Description (Tagline)
              </label>
              <input
                type="text"
                placeholder="e.g., Freshly baked goods with a traditional touch"
                value={formData.tagline}
                onChange={(e) =>
                  setFormData({ ...formData, tagline: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-[#1a2e22] text-white border border-green-900/30 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm placeholder:text-gray-500"
              />
            </div>

            {/* Long Description */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Long Description
              </label>
              <textarea
                rows={5}
                placeholder="Tell your story. What makes your business special?"
                value={formData.longDescription}
                onChange={(e) =>
                  setFormData({ ...formData, longDescription: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-[#1a2e22] text-white border border-green-900/30 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm placeholder:text-gray-500 resize-none"
              />
            </div>
          </form>

          {/* Profile Visibility */}
          <div className="mt-8 pt-8 border-t border-green-900/30">
            <h2 className="text-xl font-bold mb-4">Profile Visibility</h2>
            <div className="bg-[#1a2e22] rounded-xl p-4 sm:p-5 border border-green-900/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Profile Visible</p>
                  <p className="text-gray-500 text-sm">
                    Allow customers to find and view your profile.
                  </p>
                </div>
                <button
                  onClick={() => setProfileVisible(!profileVisible)}
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    profileVisible ? "bg-green-500" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform flex items-center justify-center ${
                      profileVisible ? "translate-x-6" : "translate-x-1"
                    }`}
                  >
                    {profileVisible && (
                      <Check className="w-3 h-3 text-green-500" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
