"use client"

import { useProuductSuggestion , SuggestedProduct } from "@/hooks/use-product";
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
    product_id : number
}

export default function RelatedProducts({ product_id }: RelatedProductsProps) {
    const {data:Products,isLoading} = useProuductSuggestion(product_id)
    return (
        <div className="mt-10 w-full max-w-[1250px] mx-auto flex flex-col gap-6 sm:gap-8 md:gap-12 px-4 sm:px-6 mb-10">
            <h1 className="text-center font-roboto capitalize font-medium text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                You might also like
            </h1>
            
            <div className="flex flex-wrap justify-center gap-6 w-full">
                {Products?.data?.map((product: SuggestedProduct) => (
                    <div
                        key={product.id}
                        className="w-80 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
                    >
                        <div className="aspect-[4/3] overflow-hidden">
                            <Link href={`/products/${product.id}`}>
                                <Image
                                    src={product.main_image ?? ""}
                                    alt={product.name}
                                    width={400}
                                    height={300}
                                    className="object-cover w-full h-full"
                                />
                            </Link>
                        </div>
                        
                        <div className="p-5">
                            <h2 className="font-semibold text-gray-900 text-base mb-2">
                                {product.name}
                            </h2>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {product.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <p className="font-bold text-xl text-[#331d67]">
                                    ${product.price}
                                </p>
                                <div className="w-10 h-10 bg-[#331d67] rounded-full flex items-center justify-center">
                                    <Plus className="text-white w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}