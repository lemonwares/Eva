"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Image from "next/image";
import Link from "next/link";
import {
  FiHeart,
  FiMapPin,
  FiStar,
  FiGrid,
  FiList,
  FiSearch,
  FiLoader,
  FiTrash2,
  FiExternalLink,
} from "react-icons/fi";

interface FavoriteVendor {
  id: string;
  createdAt: string;
  provider: {
    id: string;
    businessName: string;
    coverImage: string | null;
    description: string | null;
    city: string | null;
    averageRating: number | null;
    reviewCount: number;
    priceFrom: number | null;
    isPublished: boolean;
  };
}

export default function FavoritesPage() {
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

  const [favorites, setFavorites] = useState<FavoriteVendor[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<FavoriteVendor[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/favorites");
    }
  }, [status, router]);

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (status !== "authenticated") return;

      try {
        const response = await fetch("/api/favorites");
        if (response.ok) {
          const data = await response.json();
          // API returns { favorites: [...], pagination: {...} }
          const favoritesData = data.favorites || data;
          setFavorites(favoritesData);
          setFilteredFavorites(favoritesData);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [status]);

  // Filter favorites based on search and category
  useEffect(() => {
    let filtered = [...favorites];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (fav) =>
          fav.provider.businessName.toLowerCase().includes(query) ||
          fav.provider.description?.toLowerCase().includes(query) ||
          fav.provider.city?.toLowerCase().includes(query)
      );
    }

    setFilteredFavorites(filtered);
  }, [searchQuery, favorites]);

  // Remove from favorites
  const handleRemoveFavorite = async (providerId: string) => {
    setRemovingId(providerId);

    try {
      const response = await fetch(`/api/favorites/${providerId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFavorites((prev) =>
          prev.filter((fav) => fav.provider.id !== providerId)
        );
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    } finally {
      setRemovingId(null);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div
        className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <FiLoader
              className={`w-8 h-8 animate-spin ${
                darkMode ? "text-pink-500" : "text-pink-600"
              }`}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-linear-to-br from-pink-500 to-red-500 rounded-xl text-white">
              <FiHeart className="w-6 h-6" />
            </div>
            <div>
              <h1
                className={`text-2xl md:text-3xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                My Favorites
              </h1>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {favorites.length}{" "}
                {favorites.length === 1 ? "vendor" : "vendors"} saved
              </p>
            </div>
          </div>
        </div>

        {/* Filters & View Toggle */}
        <div
          className={`p-4 rounded-xl mb-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow-sm`}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="text"
                placeholder="Search favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-pink-500`}
              />
            </div>

            {/* View Toggle */}
            <div
              className={`flex rounded-lg border ${
                darkMode ? "border-gray-600" : "border-gray-200"
              } overflow-hidden`}
            >
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 ${
                  viewMode === "grid"
                    ? "bg-pink-500 text-white"
                    : darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-50 text-gray-600"
                } transition-colors`}
                aria-label="Grid view"
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 ${
                  viewMode === "list"
                    ? "bg-pink-500 text-white"
                    : darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-50 text-gray-600"
                } transition-colors`}
                aria-label="List view"
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Favorites List/Grid */}
        {(Array.isArray(filteredFavorites) ? filteredFavorites.length : 0) ===
        0 ? (
          <div
            className={`text-center py-16 rounded-xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-sm`}
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-linear-to-br from-pink-100 to-red-100 flex items-center justify-center">
              <FiHeart className="w-10 h-10 text-pink-500" />
            </div>
            <h3
              className={`text-xl font-semibold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {searchQuery ? "No matches found" : "No favorites yet"}
            </h3>
            <p
              className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              {searchQuery
                ? "Try adjusting your search"
                : "Start exploring and save vendors you love!"}
            </p>
            {!searchQuery && (
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all"
              >
                <FiSearch className="w-5 h-5" />
                Explore Vendors
              </Link>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(Array.isArray(filteredFavorites) ? filteredFavorites : []).map(
              (fav) => (
                <div
                  key={fav.id}
                  className={`group rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  {/* Image */}
                  <div className="relative aspect-4/3 overflow-hidden">
                    {fav.provider.coverImage ? (
                      <Image
                        src={fav.provider.coverImage}
                        alt={fav.provider.businessName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                          {fav.provider.businessName.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFavorite(fav.provider.id)}
                      disabled={removingId === fav.provider.id}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                      aria-label="Remove from favorites"
                    >
                      {removingId === fav.provider.id ? (
                        <FiLoader className="w-4 h-4 animate-spin" />
                      ) : (
                        <FiTrash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <Link href={`/vendors/${fav.provider.id}`}>
                      <h3
                        className={`font-semibold mb-1 hover:text-pink-500 transition-colors ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {fav.provider.businessName}
                      </h3>
                    </Link>

                    {fav.provider.city && (
                      <div
                        className={`flex items-center gap-1 text-sm mb-2 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        <FiMapPin className="w-3.5 h-3.5" />
                        <span>{fav.provider.city}</span>
                      </div>
                    )}

                    {/* Rating */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span
                          className={`text-sm font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {fav.provider.averageRating?.toFixed(1) || "New"}
                        </span>
                        <span
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          ({fav.provider.reviewCount})
                        </span>
                      </div>

                      <Link
                        href={`/vendors/${fav.provider.id}`}
                        className="text-pink-500 hover:text-pink-600 transition-colors"
                      >
                        <FiExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFavorites.map((fav) => (
              <div
                key={fav.id}
                className={`flex flex-col sm:flex-row gap-4 p-4 rounded-xl shadow-sm ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                {/* Image */}
                <div className="relative w-full sm:w-48 aspect-4/3 sm:aspect-square rounded-lg overflow-hidden shrink-0">
                  {fav.provider.coverImage ? (
                    <Image
                      src={fav.provider.coverImage}
                      alt={fav.provider.businessName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {fav.provider.businessName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <Link href={`/vendors/${fav.provider.id}`}>
                        <h3
                          className={`text-lg font-semibold hover:text-pink-500 transition-colors ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {fav.provider.businessName}
                        </h3>
                      </Link>
                    </div>

                    <button
                      onClick={() => handleRemoveFavorite(fav.provider.id)}
                      disabled={removingId === fav.provider.id}
                      className={`p-2 rounded-lg transition-colors ${
                        darkMode
                          ? "bg-gray-700 hover:bg-red-500/20 text-red-400"
                          : "bg-gray-100 hover:bg-red-100 text-red-500"
                      } disabled:opacity-50`}
                      aria-label="Remove from favorites"
                    >
                      {removingId === fav.provider.id ? (
                        <FiLoader className="w-4 h-4 animate-spin" />
                      ) : (
                        <FiTrash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {fav.provider.description && (
                    <p
                      className={`text-sm mb-3 line-clamp-2 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {fav.provider.description}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {fav.provider.city && (
                        <div
                          className={`flex items-center gap-1 text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          <FiMapPin className="w-4 h-4" />
                          <span>{fav.provider.city}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span
                          className={`text-sm font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {fav.provider.averageRating?.toFixed(1) || "New"}
                        </span>
                        <span
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          ({fav.provider.reviewCount} reviews)
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/vendors/${fav.provider.id}`}
                      className="flex items-center gap-1 text-sm text-pink-500 hover:text-pink-600 transition-colors"
                    >
                      View Profile
                      <FiExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
