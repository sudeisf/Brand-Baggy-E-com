"use client"

import { usePathname } from "next/navigation";
import ProductBanner from "./components/ProductBanner"
import { ProductCrum } from "./components/ProductCrum"
import { SideMenu } from "./components/SideMenu"

export default function ProductsLayout({children}: {children: React.ReactNode}){
    const pathname = usePathname();
    const isProductDetailsPage = pathname.includes("/products/");
    return(
        <>
        <div className="container mx-auto px-4 py-2 *:font-roboto">
        {isProductDetailsPage ? null : <ProductBanner />}
        <div className="flex flex-col gap-4">
            <ProductCrum />
            <div>
                {children}
            </div>
        </div>
        </div>
        </>
    )
}
