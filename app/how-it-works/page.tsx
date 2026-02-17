import type { Metadata } from "next";
import HowItWorksClient from "./HowItWorksClient";

export const metadata: Metadata = {
  title: "How It Works | EVA Local",
  description:
    "Learn how EVA Local finds vendors who get your traditions. A guided path from search to booking for modern multicultural celebrations.",
  openGraph: {
    title: "How It Works | EVA Local",
    description:
      "Search, compare, and book multicultural event vendors in four simple steps.",
    url: "/how-it-works",
  },
  alternates: {
    canonical: "/how-it-works",
  },
};

export default function HowItWorksPage() {
  return <HowItWorksClient />;
}
