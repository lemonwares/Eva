import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-[#fafafa] py-24 px-4 sm:px-6 lg:px-8 border-t border-border/10">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-3xl sm:text-5xl font-playfair italic text-[#1e2433]">
          Ready to discover your perfect vendor?
        </h2>
        
        <p className="max-w-2xl mx-auto text-muted-foreground font-medium text-lg leading-relaxed">
          Whether you're planning a wedding, birthday, or cultural celebration, EVA Local connects you with trusted professionals in your community.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/search"
            className="w-full sm:w-auto px-10 py-4 bg-[#0097b2] text-white rounded-full font-bold shadow-lg shadow-cyan-900/10 hover:scale-[1.02] transition-transform text-base"
          >
            Search vendors near me
          </Link>
          <Link
            href="/list-your-business"
            className="w-full sm:w-auto px-10 py-4 border-2 border-[#0097b2] text-[#0097b2] bg-white rounded-full font-bold hover:bg-cyan-50 transition-colors text-base"
          >
            List my business
          </Link>
        </div>

        <p className="text-sm text-muted-foreground/60 pt-6">
          Join thousands of satisfied customers and vendors already using EVA Local.
        </p>
      </div>
    </section>
  );
}
