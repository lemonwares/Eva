import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Vendors",
  description:
    "Search and discover multicultural event vendors across the UK. Filter by category, location, culture, and ceremony to find caterers, decorators, photographers, DJs, and more.",
  openGraph: {
    title: "Search Vendors | EVA Local",
    description:
      "Find the perfect event vendor for your celebration. Filter by category, location, culture, and ceremony.",
    url: "/search",
  },
  alternates: {
    canonical: "/search",
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
