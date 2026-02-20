"use client";

import { logger } from '@/lib/logger';
import { useState, type ComponentType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  MessageCircle,
  HelpCircle,
  Sparkles,
  Compass,
  ShieldCheck,
  Wallet,
  CalendarClock,
  Briefcase,
  LifeBuoy,
  X,
  Mail,
  Loader2,
} from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    id: 1,
    question: "How do I search for vendors?",
    answer:
      "You can search vendors by postcode, category, or ceremony type. Use our main search bar on the homepage or browse by category to find vendors in your area who specialize in your specific cultural traditions.",
    category: "Getting Started",
  },
  {
    id: 2,
    question: "Are all vendors verified?",
    answer:
      "Yes! All vendors on EVA are verified professionals. We conduct thorough background checks and require reviews from previous clients to ensure quality and reliability.",
    category: "Trust & Safety",
  },
  {
    id: 3,
    question: "How much does it cost to use EVA?",
    answer:
      "Finding and contacting vendors through EVA is completely free for customers. Vendors pay a subscription fee to list their services on our platform.",
    category: "Pricing",
  },
  {
    id: 4,
    question: "Can I book vendors directly through EVA?",
    answer:
      "You can view vendor profiles, check their availability, and contact them directly. Bookings and payments are arranged directly between you and the vendor.",
    category: "Booking",
  },
  {
    id: 5,
    question: "How do I become a vendor?",
    answer:
      'Click "Become a Vendor" to apply. Fill out your business information, upload your portfolio, and our team will review your application within 5-7 business days.',
    category: "For Vendors",
  },
  {
    id: 6,
    question: "What if I have an issue with a vendor?",
    answer:
      "We have a dedicated support team to help resolve any issues. Contact us through our support page with details, and we will work with both parties to find a resolution.",
    category: "Support",
  },
];

const categoryIcons: Record<string, ComponentType<{ className?: string }>> = {
  "Getting Started": Compass,
  "Trust & Safety": ShieldCheck,
  Pricing: Wallet,
  Booking: CalendarClock,
  "For Vendors": Briefcase,
  Support: LifeBuoy,
};

export default function FAQSection() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmail("");
    setMessage("");
    setSubmitStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          message,
          type: "support",
        }),
      });

      if (res.ok) {
        setSubmitStatus("success");
        setEmail("");
        setMessage("");
        setTimeout(handleCloseModal, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      logger.error("Failed to send message:", error);
      setSubmitStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="faq"
      className="relative w-full overflow-hidden bg-secondary/30 px-4 py-28"
    >
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl"></div>

      {/* Geometric decoration */}
      <div className="absolute top-40 right-20 w-20 h-20 border-4 border-blue-200 rounded-2xl rotate-12 opacity-30"></div>
      <div className="absolute bottom-40 left-20 w-16 h-16 border-4 border-purple-200 rounded-full opacity-30"></div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-6 py-3">
            <HelpCircle className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Support centre
            </span>
          </div>

          <h2 className="text-balance text-4xl font-semibold text-foreground sm:text-5xl">
            Got questions? We’ve got answers.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-muted-foreground">
            Find answers to common questions about finding and booking vendors
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-5">
          {faqs.map((faq, index) => {
            const isActive = activeId === faq.id;

            return (
              <div
                key={faq.id}
                className="group relative"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Accent line on left */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 rounded-full bg-accent transition ${
                    isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
                  }`}
                ></div>

                <div
                  className={`relative overflow-hidden rounded-3xl border-2 bg-card/90 transition duration-500 ${
                    isActive
                      ? "border-accent shadow-2xl shadow-accent/10"
                      : "border-border hover:border-border/70 shadow-lg"
                  }`}
                >
                  {/* Question Button */}
                  <button
                    onClick={() =>
                      setActiveId(activeId === faq.id ? null : faq.id)
                    }
                    className="w-full px-8 py-6 flex items-start gap-4 text-left transition-colors duration-300 hover:bg-secondary/40"
                  >
                    {/* Icon */}
                    <div
                      className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        isActive
                          ? "bg-accent text-accent-foreground rotate-6 scale-110"
                          : "bg-secondary text-muted-foreground group-hover:bg-secondary/80"
                      }`}
                    >
                      {(() => {
                        const Icon =
                          categoryIcons[faq.category] || MessageCircle;
                        return (
                          <Icon className="w-6 h-6 transition-colors duration-300" />
                        );
                      })()}
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`text-xs font-semibold uppercase tracking-[0.3em] transition-colors duration-300 ${
                            isActive ? "text-accent" : "text-muted-foreground"
                          }`}
                        >
                          {faq.category}
                        </span>
                      </div>
                      <h3
                        className={`text-lg font-semibold transition-colors duration-300 ${
                          isActive
                            ? "text-foreground"
                            : "text-foreground group-hover:text-muted-foreground"
                        }`}
                      >
                        {faq.question}
                      </h3>
                    </div>

                    {/* Chevron */}
                    <ChevronDown
                      className={`mt-2 shrink-0 w-6 h-6 transition duration-500 ${
                        isActive
                          ? "rotate-180 text-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                      strokeWidth={2.5}
                    />
                  </button>

                  {/* Answer */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      isActive ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-8 pb-6 pt-2">
                      <div className="pl-16">
                        <p className="text-base leading-relaxed text-muted-foreground">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative dot */}
                <div
                  className={`absolute -left-2 top-8 h-4 w-4 rounded-full bg-accent transition ${
                    isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                  }`}
                ></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-lg font-medium text-muted-foreground mb-6">
            Still have questions?
          </p>
          <button
            onClick={handleOpenModal}
            className="inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background transition hover:-translate-y-0.5"
          >
            <MessageCircle className="h-5 w-5" />
            Contact support
          </button>
        </div>

        {/* Modal with 3D pop-out animation */}
        <AnimatePresence>
          {isModalOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseModal}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              />

              {/* Modal */}
              <motion.div
                initial={{ scale: 0.3, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.3, opacity: 0, y: 20 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                }}
                className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-[28px] border border-border/70 bg-card/95 p-8 shadow-2xl backdrop-blur"
              >
                {/* Close button */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-secondary transition"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>

                {/* Header */}
                <div className="mb-6">
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">
                    Get in touch
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We're here to help. Send us a message and we'll respond
                    within 24 hours.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Your email
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="w-full rounded-2xl border border-border bg-input/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none transition disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Your message
                    </label>
                    <textarea
                      placeholder="Tell us how we can help..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      disabled={isLoading}
                      rows={4}
                      className="w-full rounded-2xl border border-border bg-input/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none transition resize-none disabled:opacity-50"
                    />
                  </div>

                  {/* Status messages */}
                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
                    >
                      Message sent successfully! We'll be in touch soon.
                    </motion.div>
                  )}
                  {submitStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                    >
                      Failed to send message. Please try again.
                    </motion.div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      disabled={isLoading}
                      className="flex-1 rounded-full border border-border px-6 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || !email || !message}
                      className="relative flex-1 rounded-full bg-foreground px-6 py-2 text-sm font-semibold text-background transition hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        "Send message"
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
