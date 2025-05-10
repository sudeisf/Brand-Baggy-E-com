"use client"

import { useParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Truck, Percent , CalendarDaysIcon ,Package} from "lucide-react";
import { Rubik } from "next/font/google";

const product = {
    id: 1,
    name: "loose fit hoodie",
    price: 29.99,
    description: "This premium loose-fit zip hoodie combines streetwear style with everyday comfort. Designed with a relaxed silhouette, it offers unrestricted movement while maintaining a fashionable oversized look. The full-zip front allows for versatile styling options, making it perfect for layering or wearing solo.",
    mainImage: "/assets/products/product1.jpg",
    images: [
        "/assets/products/product1.jpg",
        "/assets/products/product2.jpg",
        "/assets/products/product3.jpg"
    ]
}

export default function ProductPage(){
    const params = useParams();
    const {id} = params;
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [isHeart, setIsHeart] = useState<boolean>(false);

    return(
        <div className="container mx-auto min-h-screen">
            <div className="flex flex-row gap-4 w-[75%] mx-auto">
                <div className=" relative w-1/2"> 
                    <div className="relative"></div>
                    <Image src={product.mainImage} alt={product.name} width={600} height={500} className="rounded-lg" />
                    <div className=" relative -top-33 justify-center flex flex-row gap-4 h-30 w-full px-4">
                        {product.images.map((image) => (
                            <Image src={image} alt={product.name} width={200} height={100} className="rounded-lg object-cover border-[3px] border-white" />
                        ))}
                    </div>
                </div>
                <div className="w-1/2 px-3 py-2 ">
                    <div className="rounded-full bg-gray-100 px-4 py-1 w-fit border-2 border-gray-200">
                        <h1 className="text-sm text-[#331d67] font-medium font-rubik">Man Fashion</h1>
                    </div>
                    <div className="flex flex-col gap-2 mt-4">
                        <h1 className="text-3xl font-medium font-rubik capitalize">{product.name}</h1>
                        <p className="text-2xl font-medium font-rubik">${product.price}</p>
                    </div>

                    <div className="mt-4">
                        <h1 className="text-sm text-gray-500 font-medium font-rubik">Select Size</h1>
                        <div className="flex flex-row gap-2 mt-2">
                            <div className={`rounded-full  px-10 py-2 w-fit border-2 border-gray-200 ${selectedSize === "S" ? "bg-[#331d67] text-white" : "bg-gray-100"}`} onClick={() => setSelectedSize("S")}>
                                <h1 className="text-lg font-medium font-rubik">S</h1>
                            </div>
                            <div className={`rounded-full  px-10 py-2 w-fit border-2 border-gray-200 ${selectedSize === "M" ? "bg-[#331d67] text-white" : "bg-gray-100"}`} onClick={() => setSelectedSize("M")}>
                                <h1 className="text-lg font-medium font-rubik">M</h1>
                            </div>
                            <div className={`rounded-full  px-10  py-2 w-fit border-2 border-gray-200 ${selectedSize === "L" ? "bg-[#331d67] text-white" : "bg-gray-100"}`} onClick={() => setSelectedSize("L")}>
                                <h1 className="text-lg font-medium font-rubik">L</h1>
                            </div>
                            <div className={`rounded-full  px-10 py-2 w-fit border-2 border-gray-200 ${selectedSize === "XL" ? "bg-[#331d67] text-white" : "bg-gray-100"}`} onClick={() => setSelectedSize("XL")}>
                                <h1 className="text-lg font-medium font-rubik">XL</h1>
                            </div>
                                <div className={`rounded-full  px-10 py-2 w-fit border-2 border-gray-200 ${selectedSize === "XXL" ? "bg-[#331d67] text-white" : "bg-gray-100"}`} onClick={() => setSelectedSize("XXL")}>
                                <h1 className="text-lg font-medium font-rubik">XXL</h1>
                            </div>
                        </div>

                        <div className="flex mt-4 gap-4 w-full items-center">
                            <Button className="bg-[#331d67] py-7 hover:bg-[#331d67]/80 text-lg font-medium text-white rounded-full w-[88%]" >Add to Cart</Button>
                            <div className="flex justify-center items-center gap-2 border-2 border-gray-300 rounded-full w-12 h-12" onClick={() => setIsHeart(!isHeart)}>
                                    <Heart className={`w-5 h-5 ${isHeart ? "fill-red-500 stroke-red-500" : "text-gray-500"}`} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 border-2 rounded-lg p-4  space-y-2 border-gray-200 pt-5">
                        <h1 className="text-lg text-[#331d67] font-semibold font-rubik">Description & Fit</h1>
                        <p className="text-sm text-gray-500  font-rubik">{product.description}</p>
                    </div>

                    <div className="mt-4 border-2 rounded-lg p-2 px-4 space-y-2 border-gray-200 ">
                        <h1 className="text-md text-[#331d67] font-semibold font-rubik mt-2">Shipping</h1>
                        <div className="grid grid-cols-2 grid-rows-2 gap-2">

                        <div className="flex gap-2 h-fit items-center">
                            <div className="rounded-full bg-[#331d67]/10  h-12 w-12 flex justify-center items-center">
                                <div className=" rounded-full bg-[#331d67]  h-5 w-5 flex justify-center items-center">
                                    <Percent className="w-3 h-3 stroke-white" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 p-2">
                                <h1 className="text-sm font-medium font-rubik text-gray-500">Discount</h1>
                                <h1 className="text-sm capitalize text-[#331d67] font-semibold font-rubik">Desc 50%</h1>
                            </div>
                        </div>
                       
                        <div className="flex gap-2 h-fit">
                            <div className="rounded-full bg-[#331d67]/10 p-2 h-12 w-12 flex justify-center items-center">
                                <Package className="w-7 h-7 stroke-1 stroke-white  fill-[#331d67]" />
                            </div>
                            <div className="flex flex-col gap-1 p-2">
                                <h1 className="text-sm font-medium font-rubik text-gray-500">Package</h1>       
                                <h1 className="text-sm capitalize text-[#331d67] font-semibold font-rubik">Regular package</h1>
                            </div>
                        </div>
                        <div className="flex gap-2 h-fit">
                            <div className="rounded-full bg-[#331d67]/10 p-2 h-12 w-12 flex justify-center items-center">
                                <CalendarDaysIcon className="w-6 h-6 stroke-1 stroke-white fill-[#331d67]" />
                            </div>
                            <div className="flex flex-col gap-1 p-2">
                                <h1 className="text-sm font-medium font-rubik text-gray-500">Delivery-time</h1>
                                <h1 className="text-sm capitalize text-[#331d67] font-semibold font-rubik">3-5 Working days</h1>
                            </div>
                        </div>
                        <div className="flex gap-2 h-fit">
                            <div className="rounded-full bg-[#331d67]/10 p-2 h-12 w-12 flex justify-center items-center">
                                <Truck className="w-7 h-7 stroke-1 stroke-white fill-[#331d67]" />
                            </div>
                            <div className="flex flex-col gap-1 p-2">
                                <h1 className="text-sm font-medium font-rubik text-gray-500">Estimation Arrive</h1>
                                <h1 className="text-sm capitalize text-[#331d67] font-semibold font-rubik">10-15 october 2025</h1>
                            </div>
                        </div>
                        
                    </div>
                    </div>
                </div>
            </div>
            <div>
                <h1>Rating & Reviews </h1>
                <div className="flex flex-row gap-4">
                    <div>
                        <div>
                            <h1>5.0</h1>
                            <h1>100</h1>
                        </div>
                    </div>

                    <div>
                        <div>
                            <h1>100</h1>
                            <h1>100</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h1>you might also like</h1>
            </div>
        </div>
    )
}
