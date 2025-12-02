"use client";

import VendorLayout from "@/components/vendor/VendorLayout";
import { useVendorTheme } from "@/components/vendor/VendorThemeContext";
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
} from "lucide-react";
import Image from "next/image";

const galleryImages = [
  "/images/gallery-1.jpg",
  "/images/gallery-2.jpg",
  "/images/gallery-3.jpg",
  "/images/gallery-4.jpg",
  "/images/gallery-5.jpg",
  "/images/gallery-6.jpg",
];

const services = [
  {
    name: "Gold Wedding Package",
    description: "Full-day coverage with 2 photographers",
    price: "$4,500",
    popular: true,
  },
  {
    name: "Silver Package",
    description: "Half-day coverage with 1 photographer",
    price: "$2,750",
    popular: false,
  },
  {
    name: "Platinum DJ Set",
    description: "Premium sound equipment & lighting",
    price: "$3,200",
    popular: false,
  },
  {
    name: "Standard Photography",
    description: "4 hours of event coverage",
    price: "$1,800",
    popular: false,
  },
];

const reviews = [
  {
    author: "Sarah Mitchell",
    rating: 5,
    date: "Oct 15, 2024",
    content:
      "Absolutely amazing! They captured our wedding perfectly. Every moment was documented beautifully.",
    avatar: "/images/avatar-1.jpg",
  },
  {
    author: "James Wilson",
    rating: 5,
    date: "Sep 28, 2024",
    content:
      "Professional, punctual, and incredibly talented. The photos exceeded our expectations.",
    avatar: "/images/avatar-2.jpg",
  },
];

