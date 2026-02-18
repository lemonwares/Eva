"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Search, Hash, Link2, Loader2 } from "lucide-react";
import { logger } from "@/lib/logger";

interface SlugSuggestion {
  id: string;
  slug: string;
  businessName: string;
}

interface SlugValidation {
  exists: boolean;
  suggestions: SlugSuggestion[];
  provider?: { businessName: string };
}

interface EnhancedSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  searchType: "text" | "tags" | "slug" | "all";
  onSubmit: () => void;
  className?: string;
  loading?: boolean;
}

const SLUG_MIN_CHARS = 2;
const DEBOUNCE_MS = 400;

export default function EnhancedSearchInput({
  value,
  onChange,
  searchType,
  onSubmit,
  className = "",
  loading = false,
}: EnhancedSearchInputProps) {
  // Internal input state for debounced text typing
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [slugValidation, setSlugValidation] = useState<SlugValidation | null>(null);
  const [validating, setValidating] = useState(false);

  // Sync external value → local (e.g. when filters are cleared externally)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced onChange: pushes local value to parent after delay
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onChange(newValue);
      }, DEBOUNCE_MS);
    },
    [onChange],
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Validate slug in real-time with AbortController
  useEffect(() => {
    if (searchType === "slug" && localValue.trim().length >= SLUG_MIN_CHARS) {
      // Abort any in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const validateSlug = async () => {
        setValidating(true);
        try {
          const res = await fetch(
            `/api/slugs/check?slug=${encodeURIComponent(localValue.trim())}`,
            { signal: controller.signal },
          );
          if (res.ok) {
            const data = await res.json();
            setSlugValidation(data);
          }
        } catch (err: unknown) {
          if (err instanceof Error && err.name !== "AbortError") {
            logger.error("Slug validation error:", err);
          }
        } finally {
          if (!controller.signal.aborted) {
            setValidating(false);
          }
        }
      };

      const timer = setTimeout(validateSlug, DEBOUNCE_MS);
      return () => {
        clearTimeout(timer);
        controller.abort();
      };
    } else {
      setSlugValidation(null);
      setValidating(false);
    }
  }, [localValue, searchType]);

  // Memoized placeholder
  const placeholder = useMemo(() => {
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
  }, [searchType]);

  // Memoized icon
  const Icon = useMemo(() => {
    switch (searchType) {
      case "tags":
        return Hash;
      case "slug":
        return Link2;
      default:
        return Search;
    }
  }, [searchType]);

  // Stable keydown handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        // Flush any pending debounce immediately
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
          debounceRef.current = null;
        }
        onChange(localValue);
        onSubmit();
      }
    },
    [onChange, onSubmit, localValue],
  );

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
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
        localValue.trim().length >= SLUG_MIN_CHARS &&
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
                  No vendor found with slug &ldquo;{localValue}&rdquo;
                </div>
                {slugValidation.suggestions.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Similar vendors:
                    </p>
                    <div className="space-y-1">
                      {slugValidation.suggestions
                        .slice(0, 3)
                        .map((suggestion) => (
                          <button
                            key={suggestion.id}
                            type="button"
                            onClick={() => {
                              setLocalValue(suggestion.slug);
                              onChange(suggestion.slug);
                            }}
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
