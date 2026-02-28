import Image from "next/image";
import { Star } from "lucide-react";

export interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  authorName: string;
  createdAt: string;
  providerReply: string | null;
  author?: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

interface VendorReviewsSectionProps {
  reviews: Review[];
  reviewCount: number;
  businessName: string;
}

export function VendorReviewsSection({
  reviews,
  reviewCount,
  businessName,
}: VendorReviewsSectionProps) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold mb-4">
        Reviews ({reviewCount})
      </h2>

      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-2xl border border-border"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted border">
                  <Image
                    src={
                      review.author?.avatar ||
                      "/images/default-avatar.svg"
                    }
                    alt={`${review.authorName} profile`}
                    width={48}
                    height={48}
                    unoptimized={true}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      // Fallback to default avatar if user avatar fails to load
                      const target = e.target as HTMLImageElement;
                      if (target.src !== "/images/default-avatar.svg") {
                        target.src = "/images/default-avatar.svg";
                      }
                    }}
                  />
                </div>
                <div>
                  <p className="font-semibold">{review.authorName}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className="text-accent"
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              {review.title && (
                <p className="font-semibold mb-2">{review.title}</p>
              )}
              <p className="text-muted-foreground">{review.body}</p>
              {review.providerReply && (
                <div className="mt-4 p-4 rounded-lg bg-muted">
                  <p className="text-sm font-semibold mb-1">
                    Response from {businessName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {review.providerReply}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No reviews yet. Be the first to review!
        </p>
      )}
    </div>
  );
}
