"use client";

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
  const [isChecking, setIsChecking] = useState(true);
  const hasCheckedRef = useRef(false);

  // Check if already favorited on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      // Avoid duplicate checks and wait for auth to resolve
      if (hasCheckedRef.current) return;
      if (status === "loading") return;

      // Not logged in: nothing to fetch, just enable the button
      if (status !== "authenticated") {
        setIsChecking(false);
        hasCheckedRef.current = true;
        return;
      }

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 8000);

      try {
        const response = await fetch(`/api/favorites`, {
          signal: controller.signal,
        });

        if (response.ok) {
          const data = await response.json();
          const favorites = data.favorites || data;
          if (Array.isArray(favorites)) {
            const found = favorites.some(
              (fav: { provider: { id: string } }) =>
                fav.provider?.id === providerId
            );
            setIsFavorited(found);
          } else if (data.isFavorited !== undefined) {
            setIsFavorited(data.isFavorited);
          }
        }
      } catch (error) {
        // AbortError is expected on slow networks; just fall back to enabled state
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("Error checking favorite status:", error);
        }
      } finally {
        window.clearTimeout(timeoutId);
        setIsChecking(false);
        hasCheckedRef.current = true;
      }
    };

    if (!initialFavorited) {
      checkFavoriteStatus();
    } else if (!hasCheckedRef.current && status !== "loading") {
      // When we already know it's favorited, skip the fetch and unblock UI
      setIsChecking(false);
      hasCheckedRef.current = true;
    }
  }, [providerId, status, initialFavorited]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Redirect to login if not authenticated
    if (status !== "authenticated") {
      router.push(
        `/auth/signin?callbackUrl=${encodeURIComponent(
          window.location.pathname
        )}`
      );
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      if (isFavorited) {
        const response = await fetch(`/api/favorites/${providerId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsFavorited(false);
          onToggle?.(false);
        } else {
          console.error("Failed to remove favorite:", response.statusText);
        }
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ providerId }),
        });

        if (response.ok) {
          setIsFavorited(true);
          onToggle?.(true);
        } else {
          console.error("Failed to add favorite:", response.statusText);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      // Ensure loading state is always reset
      setIsLoading(false);
    }
  };

  const colors = {
    heart: isFavorited
      ? "text-red-500"
      : "text-slate-400 group-hover:text-red-400",
    bg: isFavorited
      ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30"
      : "bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-500/30",
    text: isFavorited
      ? "text-red-600 dark:text-red-400"
      : "text-slate-600 dark:text-slate-400",
  };

  const variants = {
    outline: `${colors.bg} border shadow-sm`,
    ghost: "hover:bg-slate-100 dark:hover:bg-gray-800",
    default: "bg-accent text-white hover:bg-accent/90 shadow-md",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      disabled={isChecking}
      className={`group relative flex items-center justify-center transition-all duration-300 ${
        iconOnly ? "rounded-full p-2.5" : "rounded-xl px-4 py-2"
      } ${variants[variant]} ${className} disabled:opacity-50`}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <AnimatePresence mode="wait">
        {isLoading || isChecking ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Loader2 size={iconOnly ? 20 : 18} />
          </motion.div>
        ) : (
          <motion.div
            key="heart"
            className="flex items-center gap-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
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
                size={iconOnly ? 20 : 18}
                className={`${colors.heart} transition-colors duration-300`}
                fill={isFavorited ? "currentColor" : "none"}
                strokeWidth={isFavorited ? 0 : 2}
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
      {isFavorited && !isLoading && (
        <motion.div
          layoutId="favorite-ring"
          className="absolute inset-0 rounded-full border-2 border-red-400/50"
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.button>
  );
}
