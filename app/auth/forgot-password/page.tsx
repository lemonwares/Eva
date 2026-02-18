"use client";

import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { forgotPassword } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await forgotPassword(email);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 relative">
       {/* Top bar */}
      <div className="absolute top-6 left-6 z-20 hidden sm:flex items-center gap-4">
        <Link
          href="/auth"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-border shadow-sm">
             <span className="text-xs">←</span>
          </div>
          Back to Login
        </Link>
      </div>

      <div className="w-full max-w-[480px] space-y-6">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src="/images/brand/eva-logo-dark.png"
              alt="EVA Local"
              width={140}
              height={48}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-black/5">
            {success ? (
              <div className="text-center py-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-playfair font-bold italic text-[#1e2433] mb-2">
                  Check your email
                </h2>
                <p className="text-muted-foreground mb-6">
                  We&apos;ve sent a password reset link to{" "}
                  <strong className="text-foreground">{email}</strong>. Click
                  the link in the email to reset your password.
                </p>
                <div className="text-sm text-muted-foreground">
                  Didn&apos;t receive the email?{" "}
                  <button
                    onClick={() => setSuccess(false)}
                    className="font-bold text-[#0097b2] hover:underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            ) : (
              <>
                 <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-playfair font-bold italic text-[#1e2433] mb-3">
                    Forgot your password?
                  </h2>
                  <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    Enter your email and we&apos;ll send you a link to reset your
                    password
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {error}
                      </div>
                    </div>
                  )}

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

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-[#0097b2] py-4 font-bold text-white shadow-lg shadow-cyan-900/10 transition hover:bg-[#0088a0] hover:scale-[1.01] hover:shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>

                  <div className="text-center text-sm text-muted-foreground pt-2">
                    Remember your password?{" "}
                    <Link
                        href="/auth"
                        className="font-bold text-[#1e2433] hover:underline"
                    >
                        Back to Sign in
                    </Link>
                  </div>
                </form>
              </>
            )}
        </div>
      </div>
    </main>
  );
}
