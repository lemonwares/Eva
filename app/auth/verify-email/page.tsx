"use client";

import { useState, useEffect, Suspense } from "react";
import { Loader2, CheckCircle, XCircle, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail, resendVerification } from "@/lib/auth-client";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(!!token);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Only run verification once per token, and remember in sessionStorage
  useEffect(() => {
    if (token && typeof window !== "undefined") {
      const alreadyVerified = sessionStorage.getItem(`verified-${token}`);
      if (alreadyVerified) {
        setSuccess(true);
        setLoading(false);
        return;
      }
      if (!success && !error) {
        handleVerification(token);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleVerification = async (verificationToken: string) => {
    setError(null);
    setLoading(true);

    try {
      const result = await verifyEmail(verificationToken);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setSuccess(true);

      // Mark as verified in sessionStorage to prevent re-verification
      if (typeof window !== "undefined") {
        sessionStorage.setItem(`verified-${verificationToken}`, "true");
      }

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth");
      }, 3000);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("No email address provided. Please register again.");
      return;
    }

    setError(null);
    setResending(true);

    try {
      const result = await resendVerification(email);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setResendSuccess(true);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setResending(false);
    }
  };

  // Loading state while verifying token
  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-accent mb-4" />
            <h2 className="text-xl font-semibold text-foreground">
              Verifying your email...
            </h2>
            <p className="mt-2 text-muted-foreground">
              Please wait while we verify your email address.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-16 h-72 w-72 rounded-full bg-accent/20 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-primary/15 blur-[140px]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-4xl border border-border bg-card/90 p-8 shadow-[0_30px_120px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-10">
            {/* Back link */}
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>

            {success ? (
              <div className="text-center py-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Email verified!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your email has been successfully verified. You can now sign in
                  to your account.
                </p>
                <p className="text-sm text-muted-foreground">
                  Redirecting to sign in...
                </p>
              </div>
            ) : error && token ? (
              <div className="text-center py-4">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Verification failed
                </h2>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-primary to-accent px-6 py-3 font-semibold text-primary-foreground shadow-[0_18px_45px_rgba(233,89,146,0.25)] transition hover:-translate-y-0.5"
                >
                  Go to sign in
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center py-4">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <Mail className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    Check your email
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {email ? (
                      <>
                        We&apos;ve sent a verification link to{" "}
                        <strong className="text-foreground">{email}</strong>.
                        Click the link in the email to verify your account.
                      </>
                    ) : (
                      <>
                        We&apos;ve sent a verification link to your email
                        address. Click the link to verify your account.
                      </>
                    )}
                  </p>

                  {error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 mb-6">
                      {error}
                    </div>
                  )}

                  {resendSuccess ? (
                    <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700 mb-6">
                      Verification email sent! Check your inbox.
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Didn&apos;t receive the email?{" "}
                      <button
                        onClick={handleResend}
                        disabled={resending || !email}
                        className="text-accent hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {resending ? "Sending..." : "Resend verification email"}
                      </button>
                    </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-4">
                      Already verified?
                    </p>
                    <Link
                      href="/auth"
                      className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-primary to-accent px-6 py-3 font-semibold text-primary-foreground shadow-[0_18px_45px_rgba(233,89,146,0.25)] transition hover:-translate-y-0.5"
                    >
                      Sign in to your account
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
