"use client"

import { Button } from "@/components/ui/button"
import { ShieldCheck } from "lucide-react"
import Link from "next/link"
import { Rubik } from "next/font/google"

const rubik = Rubik({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
})

export default function OrderSummary() {
    return (
        <div className="border-2 space-y-4  border-gray-200 rounded-xl p-6 h-fit">
            <h1 className="text-2xl font-medium font-roboto text-[#331d67]">Order Summary</h1>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <p>Order Price</p>
                    <p className={`font-${rubik.className} font-medium tracking-wider`}>300 <span className="text-sm font-roboto">ETB</span></p>
                </div>
                <div className="flex justify-between">
                    <p>VAT(15%)</p>
                    <p className={`font-${rubik.className} font-medium tracking-wider`}>45 <span className="text-sm font-roboto">ETB</span></p>
                </div>
            </div>
            <div className="flex justify-between border-t-2 border-gray-200 pt-2">
                <p>Total</p>
                <p className={`font-${rubik.className} font-medium tracking-wider`}>345 <span className="text-sm font-roboto">ETB</span></p>
            </div>
            <div className="flex items-start gap-2 bg-[#331d67]/5 text-[#331d67] p-4 rounded-md">
                <ShieldCheck className="w-6 h-6" />
                <p className={`font-${rubik.className} font-medium`}>90 days Limited Warranty against manufacturing defects</p>
            </div>

            <div className="flex justify-center items-center ">
                <Link href="/shipping" className="w-full"> 
                <Button className="w-full py-6 rounded-md font-${rubik.className} font-semibold tracking-wider bg-[#331d67] text-white hover:bg-[#331d67]/80">Confirm Order</Button>
                </Link>
            </div>


        </div>
    )
}   
