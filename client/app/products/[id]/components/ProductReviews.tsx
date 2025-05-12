"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress"
import { Star } from "lucide-react"

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
    return (
<div className="w-[1250px] mx-auto  rounded-lg mb-4">
    <h1 className="text-3xl font-semibold font-roboto  py-4 ">Rating & Reviews </h1>
    <div className="flex flex-row gap-7 py-4 ">
        <div className="flex flex-row gap-4  items-center rounded-lg w-full px-4  justify-center ">
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
        <div className="w-full border border-gray-500 rounded-lg p-4">
                        <h1 className="capitalize font-bold text-lg mb-2">Jhon Doe</h1>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-row space-x-4">
                                <Star className="w-5 h-5 fill-[#331d67]" />
                                <Star className="w-5 h-5 fill-[#331d67]" />
                                <Star className="w-5 h-5 fill-[#331d67]" />
                                <Star className="w-5 h-5 fill-[#331d67]" />
                                <Star className="w-5 h-5 fill-[#331d67]" />
                            </div>
                            <h1 className="text-md font-medium text-gray-500 font-rubik">13 Oct 2024</h1>
                        </div>
                        <p className="text-md text-gray-500 font-rubik mt-4">"This product exceeded my expectations. The quality is top-notch, and the performance is just as described.
                            Highly recommended for anyone looking for reliability and value."</p>
                        <Avatar className="w-14 h-14 mt-2">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
        </div>
       

        </div>
    )
}
