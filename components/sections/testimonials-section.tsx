export default function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "EVA was a lifesaver! We found a photographer who understood the specific traditions of our Nikah ceremony. The photos are incredible.",
      author: "Aisha & Tariq",
      role: "Married May 2024",
      initials: "AT",
    },
    {
      quote:
        "As a planner, finding vendors who are culturally competent is my biggest challenge. EVA's platform has made my job so much easier.",
      author: "David Chen",
      role: "Event Planner",
      initials: "DC",
    },
    {
      quote:
        "We needed a caterer for our Diwali party who could handle a large crowd and authentic recipes. Found the perfect one in our area on EVA!",
      author: "Priya Sharma",
      role: "Party Host",
      initials: "PS",
    },
  ];

  return (
    <section
      id="inspiration"
      className="bg-background px-4 py-28 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          Stories from the EVA community
        </p>
        <h2 className="mt-4 text-balance text-4xl font-semibold text-foreground sm:text-5xl">
          Trusted by couples, planners, & hosts
        </h2>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.author}
            className="flex flex-col rounded-[28px] border border-border/70 bg-card/80 p-8 text-left shadow-lg transition hover:-translate-y-1 hover:border-accent/50 hover:shadow-2xl"
          >
            <div className="mb-6 flex items-center gap-1 text-accent">
              {[...Array(5)].map((_, index) => (
                <svg key={index} viewBox="0 0 20 20" className="h-4 w-4">
                  <path
                    d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                    fill="currentColor"
                  />
                </svg>
              ))}
            </div>
            <p className="text-lg text-foreground">“{testimonial.quote}”</p>
            <div className="mt-auto flex items-center gap-4 pt-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                {testimonial.initials}
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {testimonial.author}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
