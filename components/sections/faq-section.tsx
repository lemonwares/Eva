"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle, HelpCircle, Sparkles } from "lucide-react";

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

export default function FAQSection() {
  const [activeId, setActiveId] = useState<number | null>(null);

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
              Support center
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
                      <MessageCircle
                        className="w-6 h-6 transition-colors duration-300"
                        strokeWidth={2.5}
                      />
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
          <button className="inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background transition hover:-translate-y-0.5">
            <MessageCircle className="h-5 w-5" />
            Contact support
          </button>
        </div>
      </div>
    </section>
  );
}
