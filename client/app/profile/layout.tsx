"use client"

import { ProductCrum } from "@/app/products/components/ProductCrum"
import SideBarMenu from "./components/SIdeBarMenu"
export default function ProfileLayout({children}: {children: React.ReactNode}) {
    return <div className="container mx-auto px-4 py-5 mb-10">
        <ProductCrum />
        <div className="flex w-[1250px] mx-auto min-h-screen">
            <SideBarMenu />
            {children}
        </div>
    </div>
}
    