"use client";

import { useState, useEffect, useCallback } from "react";
import type { PaginatedResponse, SearchFilters } from "./types";

// Generic fetch hook
interface UseFetchOptions<T> {
  initialData?: T;
  enabled?: boolean;
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useFetch<T>(
  url: string | null,
  options: UseFetchOptions<T> = {}
): UseFetchResult<T> {
  const { initialData = null, enabled = true } = options;
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(enabled && !!url);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result.data ?? result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (enabled && url) {
      fetchData();
    }
  }, [enabled, url, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Paginated fetch hook
interface UsePaginatedOptions<T> {
  initialPage?: number;
  limit?: number;
  initialFilters?: Record<string, string | string[] | undefined>;
}

interface UsePaginatedResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  page: number;
  totalPages: number;
  total: number;
  hasMore: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setFilters: (filters: Record<string, string | string[] | undefined>) => void;
  refetch: () => Promise<void>;
}

export function usePaginated<T>(
  baseUrl: string,
  options: UsePaginatedOptions<T> = {}
): UsePaginatedResult<T> {
  const { initialPage = 1, limit = 20, initialFilters = {} } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState(initialFilters);

  const totalPages = Math.ceil(total / limit);
  const hasMore = page < totalPages;

  const buildUrl = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, value);
        }
      }
    });

    return `${baseUrl}?${params.toString()}`;
  }, [baseUrl, page, limit, filters]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(buildUrl());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: { data: T[]; meta: { total: number } } =
        await response.json();
      setData(result.data);
      setTotal(result.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  }, [buildUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const goToPage = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
      }
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    if (hasMore) setPage((p) => p + 1);
  }, [hasMore]);

  const prevPage = useCallback(() => {
    if (page > 1) setPage((p) => p - 1);
  }, [page]);

  const updateFilters = useCallback(
    (newFilters: Record<string, string | string[] | undefined>) => {
      setFilters(newFilters);
      setPage(1); // Reset to first page when filters change
    },
    []
  );

  return {
    data,
    loading,
    error,
    page,
    totalPages,
    total,
    hasMore,
    goToPage,
    nextPage,
    prevPage,
    setFilters: updateFilters,
    refetch: fetchData,
  };
}

// Mutation hook (POST, PUT, PATCH, DELETE)
interface UseMutationOptions<T, V> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseMutationResult<T, V> {
  mutate: (variables: V) => Promise<T | null>;
  loading: boolean;
  error: Error | null;
  data: T | null;
  reset: () => void;
}

export function useMutation<T, V>(
  url: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
  options: UseMutationOptions<T, V> = {}
): UseMutationResult<T, V> {
  const { onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (variables: V): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(variables),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }

        const result = await response.json();
        const responseData = result.data ?? result;
        setData(responseData);
        onSuccess?.(responseData);
        return responseData;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("An error occurred");
        setError(error);
        onError?.(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, method, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { mutate, loading, error, data, reset };
}

// Provider search hook
export function useProviderSearch(initialFilters: SearchFilters = {}) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.city) params.set("city", filters.city);
    if (filters.state) params.set("state", filters.state);
    if (filters.priceMin) params.set("priceMin", String(filters.priceMin));
    if (filters.priceMax) params.set("priceMax", String(filters.priceMax));
    if (filters.rating) params.set("rating", String(filters.rating));
    if (filters.verified) params.set("verified", "true");
    if (filters.featured) params.set("featured", "true");
    if (filters.cultureTags?.length) {
      filters.cultureTags.forEach((tag) => params.append("cultureTags", tag));
    }

    return params.toString();
  }, [filters]);

  const url = `/api/providers?${buildQueryString()}`;
  const { data, loading, error, refetch } =
    useFetch<PaginatedResponse<unknown>>(url);

  return {
    providers: data?.data ?? [],
    loading,
    error,
    filters,
    setFilters,
    refetch,
    total: data?.meta?.total ?? 0,
  };
}

// User session hook
export function useSession() {
  const { data, loading, error, refetch } = useFetch<{
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      image?: string;
    };
  }>("/api/auth/me");

  return {
    user: data?.user ?? null,
    loading,
    error,
    isAuthenticated: !!data?.user,
    refetch,
  };
}

// Notifications hook
export function useNotifications() {
  const { data, loading, refetch } = useFetch<{
    notifications: Array<{
      id: string;
      type: string;
      title: string;
      message: string;
      read: boolean;
      createdAt: string;
    }>;
    unreadCount: number;
  }>("/api/notifications");

  const markAsRead = useCallback(
    async (id: string) => {
      await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      refetch();
    },
    [refetch]
  );

  const markAllAsRead = useCallback(async () => {
    await fetch("/api/notifications/mark-all-read", {
      method: "POST",
    });
    refetch();
  }, [refetch]);

  return {
    notifications: data?.notifications ?? [],
    unreadCount: data?.unreadCount ?? 0,
    loading,
    refetch,
    markAsRead,
    markAllAsRead,
  };
}

// Debounced value hook
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Local storage hook
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }

        return valueToStore;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}

// Toggle hook
export function useToggle(
  initialValue: boolean = false
): [boolean, () => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}

// Clipboard hook
export function useClipboard(timeout: number = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), timeout);
        return true;
      } catch {
        return false;
      }
    },
    [timeout]
  );

  return { copy, copied };
}
