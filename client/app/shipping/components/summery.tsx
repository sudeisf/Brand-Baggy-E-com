"use client"

import { Button } from "@/components/ui/button"
import { MoveRightIcon, ShieldCheck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Rubik } from "next/font/google"

const rubik = Rubik({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    variable: '--font-rubik',
  });   

const items = [
    {
        id: 1,
        name: "Product 1",
        price: 100,
        image: "/assets/products/product1.jpg",
        quantity: 2,
    },
    {
        id: 2,
        name: "Product 2",
        price: 200,
        image: "/assets/products/product2.jpg",
        quantity: 1,
    },
    {
        id: 3,
        name: "Product 3",
        price: 300,
        image: "/assets/products/product3.jpg",
        quantity: 1,
    }
]

export default function Summery() {
    return (
        <div className="border-2 space-y-4  border-gray-200 rounded-xl w-full p-6 h-fit">

        <div className="flex flex-col gap-4 p-2">
            {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Image src={item.image} alt={item.name} width={50} height={50} className="rounded-sm" />
                        <p className="font-${rubik.className} font-medium text-gray-500">{item.name} x {item.quantity}</p>
                    </div>  
                    <div className="flex items-center gap-4">
                         <p className="font-${rubik.className} font-bold text-gray-500">${item.price * item.quantity}</p>
                     </div>
                </div>
                
            ))}
        </div>
            <div className="space-y-2 mt-4 border-t-2 border-t-gray-200 pt-4">
                <div className="flex justify-between">
                    <p className="font-${rubik.className} font-medium text-gray-500">Subtotal</p>
                    <p className="font-${rubik.className} font-medium tracking-wider">${items.reduce((acc, item) => acc + item.price * item.quantity, 0)}<span className="text-sm">ETB</span></p>
                </div>
                <div className="flex justify-between">
                    <p className="font-${rubik.className} font-medium text-gray-500">Discount</p>
                    <p className="font-${rubik.className} font-medium tracking-wider">{0}%</p>
                </div>
                <div className="flex justify-between">
                    <p className="font-${rubik.className} font-medium text-gray-500">Delivery Fee</p>
                    <p className="font-${rubik.className} font-medium tracking-wider">{100}<span className="text-sm">ETB</span> </p>
                </div>
            </div>
            <div className="flex justify-between border-t-2 border-gray-200 pt-2">
                <p className="font-${rubik.className} font-medium text-gray-500">Total</p>
                <p className="font-${rubik.className} lg:text-2xl font-medium tracking-wider">${items.reduce((acc, item) => acc + item.price * item.quantity, 0) + 100}<span className="">ETB</span></p>
            </div>
            

            <div className="flex justify-center items-center ">
                <Link href="/shipping" className="w-full"> 
                <Button className="w-full py-6 rounded-md flex items-center justify-center gap-2 font-${rubik.className} font-medium tracking-wider bg-[#331d67] text-white hover:bg-[#331d67]/80">Place Order
                <MoveRightIcon className="w-8 h-8 stroke-3" />
                </Button>
                </Link>
            </div>


        </div>
    )
}