"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ArrowLeft, ChevronRight, Plus, Minus } from "lucide-react";

export interface BookingService {
  id: string;
  headline: string;
  minPrice: number | null;
  maxPrice: number | null;
  duration?: string;
  description?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: BookingService[];
  onBook: (selected: BookingService[]) => void;
  darkMode?: boolean;
  businessName?: string;
  businessRating?: number;
  businessReviews?: number;
  businessAddress?: string;
  businessImage?: string;
}

type Step = "services" | "time" | "confirm";

export default function BookingModal({
  isOpen,
  onClose,
  services,
  onBook,
  darkMode = false,
  businessName = "The Business",
  businessRating = 4.7,
  businessReviews = 572,
  businessAddress = "Business Address",
  businessImage,
}: BookingModalProps) {
  const [step, setStep] = useState<Step>("services");
  const [selected, setSelected] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState("Featured");

  // Organize services into categories
  const categories = [
    "Featured",
    "CHROME NAILS",
    "Children services",
    "Services with client profile",
  ];

  useEffect(() => {
    if (isOpen) {
      setStep("services");
      setSelected([]);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  const handleContinue = () => {
    if (step === "services") {
      setStep("time");
    } else if (step === "time") {
      setStep("confirm");
    } else {
      const selectedServices = services.filter((s) => selected.includes(s.id));
      onBook(selectedServices);
      onClose();
    }
  };

  const handleBack = () => {
    if (step === "time") {
      setStep("services");
    } else if (step === "confirm") {
      setStep("time");
    } else {
      onClose();
    }
  };

  const selectedServices = services.filter((s) => selected.includes(s.id));
  const total = selectedServices.reduce((sum, s) => sum + (s.minPrice || 0), 0);

  // Breadcrumb
  const breadcrumbs = [
    { label: "Services", active: step === "services" },
    { label: "Professional", active: step === "services" },
    { label: "Time", active: step === "time" },
    { label: "Confirm", active: step === "confirm" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 sticky top-0 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              {breadcrumbs.map((crumb, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span
                    className={
                      crumb.active
                        ? "text-gray-900 font-medium"
                        : "text-gray-400"
                    }
                  >
                    {crumb.label}
                  </span>
                  {idx < breadcrumbs.length - 1 && (
                    <ChevronRight size={16} className="text-gray-400" />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content - Services List */}
            <div className="lg:col-span-2">
              <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
                Services
              </h1>

              {/* Category Filters */}
              <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 overflow-x-auto pb-2 hide-scrollbar">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`px-4 sm:px-6 py-2 rounded-full whitespace-nowrap transition-colors text-xs sm:text-base ${
                      activeFilter === category
                        ? "bg-black text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Category Title */}
              <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6">
                {activeFilter}
              </h2>

              {/* Services List */}
              <div className="space-y-4">
                {services.map((service) => {
                  const isSelected = selected.includes(service.id);

                  return (
                    <div
                      key={service.id}
                      className="border border-gray-200 rounded-2xl p-4 sm:p-6 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
                            {service.headline}
                          </h3>
                          {service.duration && (
                            <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">
                              {service.duration}
                            </p>
                          )}
                          {service.description && (
                            <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4">
                              {service.description}
                            </p>
                          )}
                          <p className="font-semibold text-sm sm:text-base">
                            {service.minPrice != null
                              ? `from ₦${service.minPrice.toLocaleString()}`
                              : "Price on request"}
                          </p>
                        </div>

                        <button
                          onClick={() => handleSelect(service.id)}
                          className="mt-2 sm:mt-0 ml-0 sm:ml-4 p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          {isSelected ? (
                            <Minus size={20} className="text-gray-700" />
                          ) : (
                            <Plus size={20} className="text-gray-700" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar - Booking Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 border border-gray-200 rounded-2xl p-4 sm:p-6 bg-white mt-6 lg:mt-0">
                {/* Business Info */}
                <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                  {businessImage && (
                    <Image
                      src={businessImage}
                      alt={businessName}
                      width={64}
                      height={64}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover"
                      unoptimized
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-base sm:text-lg mb-1">
                      {businessName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs sm:text-sm mb-1">
                      <span className="font-semibold">{businessRating}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < Math.floor(businessRating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-600">({businessReviews})</span>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {businessAddress}
                    </p>
                  </div>
                </div>

                {/* Selected Services */}
                <div className="mb-4 sm:mb-6">
                  {selected.length === 0 ? (
                    <p className="text-gray-500 text-xs sm:text-sm">
                      No services selected
                    </p>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {selectedServices.map((service) => (
                        <div
                          key={service.id}
                          className="flex justify-between items-start"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-xs sm:text-sm">
                              {service.headline}
                            </p>
                            {service.duration && (
                              <p className="text-gray-600 text-[10px] sm:text-xs">
                                {service.duration}
                              </p>
                            )}
                          </div>
                          <p className="font-semibold text-xs sm:text-sm">
                            ₦{(service.minPrice || 0).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="pt-4 sm:pt-6 border-t border-gray-200 mb-4 sm:mb-6">
                  <div className="flex justify-between items-center mb-1 sm:mb-2">
                    <span className="font-semibold text-base sm:text-lg">
                      Total
                    </span>
                    <span className="font-bold text-lg sm:text-xl">
                      {selected.length === 0
                        ? "free"
                        : `₦${total.toLocaleString()}`}
                    </span>
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleContinue}
                  disabled={selected.length === 0}
                  className="w-full py-2 sm:py-3 rounded-full bg-gray-900 text-white font-semibold text-sm sm:text-lg transition-all hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
