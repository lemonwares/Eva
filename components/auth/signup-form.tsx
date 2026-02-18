"use client";

import {
  Eye,
  EyeOff,
  User2,
  Loader2,
  CheckCircle,
  Check,
  X,
  Search,
  Heart,
  Star,
  MapPin,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { register, loginWithGoogle } from "@/lib/auth-client";
import Link from "next/link";

type AccountType = "CLIENT" | "PROFESSIONAL";

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const defaultState: FormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function SignUpForm({
  defaultType,
}: {
  defaultType?: "PROFESSIONAL";
}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Use prop to set initial state. If defaultType is provided, lock to that mode mostly.
  const [accountType, setAccountType] = useState<AccountType>(
    defaultType || "CLIENT",
  );
  
  const [formData, setFormData] = useState<FormState>(defaultState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isProfessional = accountType === "PROFESSIONAL";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // Basic complexity check
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
       setError("Password must contain uppercase, lowercase and number");
       return;
    }

    setLoading(true);

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: accountType,
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(
          `/auth/verify-email?email=${encodeURIComponent(formData.email)}`,
        );
      }, 2000);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    await loginWithGoogle(
      accountType === "PROFESSIONAL" ? "/vendor/onboarding" : "/",
    );
  };

  if (success) {
    return (
      <div className="space-y-6 text-center py-8">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground">
            Account Created!
          </h3>
          <p className="mt-2 text-muted-foreground">
            We&apos;ve sent a verification email to{" "}
            <strong>{formData.email}</strong>. Please check your inbox.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-playfair font-bold italic text-[#1e2433] mb-3">
          {isProfessional ? "Create a professional account" : "Create your account"}
        </h1>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
          {isProfessional
            ? "List your business and start receiving inquiries today"
            : "Find and book trusted local vendors for your events"}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
            {isProfessional ? (
                <>
                  <Badge icon={MapPin} text="Reach local clients" dark />
                  <Badge icon={ShieldCheck} text="Secure payments" dark />
                  <Badge icon={CalendarDays} text="Manage bookings" dark />
                </>
            ) : (
                <>
                  <Badge icon={Search} text="Discover vendors" />
                  <Badge icon={Heart} text="Save favourites" />
                  <Badge icon={Star} text="Leave reviews" />
                </>
            )}
        </div>
      </div>

       <button
        type="button"
        onClick={handleGoogleSignup}
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
          or sign up with email
        </span>
        <span className="absolute left-0 right-0 top-1/2 -z-0 border-t border-border/40" />
      </div>

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

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-[#1e2433] ml-1">
            Full Name
          </label>
           <input
            type="text"
            name="name"
            placeholder="Your full name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
              className="w-full rounded-xl border border-transparent bg-[#f3f4f6] px-4 py-3.5 text-foreground placeholder:text-muted-foreground transition-all focus:bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-[#1e2433] ml-1">
            {isProfessional ? "Business Email" : "Email"}
          </label>
           <input
            type="email"
            name="email"
            placeholder={isProfessional ? "you@yourbusiness.com" : "you@example.com"}
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
              className="w-full rounded-xl border border-transparent bg-[#f3f4f6] px-4 py-3.5 text-foreground placeholder:text-muted-foreground transition-all focus:bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
          />
        </div>

        <PasswordFields
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onTogglePassword={() => setShowPassword((prev) => !prev)}
            onToggleConfirmPassword={() => setShowConfirmPassword((prev) => !prev)}
            formData={formData}
            onChange={handleChange}
            disabled={loading}
        />
        
        {isProfessional ? (
            <p className="text-xs text-muted-foreground/80 ml-1">
                At least 8 characters with letters and numbers
            </p>
        ) : (
             <p className="text-xs text-muted-foreground/80 ml-1">
                At least 8 characters with letters and numbers
            </p>
        )}
      </div>

       <div className="pt-2">
            <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl py-4 font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    isProfessional 
                    ? "bg-[#1e2433] hover:bg-black shadow-black/10" 
                    : "bg-[#0097b2] hover:bg-[#0088a0] shadow-cyan-900/10"
                }`}
            >
                {loading ? (
                <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating account...
                </>
                ) : (
                   isProfessional ? "Create professional account" : "Create account"
                )}
            </button>
       </div>
       
       <p className="text-center text-xs text-muted-foreground">
          I accept the <Link href="/terms" className="text-[#0097b2] hover:underline">terms and conditions</Link> and <Link href="/privacy" className="text-[#0097b2] hover:underline">privacy policy</Link>
       </p>
       
       {isProfessional && (
           <p className="text-center text-[10px] text-muted-foreground/60 -mt-2">
               Free to list. 15% commission on completed bookings only.
           </p>
       )}

    </form>
  );
}

function Badge({ icon: Icon, text, dark }: { icon: any; text: string; dark?: boolean }) {
    return (
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
            dark 
            ? "bg-[#1e2433] text-white" 
            : "bg-cyan-100 text-cyan-800"
        }`}>
            <Icon size={12} strokeWidth={3} />
            {text}
        </div>
    )
}

function PasswordFields({
  showPassword,
  showConfirmPassword,
  onTogglePassword,
  onToggleConfirmPassword,
  formData,
  onChange,
  disabled,
}: any) {
  return (
    <>
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-[#1e2433] ml-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={showPassword || !formData.password ? "Create a password" : "••••••••"}
            value={formData.password}
            onChange={onChange}
            required
            minLength={8}
            disabled={disabled}
            className="w-full rounded-xl border border-transparent bg-[#f3f4f6] px-4 py-3.5 pr-12 text-foreground placeholder:text-muted-foreground transition-all focus:bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={onTogglePassword}
            disabled={disabled}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-[#1e2433] ml-1">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder={showConfirmPassword || !formData.confirmPassword ? "Confirm your password" : "••••••••"}
            value={formData.confirmPassword}
            onChange={onChange}
            required
            minLength={8}
            disabled={disabled}
            className="w-full rounded-xl border border-transparent bg-[#f3f4f6] px-4 py-3.5 pr-12 text-foreground placeholder:text-muted-foreground transition-all focus:bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
          />
           <button
            type="button"
            onClick={onToggleConfirmPassword}
            disabled={disabled}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </>
  );
}
