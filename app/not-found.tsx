"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative mx-auto w-48 h-48">
            {/* Decorative circles */}
            <div className="absolute inset-0 rounded-full bg-accent/10 animate-pulse" />
            <div className="absolute inset-4 rounded-full bg-accent/20" />
            <div className="absolute inset-8 rounded-full bg-accent/30" />
            {/* 404 text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-bold text-accent">404</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors"
          >
            <Home size={18} />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border text-foreground font-semibold hover:bg-muted transition-colors"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Search Suggestion */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Looking for something specific?
          </p>
          <Link
            href="/vendors"
            className="inline-flex items-center gap-2 text-accent hover:underline font-medium"
          >
            <Search size={16} />
            Browse our vendors
          </Link>
        </div>
      </div>
    </div>
  );
}
