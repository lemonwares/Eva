"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <Loader2
      className={`animate-spin text-[oklch(0.65_0.25_15)] ${sizes[size]} ${className}`}
    />
  );
}

export interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({
  message = "Loading...",
}: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" />
        <p className="text-[oklch(0.45_0.02_280)] font-medium">{message}</p>
      </div>
    </div>
  );
}

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  className = "",
}: LoadingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      <Spinner size="lg" />
      <p className="mt-4 text-[oklch(0.55_0.02_280)]">{message}</p>
    </div>
  );
}

// Skeleton components
export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[oklch(0.92_0.01_280)] rounded ${className}`}
    />
  );
}

export function SkeletonText({ className = "" }: SkeletonProps) {
  return <Skeleton className={`h-4 ${className}`} />;
}

export function SkeletonAvatar({ className = "" }: SkeletonProps) {
  return <Skeleton className={`w-10 h-10 rounded-full ${className}`} />;
}

export function SkeletonCard({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[oklch(0.92_0.01_280)] p-6 ${className}`}
    >
      <div className="flex items-center gap-4 mb-4">
        <SkeletonAvatar />
        <div className="flex-1 space-y-2">
          <SkeletonText className="w-3/4" />
          <SkeletonText className="w-1/2" />
        </div>
      </div>
      <div className="space-y-3">
        <SkeletonText />
        <SkeletonText className="w-5/6" />
        <SkeletonText className="w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <SkeletonText className="w-1/4" />
          <SkeletonText className="w-1/4" />
          <SkeletonText className="w-1/4" />
          <SkeletonText className="w-1/4" />
        </div>
      ))}
    </div>
  );
}
