"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Error Icon */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm">
          500
        </div>
      </div>

      {/* Error Message */}
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-center">
        Something went wrong!
      </h1>
      <p className="text-muted-foreground text-center max-w-md mb-2">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground mb-8">
          Error ID: {error.digest}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-all hover:-translate-y-0.5"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-foreground font-semibold hover:bg-accent transition-all hover:-translate-y-0.5"
        >
          <Home size={18} />
          Go Home
        </Link>
      </div>

      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Go back to previous page
      </button>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-accent/10 blur-2xl" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-accent/10 blur-3xl" />
    </div>
  );
}
