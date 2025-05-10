"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { ProductList } from "./ProductList"
import { PaginationDemo } from "./pagination"
import { AppliedFilters } from "./AppliedFilters"
import { SideMenu } from "./SideMenu"

export default function ProductsView(){
    return(
        <div className="flex flex-row ">
            <SideMenu />
        <div className="w-[75%] flex flex-col gap-4">
            <div className="flex flex-row gap-4 items-center justify-between border-b border-gray-200 pb-4">
                <AppliedFilters />
                <div className="mt-7">
                    <Select >
                        <SelectTrigger className="w-24">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="asc">Ascending</SelectItem>
                            <SelectItem value="desc">Descending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
            </div>
            <div>
                <ProductList />
                <PaginationDemo />
            </div>
            
        </div>
        </div>      
    )
}
