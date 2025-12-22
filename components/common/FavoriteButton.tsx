"use client";

import React, { useState, useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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

  // Simple dark mode detection based on system preference
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setDarkMode(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if already favorited on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (status !== "authenticated") {
        setIsChecking(false);
        return;
      }

      try {
        const response = await fetch(`/api/favorites`);
        if (response.ok) {
          const data = await response.json();
          // API returns { favorites: [...], pagination: {...} }
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
        console.error("Error checking favorite status:", error);
      } finally {
        setIsChecking(false);
      }
    };

    if (!initialFavorited) {
      checkFavoriteStatus();
    } else {
      setIsChecking(false);
    }
  }, [providerId, status, initialFavorited]);

  const handleToggle = async () => {
    // Redirect to login if not authenticated
    if (status !== "authenticated") {
      router.push(
        `/auth/signin?callbackUrl=${encodeURIComponent(
          window.location.pathname
        )}`
      );
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`/api/favorites/${providerId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsFavorited(false);
          onToggle?.(false);
        }
      } else {
        // Add to favorites
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ providerId }),
        });

        if (response.ok) {
          setIsFavorited(true);
          onToggle?.(true);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonClasses = () => {
    const base = "transition-all";
    switch (variant) {
      case "outline":
        return `${base} p-3 rounded-full border bg-white ${
          isFavorited
            ? "border-red-500 bg-red-50 dark:bg-red-500/10 hover:scale-[1.1] transition-all duration-200 ease-in-out"
            : darkMode
            ? "border-gray-600 hover:bg-gray-700"
            : "border-gray-300 hover:bg-gray-100"
        }`;
      case "ghost":
        return `${base} p-2 rounded-lg ${
          isFavorited
            ? "text-red-500"
            : darkMode
            ? "hover:bg-gray-700"
            : "hover:bg-gray-100"
        }`;
      default:
        return `${base} p-3 rounded-full ${
          isFavorited
            ? "bg-red-500 text-white"
            : "bg-pink-500 text-white hover:bg-pink-600"
        }`;
    }
  };

  const getIconColor = () => {
    if (isLoading || isChecking)
      return darkMode ? "text-accent" : "text-accent";
    if (isFavorited) return "text-red-500";
    return darkMode ? "text-accent" : "text-accent";
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading || isChecking}
      className={`${getButtonClasses()} ${className} disabled:opacity-50`}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      {isLoading || isChecking ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <>
          <Heart
            size={20}
            className={getIconColor()}
            fill={isFavorited ? "currentColor" : "none"}
          />
          {!iconOnly && (
            <span className="ml-2">{isFavorited ? "Saved" : "Save"}</span>
          )}
        </>
      )}
    </button>
  );
}
