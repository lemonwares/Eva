"use client";

import { Bell, AlertTriangle, Menu, X } from "lucide-react";
import { useState } from "react";

const quoteItems = [
  {
    service: "Full Day Coordination",
    description: "Coordination services for the entire wedding day.",
    quantity: 1,
    rate: "$3,500.00",
    amount: "$3,500.00",
  },
  {
    service: "Floral Arrangements",
    description: "Bridal bouquet, centerpieces, and ceremony decor.",
    quantity: 1,
    rate: "$1,200.00",
    amount: "$1,200.00",
  },
  {
    service: "Venue Lighting Package",
    description: "Uplighting and custom gobo projection.",
    quantity: 1,
    rate: "$500.00",
    amount: "$500.00",
  },
];

export default function QuoteReview() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-gray-800">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 max-w-[1400px] mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold">EVA</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8">
            <a
              href="#"
              className="text-gray-400 hover:text-white font-medium text-sm"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white font-medium text-sm"
            >
              Messages
            </a>
            <a href="#" className="text-white font-medium text-sm">
              Bookings
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white font-medium text-sm"
            >
              Favorites
            </a>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 hover:bg-gray-800 rounded-full relative">
              <Bell size={20} className="text-gray-400" />
            </button>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
              G
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-800 rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-[#0a0a0a] px-4 py-4">
            <nav className="flex flex-col gap-3">
              <a
                href="#"
                className="text-gray-400 hover:text-white font-medium py-2"
              >
                Dashboard
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white font-medium py-2"
              >
                Messages
              </a>
              <a href="#" className="text-white font-medium py-2">
                Bookings
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white font-medium py-2"
              >
                Favorites
              </a>
            </nav>
          </div>
        )}
      </header>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
          {/* Left Column - Summary & Actions */}
          <div className="lg:col-span-4 order-1 lg:order-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold italic mb-3 sm:mb-4">
              Review Your Quote
            </h1>
            <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
              Please review the details below from the vendor before proceeding.
            </p>

            {/* Vendor Info */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-linear-to-br from-purple-400 to-pink-400 shrink-0" />
              <div>
                <p className="font-bold text-base sm:text-lg">
                  Celebrations by Design
                </p>
                <p className="text-gray-500 text-xs sm:text-sm">
                  Wedding Planning Services
                </p>
              </div>
            </div>

            {/* Alert */}
            <div className="flex items-center gap-2 sm:gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 mb-6 sm:mb-8">
              <AlertTriangle size={18} className="text-yellow-500 shrink-0" />
              <span className="text-yellow-500 font-medium text-xs sm:text-sm">
                Awaiting Your Response. Expires in 3 days.
              </span>
            </div>

            {/* Total */}
            <div className="mb-6 sm:mb-8">
              <p className="text-gray-500 text-xs sm:text-sm mb-1">
                Total Quote Amount
              </p>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                $5,500.00
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2 sm:space-y-3">
              <button className="w-full bg-green-500 text-white font-semibold py-3 sm:py-4 rounded-xl hover:bg-green-600 transition-colors text-sm sm:text-base">
                Accept Quote & Pay Deposit
              </button>
              <button className="w-full bg-gray-800 text-white font-semibold py-3 sm:py-4 rounded-xl hover:bg-gray-700 transition-colors text-sm sm:text-base">
                Request Changes
              </button>
              <button className="w-full text-gray-500 font-medium py-2 hover:text-gray-400 transition-colors text-sm sm:text-base">
                Decline Quote
              </button>
            </div>
          </div>

          {/* Right Column - Quote Details */}
          <div className="lg:col-span-8 order-2 lg:order-2">
            <div className="bg-[#1a1a1a] rounded-xl sm:rounded-2xl border border-gray-800 overflow-hidden">
              {/* Quote Header */}
              <div className="bg-[#252525] px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
                  Quote Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm mb-1">
                      Quote ID
                    </p>
                    <p className="font-semibold text-sm sm:text-base">
                      Q-2024-8817
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm mb-1">
                      Issue Date
                    </p>
                    <p className="font-semibold text-sm sm:text-base">
                      October 26, 2024
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm mb-1">
                      Expiry Date
                    </p>
                    <p className="font-semibold text-sm sm:text-base">
                      November 2, 2024
                    </p>
                  </div>
                </div>
              </div>

              {/* Quote Items - Desktop Table */}
              <div className="hidden sm:block px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead>
                      <tr className="text-gray-500 text-xs sm:text-sm border-b border-gray-800">
                        <th className="text-left pb-3 sm:pb-4 font-medium">
                          Service / Item
                        </th>
                        <th className="text-left pb-3 sm:pb-4 font-medium hidden md:table-cell">
                          Description
                        </th>
                        <th className="text-center pb-3 sm:pb-4 font-medium">
                          Qty
                        </th>
                        <th className="text-right pb-3 sm:pb-4 font-medium">
                          Rate
                        </th>
                        <th className="text-right pb-3 sm:pb-4 font-medium">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {quoteItems.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-800">
                          <td className="py-3 sm:py-5 font-medium text-sm">
                            {item.service}
                          </td>
                          <td className="py-3 sm:py-5 text-gray-400 text-xs sm:text-sm hidden md:table-cell">
                            {item.description}
                          </td>
                          <td className="py-3 sm:py-5 text-center text-sm">
                            {item.quantity}
                          </td>
                          <td className="py-3 sm:py-5 text-right text-gray-400 text-sm">
                            {item.rate}
                          </td>
                          <td className="py-3 sm:py-5 text-right font-medium text-sm">
                            {item.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-800">
                  <div className="flex justify-end">
                    <div className="w-full sm:w-64 space-y-2 sm:space-y-3">
                      <div className="flex justify-between text-gray-400 text-sm">
                        <span>Subtotal</span>
                        <span className="text-white">$5,200.00</span>
                      </div>
                      <div className="flex justify-between text-gray-400 text-sm">
                        <span>Taxes & Fees (5.75%)</span>
                        <span className="text-white">$300.00</span>
                      </div>
                      <div className="flex justify-between font-bold text-base sm:text-lg pt-2 border-t border-gray-800">
                        <span>Total</span>
                        <span>$5,500.00</span>
                      </div>
                      <div className="flex justify-between text-green-400 font-semibold pt-2 text-sm sm:text-base">
                        <span>Deposit Due (50%)</span>
                        <span>$2,750.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote Items - Mobile Cards */}
              <div className="sm:hidden px-4 py-4">
                <div className="space-y-4">
                  {quoteItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[#252525] rounded-lg p-4 border border-gray-700"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{item.service}</h4>
                        <span className="font-bold text-green-400">
                          {item.amount}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs mb-3">
                        {item.description}
                      </p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Qty: {item.quantity}</span>
                        <span>Rate: {item.rate}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile Totals */}
                <div className="mt-4 pt-4 border-t border-gray-800 space-y-2">
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Subtotal</span>
                    <span className="text-white">$5,200.00</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Taxes & Fees (5.75%)</span>
                    <span className="text-white">$300.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-800">
                    <span>Total</span>
                    <span>$5,500.00</span>
                  </div>
                  <div className="flex justify-between text-green-400 font-semibold pt-2 text-sm">
                    <span>Deposit Due (50%)</span>
                    <span>$2,750.00</span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t border-gray-800">
                <h3 className="font-bold mb-2 sm:mb-3 text-sm sm:text-base">
                  Terms & Conditions
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  A 50% non-refundable deposit is required to secure your date.
                  The remaining balance is due 30 days prior to the event date.
                  Cancellations made within 60 days of the event are subject to
                  a 100% cancellation fee. By accepting this quote, you agree to
                  the full terms and conditions outlined in our service
                  agreement, which will be provided upon payment of the deposit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-8 sm:mt-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-xs sm:text-sm">
          <p>© 2024 EVA. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            <a href="#" className="hover:text-white">
              Help Center
            </a>
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
