"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress"
import { ChevronRight, ChevronLeft, Star } from "lucide-react"
import { Rubik } from "next/font/google";
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

 
  

interface ProductReviewsProps{
    avarageRating : number;
    totalReviews : number
    reviews : Review[]
}



export default function ProductReviews({avarageRating,totalReviews,reviews}:ProductReviewsProps){
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
<div className="w-[1250px] mx-auto  rounded-lg mb-4">
    <h1 className="text-3xl font-semibold font-roboto  py-4 ">Rating & Reviews </h1>
    <div className="flex flex-row gap-7 py-4 ">
        <div className="flex flex-row gap-4 items-center rounded-lg w-full px-4 justify-center">
            <div className="flex flex-col  w-full  h-full   ">
                <h1 className="text-[10rem]  font-medium font-inter p-0 m-0">{avarageRating}<span className="text-3xl font-medium font-rubik text-[#331d67]">/ 5</span></h1>
                <h1 className="text-lg  font-medium font-rubik text-gray-500">({totalReviews} Reviews)</h1>
            </div>
            <div className="flex flex-col justify-center gap-1 pt-4  h-full w-full">
                <div className="flex flex-row gap-2 items-center">
                    <Star className="w-10 h-10 stroke-1 stroke-white fill-[#331d67]" /> <p className="text-xl">5</p>
                    <Progress value={100} color="#331d67" />
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <Star className="w-10 h-10 stroke-1 stroke-white fill-[#331d67]" /> <p className="text-xl">4</p>
                    <Progress value={30} color="#331d67" />
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <Star className="w-10 h-10 stroke-1 stroke-white fill-[#331d67]" /> <p className="text-xl">3</p>
                    <Progress value={20} color="#331d67" />
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <Star className="w-10 h-10 stroke-1 stroke-white fill-[#331d67]" /> <p className="text-xl">2</p>
                    <Progress value={10} color="#331d67" />
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <Star className="w-10 h-10 stroke-1 stroke-white fill-[#331d67]" /> <p className="text-xl">1</p>
                    <Progress value={10} color="#331d67" />
                </div>
            </div>
        </div>
        <div className="relative w-[600px]">
            <div 
                ref={scrollContainerRef}
                className="flex flex-row space-x-4 w-full overflow-x-scroll scrollbar-hide" 
                style={{scrollSnapType: "x mandatory"}}
            >
                {reviews.map((review , index) => (
                    <ProductReviewCard 
                        key={index}
                        name={review.name}
                        date={review.date}
                        description={review.comment}
                        url={review.avatar}
                    />
                ))}
            </div>
            {showLeftButton && (
                <Button 
                    className="absolute p-2 w-10 h-10 -left-4 top-1/2 -translate-y-1/2 z-10 bg-white border-none hover:bg-transparent rounded-full shadow-lg border-2 border-[#331d67]"
                    onClick={scrollLeft}
                >
                    <div className="border-3 p-1 border-[#331d67] rounded-full flex items-center justify-center">
                        <ChevronLeft className="w-10 h-10 stroke-4 stroke-[#331d67]" />
                    </div>
                </Button>
            )}
            {showRightButton && (
                <Button 
                    className="absolute p-2 w-10 h-10 -right-4 top-1/2 -translate-y-1/2 z-10 bg-white border-none hover:bg-transparent rounded-full shadow-lg border-2 border-[#331d67]"
                    onClick={scrollRight}
                >
                    <div className="border-3 p-1 border-[#331d67] rounded-full flex items-center justify-center">
                        <ChevronRight className="w-10 h-10 stroke-4 stroke-[#331d67]" />
                    </div>
                </Button>
            )}
        </div>
    </div>
</div>
    )
}   
