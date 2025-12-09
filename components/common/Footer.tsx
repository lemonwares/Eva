import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-linear-to-b from-foreground to-foreground/95 text-background"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background/10 text-lg font-semibold">
                EVA
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-background/70">
                  Event Vendor Atlas
                </p>
                <p className="text-base font-semibold">Book with confidence</p>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm text-background/70">
              Connecting you with culturally-aware vendors, planners, and spaces
              so every celebration feels authentically yours.
            </p>
            <div className="mt-6 space-y-3 text-sm text-background/80">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a
                  href="mailto:hello@eva.com"
                  className="hover:text-background"
                >
                  hello@eva.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>London • Remote worldwide</span>
              </div>
            </div>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-background/70">
              Company
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  href="/#about"
                  className="text-background/80 transition hover:text-background"
                >
                  About EVA
                </Link>
              </li>
              <li>
                <Link
                  href="/#vendors"
                  className="text-background/80 transition hover:text-background"
                >
                  For vendors
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-background/80 transition hover:text-background"
                >
                  Help center
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-background/70">
              Legal
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-background/80 transition hover:text-background"
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-background/80 transition hover:text-background"
                >
                  Terms of service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-background/20 pt-8 text-sm text-background/70">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} EVA. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="hover:text-background transition"
              >
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-background transition">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
