import {
  Search,
  ChevronDown,
  MapPin,
  Camera,
  Cake,
  Flower2,
  Users,
  Music,
  CheckCircle2,
} from "lucide-react";

const vendors = [
  {
    name: "Aperture Alchemists",
    category: "Photography",
    location: "Brooklyn, NY",
    time: "~ 24 hrs",
    score: 92,
    image: "/images/vendor1.jpg",
  },
  {
    name: "Sweet Harmony Cakes",
    category: "Catering",
    location: "Manhattan, NY",
    time: "~ 12 hrs",
    score: 88,
    image: "/images/vendor2.jpg",
  },
  {
    name: "Petal Perfect",
    category: "Florist",
    location: "Queens, NY",
    time: "~ 48 hrs",
    score: 95,
    image: "/images/vendor3.jpg",
  },
  {
    name: "Moment Captures",
    category: "Photography",
    location: "Brooklyn, NY",
    time: "~ 6 hrs",
    score: 85,
    image: "/images/vendor4.jpg",
  },
  {
    name: "The Brooklyn Loft",
    category: "Venue",
    location: "Brooklyn, NY",
    time: "~ 72 hrs",
    score: 91,
    image: "/images/vendor5.jpg",
  },
  {
    name: "Groove Collective",
    category: "Music Band",
    location: "Manhattan, NY",
    time: "~ 24 hrs",
    score: 90,
    image: "/images/vendor6.jpg",
  },
];

const filters = [
  {
    label: "Location",
    options: ["Brooklyn", "Manhattan", "Queens", "Bronx"],
  },
  {
    label: "Service Type",
    options: ["Photography", "Videography", "Photo Booth", "Drone"],
  },
  {
    label: "Availability",
    options: ["Weekdays", "Weekends"],
  },
  {
    label: "Budget",
    options: ["<$500", "$500-$1000", "$1000+"],
  },
];

export default function VendorSearchResults() {
  return (
    <div className="min-h-screen bg-[#101a13] text-white font-sans">
      {/* Header */}
      <header className="flex items-center px-8 py-4 border-b border-border bg-[#101a13]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="text-xl font-bold">EVA</span>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-lg">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <input
              type="text"
              defaultValue="Wedding Photographers in Brooklyn"
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-[#16251b] text-white border border-border focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <nav className="flex items-center gap-8 ml-8">
          <a
            href="#"
            className="text-muted-foreground hover:text-white transition-colors"
          >
            Discover
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-white transition-colors"
          >
            Bookings
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-white transition-colors"
          >
            Messages
          </a>
          <button className="ml-4 w-8 h-8 rounded-full bg-[#f5e9dc] flex items-center justify-center">
            <span className="block w-6 h-6 rounded-full bg-[#e2c6a8]" />
          </button>
        </nav>
      </header>

      <main className="flex gap-8 px-8 py-10">
        {/* Sidebar Filters */}
        <aside className="w-64 bg-[#16251b] rounded-2xl p-6 flex flex-col gap-8 border border-border">
          <h3 className="text-lg font-semibold mb-2">Filters</h3>
          {filters.map((filter, idx) => (
            <div key={idx}>
              <button className="flex items-center justify-between w-full text-left text-white font-medium py-2 mb-2">
                {filter.label}
                <ChevronDown size={18} className="text-muted-foreground" />
              </button>
              <div className="flex flex-col gap-2 ml-2">
                {filter.options.map((option, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="accent-green-500 w-4 h-4 rounded"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button className="mt-6 bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors">
            Apply Filters
          </button>
        </aside>

        {/* Results Section */}
        <section className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                Showing results for 'Wedding Photographers'
              </h2>
              <p className="text-muted-foreground text-sm">
                247 results found in Brooklyn
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Sort by:</span>
              <select className="bg-[#16251b] border border-border rounded-lg px-3 py-2 text-white">
                <option>Relevance</option>
                <option>Rating</option>
                <option>Distance</option>
              </select>
            </div>
          </div>

          {/* Vendor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vendors.map((vendor, idx) => (
              <div
                key={idx}
                className="bg-[#16251b] rounded-2xl overflow-hidden shadow-lg border border-border flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 right-4 bg-[#101a13] bg-opacity-80 rounded-full px-3 py-1 flex items-center gap-1">
                    <CheckCircle2 className="text-green-400" size={16} />
                    <span className="text-green-400 font-bold text-sm">
                      {vendor.score}%
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold mb-1">{vendor.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {vendor.category}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span>{vendor.time}</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {vendor.location}
                      </span>
                    </div>
                  </div>
                  <button className="mt-4 bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-10">
            <button className="px-4 py-2 rounded-lg bg-[#16251b] text-muted-foreground border border-border">
              Previous
            </button>
            <button className="px-4 py-2 rounded-lg bg-green-500 text-white font-bold border border-green-500">
              1
            </button>
            <button className="px-4 py-2 rounded-lg bg-[#16251b] text-muted-foreground border border-border">
              2
            </button>
            <button className="px-4 py-2 rounded-lg bg-[#16251b] text-muted-foreground border border-border">
              3
            </button>
            <span className="px-2">...</span>
            <button className="px-4 py-2 rounded-lg bg-[#16251b] text-muted-foreground border border-border">
              12
            </button>
            <button className="px-4 py-2 rounded-lg bg-[#16251b] text-muted-foreground border border-border">
              Next
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
