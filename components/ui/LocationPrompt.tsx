"use client";

import { useState, useEffect } from "react";
import { MapPin, X, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LocationPromptProps {
  onAllow: () => void;
  onDecline: () => void;
  isOpen: boolean;
}

export default function LocationPrompt({
  onAllow,
  onDecline,
  isOpen,
}: LocationPromptProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShow(true), 1000); // Small delay for better UX
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:right-6 sm:left-auto z-[100] max-w-md"
        >
          <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <button
                onClick={onDecline}
                className="p-1.5 hover:bg-muted rounded-full text-muted-foreground transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground mb-1">
                Find vendors nearby?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Allow us to use your location to show vendors in your area. This
                helps us provide more relevant results.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onAllow}
                className="flex-1 py-2.5 bg-accent text-accent-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                Allow access
              </button>
              <button
                onClick={onDecline}
                className="flex-1 py-2.5 border border-border rounded-xl font-semibold text-sm hover:bg-muted transition"
              >
                Not now
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
