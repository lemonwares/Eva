"use client";

import { Search, Bell, Star, Clock, Menu, X } from "lucide-react";
import { useState } from "react";

const galleryImages = [
  "/images/gallery1.jpg",
  "/images/gallery2.jpg",
  "/images/gallery3.jpg",
  "/images/gallery4.jpg",
  "/images/gallery5.jpg",
  "/images/gallery6.jpg",
];

const services = [
  {
    title: "Full-Day Wedding Coverage",
    description:
      "10 hours of coverage, from getting ready to the final dance. Includes a second shooter and an online gallery.",
  },
  {
    title: "Elopement Package",
    description:
      "Up to 4 hours of intimate coverage for your special day. Perfect for small ceremonies.",
  },
  {
    title: "Engagement Session",
    description:
      "A 2-hour session at a location of your choice to celebrate your engagement.",
  },
];

const cultureTags = [
  {
    label: "Bilingual (English/Spanish)",
    color: "border-green-500 text-green-400",
  },
  { label: "LGBTQ+ Friendly", color: "border-accent text-accent" },
  {
    label: "Traditional Ceremonies",
    color: "border-yellow-500 text-yellow-400",
  },
  { label: "Candid Style", color: "border-blue-500 text-blue-400" },
];

const reviews = [
  {
    name: "Sarah L.",
    date: "June 2024",
    rating: 5,
    text: "Elena was an absolute dream to work with! She made us feel so comfortable and the photos are beyond stunning. She captured our day perfectly.",
  },
  {
    name: "Michael B.",
    date: "May 2024",
    rating: 5,
    text: "Incredible talent and professionalism. Elena captured moments we didn't even know were happening. Highly recommend!",
  },
];

export default function VendorProfile() {
  const [rating, setRating] = useState(4);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d1a12] text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0d1a12] border-b border-green-900/30">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 max-w-[1400px] mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold">EVA</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4 lg:gap-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white font-medium text-sm"
              >
                Home
              </a>
              <a href="#" className="text-green-400 font-medium text-sm">
                Explore
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white font-medium text-sm"
              >
                Messages
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white font-medium text-sm"
              >
                Help
              </a>
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop Search */}
            <div className="hidden sm:block relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 rounded-lg bg-[#1a2e22] text-white border border-green-900/30 focus:outline-none focus:ring-2 focus:ring-green-500 w-32 lg:w-48 text-sm"
              />
            </div>
            <button className="p-2 hover:bg-green-900/20 rounded-full relative">
              <Bell size={20} className="text-gray-400" />
            </button>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-orange-300 to-orange-400" />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-green-900/20 rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-green-900/30 bg-[#0d1a12] px-4 py-4">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#1a2e22] text-white border border-green-900/30 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
            <nav className="flex flex-col gap-3">
              <a
                href="#"
                className="text-gray-400 hover:text-white font-medium py-2"
              >
                Home
              </a>
              <a href="#" className="text-green-400 font-medium py-2">
                Explore
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white font-medium py-2"
              >
                Messages
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white font-medium py-2"
              >
                Help
              </a>
            </nav>
          </div>
        )}
      </header>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-linear-to-br from-gray-600 to-gray-700 overflow-hidden shrink-0">
              <div className="w-full h-full bg-gray-500" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                Elena Rosas Photography
              </h1>
              <p className="text-gray-400 mb-1 text-sm sm:text-base">
                Wedding Photographer
              </p>
              <p className="text-gray-500 text-sm">Brooklyn, New York</p>
            </div>
          </div>
          <button className="bg-green-500 text-white font-semibold px-6 sm:px-8 py-3 rounded-full hover:bg-green-600 transition-colors w-full sm:w-auto text-sm sm:text-base">
            Get a Quote
          </button>
        </div>

        {/* Gallery */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-lg sm:text-xl font-bold text-green-400 mb-4 sm:mb-6">
            Gallery
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
            {galleryImages.map((_, idx) => (
              <div
                key={idx}
                className={`rounded-lg sm:rounded-xl overflow-hidden bg-gray-700 ${
                  idx === 0
                    ? "col-span-2 row-span-2 aspect-square sm:col-span-1 sm:row-span-2 sm:h-64"
                    : "aspect-square sm:h-28"
                }`}
              >
                <div className="w-full h-full bg-linear-to-br from-gray-600 to-gray-700" />
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column */}
          <div>
            {/* About */}
            <section className="mb-8 sm:mb-10">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                About Elena Rosas
              </h2>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                With over a decade of experience, Elena Rosas Photography
                specializes in capturing authentic, emotional moments. My
                philosophy is to blend into the background, allowing your day to
                unfold naturally while I document the genuine smiles, tears, and
                laughter. I believe in creating timeless images that tell your
                unique love story for generations to come.
              </p>
            </section>

            {/* Services */}
            <section className="mb-8 sm:mb-10">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
                Services
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {services.map((service, idx) => (
                  <div
                    key={idx}
                    className="bg-[#1a2e22] rounded-xl p-4 sm:p-5 border border-green-900/30"
                  >
                    <h3 className="font-bold text-green-400 mb-2 text-sm sm:text-base">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Culture-Fit Tags */}
            <section className="mb-8 lg:mb-0">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                Culture-Fit Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {cultureTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm font-medium ${tag.color}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Reviews */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
              Ratings & Reviews
            </h2>

            {/* Rating Summary */}
            <div className="bg-[#1a2e22] rounded-xl p-4 sm:p-6 border border-green-900/30 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
                <div>
                  <div className="text-4xl sm:text-5xl font-bold mb-2">4.9</div>
                  <div className="flex gap-1 justify-center sm:justify-start">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="text-green-500 fill-green-500"
                      />
                    ))}
                  </div>
                </div>
                <div className="text-gray-400 text-sm sm:text-base">
                  Based on{" "}
                  <span className="text-white font-semibold">124 reviews</span>{" "}
                  from verified clients.
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              {reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="border-b border-green-900/30 pb-4 sm:pb-6"
                >
                  <div className="flex items-start sm:items-center justify-between mb-2 sm:mb-3 gap-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-sm sm:text-base">
                          {review.name}
                        </p>
                        <p className="text-gray-500 text-xs sm:text-sm">
                          {review.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 sm:gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < review.rating
                              ? "text-green-500 fill-green-500"
                              : "text-gray-600"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Leave a Review */}
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                Leave a Review
              </h3>

              <div className="mb-3 sm:mb-4">
                <p className="text-gray-400 text-xs sm:text-sm mb-2">
                  Your Rating
                </p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setRating(i + 1)}
                      className="focus:outline-none"
                    >
                      <Star
                        size={20}
                        className={
                          i < rating
                            ? "text-green-500 fill-green-500"
                            : "text-gray-600"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-3 sm:mb-4">
                <p className="text-gray-400 text-xs sm:text-sm mb-2">
                  Your Review
                </p>
                <textarea
                  placeholder="Share your experience..."
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#1a2e22] text-white border border-green-900/30 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm"
                />
              </div>

              <button className="bg-green-500 text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-green-600 transition-colors text-sm sm:text-base w-full sm:w-auto">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
