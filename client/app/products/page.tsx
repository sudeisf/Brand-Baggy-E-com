"use client"

import { useState } from "react";
import Image from "next/image";
import ProductBanner from "./components/ProductBanner";
import { ProductCrum } from "./components/ProductCrum";
import { SideMenu } from "./components/SideMenu";
import { AppliedFilters } from "./components/AppliedFilters";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductList } from "./components/ProductList";
import { PaginationDemo } from "./components/pagination";
import ProductsView from "./components/productsView";
    export default function ProductsPage(){
    return(
        <>  
            <ProductsView />
        </>
    )
}





