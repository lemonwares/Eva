import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SessionProvider } from "@/components/providers/session-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  themeColor: "#0097b2",
};

export const metadata: Metadata = {
  title: {
    default: "EVA Local | Your Perfect Event, Beautifully Curated",
    template: "%s | EVA Local",
  },
  description:
    "Discover local professionals for your event. Search by postcode, culture, and ceremony to find the perfect fit.",
  applicationName: "EVA Local",
  manifest: "/manifest.json",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://evalocal.com",
  ),
  icons: {
    icon: [{ url: "/images/brand/icon.png", type: "image/png" }],
    shortcut: "/images/brand/icon.png",
    apple: "/images/brand/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "EVA Local",
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "EVA Local",
    title: "EVA Local | Your Perfect Event, Beautifully Curated",
    description:
      "Discover local professionals for your event. Search by postcode, culture, and ceremony to find the perfect fit.",
    images: [
      {
        url: "/images/brand/eva-logo-dark.png",
        width: 1200,
        height: 630,
        alt: "EVA Local — UK Multicultural Events Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EVA Local | Your Perfect Event, Beautifully Curated",
    description:
      "Discover local professionals for your event. Search by postcode, culture, and ceremony to find the perfect fit.",
    images: ["/images/brand/eva-logo-dark.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external image CDNs for faster loading */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body
        className={`${inter.variable} ${playfairDisplay.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
