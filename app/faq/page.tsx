"use client";

import React, { useState } from "react";
import { ChevronDown, Sparkles, MessageCircle } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const faqs = [
  {
    id: "01",
    question: "How do I book a vendor on Eva?",
    answer:
      "Simply browse or search for your desired vendor, view their profile, and click the 'Request Quote' or 'Book Now' button. Fill in your event details and the vendor will respond to your inquiry.",
  },
  {
    id: "02",
    question: "Is there a fee to use Eva?",
    answer:
      "No, Eva is free for event planners and clients. You only pay the vendors for their services. Vendors may pay a subscription or commission to be listed.",
  },
  {
    id: "03",
    question: "How are vendors verified?",
    answer:
      "All vendors go through a verification process, including document checks and reviews, before being listed as 'Verified' on Eva. Look for the verified badge on vendor profiles.",
  },
  {
    id: "04",
    question: "Can I message vendors before booking?",
    answer:
      "Yes! You can chat with vendors directly through Eva's secure messaging system to discuss your needs before making a booking.",
  },
  {
    id: "05",
    question: "What payment methods are supported?",
    answer:
      "Vendors on Eva accept a variety of payment methods, including bank transfer, credit/debit cards, and secure online payments. Check each vendor's profile for their accepted methods.",
  },
  {
    id: "06",
    question: "How do I leave a review for a vendor?",
    answer:
      "After your event, you'll receive an email and dashboard prompt to rate and review your vendor. Your feedback helps others book with confidence!",
  },
  {
    id: "07",
    question: "Can I manage all my bookings in one place?",
    answer:
      "Yes, your Eva dashboard lets you track all inquiries, bookings, payments, and messages in one convenient place.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Header />
      <main className="relative min-h-screen px-4 py-24 bg-background">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="mb-16 text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/70 px-5 py-2 shadow-sm backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Frequently Asked Questions
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Everything you need to know about using Eva
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
              Find answers to common questions about booking, payments, vendor
              verification, and more. Planning your event is easier with Eva!
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-card border border-border/70 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden"
                >
                  {/* Question Header */}
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-6 text-left transition-colors duration-200 hover:bg-muted/30 focus:outline-none"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {/* Number Badge */}
                      <span className="flex items-center justify-center h-10 w-10 rounded-full bg-accent/10 text-accent font-semibold text-base shrink-0 border border-accent/30">
                        {faq.id}
                      </span>
                      {/* Question */}
                      <h2 className="text-lg font-semibold text-foreground pr-4">
                        {faq.question}
                      </h2>
                    </div>
                    {/* Chevron Icon */}
                    <div
                      className={`shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </button>
                  {/* Answer Content */}
                  <div
                    id={`faq-answer-${index}`}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 pb-6 pl-20">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-card border border-border/70 rounded-2xl p-8 shadow-sm flex flex-col items-center">
              <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-accent" />
                Still have questions?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Can't find the answer you're looking for? Please chat with our
                support team or visit the Help Center.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:bg-primary"
              >
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// "use client";

// import React, { useState } from "react";
// import { ChevronDown, Sparkles } from "lucide-react";
// import Header from "@/components/common/Header";
// import Footer from "@/components/common/Footer";

// const faqs = [
//   {
//     id: "01",
//     question: "What facilities are available at the workspace?",
//     answer:
//       "We provide facilities such as high-speed WiFi, air-conditioned workspaces, ergonomic chairs and desks, a pantry with complimentary beverages (coffee/tea), a printer, and meeting rooms that can be booked as needed.",
//   },
//   {
//     id: "02",
//     question: "Do I need to make a reservation in advance?",
//     answer:
//       "Yes, we recommend making a reservation in advance via our website or app to ensure workspace availability, especially during peak hours.",
//   },
//   {
//     id: "03",
//     question: "Are there flexible rental packages available?",
//     answer:
//       "We offer a variety of packages, including daily, weekly, and monthly options. You can also choose specialized packages such as coworking spaces, meeting rooms, or private offices, based on your needs.",
//   },
//   {
//     id: "04",
//     question: "What payment methods are accepted?",
//     answer:
//       "Payments can be made online via bank transfer, e-wallets, or credit cards. On-site payments are also available for certain services.",
//   },
//   {
//     id: "05",
//     question: "Can I access the workspace 24/7?",
//     answer:
//       "Yes, depending on your membership tier. Premium and business members have 24/7 access, while basic members have access during business hours (8 AM - 8 PM).",
//   },
//   {
//     id: "06",
//     question: "Is there parking available?",
//     answer:
//       "Yes, we provide complimentary parking for all members. Visitor parking is also available on a first-come, first-served basis.",
//   },
// ];

// export default function FAQPage() {
//   const [openIndex, setOpenIndex] = useState<number | null>(0);

//   const toggleFAQ = (index: number) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <>
//       <Header />
//       <main className="relative min-h-screen px-4 py-20 bg-background">
//         {/* Background decorative elements */}
//         <div className="absolute inset-0 -z-10 overflow-hidden">
//           <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl"></div>
//           <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
//         </div>

//         <div className="max-w-4xl mx-auto">
//           {/* Header Section */}
//           <div className="text-center mb-16">
//             <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-5 py-2 shadow-sm backdrop-blur-sm">
//               <Sparkles className="w-4 h-4 text-accent" />
//               <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
//                 FREQUENTLY ASKED QUESTIONS
//               </span>
//             </div>

//             <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
//               Your questions answered
//             </h1>
//             <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
//               To provide flexible, inspiring workspaces that foster creativity,
//               collaboration, and professional growth. We strive to create an
//               environment where everyone can thrive.
//             </p>
//           </div>

//           {/* FAQ Accordion */}
//           <div className="space-y-4">
//             {faqs.map((faq, index) => {
//               const isOpen = openIndex === index;

//               return (
//                 <div
//                   key={index}
//                   className="bg-card border border-border/70 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden"
//                 >
//                   {/* Question Header */}
//                   <button
//                     onClick={() => toggleFAQ(index)}
//                     className="w-full flex items-center justify-between p-6 text-left transition-colors duration-200 hover:bg-muted/30"
//                     aria-expanded={isOpen}
//                     aria-controls={`faq-answer-${index}`}
//                   >
//                     <div className="flex items-center gap-4 flex-1">
//                       {/* Number Badge */}
//                       <span className="flex items-center justify-center h-10 w-10 rounded-full bg-muted text-foreground font-semibold text-sm shrink-0">
//                         {faq.id}
//                       </span>

//                       {/* Question */}
//                       <h2 className="text-lg font-semibold text-foreground pr-4">
//                         {faq.question}
//                       </h2>
//                     </div>

//                     {/* Chevron Icon */}
//                     <div
//                       className={`shrink-0 transition-transform duration-300 ${
//                         isOpen ? "rotate-180" : ""
//                       }`}
//                     >
//                       <ChevronDown className="h-5 w-5 text-muted-foreground" />
//                     </div>
//                   </button>

//                   {/* Answer Content */}
//                   <div
//                     id={`faq-answer-${index}`}
//                     className={`overflow-hidden transition-all duration-300 ease-in-out ${
//                       isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
//                     }`}
//                   >
//                     <div className="px-6 pb-6 pl-20">
//                       <p className="text-muted-foreground leading-relaxed">
//                         {faq.answer}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Bottom CTA Section */}
//           <div className="mt-16 text-center">
//             <div className="bg-card border border-border/70 rounded-2xl p-8 shadow-sm">
//               <h3 className="text-xl font-semibold text-foreground mb-3">
//                 Still have questions?
//               </h3>
//               <p className="text-muted-foreground mb-6">
//                 Can't find the answer you're looking for? Please chat with our
//                 friendly team.
//               </p>
//               <button className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:-translate-y-0.5 hover:shadow-lg hover:bg-accent hover:text-white">
//                 Get in touch
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// }
