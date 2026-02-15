"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LoaderCircle,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function FooterCTA() {
  return (
    <div className="text-center pb-16 border-b border-white/10">
      <h2
        className="text-3xl sm:text-4xl font-bold text-white"
        style={{ fontStyle: "normal" }}
      >
        Ready to discover your perfect vendor?
      </h2>
      <p className="mt-4 mx-auto max-w-xl text-white/60 text-sm leading-relaxed">
        Whether you&apos;re planning a wedding, birthday, or cultural
        celebration, EVA Local connects you with trusted professionals in your
        community.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/search"
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#007a91]"
        >
          Search vendors near me
        </Link>
        <Link
          href="/list-your-business"
          className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          List my business
        </Link>
      </div>
      <p className="mt-6 text-sm text-white/40">
        Interested in joining our mission?{" "}
        <a
          href="mailto:hello@eva-local.co.uk"
          className="underline hover:text-white transition-colors"
        >
          Get in touch
        </a>
      </p>
    </div>
  );
}

function FooterBrand() {
  return (
    <div className="space-y-5">
      <Link href="/" className="inline-block">
        <Image
          src="/images/brand/eva-logo-dark.png"
          alt="EVA Local"
          width={100}
          height={40}
          className="h-9 w-auto object-contain"
        />
      </Link>
      <p className="text-white/60 text-sm leading-relaxed max-w-xs">
        Connecting communities with trusted local event vendors across the UK.
      </p>
      <div className="flex items-center gap-4">
        {[
          {
            icon: Facebook,
            href: "https://facebook.com/evalocal",
            label: "Facebook",
          },
          {
            icon: Instagram,
            href: "https://instagram.com/evalocal",
            label: "Instagram",
          },
          { icon: Twitter, href: "https://x.com/evalocal", label: "Twitter" },
          {
            icon: Linkedin,
            href: "https://linkedin.com/company/evalocal",
            label: "LinkedIn",
          },
        ].map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-primary transition-colors"
            aria-label={social.label}
          >
            <social.icon size={20} />
          </a>
        ))}
      </div>
    </div>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4
        className="font-semibold text-sm mb-5 text-white uppercase tracking-wide"
        style={{ fontStyle: "normal" }}
      >
        {title}
      </h4>
      <ul className="space-y-3 text-white/60 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InstallModal({
  onClose,
  onContinue,
  isInstalling,
}: {
  onClose: () => void;
  onContinue: () => void;
  isInstalling: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white text-foreground rounded-2xl shadow-xl p-6 min-w-[300px] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-2">Install EVA</h2>
        <p className="text-muted-foreground mb-4">
          You&apos;re about to install this app on your device. Continue?
        </p>
        <div className="flex justify-end gap-3">
          <button className="btn-eva-ghost rounded-lg" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-eva-primary rounded-lg flex items-center gap-2"
            onClick={onContinue}
            disabled={isInstalling}
          >
            {isInstalling && (
              <LoaderCircle size={16} className="animate-spin" />
            )}
            {isInstalling ? "Installing..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

export default function Footer() {
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleContinue = async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setIsInstalling(false);
      setShowInstallModal(false);
    }
  };

  return (
    <footer className="bg-[#1e2433] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* CTA Banner */}
        <FooterCTA />

        {/* Main footer columns */}
        <div className="mt-16 grid gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <FooterBrand />
          </div>

          <FooterColumn
            title="For Clients"
            links={[
              { label: "Browse Categories", href: "/categories" },
              { label: "How It Works", href: "/how-it-works" },
              { label: "Search Vendors", href: "/search" },
              { label: "Sign Up", href: "/auth?tab=signup" },
            ]}
          />

          <FooterColumn
            title="For Businesses"
            links={[
              { label: "List Your Business", href: "/list-your-business" },
              { label: "How It Works", href: "/how-it-works" },
              {
                label: "Sign Up as Vendor",
                href: "/auth?tab=signup&type=PROFESSIONAL",
              },
            ]}
          />

          <FooterColumn
            title="Company"
            links={[
              { label: "About Us", href: "/about" },
              { label: "Contact", href: "/contact" },
            ]}
          />

          <FooterColumn
            title="Legal"
            links={[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
            ]}
          />
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <p>
            &copy; {new Date().getFullYear()} EVA Local. All rights reserved.
          </p>
          <p>
            Powered by{" "}
            <a
              href="https://www.sparkpoint.agency/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white/50 hover:text-white transition-colors"
            >
              SPARKPOINT
            </a>
          </p>
        </div>
      </div>

      {showInstallModal && (
        <InstallModal
          onClose={() => setShowInstallModal(false)}
          onContinue={handleContinue}
          isInstalling={isInstalling}
        />
      )}
    </footer>
  );
}
