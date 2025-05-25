"use client"
import Image from "next/image"
import QuantityButton from "@/app/cart/Components/QuantityButton"


const cartItems = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    quantity: 1,
    image: "/assets/products/product1.jpg",
    total: 100,
    size: "M",
    color: "Red",
  },
  {
    id: 2,
    name: "Product 2",
    price: 200,
    quantity: 2,
    image: "/assets/products/product2.jpg",
    total: 400,
    size: "L",
    color: "Red",
  },
  {
    id: 3,  
    name: "Product 3",
    price: 300,
    quantity: 3,
    image: "/assets/products/product3.jpg",
    total: 300,
    size: "XL",
    color: "Blue",
  },
]

import { Trash2 } from "lucide-react"



export default function CartTable() {
    return (
        <div className=" *:font-roboto w-[70%] ">
        <div className="  border-gray-200 rounded-xl p-4">
            <div className="grid grid-cols-12 border-b-1 border-gray-200 gap-4 py-4">
                <div className="col-span-6 font-roboto text-[#331d67] font-medium">Product name</div>
                <div className="col-span-2 text-center font-roboto text-[#331d67] font-medium">Quantity</div>
                <div className="col-span-2 text-center font-roboto text-[#331d67] font-medium">Total</div>
                <div className="col-span-2 text-center font-roboto text-[#331d67] font-medium">Action</div>
            </div>
            <div className="space-y-6 py-4">
                {cartItems.map((item) => (
                    <div key={item.id} className="grid not-last:border-b-1 *:font-roboto grid-cols-12 gap-4 items-center">
                    <div className="col-span-6   flex items-center gap-4">
                        <Image src={item.image} 
                        alt={item.name} 
                        width={80} 
                        height={80}
                        className="rounded-md"
                         />
                        <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-medium font-roboto">{item.name}</h2>
                        <p className="text-sm font-roboto text-[#331d67]">Set Size: {item.size}</p>
                        <p className="text-sm font-roboto text-[#331d67]">Color: {item.color}</p>
                        </div>
                        </div>
                        <div className="col-span-2 text-center items-center font-roboto">
                            <QuantityButton quantity={item.quantity} onQuantityChange={() => {}} />
                        </div>
                        <div className="col-span-2 text-[#331d67] text-center font-medium font-roboto">
                            <p>${item.total}</p>
                        </div>
                        <div className="col-span-2 text-center font-roboto">
                            <Trash2  className="w-5 h-5 text-[#331d67] mx-auto" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    )
}
