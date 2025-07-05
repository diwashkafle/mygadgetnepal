import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Review = {
  rating: number;
  comment: string;
  user: string;
};

type ProductReviewProps = {
  reviews: Review[];
  productId: string;
};

export default function ProductReview({ reviews}: ProductReviewProps) {
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  const starDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
  <h2 className="text-lg font-semibold">Reviews</h2>

  <div className="flex items-center gap-2">
    <div className="flex items-center gap-[2px] text-yellow-500">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= averageRating;
        const half = !filled && i + 0.5 <= averageRating;

        return (
          <Star
            key={i}
            size={16}
            fill={filled || half ? "currentColor" : "none"}
            className={cn(
              "stroke-yellow-500",
              filled ? "text-yellow-500" : half ? "text-yellow-500 opacity-60" : "opacity-30"
            )}
          />
        );
      })}
    </div>
    <span className="text-sm font-bold text-muted-foreground">
      {averageRating.toFixed(1)}
    </span>
  </div>
</div>


      {/* Write a review button */}
      <Button variant="outline" className="text-sm">
        Write a Review
      </Button>

      {/* Rating distribution and list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Star rating breakdown */}
        <div className="space-y-3">
          <p className="font-semibold text-sm">Rating Distribution</p>
          {starDistribution.map((item) => (
            <div key={item.star} className="flex items-center gap-2 text-sm">
              <span className="w-4">{item.star}</span>
              <Star size={14} className="text-yellow-500" fill="currentColor" />
              <div className="flex-1 h-2 bg-muted rounded overflow-hidden">
                <div
                  className="h-full bg-primary rounded"
                  style={{
                    width: totalReviews ? `${(item.count / totalReviews) * 100}%` : "0%",
                  }}
                />
              </div>
              <span className="w-6 text-right">{item.count}</span>
            </div>
          ))}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              There are no reviews yet. Be the first one to write one.
            </p>
          ) : (
            reviews.map((review, idx) => (
              <div key={idx} className="border rounded p-3">
                <div className="flex items-center gap-2 mb-1 text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < review.rating ? "currentColor" : "none"}
                      className="stroke-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-800 mb-1">{review.comment}</p>
                <p className="text-xs text-muted-foreground">by {review.user}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
