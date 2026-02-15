import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with EVA Local. Whether you have a question, feedback, or need support — we're here to help.",
  openGraph: {
    title: "Contact Us | EVA Local",
    description:
      "Have a question or need support? Reach out to the EVA Local team.",
    url: "/contact",
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
