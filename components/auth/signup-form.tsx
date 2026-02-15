"use client";

import {
  Eye,
  EyeOff,
  Mail,
  User2,
  Loader2,
  CheckCircle,
  Check,
  X,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { register, loginWithGoogle } from "@/lib/auth-client";

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
  const [accountType, setAccountType] = useState<AccountType>(
    defaultType || "CLIENT",
  );
  const [formData, setFormData] = useState<FormState>(defaultState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength (must match server-side passwordSchema)
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      );
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

      // Show success message
      setSuccess(true);

      // Redirect to verify email page after 2 seconds
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
    // Redirect vendors to onboarding, clients to home
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
            <strong>{formData.email}</strong>. Please check your inbox and click
            the link to verify your account.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Redirecting to verification page...
        </div>
      </div>
    );
  }

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

      <div className="grid gap-4 sm:grid-cols-2">
        <AccountTypeCard
          title="Client"
          description="Plan events, compare quotes, and manage every decision."
          selected={accountType === "CLIENT"}
          onClick={() => setAccountType("CLIENT")}
          disabled={loading}
        />
        <AccountTypeCard
          title="Vendor"
          description="Showcase services, respond to leads, and get paid faster."
          badge="Pro"
          selected={accountType === "PROFESSIONAL"}
          onClick={() => setAccountType("PROFESSIONAL")}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-muted-foreground">
          Full name
        </label>
        <div className="relative">
          <User2 className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full rounded-xl border border-border bg-input/60 px-11 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-muted-foreground">
          Email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full rounded-xl border border-border bg-input/60 px-11 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
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

      <div className="rounded-2xl border border-dashed border-border/70 bg-secondary/30 p-4 text-sm text-muted-foreground">
        You are registering as{" "}
        <span className="font-semibold text-foreground">
          {accountType === "CLIENT" ? "a client" : "a vendor"}.
        </span>{" "}
        You can switch later under account settings.
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-primary py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create free account"
        )}
      </button>

      <div className="relative py-2 text-center text-sm text-muted-foreground">
        <span className="absolute left-0 right-0 top-1/2 -z-10 border-t border-border" />
        <span className="bg-card px-3">or continue with</span>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignup}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-secondary/50 py-3 font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
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

type AccountTypeCardProps = {
  title: string;
  description: string;
  badge?: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
};

function AccountTypeCard({
  title,
  description,
  badge,
  selected,
  onClick,
  disabled,
}: AccountTypeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative flex h-full flex-col rounded-2xl border p-4 text-left transition hover:border-primary/60 disabled:opacity-50 disabled:cursor-not-allowed ${
        selected
          ? "border-primary bg-primary/5 shadow-[0_0_30px_rgba(0,151,178,0.15)]"
          : "border-border bg-transparent"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-primary/20 text-2xl">
          {title === "Client" ? "🎉" : "🛠️"}
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">
            {title === "Client" ? "Default role" : "Optional upgrade"}
          </p>
        </div>
        {badge ? (
          <span className="ml-auto rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-emerald-900">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
    </button>
  );
}

/* ─── Password helpers ─── */

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
  if (score === 2)
    return { label: "Fair", color: "bg-orange-400", width: "w-2/4" };
  if (score === 3)
    return { label: "Good", color: "bg-yellow-400", width: "w-3/4" };
  return { label: "Strong", color: "bg-green-500", width: "w-full" };
}

const PASSWORD_RULES = [
  {
    key: "length",
    label: "At least 8 characters",
    test: (p: string) => p.length >= 8,
  },
  {
    key: "upper",
    label: "Uppercase letter",
    test: (p: string) => /[A-Z]/.test(p),
  },
  { key: "number", label: "Number", test: (p: string) => /[0-9]/.test(p) },
  {
    key: "special",
    label: "Special character",
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
] as const;

/* ─── PasswordFields ─── */

type PasswordFieldsProps = {
  showPassword: boolean;
  showConfirmPassword: boolean;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  formData: FormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

function PasswordFields({
  showPassword,
  showConfirmPassword,
  onTogglePassword,
  onToggleConfirmPassword,
  formData,
  onChange,
  disabled,
}: PasswordFieldsProps) {
  const strength = useMemo(
    () => getPasswordStrength(formData.password),
    [formData.password],
  );
  const showStrength = formData.password.length > 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            label: "Password",
            name: "password" as const,
            visible: showPassword,
            toggle: onTogglePassword,
          },
          {
            label: "Confirm password",
            name: "confirmPassword" as const,
            visible: showConfirmPassword,
            toggle: onToggleConfirmPassword,
          },
        ].map(({ label, name, visible, toggle }) => (
          <div key={name} className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">
              {label}
            </label>
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                name={name}
                placeholder="••••••••"
                value={formData[name]}
                onChange={onChange}
                required
                minLength={8}
                disabled={disabled}
                className="w-full rounded-xl border border-border bg-input/60 px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={toggle}
                disabled={disabled}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                {visible ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Strength meter */}
      {showStrength && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground w-12 text-right">
              {strength.label}
            </span>
          </div>

          {/* Requirements checklist */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {PASSWORD_RULES.map(({ key, label, test }) => {
              const passed = test(formData.password);
              return (
                <div
                  key={key}
                  className={`flex items-center gap-1.5 text-xs transition-colors ${
                    passed ? "text-green-600" : "text-muted-foreground"
                  }`}
                >
                  {passed ? (
                    <Check className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <X className="w-3.5 h-3.5 shrink-0" />
                  )}
                  {label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fallback hint when password not yet typed */}
      {!showStrength && (
        <p className="text-xs text-muted-foreground">
          Password must be at least 8 characters long
        </p>
      )}
    </div>
  );
}
