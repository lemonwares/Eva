"use client";

import { Eye, EyeOff, Mail, Shield, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login, loginWithGoogle } from "@/lib/auth-client";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login({ email, password }, callbackUrl);

      if (!result.success) {
        // Show a specific error if the backend says email is not verified
        if (
          result.message?.toLowerCase().includes("verify your email") ||
          result.error?.toLowerCase().includes("verify your email")
        ) {
          setError(
            "Your email address is not verified. Please check your inbox for a verification link before logging in."
          );
        } else {
          setError(result.message);
        }
        return;
      }

      // After login, redirect users based on their role: admins to /admin, vendors to /vendor, clients to /dashboard
      let nextUrl = callbackUrl;
      // Only do role-based redirect if callbackUrl is "/" or not set
      if (!callbackUrl || callbackUrl === "/") {
        try {
          // Force fresh session read (no cache) and include cookies so role is accurate right after login.
          const meResponse = await fetch("/api/auth/me", {
            cache: "no-store",
            credentials: "include",
          });
          if (meResponse.ok) {
            const { user } = await meResponse.json();
            // Route based on user role for optimal landing page
            if (user?.role === "ADMINISTRATOR") {
              nextUrl = "/admin";
            } else if (user?.role === "PROFESSIONAL") {
              nextUrl = "/vendor";
            } else if (user?.role === "CLIENT" || user?.role === "VISITOR") {
              // Route clients to their dashboard
              nextUrl = "/dashboard";
            }
          }
        } catch (lookupError) {
          console.error(
            "Role lookup failed, falling back to callbackUrl",
            lookupError
          );
        }
      }
      // Always push so router state matches the chosen destination.
      router.push(nextUrl);
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await loginWithGoogle(callbackUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-muted-foreground">
          Email address
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full rounded-xl border border-border bg-input/60 px-11 py-3 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-muted-foreground">
          Password
        </label>
        <div className="relative">
          <Shield className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
            className="w-full rounded-xl border border-border bg-input/60 px-11 py-3 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={loading}
            className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
          />
          Remember me
        </label>
        <Link
          href="/auth/forgot-password"
          className="font-medium text-accent hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-linear-to-r from-primary to-accent py-3 font-semibold text-primary-foreground shadow-[0_18px_45px_rgba(233,89,146,0.25)] transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in securely"
        )}
      </button>

      <div className="relative py-2 text-center text-sm text-muted-foreground">
        <span className="absolute left-0 right-0 top-1/2 -z-10 border-t border-border" />
        <span className="bg-card px-3">or continue with</span>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-secondary/50 py-3 font-medium text-muted-foreground transition hover:border-accent/40 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>
    </form>
  );
}
