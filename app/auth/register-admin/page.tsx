"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", adminKey: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      toast.success("Admin account created! You can now sign in.");
      setTimeout(() => router.push("/auth"), 1500);
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4">
      <div className="absolute top-6 left-6">
        <Link
          href="/auth"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
        >
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-border shadow-sm text-xs">←</span>
          Back to Sign In
        </Link>
      </div>

      <div className="w-full max-w-[480px] space-y-6">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image src="/images/brand/eva-logo-light.png" alt="EVA Local" width={140} height={48} className="h-10 w-auto" />
          </Link>
        </div>

        <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-black/5">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-4">
              <ShieldCheck size={28} className="text-accent" />
            </div>
            <h1 className="text-2xl font-playfair font-bold text-[#1e2433]">Admin Registration</h1>
            <p className="text-muted-foreground text-sm mt-1">
              A valid admin key is required to create an admin account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#1e2433] ml-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                disabled={loading}
                className="w-full rounded-xl border border-transparent bg-[#f3f4f6] px-4 py-3.5 text-foreground placeholder:text-muted-foreground transition-all focus:bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#1e2433] ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@yourdomain.com"
                required
                disabled={loading}
                className="w-full rounded-xl border border-transparent bg-[#f3f4f6] px-4 py-3.5 text-foreground placeholder:text-muted-foreground transition-all focus:bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#1e2433] ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  disabled={loading}
                  className="w-full rounded-xl border border-transparent bg-[#f3f4f6] px-4 py-3.5 pr-12 text-foreground placeholder:text-muted-foreground transition-all focus:bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#1e2433] ml-1">Admin Key</label>
              <input
                type="password"
                name="adminKey"
                value={form.adminKey}
                onChange={handleChange}
                placeholder="Enter the admin registration key"
                required
                disabled={loading}
                className="w-full rounded-xl border border-transparent bg-[#f3f4f6] px-4 py-3.5 text-foreground placeholder:text-muted-foreground transition-all focus:bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
              />
              <p className="text-xs text-muted-foreground ml-1">
                Contact your system administrator to obtain this key.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#1e2433] py-3.5 font-bold text-white transition hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Admin Account"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth" className="font-bold text-[#1e2433] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
