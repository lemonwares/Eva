"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login, loginWithGoogle } from "@/lib/auth-client";
import Link from "next/link";
import { logger } from "@/lib/logger";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [showPassword, setShowPassword] = useState(false);
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
        setError(result.message || "Invalid email or password");
        return;
      }

      let nextUrl = callbackUrl;
      if (!callbackUrl || callbackUrl === "/") {
        try {
          const meResponse = await fetch("/api/auth/me", {
            cache: "no-store",
            credentials: "include",
          });
          if (meResponse.ok) {
            const { user } = await meResponse.json();
            if (user?.role === "ADMINISTRATOR") {
              nextUrl = "/admin";
            } else if (user?.role === "PROFESSIONAL") {
              nextUrl = "/vendor";
            } else if (user?.role === "CLIENT" || user?.role === "VISITOR") {
              nextUrl = "/dashboard";
            }
          }
        } catch (lookupError) {
          logger.error(
            "Role lookup failed, falling back to callbackUrl",
            lookupError,
          );
        }
      }
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
      <div className="text-center mb-8">
        <h1 className="text-3xl font-playfair font-bold italic text-[#1e2433] mb-2">
          Welcome back
        </h1>
        <p className="text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-border/60 bg-white py-3.5 font-bold text-[#1e2433] transition hover:bg-gray-50 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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

      <div className="relative py-2 text-center text-xs text-muted-foreground uppercase tracking-widest font-medium">
        <span className="bg-white px-3 relative z-10">
          or sign in with email
        </span>
        <span className="absolute left-0 right-0 top-1/2 -z-0 border-t border-border/40" />
      </div>

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

      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-[#1e2433] ml-1">
            Email
          </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full rounded-xl border border-transparent bg-[#f3f4f6] px-4 py-3.5 text-foreground placeholder:text-muted-foreground transition-all focus:bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
            />
        </div>

        <div className="space-y-1.5">
           <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-bold text-[#1e2433]">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs font-bold text-[#0097b2] hover:underline"
              >
                Forgot password?
              </Link>
           </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
              className="w-full rounded-xl border border-transparent bg-[#f3f4f6] px-4 py-3.5 pr-12 text-foreground placeholder:text-muted-foreground transition-all focus:bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
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
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#0097b2] py-3.5 font-bold text-white shadow-lg shadow-cyan-900/10 transition hover:bg-[#0088a0] hover:scale-[1.01] hover:shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 mt-8"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
}
