"use client"

import { Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
}

interface RelatedProductsProps {
    products: Product[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
    return (
        <div className="mt-10 w-full max-w-[1250px] mx-auto flex flex-col gap-6 sm:gap-8 md:gap-12 px-4 sm:px-6 mb-10">
            <h1 className="text-center font-roboto capitalize font-medium text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                You might also like
            </h1>
            
            <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 sm:gap-4 md:gap-6 w-full overflow-x-auto sm:overflow-visible pb-4 scrollbar-hide">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-inherit rounded-md transition-shadow duration-300 w-full sm:w-56 md:w-64 h-[20rem] sm:h-[22rem] md:h-[24rem] flex flex-col justify-between snap-start group border border-gray-200"
                    >
                        <div className="overflow-hidden rounded-t-md w-full h-40 sm:h-48 md:h-56">
                            <Link href={`/products/${product.id}`}>
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={220}
                                    height={220}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                />
                            </Link>
                        </div>
                        
                        <div className="flex flex-col items-start justify-start px-3 sm:px-4 w-full">
                            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 py-1 sm:py-2 mb-1 text-left">
                                {product.name}
                            </h2>
                            <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-2 line-clamp-2 text-left">
                                {product.description}
                            </p>
                            <div className="flex justify-between w-full mt-auto mb-2 sm:mb-3">
                                <p className="text-sm sm:text-base md:text-lg font-bold text-[#331d67]">
                                    ${product.price}
                                </p>
                                <div className="w-fit h-fit bg-[#331d67] rounded-full p-1">
                                    <Plus className="text-white w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}