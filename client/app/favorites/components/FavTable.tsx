"use client"
import Image from "next/image"
import QuantityButton from "@/app/cart/Components/QuantityButton"
import { X } from "lucide-react"
import { ProductCrum } from "@/app/products/components/ProductCrum"
import { Button } from "@/components/ui/button"

const favItems = [
  {
    id: 1,  
    name: "Product 1",
    price: 100,
    quantity: 1,
    image: "/assets/products/product1.jpg",
    stockStatus: true,
  },
  {
    id: 2,
    name: "Product 2",
    price: 200,
    quantity: 2,
    image: "/assets/products/product2.jpg",
    stockStatus: true,
  },
  {
    id: 3,  
    name: "Product 3",
    price: 300,
    quantity: 3,
    image: "/assets/products/product3.jpg",
    stockStatus: false,
  },
]

export default function FavTable() {
    return (
        <div>
            <ProductCrum /> 
            <div className="w-[1250px] mt-5 mx-auto min-h-screen">
                <h1 className="text-4xl text-[#331d67] font-semibold py-4">Favorites</h1>
                <div className="border-2 border-gray-200 rounded-xl p-4">
                    <div className="grid grid-cols-12 border-b-2 border-gray-200 gap-4 py-4">
                        <div className="col-span-6 text-[#331d67] font-medium">Product name</div>
                        <div className="col-span-2 text-center text-[#331d67] font-medium">Price</div>
                        <div className="col-span-2 text-center text-[#331d67] font-medium">Stock Status</div>
                    </div>
                    <div className="space-y-6 py-4">
                        {favItems.map((item) => (
                            <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-6 flex items-center gap-4 p-2">
                                    <X className="w-4 h-4 text-[#331d67] cursor-pointer" />
                                    <Image src={item.image} 
                                        alt={item.name} 
                                        width={80} 
                                        height={80}
                                        className=""
                                    />
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-lg font-medium">{item.name}</h2>
                                    </div>
                                </div>
                                <div className="col-span-2 text-center text-[#331d67] font-bold">
                                    <p>${item.price}</p>
                                </div>
                                <div className="col-span-2 text-center">
                                    <p className={`${item.stockStatus ? "text-green-500 bg-green-500/5 rounded-md px-2 py-1" : "text-red-500 bg-red-500/5 rounded-md px-2 py-1"} w-fit mx-auto text-center text-xsm`}>
                                        {item.stockStatus ? "In Stock" : "Out of Stock"}
                                    </p>
                                </div>
                                <div className="col-span-2 text-center text-[#331d67] font-semibold">
                                    <Button
                                        disabled={!item.stockStatus}
                                        className="bg-[#331d67] text-white rounded-md px-4 py-2">
                                        Add to Cart
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
