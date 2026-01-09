"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto mt-10 px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Cookies Policy</h1>
        <p className="text-muted-foreground mb-8">
          Last updated: December 2025
        </p>
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              1. What Are Cookies?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files stored on your device by your web
              browser when you visit websites. They help websites remember your
              preferences, improve your experience, and provide information to
              site owners.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              2. How We Use Cookies
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              EVA uses cookies to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Remember your preferences and settings</li>
              <li>Enable essential platform features</li>
              <li>Analyse site usage and performance</li>
              <li>Personalise your experience</li>
              <li>Deliver relevant content and communications</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              3. Types of Cookies We Use
            </h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>
                <strong>Essential Cookies:</strong> Required for the platform to
                function properly.
              </li>
              <li>
                <strong>Performance Cookies:</strong> Help us understand how
                visitors use EVA.
              </li>
              <li>
                <strong>Functionality Cookies:</strong> Remember your choices
                and preferences.
              </li>
              <li>
                <strong>Targeting Cookies:</strong> Deliver content and
                communications tailored to your interests.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Managing Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              You can control and manage cookies through your browser settings.
              Most browsers allow you to refuse or delete cookies. Please note
              that disabling cookies may affect the functionality of EVA.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              5. Changes to This Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Cookies Policy from time to time. We encourage
              you to review this page regularly for any changes.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about our use of cookies, please contact
              us at:{" "}
              <a
                href="mailto:hello@evalocal.com"
                className="text-accent hover:underline"
              >
                hello@evalocal.com
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
