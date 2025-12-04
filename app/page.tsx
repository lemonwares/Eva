// app/page.tsx

import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import CategorySection from "@/components/sections/category-section";
import FAQSection from "@/components/sections/faq-section";
import HeroSection from "@/components/sections/hero-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import VendorsSection from "@/components/sections/vendors-section";
import WhyChooseSection from "@/components/sections/why-choose-section";
import { auth } from "@/lib/auth-rsc";

export default async function HomePage() {
  // const session = await auth();

  // if (!session) {
  //   return <p>Not signed in</p>;
  // }

  return (
    <div>
      {/* <p>Welcome, {session.user?.name}!</p>
      <p>ID: {session.user?.id}</p> */}
      {/* <div className="min-h-screen bg-background pt-24"> */}
      <Header />

      {/* Hero Section */}
      <HeroSection />
      <VendorsSection />
      <CategorySection />
      <WhyChooseSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
      {/* </div> */}
    </div>
  );
}
