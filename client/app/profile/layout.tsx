"use client"

import { ProductCrum } from "@/app/products/components/ProductCrum"
import SideBarMenu from "./components/SIdeBarMenu"
import { Rubik } from "next/font/google"

const rubik = Rubik({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})

export default function ProfileLayout({children}: {children: React.ReactNode}) {
    return <div className="container mx-auto px-4 py-5 mb-10">
        <ProductCrum />
        <div className=" flex flex-col gap-4 w-[1250px] mx-auto min-h-screen">
            <h1 className={`${rubik.className} text-[#331d67] text-2xl font-bold p-4`}>My Account</h1>
            <div className="flex">
                <SideBarMenu />
                {children}
            </div>
        </div>
    </div>
}
    