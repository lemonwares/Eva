import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import CategorySection from "@/components/sections/category-section";
import HeroSection from "@/components/sections/hero-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import VendorsSection from "@/components/sections/vendors-section";
import WhyChooseSection from "@/components/sections/why-choose-section";
import { auth } from "@/lib/auth-rsc";

export default async function HomePage() {
  const session = await auth();

  return (
    <div>
      <Header />
      <HeroSection />
      <VendorsSection />
      <CategorySection />
      <WhyChooseSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
