"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto mt-10 px-4 py-16 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        <p className="text-muted-foreground mb-8">
          Have a question, feedback, or need support? Fill out the form below or
          email us at{" "}
          <a
            href="mailto:support@eva.events"
            className="text-accent hover:underline"
          >
            support@eva.events
          </a>
          .
        </p>
        {submitted ? (
          <div className="p-6 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-800 dark:text-green-200">
            Thank you for contacting us! We will get back to you soon.
          </div>
        ) : (
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div>
              <label htmlFor="name" className="block mb-2 font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-2 border rounded-lg bg-background text-foreground border-muted focus:outline-none focus:ring-2 focus:ring-accent"
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
                className="w-full px-4 py-2 border rounded-lg bg-background text-foreground border-muted focus:outline-none focus:ring-2 focus:ring-accent"
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
                className="w-full px-4 py-2 border rounded-lg bg-background text-foreground border-muted focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition"
            >
              Send Message
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
