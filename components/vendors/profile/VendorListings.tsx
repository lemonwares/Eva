import Image from "next/image";
import { formatCurrency } from "@/lib/formatters";
import { BadgeEuro, Clock, CircleCheckBig, Calendar } from "lucide-react";

export interface Listing {
  id: string;
  headline: string;
  longDescription?: string;
  price?: number;
  timeEstimate?: string;
  maxGuests?: number | null;
  coverImageUrl?: string;
  galleryUrls?: string[];
}

function truncate(str: string = "", max: number = 150) {
  if (!str) return "";
  return str.length > max ? str.slice(0, max) + "..." : str;
}

interface VendorListingsProps {
  isListingsLoading: boolean;
  listings: Listing[];
  selectedListings: string[];
  handleListingToggle: (listingId: string) => void;
  handleMultiListingBooking: (e: React.FormEvent) => void;
  totalSelectedPrice: number;
}

export function VendorListings({
  isListingsLoading,
  listings,
  selectedListings,
  handleListingToggle,
  handleMultiListingBooking,
  totalSelectedPrice,
}: VendorListingsProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Services & Packages</h3>
      {isListingsLoading ? (
        <p className="text-muted-foreground">Loading listings...</p>
      ) : listings.length === 0 ? (
        <p className="text-muted-foreground">No listings available.</p>
      ) : (
        <form onSubmit={handleMultiListingBooking} className="space-y-4">
          <ul className="space-y-4">
            {listings.map((listing) => {
              const isSelected = selectedListings.includes(listing.id);
              return (
                <li
                  key={listing.id}
                  className="border rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white dark:bg-card"
                >
                  {listing.coverImageUrl && (
                    <Image
                      width={80}
                      height={80}
                      loading="lazy"
                      src={listing.coverImageUrl}
                      alt="Cover"
                      className="w-20 h-20 object-cover object-center rounded-md border"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">
                        {listing.headline}
                      </h4>
                    </div>
                    <div className="text-gray-700 mt-1 text-[14px]">
                      {truncate(listing.longDescription, 150)}
                    </div>
                    <div className="text-gray-500 dark:text-muted-foreground text-sm mt-2 flex flex-wrap gap-3 sm:gap-4">
                      <span className="inline-flex items-center gap-1 font-medium text-accent">
                        <BadgeEuro
                          size={16}
                          className="inline-block align-middle"
                        />
                        {listing.price ? (
                          formatCurrency(listing.price)
                        ) : (
                          <span className="text-gray-400">Not listed</span>
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium text-foreground">
                        <Clock
                          size={16}
                          className="inline-block align-middle"
                        />
                        {listing.timeEstimate ? (
                          listing.timeEstimate
                        ) : (
                          <span className="text-gray-400">No estimate</span>
                        )}
                      </span>
                    </div>
                    {listing.galleryUrls && listing.galleryUrls.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {listing.galleryUrls.slice(0, 3).map((url, i) => (
                          <Image
                            key={i}
                            width={48}
                            height={48}
                            loading="lazy"
                            src={url}
                            alt="Gallery"
                            className="w-12 h-12 object-cover rounded border"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    {!isSelected ? (
                      <button
                        type="button"
                        onClick={() => handleListingToggle(listing.id)}
                        className="text-accent text-[14px] font-bold hover:underline hover:cursor-pointer transition"
                      >
                        Book Now
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleListingToggle(listing.id)}
                        className="px-4 py-2 rounded-full text-accent flex items-center justify-center"
                        title="Deselect"
                      >
                        <CircleCheckBig />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Show booking button when listings are selected */}
          {selectedListings.length > 0 && (
            <div className="mt-6 p-4 border rounded-lg bg-accent/5">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">
                  {selectedListings.length} service
                  {selectedListings.length > 1 ? "s" : ""} selected
                </span>
                <span className="font-bold text-lg">
                  Total: {formatCurrency(totalSelectedPrice)}
                </span>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <Calendar size={18} />
                Book Selected Services
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
