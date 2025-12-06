"use client";

import { useState, useEffect } from "react";
import { WifiOff, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  const [isRetrying, setIsRetrying] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-redirect when back online
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      // Try to fetch a simple resource to check connectivity
      const response = await fetch("/api/health", {
        method: "HEAD",
        cache: "no-store",
      });
      if (response.ok) {
        window.location.reload();
      }
    } catch {
      // Still offline
    } finally {
      setIsRetrying(false);
    }
  };

  if (isOnline) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background to-muted flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            You're back online!
          </h2>
          <p className="text-muted-foreground">Redirecting you now...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Offline Icon */}
        <div className="mb-8">
          <div className="relative mx-auto w-32 h-32">
            {/* Animated rings */}
            <div
              className="absolute inset-0 rounded-full border-4 border-muted-foreground/20 animate-ping"
              style={{ animationDuration: "2s" }}
            />
            <div className="absolute inset-2 rounded-full border-2 border-muted-foreground/30" />
            {/* Icon container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <WifiOff size={40} className="text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          You're Offline
        </h1>
        <p className="text-muted-foreground mb-2 text-lg">
          It looks like you've lost your internet connection.
        </p>
        <p className="text-muted-foreground mb-8">
          Please check your network settings and try again.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={18} className={isRetrying ? "animate-spin" : ""} />
            {isRetrying ? "Checking..." : "Try Again"}
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border text-foreground font-semibold hover:bg-muted transition-colors"
          >
            <Home size={18} />
            Go Home
          </Link>
        </div>

        {/* Tips */}
        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Troubleshooting Tips
          </h3>
          <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-xs mx-auto">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              Check if your Wi-Fi is turned on
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              Try switching to mobile data
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              Move closer to your router
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              Restart your device
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
