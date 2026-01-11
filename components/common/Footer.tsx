"use client";

import Link from "next/link";
import {
  LoaderCircle,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { IoToggle } from "react-icons/io5";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Footer() {
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null as any);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = () => {
    setShowInstallModal(true);
  };

  const handleCloseModal = () => {
    setShowInstallModal(false);
  };

  const handleContinue = async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setIsInstalling(false);
      setShowInstallModal(false);
    }
  };
  return (
    <footer className="bg-black text-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="font-bold text-3xl tracking-wide">EVA</div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Connecting you with real people & trusted vendors to make
              unforgettable moments
            </p>

            <button
              onClick={handleInstallClick}
              className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-1 py-1 pr-6 hover:bg-white/10 transition-colors w-fit"
            >
              <div className="relative h-8 w-14 rounded-full bg-white transition-colors">
                <div className="absolute top-1 left-1 h-6 w-6 rounded-full bg-black shadow-sm" />
              </div>
              <span className="font-medium text-sm">Install EVA</span>
            </button>

            {/* Install Modal */}
            {showInstallModal && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                onClick={handleCloseModal}
              >
                <div
                  className="bg-white text-gray-900 rounded-lg shadow-lg p-6 min-w-[300px] max-w-[90vw]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-lg font-semibold mb-2">Install EVA</h2>
                  <p className="mb-4">
                    You're about to install this app on your device. Continue?
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-black text-white flex items-center gap-2"
                      onClick={handleContinue}
                      disabled={isInstalling}
                    >
                      {isInstalling ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="loader mr-2 text-white text-xl"
                        >
                          <LoaderCircle size={20} />
                        </motion.span>
                      ) : null}
                      {isInstalling ? "Installing..." : "Continue"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>
                <Link
                  href="/vendors"
                  className="hover:text-white transition-colors"
                >
                  Find Vendors
                </Link>
              </li>
              <li>
                <Link
                  href="/vendor/onboarding"
                  className="hover:text-white transition-colors"
                >
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For You */}
          <div>
            <h3 className="font-semibold text-lg mb-6">For You</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>
                <Link
                  href="/vendor"
                  className="hover:text-white transition-colors"
                >
                  Vendor Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/quotes"
                  className="hover:text-white transition-colors"
                >
                  My Quotes
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/bookings"
                  className="hover:text-white transition-colors"
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Connect With Us</h3>
            <div className="flex items-center gap-4 mb-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="mailto:hello@evalocal.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
            <a
              href="mailto:hello@evalocal.com"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              hello@evalocal.com
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} EVA. All rights reserved.</p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
