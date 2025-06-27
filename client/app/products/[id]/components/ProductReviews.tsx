"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress"
import { ChevronRight, ChevronLeft, Star } from "lucide-react"
import ProductCard from "./ProductReviewCard";
import { Button } from "@/components/ui/button";
import ProductReviewCard from "./ProductReviewCard";
import { useRef, useState, useEffect } from "react";

interface Review {
    name: string;
    rating: number;
    date: string;
    comment: string;
    avatar: string;
}

interface ProductReviewsProps {
    avarageRating: number;
    totalReviews: number;
    reviews: Review[];
}

export default function ProductReviews({avarageRating, totalReviews, reviews}: ProductReviewsProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 600,
                behavior: 'smooth'
            });
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -620,
                behavior: 'smooth'
            });
        }
    };

    // Update scroll event listener to check both left and right positions
    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
                setShowLeftButton(scrollLeft > 0);
                setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
            }
        };

        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            // Initial check
            handleScroll();
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    return (
        <div className="w-full max-w-[1250px] mx-auto rounded-lg mb-4 px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-semibold font-roboto py-4">Rating & Reviews</h1>
        <div className="flex flex-col lg:flex-row gap-7 py-4">
          {/* Rating Summary Section */}
          <div className="flex flex-col md:flex-row gap-4 items-center rounded-lg w-full justify-center lg:justify-start">
            <div className="flex flex-col items-center md:items-start">
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-medium font-inter p-0 m-0 leading-none">
                {avarageRating}
                <span className="text-xl sm:text-2xl md:text-3xl font-medium text-[#331d67]">/5</span>
              </h1>
              <p className="text-base sm:text-lg font-medium text-gray-500 mt-1 sm:mt-2">
                ({totalReviews} Reviews)
              </p>
            </div>
            
            <div className="flex flex-col justify-center gap-2 w-full max-w-md">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex flex-row gap-2 items-center">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 stroke-1 stroke-white fill-[#331d67]" />
                  <p className="text-xs sm:text-sm md:text-base min-w-[1.25rem]">{rating}</p>
                  <Progress 
                    value={rating === 5 ? 100 : rating === 4 ? 30 : rating === 3 ? 20 : 10} 
                    className="w-full h-1.5 sm:h-2" 
                    color="#331d67" 
                  />
                </div>
              ))}
            </div>
          </div>
      
          {/* Reviews Carousel Section */}
          <div className="relative w-full lg:w-[600px] mt-6 lg:mt-0">
            <div 
              ref={scrollContainerRef}
              className="flex flex-row space-x-4 w-full overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {reviews.map((review, index) => (
                <div key={index} className="flex-none" style={{ scrollSnapAlign: "start", minWidth: "calc(100% - 1rem)" }}>
                  <ProductReviewCard 
                    name={review.name}
                    date={review.date}
                    description={review.comment}
                    url={review.avatar}
                  />
                </div>
              ))}
            </div>
            
            {/* Navigation Buttons */}
            {showLeftButton && (
              <Button 
                className="absolute p-1 w-8 h-8 sm:w-10 sm:h-10 -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-white/90 rounded-full shadow-md border border-[#331d67]"
                onClick={scrollLeft}
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-2 stroke-[#331d67]" />
              </Button>
            )}
            
            {showRightButton && (
              <Button 
                className="absolute p-1 w-8 h-8 sm:w-10 sm:h-10 -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-white/90 rounded-full shadow-md border border-[#331d67]"
                onClick={scrollRight}
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-2 stroke-[#331d67]" />
              </Button>
            )}
          </div>
        </div>
      </div>
    )
}   
