"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="container mx-auto mt-10 px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">
          Last updated: December 2024
        </p>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              EVA (Event Vendor App) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our platform. Please read
              this policy carefully.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              2. Information We Collect
            </h2>
            <h3 className="text-xl font-medium mb-3 mt-6">
              Personal Information
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may collect personal information that you voluntarily provide,
              including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Name and contact information (email, phone number)</li>
              <li>Account credentials</li>
              <li>Profile information and photos</li>
              <li>Payment and billing information</li>
              <li>Event details and preferences</li>
              <li>Communications with vendors or clients</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 mt-6">
              Automatically Collected Information
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When you use EVA, we automatically collect:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Device information (browser type, operating system)</li>
              <li>IP address and location data</li>
              <li>Usage patterns and preferences</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use the collected information to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Provide, operate, and maintain our platform</li>
              <li>Connect clients with appropriate vendors</li>
              <li>Process transactions and send related information</li>
              <li>
                Send administrative information, updates, and marketing
                communications
              </li>
              <li>Respond to enquiries and offer customer support</li>
              <li>Personalise and improve user experience</li>
              <li>Monitor and analyse usage patterns</li>
              <li>Detect, prevent, and address fraud and security issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              4. Information Sharing
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may share your information in the following situations:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>
                <strong>With Vendors/Clients:</strong> To facilitate bookings
                and communications
              </li>
              <li>
                <strong>Service Providers:</strong> Third parties who perform
                services on our behalf
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to
                protect our rights
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a
                merger, acquisition, or sale
              </li>
              <li>
                <strong>With Consent:</strong> When you have given us permission
                to share
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational security
              measures to protect your personal information. However, no
              electronic transmission or storage system is 100% secure. While we
              strive to protect your information, we cannot guarantee absolute
              security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal information for as long as necessary to
              fulfil the purposes outlined in this policy, unless a longer
              retention period is required by law. When we no longer need your
              information, we will securely delete or anonymize it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>
                <strong>Access:</strong> Request a copy of your personal data
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate
                data
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal
                data
              </li>
              <li>
                <strong>Portability:</strong> Receive your data in a portable
                format
              </li>
              <li>
                <strong>Objection:</strong> Object to certain processing of your
                data
              </li>
              <li>
                <strong>Withdrawal:</strong> Withdraw consent for data
                processing
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              To exercise these rights, please contact us at{" "}
              <a
                href="mailto:privacy@eva.events"
                className="text-accent hover:underline"
              >
                privacy@eva.events
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              8. Cookies and Tracking
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar technologies to enhance your
              experience, analyse usage, and deliver personalised content. You
              can control cookie preferences through your browser settings. Note
              that disabling cookies may affect platform functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              9. Third-Party Links
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our platform may contain links to third-party websites or
              services. We are not responsible for the privacy practices of
              these third parties. We encourage you to review their privacy
              policies before providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              10. Children&apos;s Privacy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              EVA is not intended for users under 18 years of age. We do not
              knowingly collect personal information from children. If you
              believe we have collected information from a minor, please contact
              us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              11. International Transfers
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Your information may be transferred to and processed in countries
              other than your own. We ensure appropriate safeguards are in place
              to protect your information in compliance with applicable data
              protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              12. Changes to This Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of any material changes by posting the new policy on
              this page and updating the &quot;Last updated&quot; date. We
              encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy or our data
              practices, please contact us at:
            </p>
            <div className="mt-4 p-6 bg-secondary/50 rounded-xl">
              <p className="text-foreground font-medium">
                EVA - Event Vendor App
              </p>
              <p className="text-muted-foreground mt-2">
                Email:{" "}
                <a
                  href="mailto:privacy@eva.events"
                  className="text-accent hover:underline"
                >
                  privacy@eva.events
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
