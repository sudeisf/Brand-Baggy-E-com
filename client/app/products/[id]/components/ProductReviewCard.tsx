"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import { Star , ChevronRight } from "lucide-react"

interface ProductCardProps{
    name : string;
    date : string;
    description : string;
    url : string;
}


export default function ProductReviewCard({name,date,description,url}:ProductCardProps){
    // const renderStars = (rating) => {
    //     const stars = [];
    //     const filled = Math.floor(rating);
    //     const hasHalf = rating % 1 !== 0;
      
    //     for (let i = 0; i < filled; i++) {
    //       stars.push(<Star key={i} className="w-5 h-5 fill-[#331d67]" />);
    //     }
    //     if (hasHalf) {
    //       stars.push(<Star key="half" className="w-5 h-5 fill-[#a892f0]" />); // Optional: use different style
    //     }
    //     while (stars.length < 5) {
    //       stars.push(<Star key={`empty-${stars.length}`} className="w-5 h-5 text-gray-300" />);
    //     }
      
    //     return stars;
    //   };



    return (
        <div className="flex-shrink-0 flex items-center justify-center w-[600px] h-full">
        <div className="w-full border shadow-sm border-gray-200 rounded-lg p-4">
            <h1 className="capitalize font-bold text-lg mb-2">{name}</h1>
                <div className="flex items-center justify-between">
                    <div className="flex flex-row space-x-4">
                        <Star className="w-5 h-5 fill-[#331d67]" />
                        <Star className="w-5 h-5 fill-[#331d67]" />
                        <Star className="w-5 h-5 fill-[#331d67]" />
                        <Star className="w-5 h-5 fill-[#331d67]" />
                        <Star className="w-5 h-5 fill-[#331d67]" />
                    </div>
                    <h1 className="text-md font-medium text-gray-500 font-rubik">{date}</h1>
                </div>
                    <p className="text-sm text-gray-500 font-rubik mt-4">{description}</p>
                    <Avatar className="w-12 h-12 mt-2">
                        <AvatarImage src={url} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
            </div>
            </div>

    )
}
