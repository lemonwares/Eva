"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface UseAuthOptions {
  required?: boolean;
  redirectTo?: string;
  allowedRoles?: string[];
}

export function useAuth(options: UseAuthOptions = {}) {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const { required = false, redirectTo = "/auth", allowedRoles } = options;

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const user = session?.user;
  const role = user?.role as string | undefined;

  useEffect(() => {
    // Wait for session to load
    if (isLoading) return;

    // Redirect if authentication is required but user is not logged in
    if (required && !isAuthenticated) {
      router.push(
        `${redirectTo}?callbackUrl=${encodeURIComponent(
          window.location.pathname
        )}`
      );
      return;
    }

    // Check role-based access
    if (
      isAuthenticated &&
      allowedRoles &&
      role &&
      !allowedRoles.includes(role)
    ) {
      router.push("/");
    }
  }, [
    isLoading,
    isAuthenticated,
    required,
    redirectTo,
    allowedRoles,
    role,
    router,
  ]);

  return {
    user,
    role,
    isLoading,
    isAuthenticated,
    status,
    session,
    update,
  };
}

export function useRequireAuth(options: Omit<UseAuthOptions, "required"> = {}) {
  return useAuth({ ...options, required: true });
}

export function useRequireAdmin() {
  return useRequireAuth({ allowedRoles: ["ADMINISTRATOR"] });
}

export function useRequireVendor() {
  return useRequireAuth({ allowedRoles: ["PROFESSIONAL", "ADMINISTRATOR"] });
}

export function useRequireClient() {
  return useRequireAuth({ allowedRoles: ["CLIENT", "ADMINISTRATOR"] });
}
