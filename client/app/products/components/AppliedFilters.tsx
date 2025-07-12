"use client"
import { useProductFilterStore } from "@/store/productStore"
import { X , Check } from "lucide-react"


export function AppliedFilters(){
    const selectedCatagories = useProductFilterStore(s=>s.selectedSubcategories)
    const removeCatagories = useProductFilterStore(s=>s.removeSubcategory)
    return(
        <div>
            <h1 className="font-inter font-medium mb-2 text-[#331d67]">Applied filters:</h1>
            <div className="flex flex-row gap-2">
                {selectedCatagories.map((filter) => (
                    <div  key={filter.id} className="border flex items-center justify-between border-gray-200 rounded-md px-2 group py-2 w-fit gap-2 hover:bg-gray-100 cursor-pointer">
                        <p>{filter.name}</p>
                        <Check className="w-3 h-3 group-hover:hidden block" />
                        <X onClick={()=>removeCatagories(filter.id)} className="w-3 h-3 group-hover:block hidden" />
                    </div>
                ))}
            </div>
        </div>
    )
}
