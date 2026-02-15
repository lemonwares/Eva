"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useState } from "react";
import {
  Loader2,
  Send,
  User,
  Mail,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Headphones,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data: ContactFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setReferenceId(result.referenceId);
      } else {
        setError(result.error || "Failed to send message. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyReference = () => {
    if (referenceId) {
      navigator.clipboard.writeText(referenceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "hello@evalocal.com",
      href: "mailto:hello@evalocal.com",
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "United Kingdom",
      color: "text-rose-600",
      bg: "bg-rose-50 dark:bg-rose-900/20",
    },
    {
      icon: Clock,
      label: "Response Time",
      value: "Within 24 hours",
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="relative px-4 py-24">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-16 text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/70 px-5 py-2 shadow-sm backdrop-blur-sm">
              <Headphones className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Get in Touch
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
              We&apos;d love to hear
              <br />
              <span className="text-accent">from you</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Have a question, feedback, or need support? Our team is here to
              help you make the most of Eva.
            </p>
          </div>

          {submitted ? (
            /* ─── Success State ─── */
            <div className="max-w-xl mx-auto">
              <div className="rounded-2xl border border-green-200 dark:border-green-800/40 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 p-10 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-800/30">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Message Sent!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for reaching out. We&apos;ve received your message
                  and will get back to you within 24 hours.
                </p>

                {referenceId && (
                  <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-green-200 dark:border-green-800/40 bg-white/60 dark:bg-white/5 px-4 py-2.5">
                    <span className="text-sm text-muted-foreground">
                      Reference:
                    </span>
                    <code className="font-mono font-semibold text-foreground">
                      {referenceId}
                    </code>
                    <button
                      onClick={copyReference}
                      className="ml-1 p-1 rounded hover:bg-green-100 dark:hover:bg-green-800/20 transition-colors"
                      title="Copy reference ID"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                )}

                <p className="text-sm text-muted-foreground">
                  A confirmation email has been sent to your inbox.
                </p>

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setReferenceId(null);
                  }}
                  className="mt-6 inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium text-sm transition-colors"
                >
                  Send another message
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* ─── Form + Info Grid ─── */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl border border-border/50 bg-card/70 p-8 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-accent/10">
                      <MessageSquare className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Send us a message
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Fill out the form and we&apos;ll respond promptly
                      </p>
                    </div>
                  </div>

                  {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/20 p-4">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {error}
                      </p>
                    </div>
                  )}

                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-foreground"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          disabled={loading}
                          placeholder="Your full name"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-foreground"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          disabled={loading}
                          placeholder="you@example.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block mb-2 text-sm font-medium text-foreground"
                      >
                        Message
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          required
                          disabled={loading}
                          placeholder="Tell us how we can help..."
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-8 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Contact Info Sidebar */}
              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-sm"
                  >
                    <div
                      className={`inline-flex p-2.5 rounded-xl ${item.bg} mb-3`}
                    >
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-foreground font-semibold hover:text-accent transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-foreground font-semibold">
                        {item.value}
                      </p>
                    )}
                  </div>
                ))}

                {/* FAQ callout */}
                <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Looking for quick answers?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check our FAQ for instant answers to common questions.
                  </p>
                  <a
                    href="/faq"
                    className="inline-flex items-center gap-2 text-accent font-medium text-sm hover:text-accent/80 transition-colors"
                  >
                    Visit FAQ
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
