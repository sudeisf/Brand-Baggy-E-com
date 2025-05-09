"use client"

import { useState } from "react";
import Image from "next/image";
import ProductBanner from "./components/ProductBanner";
import { ProductCrum } from "./components/ProductCrum";
import { SideMenu } from "./components/SideMenu";
export default function ProductsPage(){
    return(
        <>
            <div className="container mx-auto px-4 py-2 *:font-roboto">
                <ProductBanner />
                <div>
                    <ProductCrum />
                    <div className="flex">
                        <SideMenu />
                        <div className="w-full flex flex-col gap-4">
                            <p>product list and sidbar list</p>
                            <p>product list pagination</p>
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    )
}
