"use client";

import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductReviewCard from "./ProductReviewCard";
import { useRef, useState, useEffect } from "react";
import { useProductReviewRating } from "@/hooks/use-product";

interface ProductReviewsProps {
  ProductId: number;
}

export default function ProductReviews({ ProductId }: ProductReviewsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const { data: details, isLoading } = useProductReviewRating(ProductId);

  const scrollByAmount = (amount: number) => {
    scrollContainerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => scrollContainer?.removeEventListener("scroll", handleScroll);
  }, [details]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 p-6 text-gray-500">
        Loading reviews...
      </div>
    );
  }

  if (!details) {
    return null;
  }

  const hasReviews = details.reviews.length > 0;
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => {
    const count = details.reviews.filter((r) => r.rating === rating).length;
    const value =
      details.reviews.length > 0
        ? Math.round((count / details.reviews.length) * 100)
        : 0;
    return { rating, value };
  });

  return (
    <div className="w-full rounded-xl border border-gray-200 p-5 sm:p-6">
      <h2 className="text-2xl sm:text-3xl text-[#331d67] font-semibold mb-6">
        Rating & reviews
      </h2>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start lg:w-[45%]">
          <div className="text-center sm:text-left">
            <p className="text-6xl sm:text-7xl font-medium leading-none text-gray-900">
              {Number(details.average_rating || 0).toFixed(1)}
              <span className="text-2xl text-[#331d67]">/5</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              ({details.reviews.length} reviews)
            </p>
          </div>

          <div className="flex flex-col justify-center gap-2 w-full max-w-sm">
            {ratingCounts.map(({ rating, value }) => (
              <div key={rating} className="flex flex-row gap-2 items-center">
                <Star className="w-4 h-4 fill-[#331d67] stroke-[#331d67]" />
                <p className="text-sm min-w-[1rem]">{rating}</p>
                <Progress value={value} className="w-full h-2" color="#331d67" />
              </div>
            ))}
          </div>
        </div>

        {hasReviews ? (
          <div className="relative w-full lg:flex-1">
            <div
              ref={scrollContainerRef}
              className="flex flex-row gap-4 w-full overflow-x-auto scrollbar-hide pb-2"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {details.reviews.map((r, index) => (
                <div
                  key={`${r.user}-${index}`}
                  className="flex-none w-[min(100%,340px)]"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <ProductReviewCard
                    name={r.user}
                    date={r.created_at}
                    description={r.review}
                    url={r.user_image ?? ""}
                    rating={r.rating}
                  />
                </div>
              ))}
            </div>

            {showLeftButton && (
              <Button
                className="absolute p-1 w-9 h-9 -left-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-white/90 rounded-full shadow-md border border-[#331d67]"
                onClick={() => scrollByAmount(-320)}
              >
                <ChevronLeft className="w-5 h-5 stroke-[#331d67]" />
              </Button>
            )}

            {showRightButton && details.reviews.length > 1 && (
              <Button
                className="absolute p-1 w-9 h-9 -right-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-white/90 rounded-full shadow-md border border-[#331d67]"
                onClick={() => scrollByAmount(320)}
              >
                <ChevronRight className="w-5 h-5 stroke-[#331d67]" />
              </Button>
            )}
          </div>
        ) : (
          <div className="w-full lg:flex-1 rounded-xl border border-dashed border-gray-200 p-8 flex flex-col items-center justify-center gap-3 text-center min-h-[220px]">
            <MessageCircle className="w-8 h-8 text-gray-400" />
            <p className="text-[#331d67] font-medium">No reviews yet</p>
            <p className="text-sm text-gray-500">Be the first to review this product.</p>
          </div>
        )}
      </div>
    </div>
  );
}