export default function VendorProfilePage() {
  const { darkMode } = useVendorTheme();

  return (
    <VendorLayout
      title="My Profile"
      actionButton={{ label: "Edit Profile", onClick: () => {} }}
    >
      {/* Profile Header */}
      <div
        className={`${
          darkMode ? "bg-[#141414] border-white/10" : "bg-white border-gray-200"
        } rounded-xl border overflow-hidden mb-6`}
      >
        {/* Cover Image */}
        <div className="relative h-32 sm:h-48 bg-linear-to-r from-accent/30 to-green-600/30">
          <button
            className={`absolute top-4 right-4 p-2 rounded-lg ${
              darkMode
                ? "bg-black/50 text-white hover:bg-black/70"
                : "bg-white/80 text-gray-700 hover:bg-white"
            } transition-colors`}
          >
            <Camera size={18} />
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
                  EP
                </div>
              </div>
              <button className="absolute bottom-2 right-2 p-1.5 rounded-full bg-accent text-white">
                <Edit3 size={12} />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2
                    className={`text-xl sm:text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Elegant Productions
                  </h2>
                  <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    Photography & DJ Services
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star size={16} fill="currentColor" />
                      <span className="font-medium">4.9</span>
                      <span className="text-gray-500">(156 reviews)</span>
                    </div>
                    <div
                      className={`flex items-center gap-1 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <MapPin size={16} />
                      <span>Los Angeles, CA</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm font-medium border border-green-500/30">
                    Verified Vendor
                  </span>
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
              Elegant Productions is a premier event services company
              specializing in photography and DJ services for weddings,
              corporate events, and private parties. With over 10 years of
              experience, we bring creativity, passion, and professionalism to
              every event we serve. Our team of skilled photographers and DJs
              are dedicated to capturing your special moments and creating
              unforgettable experiences.
            </p>
          </div>

          {/* Services Section */}
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
                Services & Packages
              </h3>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/20 text-accent text-sm hover:bg-accent/30 transition-colors">
                <Plus size={16} />
                Add Service
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg ${
                    darkMode
                      ? "bg-white/5 border-white/10 hover:border-accent/50"
                      : "bg-gray-50 border-gray-200 hover:border-accent/50"
                  } border transition-colors group`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {service.name}
                        </h4>
                        {service.popular && (
                          <span className="px-2 py-0.5 rounded text-xs bg-accent/20 text-accent">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mt-1">
                        {service.description}
                      </p>
                    </div>
                    <button
                      className={`opacity-0 group-hover:opacity-100 p-1.5 rounded ${
                        darkMode ? "hover:bg-white/10" : "hover:bg-gray-200"
                      } transition-all`}
                    >
                      <Edit3 size={14} className="text-gray-400" />
                    </button>
                  </div>
                  <p className="text-accent font-bold text-lg">
                    {service.price}
                  </p>
                </div>
              ))}
            </div>
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
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/20 text-accent text-sm hover:bg-accent/30 transition-colors">
                <Plus size={16} />
                Add Photos
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative aspect-square rounded-lg ${
                    darkMode ? "bg-white/5" : "bg-gray-100"
                  } overflow-hidden group`}
                >
                  <div
                    className={`w-full h-full flex items-center justify-center ${
                      darkMode ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    <Camera size={24} />
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
          </div>

          {/* Reviews Section */}
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
                Recent Reviews
              </h3>
              <button className="flex items-center gap-1 text-accent text-sm hover:underline">
                View All <ChevronRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {reviews.map((review, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg ${
                    darkMode ? "bg-white/5" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-accent to-green-600 flex items-center justify-center text-white font-medium">
                      {review.author.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {review.author}
                        </p>
                        <span className="text-gray-500 text-sm">
                          {review.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-600"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    {review.content}
                  </p>
                </div>
              ))}
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
                className={`p-2 rounded-lg ${
                  darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                } transition-colors`}
              >
                <Edit3 size={16} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    darkMode ? "bg-white/5" : "bg-gray-100"
                  }`}
                >
                  <Mail size={18} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Email</p>
                  <p className={darkMode ? "text-white" : "text-gray-900"}>
                    contact@elegantprod.com
                  </p>
                </div>
              </div>
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
                    (555) 123-4567
                  </p>
                </div>
              </div>
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
                  <p className="text-accent">www.elegantprod.com</p>
                </div>
              </div>
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
                className={`p-2 rounded-lg ${
                  darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                } transition-colors`}
              >
                <Edit3 size={16} className="text-gray-400" />
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                className={`p-3 rounded-lg ${
                  darkMode
                    ? "bg-white/5 hover:bg-white/10"
                    : "bg-gray-100 hover:bg-gray-200"
                } transition-colors`}
              >
                <Instagram size={20} className="text-pink-400" />
              </button>
              <button
                className={`p-3 rounded-lg ${
                  darkMode
                    ? "bg-white/5 hover:bg-white/10"
                    : "bg-gray-100 hover:bg-gray-200"
                } transition-colors`}
              >
                <Facebook size={20} className="text-blue-400" />
              </button>
              <button
                className={`p-3 rounded-lg ${
                  darkMode
                    ? "bg-white/5 hover:bg-white/10"
                    : "bg-gray-100 hover:bg-gray-200"
                } transition-colors`}
              >
                <Twitter size={20} className="text-sky-400" />
              </button>
              <button
                className={`p-3 rounded-lg ${
                  darkMode
                    ? "bg-white/5 hover:bg-white/10"
                    : "bg-gray-100 hover:bg-gray-200"
                } transition-colors`}
              >
                <Linkedin size={20} className="text-blue-500" />
              </button>
            </div>
          </div>

          {/* Achievements */}
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
              Achievements
            </h3>
            <div className="space-y-3">
              <div
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  darkMode ? "bg-white/5" : "bg-gray-50"
                }`}
              >
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <Award size={18} className="text-yellow-400" />
                </div>
                <div>
                  <p
                    className={`${
                      darkMode ? "text-white" : "text-gray-900"
                    } font-medium`}
                  >
                    Top Rated
                  </p>
                  <p className="text-gray-500 text-sm">2024 Best Vendor</p>
                </div>
              </div>
              <div
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  darkMode ? "bg-white/5" : "bg-gray-50"
                }`}
              >
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Calendar size={18} className="text-green-400" />
                </div>
                <div>
                  <p
                    className={`${
                      darkMode ? "text-white" : "text-gray-900"
                    } font-medium`}
                  >
                    100+ Events
                  </p>
                  <p className="text-gray-500 text-sm">Milestone reached</p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
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
                Business Hours
              </h3>
              <button
                className={`p-2 rounded-lg ${
                  darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                } transition-colors`}
              >
                <Edit3 size={16} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Mon - Fri
                </span>
                <span className={darkMode ? "text-white" : "text-gray-900"}>
                  9:00 AM - 6:00 PM
                </span>
              </div>
              <div className="flex justify-between">
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Saturday
                </span>
                <span className={darkMode ? "text-white" : "text-gray-900"}>
                  10:00 AM - 4:00 PM
                </span>
              </div>
              <div className="flex justify-between">
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Sunday
                </span>
                <span className="text-gray-500">Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VendorLayout>
  );
}
