<<<<<<< HEAD
// app/page.tsx

import { auth } from "@/lib/auth-rsc";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    return <p>Not signed in</p>;
  }
=======
"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import HeroSection from "@/components/sections/hero-section";
import CategorySection from "@/components/sections/category-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import WhyChooseSection from "@/components/sections/why-choose-section";
import FAQSection from "@/components/sections/faq-section";
import VendorsSection from "@/components/sections/vendors-section";
>>>>>>> ccc4aa31507454d82c1973178b038ab612bfcd15

  return (
<<<<<<< HEAD
    <div>
      <p>Welcome, {session.user?.name}!</p>
      <p>ID: {session.user?.id}</p>
=======
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
>>>>>>> ccc4aa31507454d82c1973178b038ab612bfcd15
    </div>
  );
}
