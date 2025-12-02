"use client";

import { Eye, EyeOff, Mail, User2 } from "lucide-react";
import { useState } from "react";

type AccountType = "client" | "vendor";

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

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>("client");
  const [formData, setFormData] = useState<FormState>(defaultState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Sign Up:", { ...formData, accountType });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <AccountTypeCard
          title="Client"
          description="Plan events, compare quotes, and manage every decision."
          selected={accountType === "client"}
          onClick={() => setAccountType("client")}
        />
        <AccountTypeCard
          title="Vendor"
          description="Showcase services, respond to leads, and get paid faster."
          badge="Pro"
          selected={accountType === "vendor"}
          onClick={() => setAccountType("vendor")}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-muted-foreground">
          Full name
        </label>
        <div className="relative">
          <User2 className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-border bg-input/60 px-11 py-3 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-muted-foreground">
          Email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-border bg-input/60 px-11 py-3 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <PasswordFields
        showPassword={showPassword}
        onToggle={() => setShowPassword((prev) => !prev)}
        formData={formData}
        onChange={handleChange}
      />

      <div className="rounded-2xl border border-dashed border-border/70 bg-secondary/30 p-4 text-sm text-muted-foreground">
        You are registering as{" "}
        <span className="font-semibold text-foreground">
          {accountType === "client" ? "a client" : "a vendor"}.
        </span>{" "}
        You can switch later under account settings.
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-linear-to-r from-primary to-accent py-3 font-semibold text-primary-foreground shadow-[0_18px_45px_rgba(233,89,146,0.25)] transition hover:-translate-y-0.5"
      >
        Create free account
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
};

function AccountTypeCard({
  title,
  description,
  badge,
  selected,
  onClick,
}: AccountTypeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-full flex-col rounded-2xl border p-4 text-left transition hover:border-accent/60 ${
        selected
          ? "border-accent bg-accent/5 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
          : "border-border bg-transparent"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/20 text-2xl">
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

type PasswordFieldsProps = {
  showPassword: boolean;
  onToggle: () => void;
  formData: FormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function PasswordFields({
  showPassword,
  onToggle,
  formData,
  onChange,
}: PasswordFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[
        { label: "Password", name: "password" as const },
        { label: "Confirm password", name: "confirmPassword" as const },
      ].map(({ label, name }) => (
        <div key={name} className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground">
            {label}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name={name}
              placeholder="••••••"
              value={formData[name]}
              onChange={onChange}
              className="w-full rounded-xl border border-border bg-input/60 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            {name === "confirmPassword" ? (
              <button
                type="button"
                onClick={onToggle}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
