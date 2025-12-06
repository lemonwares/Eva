"use client";

import React, { useState, useEffect } from "react";
import { Share2, X, Copy, Check, Facebook, MessageCircle } from "lucide-react";
import { FaWhatsapp, FaXTwitter } from "react-icons/fa6";

interface ShareButtonProps {
  url?: string;
  title: string;
  description?: string;
  className?: string;
  iconOnly?: boolean;
  variant?: "default" | "outline" | "ghost";
}

export default function ShareButton({
  url,
  title,
  description,
  className = "",
  iconOnly = true,
  variant = "outline",
}: ShareButtonProps) {
  // Simple dark mode detection based on system preference
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setDarkMode(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");
  const shareText = description || title;

  const handleShare = async () => {
    // Try native share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (error) {
        // User cancelled or share failed, fall through to modal
        if ((error as Error).name === "AbortError") return;
      }
    }

    // Show modal for desktop or fallback
    setShowModal(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const shareLinks = [
    {
      name: "X (Twitter)",
      icon: FaXTwitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(shareUrl)}`,
      color: "bg-black text-white",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      color: "bg-blue-600 text-white",
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      url: `https://wa.me/?text=${encodeURIComponent(
        `${shareText} ${shareUrl}`
      )}`,
      color: "bg-green-500 text-white",
    },
    {
      name: "SMS",
      icon: MessageCircle,
      url: `sms:?body=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      color: "bg-blue-500 text-white",
    },
  ];

  const getButtonClasses = () => {
    const base = "transition-colors";
    switch (variant) {
      case "outline":
        return `${base} p-3 rounded-full border ${
          darkMode
            ? "border-gray-600 hover:bg-gray-700"
            : "border-gray-300 hover:bg-gray-100"
        }`;
      case "ghost":
        return `${base} p-2 rounded-lg ${
          darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
        }`;
      default:
        return `${base} p-3 rounded-full bg-pink-500 text-white hover:bg-pink-600`;
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        className={`${getButtonClasses()} ${className}`}
        aria-label="Share"
      >
        <Share2 size={20} />
        {!iconOnly && <span className="ml-2">Share</span>}
      </button>

      {/* Share Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowModal(false)}
        >
          <div
            className={`w-full max-w-sm rounded-2xl shadow-xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between p-4 border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Share
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className={`p-1.5 rounded-full ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <X
                  size={20}
                  className={darkMode ? "text-gray-400" : "text-gray-500"}
                />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Title Preview */}
              <p
                className={`text-sm mb-4 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {title}
              </p>

              {/* Social Share Buttons */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {shareLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl ${link.color} hover:opacity-90 transition-opacity`}
                  >
                    <link.icon className="w-6 h-6" />
                    <span className="text-xs">{link.name.split(" ")[0]}</span>
                  </a>
                ))}
              </div>

              {/* Copy Link */}
              <div
                className={`flex items-center gap-2 p-3 rounded-xl ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className={`flex-1 bg-transparent text-sm truncate ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                />
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    copied
                      ? "bg-green-500 text-white"
                      : "bg-pink-500 text-white hover:bg-pink-600"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
