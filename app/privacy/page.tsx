"use client";

import LegalLayout from "@/components/common/LegalLayout";

const sections = [
  { id: "introduction", label: "1. Introduction" },
  { id: "data-controller", label: "2. Data Controller" },
  { id: "data-collected", label: "3. What Data We Collect" },
  { id: "how-we-use", label: "4. How We Use Your Data" },
  { id: "data-sharing", label: "5. Who We Share Your Data With" },
  { id: "data-retention", label: "6. Data Retention" },
  { id: "your-rights", label: "7. Your Rights Under UK GDPR" },
  { id: "cookies", label: "8. Cookies" },
  { id: "children", label: "9. Children's Data" },
  { id: "security", label: "10. Security" },
  { id: "changes", label: "11. Changes to This Policy" },
  { id: "contact", label: "12. Contact Us" },
];

export default function PrivacyPage() {
  return (
    <LegalLayout>
      <div className="flex gap-12">
        {/* TOC sidebar */}
        <nav className="hidden lg:block w-56 shrink-0 sticky top-24 self-start">
          <ul className="space-y-2 text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-muted-foreground hover:text-primary transition block py-1"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div className="flex-1 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-playfair font-bold text-foreground mb-4 italic">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-12">
            Last updated: February 2026
          </p>

          <div className="space-y-10 text-muted-foreground leading-relaxed">
            <section id="introduction">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                1. Introduction
              </h2>
              <p>
                EVA Local (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
                &ldquo;our&rdquo;) is operated by Sparkpoint Digital. We are
                committed to protecting and respecting your privacy.
              </p>
              <p className="mt-3">
                This Privacy Policy explains how we collect, use, store, and
                share your personal data when you use the EVA Local platform,
                including our website, progressive web app, and associated
                services (the &ldquo;Platform&rdquo;).
              </p>
              <p className="mt-3">
                This policy is written in compliance with the UK General Data
                Protection Regulation (UK GDPR) and the Data Protection Act
                2018. We encourage you to read it carefully so you understand
                how your personal data is handled.
              </p>
              <p className="mt-3">
                By using the Platform, you acknowledge that you have read and
                understood this Privacy Policy. If you do not agree with our
                practices, please do not use the Platform.
              </p>
            </section>

            <section id="data-controller">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                2. Data Controller
              </h2>
              <p>
                For the purposes of UK GDPR, the data controller responsible for
                your personal data is:
              </p>
              <ul className="mt-3 list-disc list-inside space-y-1">
                <li>Company: Sparkpoint Digital</li>
                <li>
                  Data Protection Email:{" "}
                  <a
                    href="mailto:privacy@evalocal.com"
                    className="text-primary hover:underline"
                  >
                    privacy@evalocal.com
                  </a>
                </li>
                <li>Registered Address: [To be confirmed]</li>
              </ul>
            </section>

            <section id="data-collected">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                3. What Data We Collect
              </h2>
              <p>
                We collect different types of personal data depending on how you
                use the Platform:
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                Account Data
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Full name and email address</li>
                <li>Phone number (optional)</li>
                <li>Account type (client or vendor)</li>
                <li>Password (securely hashed — never stored in plain text)</li>
                <li>
                  Google account data if you sign in with Google (name, email,
                  and profile picture as provided by Google)
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                Vendor Business Data
              </h3>
              <p>If you register as a vendor, we also collect:</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Business name, description, and address</li>
                <li>Service offerings and pricing</li>
                <li>Profile and portfolio images</li>
                <li>Availability and scheduling information</li>
                <li>
                  Bank account details for payouts (held securely by Stripe, not
                  stored by EVA Local)
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                Booking &amp; Transaction Data
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Inquiry details, quotes, and booking information</li>
                <li>
                  Payment amounts, transaction references, and booking status
                </li>
                <li>
                  Messages exchanged between clients and vendors through the
                  Platform
                </li>
              </ul>
              <p className="mt-3 text-sm font-medium">
                Important: Credit and debit card details are never stored by EVA
                Local. All payment data is processed and held securely by
                Stripe, our PCI-DSS compliant payment processor.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                Automatically Collected Data
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Device type and operating system</li>
                <li>Pages visited, time spent, and navigation patterns</li>
                <li>Cookies and similar technologies (see Section 8)</li>
                <li>
                  Location data — only when you use the vendor search feature
                  and grant permission
                </li>
              </ul>
            </section>

            <section id="how-we-use">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-6">
                4. How We Use Your Data
              </h2>
              <p className="mb-6">
                Under UK GDPR, we must have a lawful basis for processing your
                personal data:
              </p>
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-foreground font-semibold">
                    <tr>
                      <th className="p-4 border-b border-border">Purpose</th>
                      <th className="p-4 border-b border-border">Lawful Basis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      ["Creating and managing your account", "Performance of contract — Art. 6(1)(b)"],
                      ["Processing bookings and payments", "Performance of contract — Art. 6(1)(b)"],
                      ["Sending confirmations and updates", "Performance of contract — Art. 6(1)(b)"],
                      ["Sending welcome emails", "Legitimate interest — Art. 6(1)(f)"],
                      ["Displaying vendor profiles", "Performance of contract — Art. 6(1)(b)"],
                      ["Marketing communications", "Consent — Art. 6(1)(a)"],
                      ["Improving our Platform", "Legitimate interest — Art. 6(1)(f)"],
                      ["Fraud prevention", "Legitimate interest — Art. 6(1)(f)"],
                      ["Legal compliance", "Legal obligation — Art. 6(1)(c)"],
                    ].map(([purpose, basis], i) => (
                      <tr key={i} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4 align-top text-foreground font-medium">{purpose}</td>
                        <td className="p-4 align-top">{basis}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="data-sharing">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                5. Who We Share Your Data With
              </h2>
              <p>
                We work with carefully selected third-party service providers to
                operate the Platform. We only share the minimum data necessary
                for each service.
              </p>
              <p className="mt-4 font-medium text-foreground">We do not:</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Sell your personal data to any third party.</li>
                <li>
                  Share your data for advertising or behavioural targeting
                  purposes.
                </li>
                <li>
                  Allow third parties to use your data for their own marketing.
                </li>
              </ul>
            </section>

            <section id="data-retention">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                6. Data Retention
              </h2>
              <p>
                We retain your personal data only for as long as necessary for
                the purposes set out in this policy, or as required by law:
              </p>
              <ul className="mt-3 list-disc list-inside space-y-1">
                <li>
                  Active account data: Duration of your account + 2 years after
                  deletion
                </li>
                <li>
                  Booking and transaction records: 7 years (UK tax and
                  accounting requirements)
                </li>
                <li>Messages and inquiries: 3 years after last activity</li>
                <li>
                  Payment records (held by Stripe): 7 years (managed by Stripe)
                </li>
                <li>Marketing consent records: Duration of consent + 1 year</li>
                <li>Automatically collected data: 26 months</li>
              </ul>
            </section>

            <section id="your-rights">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                7. Your Rights Under UK GDPR
              </h2>
              <p>
                Under UK GDPR, you have the following rights in relation to your
                personal data:
              </p>
              <ul className="mt-3 list-disc list-inside space-y-2">
                <li>
                  <strong>Right of Access:</strong> You can request a copy of
                  the personal data we hold about you.
                </li>
                <li>
                  <strong>Right to Rectification:</strong> You can ask us to
                  correct any inaccurate or incomplete personal data.
                </li>
                <li>
                  <strong>Right to Erasure:</strong> You can ask us to delete
                  your personal data (the &ldquo;right to be forgotten&rdquo;).
                </li>
                <li>
                  <strong>Right to Restrict Processing:</strong> You can ask us
                  to temporarily limit how we use your data.
                </li>
                <li>
                  <strong>Right to Data Portability:</strong> You can request
                  your data in a structured, commonly used, machine-readable
                  format.
                </li>
                <li>
                  <strong>Right to Object:</strong> You can object to our
                  processing of your data where we rely on legitimate interest.
                </li>
                <li>
                  <strong>Right to Withdraw Consent:</strong> Where processing
                  is based on your consent, you can withdraw that consent at any
                  time.
                </li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, please email us at{" "}
                <a
                  href="mailto:privacy@evalocal.com"
                  className="text-primary hover:underline"
                >
                  privacy@evalocal.com
                </a>
                . We will respond within 30 days.
              </p>
            </section>

            <section id="cookies">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                8. Cookies
              </h2>
              <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">
                Essential Cookies
              </h3>
              <p>
                These are required for the Platform to function and cannot be
                switched off. They include cookies for authentication, session
                management, and security.
              </p>
              <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">
                Analytics Cookies
              </h3>
              <p>
                These help us understand how visitors interact with the
                Platform. Analytics cookies are only placed with your consent.
              </p>
              <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">
                What We Do Not Use
              </h3>
              <p>
                We do not use advertising cookies, tracking pixels, or
                third-party behavioural advertising technologies.
              </p>
            </section>

            <section id="children">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                9. Children&apos;s Data
              </h2>
              <p>
                EVA Local is not intended for use by individuals under the age
                of 18. We do not knowingly collect personal data from children
                under 18. If we become aware that we have collected personal
                data from a child under 18, we will take steps to delete that
                data as promptly as possible.
              </p>
            </section>

            <section id="security">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                10. Security
              </h2>
              <p>
                We take the security of your personal data seriously and
                implement appropriate technical and organisational measures to
                protect it, including:
              </p>
              <ul className="mt-3 list-disc list-inside space-y-1">
                <li>
                  All data transmitted between your device and the Platform is
                  encrypted using HTTPS/TLS.
                </li>
                <li>
                  Passwords are hashed using industry-standard cryptographic
                  algorithms.
                </li>
                <li>
                  Database access is restricted, authenticated, and monitored.
                </li>
                <li>
                  Payment data is handled exclusively by Stripe, which is
                  PCI-DSS Level 1 certified.
                </li>
                <li>
                  We conduct regular reviews of our security practices and
                  infrastructure.
                </li>
              </ul>
            </section>

            <section id="changes">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                11. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices, services, or legal requirements. Where
                we make material changes, we will notify you by email and/or by
                posting a prominent notice on the Platform.
              </p>
            </section>

            <section id="contact">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                12. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy or how we
                handle your personal data, please contact us:
              </p>
              <ul className="mt-3 list-disc list-inside space-y-1">
                <li>
                  Data Protection Enquiries:{" "}
                  <a
                    href="mailto:privacy@evalocal.com"
                    className="text-primary hover:underline"
                  >
                    privacy@evalocal.com
                  </a>
                </li>
                <li>
                  General Enquiries:{" "}
                  <a
                    href="mailto:hello@evalocal.com"
                    className="text-primary hover:underline"
                  >
                    hello@evalocal.com
                  </a>
                </li>
                <li>Company: Sparkpoint Digital</li>
              </ul>
              <p className="mt-4">
                If you wish to raise a concern with the UK&apos;s data
                protection authority:
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Information Commissioner&apos;s Office (ICO)</li>
                <li>
                  Website:{" "}
                  <a
                    href="https://ico.org.uk/"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ico.org.uk
                  </a>
                </li>
                <li>Telephone: 0303 123 1113</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </LegalLayout>
  );
}
