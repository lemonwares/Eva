"use client";

import LegalLayout from "@/components/common/LegalLayout";
import Link from "next/link";

const sections = [
  { id: "introduction", label: "1. Introduction & Acceptance" },
  { id: "definitions", label: "2. Definitions" },
  { id: "accounts", label: "3. Account Registration" },
  { id: "how-it-works", label: "4. How the Platform Works" },
  { id: "payments", label: "5. Booking & Payment Terms" },
  { id: "cancellations", label: "6. Cancellation & Refunds" },
  { id: "vendor-obligations", label: "7. Vendor Obligations" },
  { id: "client-obligations", label: "8. Client Obligations" },
  { id: "reviews", label: "9. Reviews & Content" },
  { id: "ip", label: "10. Intellectual Property" },
  { id: "liability", label: "11. Limitation of Liability" },
  { id: "disputes", label: "12. Dispute Resolution" },
  { id: "data-protection", label: "13. Data Protection" },
  { id: "changes", label: "14. Changes to Terms" },
  { id: "contact", label: "15. Contact Information" },
  { id: "governing-law", label: "16. Governing Law" },
];

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-muted-foreground mb-12">
            Last updated: February 2026
          </p>

          <div className="space-y-10 text-muted-foreground leading-relaxed">
            <section id="introduction">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                1. Introduction &amp; Acceptance of Terms
              </h2>
              <p>
                Welcome to EVA Local. EVA Local (&ldquo;we&rdquo;,
                &ldquo;us&rdquo;, &ldquo;our&rdquo;) is operated by Sparkpoint
                Digital. EVA Local is a UK-based online marketplace that
                connects clients with local event vendors and service providers.
              </p>
              <p className="mt-3">
                By accessing or using the EVA Local platform, including our
                website, progressive web app, and any associated services
                (collectively, the &ldquo;Platform&rdquo;), you agree to be
                bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do
                not agree to these Terms, please do not use the Platform.
              </p>
              <p className="mt-3">
                You must be at least 18 years of age to create an account and
                use the Platform. By registering, you confirm that you meet this
                age requirement.
              </p>
              <p className="mt-3">
                We may update these Terms from time to time. Where we make
                material changes, we will notify you by email or through a
                notice on the Platform. Your continued use of the Platform after
                such notification constitutes your acceptance of the updated
                Terms.
              </p>
            </section>

            <section id="definitions">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                2. Definitions
              </h2>
              <p>In these Terms, the following definitions apply:</p>
              <ul className="mt-3 list-disc list-inside space-y-2">
                <li>
                  <strong>&ldquo;Platform&rdquo;</strong> means the EVA Local
                  website, progressive web app, and all associated services
                  available at evalocal.com and any subdomains.
                </li>
                <li>
                  <strong>&ldquo;Client&rdquo;</strong> means a registered user
                  who uses the Platform to search for, contact, and book event
                  vendors and service providers.
                </li>
                <li>
                  <strong>&ldquo;Vendor&rdquo;</strong> means a registered user
                  who lists their services on the Platform and accepts bookings
                  from Clients.
                </li>
                <li>
                  <strong>&ldquo;Booking&rdquo;</strong> means a confirmed
                  reservation for services between a Client and a Vendor, made
                  through the Platform.
                </li>
                <li>
                  <strong>&ldquo;Commission&rdquo;</strong> means the 15% fee
                  charged by EVA Local on the total value of completed Bookings,
                  deducted from Vendor payments.
                </li>
                <li>
                  <strong>&ldquo;Deposit&rdquo;</strong> means the 20% upfront
                  payment made by the Client to confirm a Booking through the
                  Platform.
                </li>
              </ul>
            </section>

            <section id="accounts">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                3. Account Registration
              </h2>
              <p>
                To use certain features of the Platform, you must create an
                account. When registering, you agree to:
              </p>
              <ul className="mt-3 list-disc list-inside space-y-1">
                <li>
                  Provide accurate, current, and complete information during
                  registration.
                </li>
                <li>
                  Keep your account details, including your password, secure and
                  confidential.
                </li>
                <li>
                  Accept responsibility for all activity that occurs under your
                  account.
                </li>
                <li>
                  Notify us immediately if you become aware of any unauthorised
                  use of your account.
                </li>
              </ul>
              <p className="mt-3">
                Each individual may only hold one account. Creating multiple
                accounts may result in suspension or termination of all accounts
                held.
              </p>
              <p className="mt-3">
                EVA Local reserves the right to suspend or terminate any account
                that violates these Terms, engages in fraudulent activity, or is
                otherwise deemed harmful to the Platform or its users.
              </p>
              <p className="mt-3">
                You may request deletion of your account at any time by
                contacting us. Upon deletion, your personal data will be handled
                in accordance with our{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </section>

            <section id="how-it-works">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                4. How the Platform Works
              </h2>
              <p>
                EVA Local is a marketplace that connects Clients with Vendors.
                We provide the technology and platform through which users can
                discover services, communicate, arrange bookings, and process
                payments.
              </p>
              <p className="mt-3 font-medium text-foreground">
                Important: EVA Local is not a party to any contract for services
                between a Client and a Vendor. The contract for the provision of
                services is entered into directly between the Client and the
                Vendor. EVA Local acts solely as an intermediary.
              </p>
              <p className="mt-3">
                EVA Local does not guarantee the quality, safety, legality, or
                suitability of any Vendor&apos;s services. While we take
                reasonable steps to verify Vendor profiles and moderate content,
                we encourage Clients to review Vendor profiles, ratings, and
                reviews carefully before making a booking.
              </p>
              <p className="mt-3">
                Payments are facilitated through the Platform using Stripe, a
                PCI-compliant payment processor. EVA Local does not hold client
                funds directly; all payments are processed and managed by Stripe
                in accordance with their terms of service.
              </p>
            </section>

            <section id="payments">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                5. Booking &amp; Payment Terms
              </h2>
              <p>
                When a Client confirms a Booking through the Platform, the
                following payment terms apply:
              </p>
              <ul className="mt-3 list-disc list-inside space-y-2">
                <li>
                  <strong>Deposit:</strong> Clients pay a 20% deposit of the
                  total booking value at the time of confirmation. This deposit
                  secures the Booking and is processed immediately via Stripe.
                </li>
                <li>
                  <strong>Remaining Balance:</strong> The remaining 80% of the
                  booking value is due as agreed between the Client and Vendor,
                  typically before or on the date of the event.
                </li>
                <li>
                  <strong>Currency:</strong> All prices displayed on the
                  Platform are in British Pounds Sterling (GBP) and are
                  inclusive of VAT where applicable.
                </li>
                <li>
                  <strong>Commission:</strong> EVA Local charges a 15%
                  commission on the total booking value. This commission is
                  deducted from payments made to the Vendor.
                </li>
                <li>
                  <strong>Payment Security:</strong> All payments are processed
                  securely via Stripe. EVA Local does not store your credit or
                  debit card details. All payment data is handled in accordance
                  with PCI DSS standards.
                </li>
              </ul>
            </section>

            <section id="cancellations">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                6. Cancellation &amp; Refund Policy
              </h2>
              <p>
                We understand that plans can change. The following cancellation
                policy applies to Bookings made through the Platform:
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                Client Cancellations
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  More than 14 days before the event: Full deposit refund.
                </li>
                <li>
                  7 to 14 days before the event: 50% of the deposit refunded.
                </li>
                <li>Less than 7 days before the event: No deposit refund.</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                Vendor Cancellations
              </h3>
              <p>
                If a Vendor cancels a confirmed Booking, the Client will receive
                a full deposit refund. EVA Local will make reasonable efforts to
                help the Client find an alternative Vendor where possible.
              </p>
              <p className="mt-2">
                Vendors who cancel confirmed Bookings repeatedly may face
                account suspension or removal from the Platform.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                Refund Processing
              </h3>
              <p>
                Approved refunds are processed within 5–10 business days.
                Refunds are returned to the original payment method. Please note
                that your bank or card provider may take additional time to
                reflect the refund in your account.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                Additional Vendor Terms
              </h3>
              <p>
                This is EVA Local&apos;s platform-level cancellation policy.
                Individual Vendors may have their own additional cancellation
                terms, which will be communicated to you during the booking
                process. Please review these carefully before confirming your
                Booking.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                Your Statutory Rights
              </h3>
              <p>
                Nothing in this cancellation policy affects your statutory
                rights as a consumer under the Consumer Rights Act 2015 or the
                Consumer Contracts (Information, Cancellation and Additional
                Charges) Regulations 2013.
              </p>
            </section>

            <section id="vendor-obligations">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                7. Vendor Obligations
              </h2>
              <p>
                By listing services on the Platform, Vendors agree to the
                following obligations:
              </p>
              <ul className="mt-3 list-disc list-inside space-y-2">
                <li>
                  <strong>Accurate Listings:</strong> You must provide truthful
                  and accurate descriptions of your services, pricing,
                  availability, and any relevant qualifications or
                  certifications.
                </li>
                <li>
                  <strong>Honouring Bookings:</strong> You must honour all
                  confirmed Bookings. Failure to do so may result in account
                  penalties, including suspension or removal.
                </li>
                <li>
                  <strong>Tax Obligations:</strong> You are solely responsible
                  for your own tax obligations, including income tax, National
                  Insurance contributions, and VAT registration where
                  applicable. EVA Local does not provide tax advice.
                </li>
                <li>
                  <strong>Insurance:</strong> Where your services require it,
                  you must hold appropriate professional indemnity, public
                  liability, or other relevant insurance.
                </li>
                <li>
                  <strong>Legal Compliance:</strong> You must comply with all
                  applicable UK laws and regulations, including but not limited
                  to health and safety regulations, licensing requirements, and
                  equality legislation.
                </li>
                <li>
                  <strong>Content Licence:</strong> By listing on the Platform,
                  you grant EVA Local a non-exclusive, worldwide, royalty-free
                  licence to display your profile, images, service descriptions,
                  and related content on the Platform and in promotional
                  materials.
                </li>
              </ul>
            </section>

            <section id="client-obligations">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                8. Client Obligations
              </h2>
              <p>
                By using the Platform to book services, Clients agree to the
                following:
              </p>
              <ul className="mt-3 list-disc list-inside space-y-2">
                <li>
                  <strong>Accurate Information:</strong> You must provide
                  accurate and complete event details when making inquiries and
                  bookings, including event date, location, guest count, and any
                  specific requirements.
                </li>
                <li>
                  <strong>Timely Payments:</strong> You must make all payments
                  on time, including the deposit at the time of booking and the
                  remaining balance as agreed with the Vendor.
                </li>
                <li>
                  <strong>Communication:</strong> You must communicate any
                  changes to your booking requirements, event details, or
                  cancellations to the Vendor promptly through the Platform.
                </li>
                <li>
                  <strong>Reviews:</strong> We encourage you to leave honest,
                  constructive reviews after completed Bookings to help other
                  users and improve the quality of the marketplace.
                </li>
              </ul>
            </section>

            <section id="reviews">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                9. Reviews &amp; Content
              </h2>
              <p>
                The Platform allows users to post reviews, messages, and other
                content. When submitting content, you agree that:
              </p>
              <ul className="mt-3 list-disc list-inside space-y-1">
                <li>
                  Reviews must be honest, fair, and based on genuine experiences
                  with the Vendor or Client.
                </li>
                <li>
                  Content must not be abusive, defamatory, discriminatory,
                  misleading, or fraudulent.
                </li>
                <li>
                  You must not post content that infringes the intellectual
                  property rights of any third party.
                </li>
              </ul>
              <p className="mt-3">
                EVA Local reserves the right to remove, edit, or refuse to
                publish any content that violates these Terms or that we deem
                inappropriate at our sole discretion.
              </p>
              <p className="mt-3">
                You retain ownership of the content you submit to the Platform.
                However, by submitting content, you grant EVA Local a
                non-exclusive, royalty-free, worldwide licence to use, display,
                reproduce, and distribute that content in connection with the
                operation and promotion of the Platform.
              </p>
            </section>

            <section id="ip">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                10. Intellectual Property
              </h2>
              <p>
                The EVA Local name, logo, visual design, software, and all
                associated intellectual property are owned by Sparkpoint Digital
                and are protected by applicable copyright, trademark, and other
                intellectual property laws.
              </p>
              <p className="mt-3">
                You may not copy, reproduce, distribute, modify, create
                derivative works from, publicly display, or otherwise exploit
                any part of the Platform or its content without our prior
                written consent.
              </p>
              <p className="mt-3">
                Nothing in these Terms grants you any rights to use the EVA
                Local brand, trademarks, or logos.
              </p>
            </section>

            <section id="liability">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                11. Limitation of Liability
              </h2>
              <p>
                EVA Local acts as a marketplace facilitator. We are not a party
                to the service contract between Clients and Vendors, and our
                liability is limited accordingly.
              </p>
              <ul className="mt-3 list-disc list-inside space-y-2">
                <li>
                  <strong>Service Quality:</strong> EVA Local is not liable for
                  the quality, safety, legality, or suitability of any services
                  provided by Vendors. Any disputes regarding service quality
                  are between the Client and Vendor.
                </li>
                <li>
                  <strong>Financial Liability:</strong> EVA Local&apos;s total
                  liability to any user in connection with the Platform shall
                  not exceed the total Commission earned by EVA Local on the
                  relevant Booking, or £500, whichever is lower.
                </li>
                <li>
                  <strong>Indirect Losses:</strong> EVA Local shall not be
                  liable for any indirect, incidental, consequential, or special
                  damages, including but not limited to loss of profits,
                  revenue, data, or business opportunity.
                </li>
                <li>
                  <strong>Platform Availability:</strong> We endeavour to keep
                  the Platform available and functioning, but we do not
                  guarantee uninterrupted or error-free access. We are not
                  liable for any losses arising from Platform downtime or
                  technical issues.
                </li>
              </ul>
              <p className="mt-4">
                Nothing in these Terms limits or excludes our liability for:
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Death or personal injury caused by our negligence.</li>
                <li>Fraud or fraudulent misrepresentation.</li>
                <li>
                  Any other liability that cannot be excluded or limited by
                  applicable law.
                </li>
              </ul>
            </section>

            <section id="disputes">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                12. Dispute Resolution
              </h2>
              <p>
                If a dispute arises between a Client and a Vendor, we encourage
                the following steps:
              </p>
              <ol className="mt-3 list-decimal list-inside space-y-2">
                <li>
                  <strong>Direct Communication:</strong> First, try to resolve
                  the issue directly with the other party through the
                  Platform&apos;s messaging system.
                </li>
                <li>
                  <strong>EVA Local Mediation:</strong> If the dispute cannot be
                  resolved directly, you may raise the matter with EVA Local. We
                  will review the circumstances and attempt to mediate a fair
                  resolution.
                </li>
                <li>
                  <strong>Platform Decision:</strong> For disputes relating to
                  platform policies, bookings, or payments processed through EVA
                  Local, our decision shall be final.
                </li>
              </ol>
              <p className="mt-3">
                Nothing in this clause prevents either party from pursuing their
                legal rights through the courts or through alternative dispute
                resolution services, such as those approved by the Chartered
                Trading Standards Institute.
              </p>
            </section>

            <section id="data-protection">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                13. Data Protection
              </h2>
              <p>
                We take the protection of your personal data seriously. EVA
                Local processes personal data in accordance with the UK General
                Data Protection Regulation (UK GDPR) and the Data Protection Act
                2018.
              </p>
              <p className="mt-3">
                For full details on how we collect, use, store, and protect your
                personal data, please refer to our{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
              <p className="mt-3">
                By using the Platform, you acknowledge that you have read and
                understood our Privacy Policy and consent to the processing of
                your personal data as described therein.
              </p>
            </section>

            <section id="changes">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                14. Changes to Terms
              </h2>
              <p>
                EVA Local may update or amend these Terms from time to time to
                reflect changes in our services, legal requirements, or business
                practices.
              </p>
              <p className="mt-3">
                Where we make material changes, we will notify you by email to
                the address associated with your account, and/or by posting a
                prominent notice on the Platform, at least 14 days before the
                changes take effect.
              </p>
              <p className="mt-3">
                Your continued use of the Platform after the effective date of
                any changes constitutes your acceptance of the revised Terms. If
                you do not agree to the updated Terms, you may close your
                account before the changes take effect.
              </p>
            </section>

            <section id="contact">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                15. Contact Information
              </h2>
              <p>
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="mt-3 list-disc list-inside space-y-1">
                <li>Company: Sparkpoint Digital</li>
                <li>
                  Email:{" "}
                  <a
                    href="mailto:hello@evalocal.com"
                    className="text-primary hover:underline"
                  >
                    hello@evalocal.com
                  </a>
                </li>
                <li>
                  Platform:{" "}
                  <a
                    href="https://evalocal.com"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    evalocal.com
                  </a>
                </li>
              </ul>
              <p className="mt-3">
                We aim to respond to all enquiries within 5 business days.
              </p>
            </section>

            <section id="governing-law">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-4">
                16. Governing Law
              </h2>
              <p>
                These Terms, and any disputes or claims arising out of or in
                connection with them (including non-contractual disputes), shall
                be governed by and construed in accordance with the laws of
                England and Wales.
              </p>
              <p className="mt-3">
                The courts of England and Wales shall have exclusive
                jurisdiction to settle any dispute arising out of or in
                connection with these Terms.
              </p>
              <p className="mt-3">
                If you are a consumer, you will benefit from any mandatory
                provisions of the law of the country in which you are resident.
                Nothing in these Terms affects your rights as a consumer to rely
                on such mandatory provisions.
              </p>
              <p className="mt-3 text-sm">
                These terms were last reviewed in February 2026. We recommend
                seeking independent legal advice if you have questions about
                your rights. Nothing in these Terms is intended to limit your
                statutory rights as a consumer.
              </p>
            </section>
          </div>
        </div>
      </div>
    </LegalLayout>
  );
}
