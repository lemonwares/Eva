"use client";

import { useState, useEffect } from "react";
import { Search, Hash, Link2, Loader2 } from "lucide-react";

interface EnhancedSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  searchType: "text" | "tags" | "slug" | "all";
  onSubmit: () => void;
  className?: string;
  loading?: boolean;
}

export default function EnhancedSearchInput({
  value,
  onChange,
  searchType,
  onSubmit,
  className = "",
  loading = false,
}: EnhancedSearchInputProps) {
  const [slugValidation, setSlugValidation] = useState<{
    exists: boolean;
    suggestions: any[];
    provider?: any;
  } | null>(null);
  const [validating, setValidating] = useState(false);

  // Validate slug in real-time
  useEffect(() => {
    if (searchType === "slug" && value.trim()) {
      const validateSlug = async () => {
        setValidating(true);
        try {
          const res = await fetch(
            `/api/slugs/check?slug=${encodeURIComponent(value.trim())}`
          );
          if (res.ok) {
            const data = await res.json();
            setSlugValidation(data);
          }
        } catch (err) {
          console.error("Slug validation error:", err);
        } finally {
          setValidating(false);
        }
      };

      const debounceTimer = setTimeout(validateSlug, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      setSlugValidation(null);
    }
  }, [value, searchType]);

  const getPlaceholder = () => {
    switch (searchType) {
      case "text":
        return "Search vendors, services, locations...";
      case "tags":
        return "Enter tags: wedding, photography, indian...";
      case "slug":
        return "Enter vendor slug: elite-photography-studios";
      default:
        return "Search vendors, tags, or enter a slug...";
    }
  };

  const getIcon = () => {
    switch (searchType) {
      case "tags":
        return Hash;
      case "slug":
        return Link2;
      default:
        return Search;
    }
  };

  const Icon = getIcon();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          className="w-full pl-12 pr-12 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />

        {/* Loading indicator */}
        {(loading || validating) && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Slug validation feedback */}
      {searchType === "slug" &&
        value.trim() &&
        slugValidation &&
        !validating && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 p-3">
            {slugValidation.exists ? (
              <div className="text-green-600 text-sm">
                ✓ Found: {slugValidation.provider?.businessName}
              </div>
            ) : (
              <div>
                <div className="text-orange-600 text-sm mb-2">
                  No vendor found with slug "{value}"
                </div>
                {slugValidation.suggestions.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Similar vendors:
                    </p>
                    <div className="space-y-1">
                      {slugValidation.suggestions
                        .slice(0, 3)
                        .map((suggestion: any) => (
                          <button
                            key={suggestion.id}
                            type="button"
                            onClick={() => onChange(suggestion.slug)}
                            className="block w-full text-left text-sm text-accent hover:underline"
                          >
                            {suggestion.slug} - {suggestion.businessName}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
    </div>
  );
}
