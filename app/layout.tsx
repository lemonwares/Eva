import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, DM_Sans } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f172a" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const metadata: Metadata = {
  title: "EVA - Find Vendors Who Get Your Traditions",
  description:
    "Discover local professionals for your event. Search by postcode, culture, and ceremony to find the perfect fit.",
  applicationName: "EVA",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/pwa-icon.svg", type: "image/svg+xml" },
      { url: "/pwa-icon.svg", rel: "mask-icon", color: "#0f172a" },
    ],
    apple: [{ url: "/pwa-icon.svg" }],
  },
  appleWebApp: {
    capable: true,
    title: "EVA",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexSans.variable} ${dmSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
