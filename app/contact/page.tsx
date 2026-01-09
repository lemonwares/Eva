"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useState } from "react";

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setReferenceId(result.referenceId);
      } else {
        setError(result.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto mt-10 px-4 py-16 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        <p className="text-muted-foreground mb-8">
          Have a question, feedback, or need support? Fill out the form below or
          email us at{" "}
          <a
            href="mailto:hello@evalocal.com"
            className="text-accent hover:underline"
          >
            hello@evalocal.com
          </a>
          .
        </p>
        {submitted ? (
          <div className="p-6 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-800 dark:text-green-200">
            <h3 className="font-semibold mb-2">Thank you for contacting us!</h3>
            <p className="mb-2">
              We've received your message and will get back to you within 24
              hours.
            </p>
            {referenceId && (
              <p className="text-sm opacity-80">
                Reference ID:{" "}
                <span className="font-mono font-semibold">{referenceId}</span>
              </p>
            )}
            <p className="text-sm mt-3">
              A confirmation email has been sent to your email address.
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-800 dark:text-red-200 mb-6">
                {error}
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block mb-2 font-medium">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 border rounded-lg bg-background text-foreground border-muted focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 border rounded-lg bg-background text-foreground border-muted focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2 font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 border rounded-lg bg-background text-foreground border-muted focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
