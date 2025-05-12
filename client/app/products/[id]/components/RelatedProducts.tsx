"use client"

import { Plus } from "lucide-react"
import Image from "next/image"

interface Product{
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
}

interface RelatedProductsProps{
    products : Product[]
}

export default function RelatedProducts({products}:RelatedProductsProps){
    return (
        <div className="mt-10 w-[1250px] mx-auto flex flex-col gap-12 mb-10 ">
                <h1 className="text-center font-roboto capitalize font-medium text-6xl">you might also like</h1>
                <div className="flex flex-row gap-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-inherit rounded-md transition-shadow duration-300 w-64 md:w-74 h-[22rem] md:h-[24rem] flex flex-col flex-shrink-0 justify-betweena snap-start group border items-start border-gray-200"
                        >
                            <div className="overflow-hidden rounded-t-md w-full h-48 md:h-56">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={220}
                                    height={220}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <div className="flex flex-col items-start justify-start px-4 w-full">
                                <h2 className="text-base md:text-lg font-semibold text-gray-900 py-2 mb-1 md:mb-2 text-left">{product.name}</h2>
                                <p className="text-sm md:text-base text-gray-600 mb-2 line-clamp-2 text-left">{product.description}</p>
                                <div className="flex justify-between w-full mt-2 mb-2">
                                    <p className="text-base md:text-lg font-bold text-[#331d67]">${product.price}</p>
                                    <div className="w-fit h-fit bg-[#331d67] rounded-full p-1">
                                        <Plus className="text-white w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
        </div>
    )
}
