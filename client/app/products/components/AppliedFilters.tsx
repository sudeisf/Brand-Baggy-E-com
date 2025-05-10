"use client"
import { X , Check } from "lucide-react"


const appliedFilters = [
    {
        id: 1,
        name: "Filter 1",
        value: "Filter 1"
    },
    {
        id: 2,
        name: "Filter 2",
        value: "Filter 2"
    },
    {
        id: 3,
        name: "Filter 3",
        value: "Filter 3"
    }
]

export function AppliedFilters(){
    return(
        <div>
            <h1 className="font-inter font-medium mb-2 text-[#331d67]">Applied filters:</h1>
            <div className="flex flex-row gap-2">
                {appliedFilters.map((filter) => (
                    <div  key={filter.id} className="border flex items-center justify-between border-gray-200 rounded-md px-2 group py-1 w-24 hover:bg-gray-100 cursor-pointer">
                        <p>{filter.name}</p>
                        <Check className="w-3 h-3 group-hover:hidden block" />
                        <X className="w-3 h-3 group-hover:block hidden" />
                    </div>
                ))}
            </div>
        </div>
    )
}
