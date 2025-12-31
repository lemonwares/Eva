import Image from "next/image";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f9fafb] min-h-screen pb-16 pt-20">
        {/* About EVA */}
        <section className="text-center py-12 bg-white">
          <h1 className="text-4xl font-bold mb-2">About EVA</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connecting communities with trusted local event vendors, making
            every celebration memorable and stress-free.
          </p>
        </section>

        {/* Our Story */}
        <section className="py-16 px-4 md:px-0 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 flex flex-col gap-4">
            <h2 className="text-2xl font-semibold mb-2">Our Story</h2>
            <p className="text-gray-700">
              EVA was born from a simple observation: finding the right event
              vendors shouldn’t be complicated, expensive, or time-consuming.
              Too many people struggle to discover talented local professionals
              who understand their cultural tradition and can work within their
              budget and location constraints.
            </p>
            <p className="text-gray-700">
              We recognised the best vendors are often right around the corner,
              waiting to help, but clients were often stuck with a 25-mile
              radius, so we help clients minimise travel expenses and support
              their local trade. Our platform brings diverse event experts and
              tradition tags for South Asian, African, Caribbean, Chinese, and
              Middle Eastern traditions, ensuring vendors truly understand what
              makes each celebration unique.
            </p>
            <p className="text-gray-700">
              Today, EVA is bringing more people with events across London,
              Manchester, Birmingham, Leeds, and Bristol—with many more cities
              on the horizon. We’re building a platform where quality vendors
              thrive and clients find exactly what they need, when they need it.
            </p>
          </div>
          <div className="flex-1 flex flex-col gap-4 items-center w-full">
            <div className="relative w-64 h-80 mb-4 max-w-full">
              <Image
                src="/about-img-1.jpeg"
                alt="EVA event"
                fill
                className="object-cover rounded-xl shadow-lg"
              />
            </div>
            <div className="relative w-64 h-48 max-w-full">
              <Image
                src="/about-img-2.jpeg"
                alt="EVA celebration"
                fill
                className="object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 shadow">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <span className="inline-block w-4 h-4 bg-gray-400 rounded-full mr-2" />
                Our Mission
              </h3>
              <p className="text-gray-700">
                To democratise event planning by connecting clients with
                exceptional local vendors who meet their budget, location, and
                cultural needs. EVA believes everyone deserves access to quality
                event services without the hassle of endless searching or
                breaking the bank on travel expenses.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 shadow">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <span className="inline-block w-4 h-4 bg-pink-300 rounded-full mr-2" />
                Our Vision
              </h3>
              <p className="text-gray-700">
                To become the UK’s leading hyper-local events marketplace, where
                cultural diversity is celebrated, every local talent thrives,
                and every event—from intimate gatherings to grand
                celebrations—is powered by trusted professionals who truly
                understand their communities.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 px-4 md:px-0 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 flex flex-col gap-6 w-full">
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                {/* <span className="inline-block w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full text-xl">
                  ❤️
                </span> */}
                <div>
                  <h4 className="font-semibold">Community First</h4>
                  <p className="text-gray-600 text-sm">
                    We prioritise local involvement and community support,
                    helping neighbourhoods thrive through local trade.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                {/* <span className="inline-block w-10 h-10 bg-pink-100 flex items-center justify-center rounded-full text-xl">
                  🎉
                </span> */}
                <div>
                  <h4 className="font-semibold">Cultural Respect</h4>
                  <p className="text-gray-600 text-sm">
                    Every tradition matters. We celebrate diversity and ensure
                    vendors understand cultural significance.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                {/* <span className="inline-block w-10 h-10 bg-green-100 flex items-center justify-center rounded-full text-xl">
                  🔍
                </span> */}
                <div>
                  <h4 className="font-semibold">Transparency</h4>
                  <p className="text-gray-600 text-sm">
                    Clear GBP pricing, honest reviews, and straightforward
                    terms—no hidden fees or surprises.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center w-full mt-8 md:mt-0">
            <div className="relative w-80 h-96 max-w-full">
              <Image
                src="/about-img-3.jpeg"
                alt="EVA values"
                fill
                className="object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* What Makes EVA Different */}
        <section className="py-12 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              What Makes EVA Different
            </h2>
            <div className="bg-gray-50 rounded-lg p-8 shadow">
              <ol className="list-decimal list-inside space-y-4 text-gray-700">
                <li>
                  <span className="font-semibold">Radius-First Discovery:</span>{" "}
                  Default to inside each client travel expense and area. Find
                  quality vendors right in your neighbourhood.
                </li>
                <li>
                  <span className="font-semibold">
                    Culture & Tradition Tags:
                  </span>{" "}
                  Specialized filters mean vendors understand South Asian,
                  African, Caribbean, Chinese, Middle Eastern, and other
                  cultural celebrations.
                </li>
                <li>
                  <span className="font-semibold">
                    Frictionless Vendor Onboarding:
                  </span>{" "}
                  Social and bespoke intake means any WhatsApp, Facebook live
                  chat work from Instagram instantly.
                </li>
                <li>
                  <span className="font-semibold">
                    Transparent GBP Pricing:
                  </span>{" "}
                  No surprises—see breakdown and pricing charts like quotes,
                  line items, deposit, and payment schedules.
                </li>
                <li>
                  <span className="font-semibold">
                    Complete Booking Pipeline:
                  </span>{" "}
                  From inquiry to quote to booking to review—manage everything
                  in one platform.
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16 px-4 md:px-0 max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8 text-center">Our Team</h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            EVA is built by a passionate team dedicated to transforming event
            planning
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <div className="relative w-24 h-24 mb-4">
                <Image
                  src="/team-abiodun.png"
                  alt="Abiodun Orhewere"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <h4 className="font-semibold">Omonlua Orhewere</h4>
              <p className="text-sm text-gray-500 mb-1">Co-founder & CEO</p>
              <p className="text-xs text-gray-400 text-center">
                Former event planner with 10+ years experience connecting
                communities with exceptional local talent.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <div className="relative w-24 h-24 mb-4">
                <Image
                  src="/team-adebayo.jpeg"
                  alt="Adebayo Adeleye"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <h4 className="font-semibold">Adebayo Adeleye</h4>
              <p className="text-sm text-gray-500 mb-1">Head of Technology</p>
              <p className="text-xs text-gray-400 text-center">
                Tech innovator passionate about building platforms that empower
                local businesses and communities.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <div className="relative w-24 h-24 mb-4">
                <Image
                  src="/team-nana.jpeg"
                  alt="Nana Bakare"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <h4 className="font-semibold">Nana Bakare</h4>
              <p className="text-sm text-gray-500 mb-1">
                Community & Culture Lead
              </p>
              <p className="text-xs text-gray-400 text-center">
                Cultural ambassador building EVA’s celebration, and respect
                diverse traditions across all communities.
              </p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-700 max-w-3xl mx-auto">
            Our diverse team brings together expertise in technology, event
            planning, community engagement, and cultural understanding. We’re
            united by a single goal: making quality event services accessible to
            everyone, everywhere.
            <br />
            <span className="block mt-2 text-sm text-blue-600">
              Interested in joining our mission?{" "}
              <a href="/contact" className="underline">
                Get in touch
              </a>
            </span>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
