"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import HeroSection from "@/components/sections/hero-section";
import CategorySection from "@/components/sections/category-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import WhyChooseSection from "@/components/sections/why-choose-section";
import FAQSection from "@/components/sections/faq-section";
import VendorsSection from "@/components/sections/vendors-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <Header />

      {/* Hero Section */}
      <HeroSection />
      <VendorsSection />
      <CategorySection />
      <WhyChooseSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
