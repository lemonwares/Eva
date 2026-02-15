import type { Metadata } from "next";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import CategorySection from "@/components/sections/category-section";
import HeroSection from "@/components/sections/hero-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import VendorsSection from "@/components/sections/vendors-section";
import WhyChooseSection from "@/components/sections/why-choose-section";
import { auth } from "@/lib/auth-rsc";

export const metadata: Metadata = {
  title: "EVA Local | Your Perfect Event, Beautifully Curated",
  description:
    "Discover UK multicultural event vendors. Search by postcode, culture, and ceremony to find caterers, decorators, photographers, DJs, and more for your celebration.",
  openGraph: {
    title: "EVA Local | Your Perfect Event, Beautifully Curated",
    description:
      "Discover UK multicultural event vendors. Search by postcode, culture, and ceremony to find the perfect fit for your celebration.",
    url: "/",
  },
  twitter: {
    title: "EVA Local | Your Perfect Event, Beautifully Curated",
    description:
      "Discover UK multicultural event vendors. Search by postcode, culture, and ceremony to find the perfect fit.",
  },
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  let session = null;
  try {
    session = await auth();
  } catch {
    // Stale/invalid JWT cookie — treat as unauthenticated
  }

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Organization structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "EVA Local",
            url: "https://evalocal.com",
            logo: "https://evalocal.com/images/brand/eva-logo-dark.png",
            description:
              "UK multicultural events marketplace — connecting communities with trusted local vendors for weddings, birthdays, cultural celebrations, and more.",
            sameAs: [
              "https://www.facebook.com/evalocal",
              "https://www.instagram.com/evalocal",
              "https://x.com/evalocal",
              "https://www.linkedin.com/company/evalocal",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              email: "hello@evalocal.com",
              contactType: "customer service",
              areaServed: "GB",
              availableLanguage: "English",
            },
          }),
        }}
      />
      <Header />
      <main>
        <HeroSection />
        <VendorsSection />
        <CategorySection />
        <WhyChooseSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
