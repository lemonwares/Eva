"use client";

import Link from "next/link";
import { LoaderCircle, Mail, MapPin } from "lucide-react";
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
    <footer
      id="contact"
      className="bg-linear-to-b from-foreground to-foreground/95 text-background"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand Section */}
          <div>
            {/* <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="EVA Logo"
                width={48}
                height={48}
                className="h-12 w-12 rounded-2xl object-contain bg-white"
                priority
              />
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-background/70">
                  Event Vendor Atlas
                </p>
                <p className="text-base font-semibold">Book with confidence</p>
              </div>
            </div> */}
            <div className="font-bold text-2xl tracking-wide">EVA</div>
            <p className="mt-6 max-w-sm text-sm text-background/70">
              Connecting you with culturally-aware vendors, organisers, and
              spaces so every celebration feels authentically yours.
            </p>
            <div className="mt-6 space-y-3 text-sm text-background/80">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a
                  href="mailto:hello@evalocal.com"
                  className="hover:text-background"
                >
                  hello@evalocal.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>London • Remote worldwide</span>
              </div>
            </div>

            {/* Download knob section */}
            <div
              className="border border-gray-500 bg-gray-700 mt-5 rounded-md w-[300px] h-[50px] flex items-center py-1 px-2 gap-3"
              style={{ cursor: "pointer" }}
              onClick={handleInstallClick}
            >
              <IoToggle size={30} className="rotate-180 hover:cursor-pointer" />
              <span>Install EVA</span>
            </div>

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
                      className="px-4 py-2 rounded bg-accent text-white flex items-center gap-2"
                      onClick={handleContinue}
                      disabled={isInstalling}
                    >
                      {isInstalling ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="loader mr-2 text-white text-2xl"
                        >
                          <LoaderCircle className="" />
                        </motion.span> // Or use a spinner icon here
                      ) : null}
                      {isInstalling ? "Installing..." : "Continue"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-background/70">
              Company
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  href="/#about"
                  className="text-background/80 transition hover:text-background"
                >
                  About EVA
                </Link>
              </li>
              <li>
                <Link
                  href="/vendors"
                  className="text-background/80 transition hover:text-background"
                >
                  For vendors
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-background/80 transition hover:text-background"
                >
                  Help centre
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-background/80 transition hover:text-background"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-background/70">
              Legal
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-background/80 transition hover:text-background"
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-background/80 transition hover:text-background"
                >
                  Terms of service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-background/80 transition hover:text-background"
                >
                  Cookies policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-background/20 pt-8 text-sm text-background/70">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} EVA. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="hover:text-background transition"
              >
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-background transition">
                Terms
              </Link>
              <Link
                href="/cookies"
                className="hover:text-background transition"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
