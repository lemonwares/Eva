"use client";

import { logger } from '@/lib/logger';
import React, { useState, useEffect, useRef } from "react";
import { Heart, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface FavoriteButtonProps {
  providerId: string;
  initialFavorited?: boolean;
  className?: string;
  iconOnly?: boolean;
  variant?: "default" | "outline" | "ghost";
  onToggle?: (isFavorited: boolean) => void;
}

export default function FavoriteButton({
  providerId,
  initialFavorited = false,
  className = "",
  iconOnly = true,
  variant = "outline",
  onToggle,
}: FavoriteButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  
  // Track the last providerId we successfully checked to avoid duplicate calls
  const lastCheckedIdRef = useRef<string | null>(null);

  // Sync with initialFavorited prop
  useEffect(() => {
    setIsFavorited(initialFavorited);
  }, [initialFavorited]);

  useEffect(() => {
    let isMounted = true;

    async function checkStatus() {
      // Don't check while auth is loading
      if (status === "loading") return;

      // Only check if authenticated
      if (status !== "authenticated") {
        if (isMounted) setIsChecking(false);
        return;
      }

      // Skip if we already checked this specific provider or it's provided as true
      if (lastCheckedIdRef.current === providerId) {
        if (isMounted) setIsChecking(false);
        return;
      }

      if (isMounted) setIsChecking(true);

      try {
        // Targeted API for single provider check
        const response = await fetch(`/api/favorites/${providerId}`);
        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setIsFavorited(!!data.isFavorited);
            lastCheckedIdRef.current = providerId;
          }
        }
      } catch (error) {
        logger.error("Error checking favorite status:", error);
      } finally {
        if (isMounted) setIsChecking(false);
      }
    }

    checkStatus();

    return () => {
      isMounted = false;
    };
  }, [providerId, status]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Redirect to login if not authenticated
    if (status !== "authenticated") {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (isLoading || isChecking) return;

    setIsLoading(true);
    const wasFavorited = isFavorited;
    
    // Optimistic UI update
    setIsFavorited(!wasFavorited);

    try {
      const response = await fetch(
        wasFavorited ? `/api/favorites/${providerId}` : "/api/favorites",
        {
          method: wasFavorited ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: wasFavorited ? undefined : JSON.stringify({ providerId }),
        }
      );

      if (!response.ok) {
        // Revert on error
        setIsFavorited(wasFavorited);
        logger.error("Failed to update favorite status");
      } else {
        onToggle?.(!wasFavorited);
      }
    } catch (error) {
      setIsFavorited(wasFavorited);
      logger.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const colors = {
    heart: isFavorited
      ? "text-red-500 fill-red-500"
      : "text-slate-400 group-hover:text-red-400",
    bg: isFavorited
      ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30"
      : "bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 hover:border-red-200",
    text: isFavorited ? "text-red-600 dark:text-red-400" : "text-slate-600 dark:text-slate-400",
  };

  const variants = {
    outline: `${colors.bg} border shadow-sm`,
    ghost: "hover:bg-slate-100 dark:hover:bg-gray-800",
    default: "bg-accent text-white hover:bg-accent/90 shadow-md",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      disabled={isChecking || isLoading}
      className={`group relative flex items-center justify-center transition-all duration-300 ${
        iconOnly ? "h-10 w-10 min-w-10 rounded-full" : "rounded-xl px-4 py-2"
      } ${variants[variant]} ${className} disabled:opacity-70`}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <AnimatePresence mode="wait">
        {isChecking || isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center"
          >
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          </motion.div>
        ) : (
          <motion.div
            key="heart"
            className="flex items-center gap-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <motion.div
              animate={
                isFavorited
                  ? {
                      scale: [1, 1.4, 1],
                      transition: { duration: 0.45, ease: "easeOut" },
                    }
                  : {}
              }
            >
              <Heart
                size={iconOnly ? 22 : 18}
                className={`${colors.heart} transition-all duration-300`}
                strokeWidth={isFavorited ? 0 : 2}
                fill={isFavorited ? "currentColor" : "none"}
              />
            </motion.div>

            {!iconOnly && (
              <span className={`text-sm font-semibold ${colors.text}`}>
                {isFavorited ? "Saved" : "Save"}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle feedback ring on active */}
      {isFavorited && !isLoading && !isChecking && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-red-400/50"
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.button>
  );
}

