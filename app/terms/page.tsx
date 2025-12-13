"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="container mt-10 mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">
          Last updated: December 2024
        </p>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using EVA (Event Vendor App), you accept and
              agree to be bound by the terms and provisions of this agreement.
              If you do not agree to abide by these terms, please do not use
              this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              2. Description of Service
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              EVA is an online platform that connects event planners and clients
              with professional vendors offering services such as catering,
              photography, decoration, venues, and more. We facilitate the
              discovery, communication, and booking process between clients and
              vendors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To access certain features of EVA, you must register for an
              account. You agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>
                Provide accurate, current, and complete information during
                registration
              </li>
              <li>Maintain and promptly update your account information</li>
              <li>
                Maintain the security of your password and accept all risks of
                unauthorised access
              </li>
              <li>
                Notify us immediately if you discover any unauthorised use of
                your account
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              4. Vendor Obligations
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Vendors using EVA agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>
                Provide accurate descriptions of their services and pricing
              </li>
              <li>Respond to enquiries in a timely manner</li>
              <li>Honour quotes and bookings made through the platform</li>
              <li>
                Maintain appropriate licences and insurance for their services
              </li>
              <li>Deliver services as described and agreed upon</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              5. Client Obligations
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Clients using EVA agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Provide accurate event details when making enquiries</li>
              <li>Communicate respectfully with vendors</li>
              <li>Honour accepted quotes and booking agreements</li>
              <li>Make payments as agreed in the booking terms</li>
              <li>Provide honest and fair reviews of vendor services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              6. Payments and Fees
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              EVA may charge service fees for transactions facilitated through
              the platform. All fees will be clearly disclosed before any
              transaction is completed. Payment terms between clients and
              vendors are agreed upon directly, though EVA may facilitate
              payment processing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              7. Reviews and Content
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Users may post reviews, photos, and other content on EVA. You
              retain ownership of your content but grant EVA a licence to use,
              display, and distribute such content. All reviews must be honest,
              accurate, and based on genuine experiences. EVA reserves the right
              to remove content that violates these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              8. Prohibited Activities
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Users may not:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Use the platform for any illegal purpose</li>
              <li>Post false, misleading, or fraudulent content</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Attempt to circumvent platform fees</li>
              <li>Scrape or collect user data without permission</li>
              <li>Interfere with the platform&apos;s security features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              9. Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              EVA acts as a platform connecting clients and vendors. We do not
              guarantee the quality of any vendor&apos;s services. EVA is not
              liable for any disputes between clients and vendors, though we may
              assist in resolution. Our total liability is limited to the fees
              paid to EVA for the relevant transaction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              EVA reserves the right to suspend or terminate accounts that
              violate these terms. Users may close their accounts at any time.
              Upon termination, users must fulfil any outstanding obligations
              from accepted bookings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              11. Changes to Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              EVA may modify these terms at any time. We will notify users of
              significant changes via email or platform notification. Continued
              use of the platform after changes constitutes acceptance of the
              new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please
              contact us at{" "}
              <a
                href="mailto:legal@eva.events"
                className="text-accent hover:underline"
              >
                legal@eva.events
              </a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
