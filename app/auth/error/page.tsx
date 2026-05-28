"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  AlertTriangle, 
  ShieldX, 
  Settings, 
  Users, 
  HelpCircle,
  RefreshCw,
  Home
} from "lucide-react";

// Define structured content for specific authentication errors
interface ErrorDetail {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<any>;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

const ERROR_MAP: Record<string, ErrorDetail> = {
  OAuthAccountNotLinked: {
    title: "Account Merging Required",
    subtitle: "Different login method already used",
    description: "It looks like you previously registered using another sign-in method (like a password or a different social account) with this email. For your security, please sign in using that original method to access your account.",
    icon: Users,
    colorClass: "text-[#0097b2]",
    bgClass: "bg-[#d4f0f5]/55",
    borderClass: "border-[#0097b2]/20",
  },
  AccessDenied: {
    title: "Access Denied",
    subtitle: "Authentication attempt rejected",
    description: "You do not have permission to access the requested area, or the sign-in request was rejected by the system's security policies.",
    icon: ShieldX,
    colorClass: "text-rose-500",
    bgClass: "bg-rose-50",
    borderClass: "border-rose-100",
  },
  Configuration: {
    title: "Server Configuration Error",
    subtitle: "Authentication system mismatch",
    description: "We encountered a technical issue while configuring the authentication servers. Our technical team has been notified. Please try again in a few moments.",
    icon: Settings,
    colorClass: "text-amber-500",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-100",
  },
  Verification: {
    title: "Verification Link Expired",
    subtitle: "Security token invalid or expired",
    description: "The verification link has expired or has already been used. For security reasons, please go back to the sign-in page and request a new link.",
    icon: AlertTriangle,
    colorClass: "text-[#0097b2]",
    bgClass: "bg-[#d4f0f5]/55",
    borderClass: "border-[#0097b2]/20",
  },
};

const DEFAULT_ERROR: ErrorDetail = {
  title: "Authentication Failed",
  subtitle: "Could not complete secure login",
  description: "An unexpected error occurred while communicating with the login provider. Please check your internet connection and try logging in again.",
  icon: AlertTriangle,
  colorClass: "text-rose-500",
  bgClass: "bg-rose-50",
  borderClass: "border-rose-100",
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error") || searchParams.get("code") || "";
  
  // Lookup error details, default to generic error if not matched
  const errorInfo = ERROR_MAP[errorCode] || DEFAULT_ERROR;
  const IconComponent = errorInfo.icon;

  return (
    <main className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background drifting glow blobs for rich premium visual depth */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#0097b2]/5 blur-[80px]"
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#fceee5]/40 blur-[80px]"
          animate={{
            x: [0, -30, 30, 0],
            y: [0, 40, -20, 0],
            scale: [1, 0.9, 1.15, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Top Navigation Bar - matching the auth page exactly */}
      <div className="absolute top-6 left-6 z-20 hidden sm:flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-border shadow-sm">
            <span className="text-xs">←</span>
          </div>
          Back to Home
        </Link>
      </div>

      <div className="w-full max-w-[480px] space-y-6 relative z-10">
        {/* Brand Logo - matching the auth page exactly */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src="/images/brand/eva-logo-light.png"
              alt="EVA Local"
              width={140}
              height={48}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Beautiful Glassmorphic Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-black/5"
        >
          {/* Animated Error Icon Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <motion.div 
              initial={{ scale: 0.8, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.15 
              }}
              className={`flex items-center justify-center w-16 h-16 rounded-2xl border ${errorInfo.borderClass} ${errorInfo.bgClass} ${errorInfo.colorClass} mb-5 shadow-sm`}
            >
              <IconComponent className="w-8 h-8 stroke-[2.25]" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="text-3xl font-playfair font-bold italic text-[#1e2433] mb-2"
            >
              {errorInfo.title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.4 }}
              className="text-xs uppercase tracking-widest font-bold text-[#0097b2]/80 mt-1"
            >
              {errorInfo.subtitle}
            </motion.p>
          </div>

          {/* Description Block */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center mb-8 px-1"
          >
            <p className="text-muted-foreground text-[14px] leading-relaxed">
              {errorInfo.description}
            </p>
            {errorCode && (
              <div className="mt-4 inline-flex items-center justify-center rounded-lg bg-gray-50 border border-gray-100 px-3 py-1 text-[11px] font-mono text-gray-500">
                Code: {errorCode}
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.4 }}
            className="space-y-3.5"
          >
            {/* Primary Action: Go to login / Try Again */}
            <Link 
              href="/auth"
              className="w-full rounded-xl bg-[#0097b2] py-3.5 font-bold text-white shadow-lg shadow-cyan-900/10 transition hover:bg-[#0088a0] flex items-center justify-center gap-2 hover:scale-[1.01] hover:shadow-cyan-900/20 active:scale-[0.99] text-sm"
            >
              <RefreshCw className="w-4 h-4 mr-0.5 animate-spin-slow" />
              Try Signing In Again
            </Link>

            {/* Secondary Action: Back to Home */}
            <Link 
              href="/"
              className="w-full rounded-xl border border-border bg-white py-3.5 font-bold text-[#1e2433] transition hover:bg-gray-50 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] text-sm shadow-sm"
            >
              <Home className="w-4 h-4 mr-0.5 text-muted-foreground" />
              Return to Homepage
            </Link>
          </motion.div>

          {/* Card Footer Help */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.56, duration: 0.5 }}
            className="mt-8 pt-6 border-t border-border/40 text-center text-sm"
          >
            <p className="text-muted-foreground">
              Still having trouble?{" "}
              <Link href="/contact" className="font-bold text-[#1e2433] hover:underline inline-flex items-center gap-0.5">
                Contact Support <HelpCircle className="w-3.5 h-3.5 text-muted-foreground inline" />
              </Link>
            </p>
          </motion.div>
        </motion.div>
        
        {/* Outermost bottom decoration */}
        <div className="text-center sm:hidden">
          <Link href="/" className="text-sm font-bold text-[#0097b2] hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

// Full page page component with Suspense wrapper to prevent de-optimization during Next.js static compilation
export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center p-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0097b2] border-t-transparent" />
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
