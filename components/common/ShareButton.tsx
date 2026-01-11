"use client";

import React, { useState } from "react";
import { 
  Share2, 
  X, 
  Copy, 
  Check, 
  Facebook, 
  Mail, 
  Linkedin,
  Globe
} from "lucide-react";
import { FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

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
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");
  const shareText = description || title;

  const handleMainAction = async () => {
    // Try native share on mobile if available
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Native share failed:", error);
        }
      }
    }
    // Desktop or native share failure: Show modal
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
      name: "WhatsApp",
      icon: FaWhatsapp,
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      hoverClass: "hover:bg-[#25D366] hover:text-white"
    },
    {
      name: "X",
      icon: FaXTwitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      hoverClass: "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      hoverClass: "hover:bg-[#1877F2] hover:text-white"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      hoverClass: "hover:bg-[#0A66C2] hover:text-white"
    },
    {
      name: "Email",
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
      hoverClass: "hover:bg-slate-700 hover:text-white"
    },
  ];

  const variants = {
    outline: "bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700/50 shadow-sm",
    ghost: "hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-600 dark:text-slate-400",
    default: "bg-accent text-white hover:bg-accent/90 shadow-md"
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleMainAction}
        className={`group flex items-center justify-center transition-all duration-300 ${
          iconOnly ? "rounded-full p-2.5" : "rounded-xl px-4 py-2"
        } ${variants[variant]} ${className}`}
        aria-label="Share content"
      >
        <Share2 size={iconOnly ? 20 : 18} className="transition-colors group-hover:text-accent" />
        {!iconOnly && <span className="ml-2 font-semibold text-sm">Share</span>}
      </motion.button>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white/95 dark:bg-gray-900/95 shadow-2xl backdrop-blur-xl border border-white/20 dark:border-white/10"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-accent/10 text-accent">
                    <Share2 size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Share this listing</h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-8">
                {/* Social Grid */}
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Share via</p>
                  <div className="flex justify-between items-center bg-white dark:bg-gray-900 shadow-lg border border-slate-50 dark:border-gray-800 px-6 py-4 rounded-3xl">
                    {shareLinks.map((link) => (
                      <motion.a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.9 }}
                        className={`flex flex-col items-center gap-2 p-2 rounded-2xl transition-all duration-300 ${link.hoverClass} group/icon`}
                        title={link.name}
                      >
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-gray-800 group-hover/icon:bg-transparent transition-colors">
                          <link.icon size={24} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-tighter opacity-0 group-hover/icon:opacity-100 transition-opacity">
                          {link.name}
                        </span>
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Copy Link Section */}
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Copy link</p>
                  <div className="relative group">
                    <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-slate-100 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700/50 group-hover:border-accent/30 transition-colors">
                      <div className="pl-3 text-slate-400">
                        <Globe size={18} />
                      </div>
                      <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="flex-1 bg-transparent text-sm font-medium text-slate-600 dark:text-slate-300 truncate outline-none select-all"
                      />
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={copyToClipboard}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                          copied
                            ? "bg-green-500 text-white"
                            : "bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:bg-slate-800"
                        }`}
                      >
                        {copied ? (
                          <motion.div
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-2"
                          >
                            <Check size={16} />
                            <span>Copied</span>
                          </motion.div>
                        ) : (
                          <>
                            <Copy size={16} />
                            <span>Copy</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Quote */}
              <div className="p-6 bg-slate-50/50 dark:bg-gray-800/30">
                <p className="text-xs text-center text-slate-400 italic">
                  "Great finds are better when shared."
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
