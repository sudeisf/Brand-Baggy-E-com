"use client"
import Image from "next/image"
import { X, ShoppingCart } from "lucide-react"
import { ProductCrum } from "@/app/products/components/ProductCrum"
import { Button } from "@/components/ui/button"
import { useFavoritesStore } from "@/store/favStore"
import Link from "next/link"
import { useFav } from "@/hooks/useFav"
import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/authStore"

export default function FavTable() {
    const fav_items = useFavoritesStore((state) => state.favorites)
    const removeItem = useFavoritesStore((state) => state.removeItem)
    

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            <ProductCrum />
            <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#331d67]">Your Favorites</h1>
                    <span className="text-gray-500">{fav_items.length} items</span>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 bg-gray-100 px-6 py-4 border-b border-gray-200">
                        <div className="col-span-6 text-[#331d67] font-semibold">Product</div>
                        <div className="col-span-2 text-[#331d67] font-semibold text-center">Price</div>
                        <div className="col-span-2 text-[#331d67] font-semibold text-center">Status</div>
                        <div className="col-span-2 text-[#331d67] font-semibold text-center">Action</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-200">
                        {fav_items.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-gray-500">Your favorites list is empty</p>
                                <Link href="/products" className="mt-4 inline-block text-[#331d67] font-medium hover:underline">
                                    Browse products
                                </Link>
                            </div>
                        ) : (
                            fav_items.map((item : any) => (
                                <div key={item.id} className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors">
                                    {/* Product Info */}
                                    <div className="col-span-6 flex items-center space-x-4">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => removeItem(item.id)}
                                            className="hover:bg-red-50 hover:text-red-500 rounded-full"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                        <div className="relative w-16 h-16 flex-shrink-0">
                                            <Image
                                                src={item.main_image}
                                                alt={item.name}
                                                fill
                                                sizes="72px"
                                                className="rounded-md object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h2 className="font-medium text-gray-900 hover:text-[#331d67] transition-colors">
                                                <Link href={`/products/${item.id}`}>
                                                    {item.name}
                                                </Link>
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="col-span-2 text-center font-medium text-[#331d67] font-roboto ">
                                        ${item.price}
                                    </div>

                                    {/* Stock Status */}
                                    <div className="col-span-2 text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                            item.in_stock 
                                                ? "bg-green-100 text-green-800" 
                                                : "bg-red-100 text-red-800"
                                        }`}>
                                            {item.in_stock ? "In Stock" : "Out of Stock"}
                                        </span>
                                    </div>

                                    {/* Action */}
                                    <div className="col-span-2 text-center">
                                        <Link
                                            href={`/products/${item.id}`}
                                            className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                                item.in_stock
                                                    ? "bg-[#331d67] text-white hover:bg-[#331d67]/90"
                                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                            }`}
                                        >
                                            {item.in_stock && <ShoppingCart className="w-4 h-4 mr-2" />}
                                            {item.in_stock ? "Add to Cart" : "Unavailable"}
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {fav_items.length > 0 && (
                    <div className="mt-8 flex justify-end">
                        <Button 
                            variant="outline" 
                            onClick={() => useFavoritesStore.getState().clearAllItem()}
                            className="text-red-500 border-red-300 hover:bg-red-50"
                        >
                            Clear All Favorites
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}