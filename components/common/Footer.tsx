"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LoaderCircle,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Download,
  Smartphone,
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
/*  PWA Install Switch                                                 */
/* ------------------------------------------------------------------ */

function getInstallInstructions() {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isFirefox = /firefox/i.test(ua);

  if (isIOS || isSafari) {
    return {
      title: "Install on iOS / Safari",
      steps: [
        'Tap the Share button (box with arrow) in your browser toolbar',
        'Scroll down and tap "Add to Home Screen"',
        'Tap "Add" to confirm',
      ],
    };
  }
  if (isFirefox) {
    return {
      title: "Install on Firefox",
      steps: [
        "Tap the menu icon (three dots) in the toolbar",
        'Select "Install" or "Add to Home Screen"',
        "Confirm the installation",
      ],
    };
  }
  return {
    title: "Install EVA App",
    steps: [
      "Click the install icon (⊕) in your browser's address bar",
      'Or open browser menu → "Install EVA Local..."',
      "Confirm the installation",
    ],
  };
}

function ManualInstallModal({ onClose }: { onClose: () => void }) {
  const instructions = getInstallInstructions();
  if (!instructions) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white text-gray-900 rounded-2xl shadow-2xl p-6 max-w-sm w-[90vw] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Download size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold">{instructions.title}</h2>
            <p className="text-xs text-gray-500">Follow these steps</p>
          </div>
        </div>
        <ol className="space-y-3 mb-5">
          {instructions.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-700">
              <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

function PWAInstallSwitch({
  deferredPrompt,
  onPromptUsed,
}: {
  deferredPrompt: any;
  onPromptUsed: () => void;
}) {
  const [isInstalled, setIsInstalled] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      setSwitchOn(true);
    }
  }, []);

  const handleToggle = async () => {
    if (isInstalled || isInstalling) return;

    // Native install prompt available (Chromium browsers)
    if (deferredPrompt) {
      setSwitchOn(true);
      setIsInstalling(true);
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setIsInstalled(true);
        } else {
          setSwitchOn(false);
        }
        onPromptUsed();
      } catch {
        setSwitchOn(false);
      } finally {
        setIsInstalling(false);
      }
    } else {
      // No native prompt — show manual instructions
      setSwitchOn(true);
      setShowManualModal(true);
    }
  };

  if (isInstalled) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-emerald-400 text-xs font-medium flex items-center gap-1.5">
            <Smartphone size={13} />
            EVA App Installed
          </span>
          <span className="text-white/35 text-[11px] leading-tight">
            You&apos;re using the installed version
          </span>
        </div>
        <div className="relative inline-flex h-6 w-11 shrink-0 rounded-full bg-emerald-500">
          <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 translate-x-5 mt-0.5 ml-0.5" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-white/70 text-xs font-medium flex items-center gap-1.5">
            <Download size={13} />
            Install EVA App
          </span>
          <span className="text-white/35 text-[11px] leading-tight">
            Get faster access with offline support
          </span>
        </div>
        <button
          onClick={handleToggle}
          disabled={isInstalling}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
            switchOn
              ? "bg-primary"
              : "bg-white/20 hover:bg-white/30"
          } ${isInstalling ? "opacity-60" : ""}`}
          role="switch"
          aria-checked={switchOn}
          aria-label="Install EVA app"
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              switchOn ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {showManualModal && (
        <ManualInstallModal
          onClose={() => {
            setShowManualModal(false);
            setSwitchOn(false);
          }}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

export default function Footer() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  return (
    <footer className="bg-[#101828] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Main footer columns */}
        <div className="grid gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
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
              { label: "Cookie Policy", href: "/cookies" },
            ]}
          />
        </div>

        {/* Install App + Description */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="max-w-md">
              <p className="text-white/50 text-xs leading-relaxed">
                EVA Local is a platform dedicated to connecting you with culturally-aware
                event service professionals in your area. Browse, book, and review
                vendors — all in one place.
              </p>
            </div>
            <PWAInstallSwitch
              deferredPrompt={deferredPrompt}
              onPromptUsed={() => setDeferredPrompt(null)}
            />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 pt-6 border-t border-white/6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <p>
            &copy; {new Date().getFullYear()} EVA Local. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">
            Powered by{" "}
            <span className="font-semibold text-white/50 hover:text-white transition-colors">
              SparkPoint
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
