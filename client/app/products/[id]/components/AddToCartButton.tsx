"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react";

interface AddToCartButtonProps{
    isHeart : boolean;
    onHeartClick : () => void ;
}

export default function AddToCartButton({isHeart , onHeartClick}:AddToCartButtonProps){
    return(
        <div className="flex mt-4 gap-4 w-full items-center">
        <Button className="bg-[#331d67] py-7 hover:bg-[#331d67]/80 text-lg font-medium text-white rounded-full w-[88%]">Add to Cart</Button>
        <div className="flex justify-center items-center gap-2 border-2 border-gray-300 rounded-full w-12 h-12" onClick={onHeartClick}>
            <Heart className={`w-5 h-5 ${isHeart ? "fill-red-500 stroke-red-500" : "text-gray-500"}`} />
        </div>
    </div>
    )
}
