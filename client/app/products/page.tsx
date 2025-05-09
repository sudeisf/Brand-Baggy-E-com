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
                <div className="flex flex-col gap-4">
                    <ProductCrum />
                    <div className="flex flex-row ">
                        <SideMenu />
                        <div className="w-1/2 flex flex-col gap-4 border border-gray-200">
                            <p>product list and sidbar list</p>
                            <p>product list pagination</p>
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    )
}
