"use client"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    ChevronDown,
    ChevronUp,
} from "lucide-react"
import { useState, useRef } from "react";

const filterList = [
    {
        id: 1,
        name: "Men",
        children: [
            {
                id: 1,
                name: "Option 1",
                children: []
            },
            {
                id: 2,
                name: "Option 2",
                children: []
            },
            {
            id: 3,
            name: "Option 3",
            children: []
        },
    ]
},
{
    id: 2,
    name: "Women",
    children: [
        {
            id: 4,
            name: "Option 1",
            children: []
        },
        {
            id: 5,
            name: "Option 2",
            children: []
        },
        {
            id: 6,
            name: "Option 3",
            children: []
        },
    ]
},
{
    id: 3,
    name: "Kids",
    children: [
        {
            id: 7,
            name: "Option 1",
        },
        {
            id: 8,
            name: "Option 2",
        },
        {
            id: 9,
            name: "Option 3",
        }
    ]
}
]

export function SideMenu(){
    const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({});
    const [selectedFilters, setSelectedFilters] = useState<number[]>([]); // Changed to array of IDs
    const ref = useRef<HTMLDivElement>(null);
        
    const toggleSection = (id: number) => {
        setOpenSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleFilterClick = (filterId: number) => {
        setSelectedFilters(prev => 
            prev.includes(filterId)
                ? prev.filter(id => id !== filterId) // Remove if already selected
                : [...prev, filterId] // Add if not selected
        );
    };

    return(
        <div className="w-[300px] h-[calc(100vh-100px)] border-gray-200 *:font-inter">
            {filterList.map((filter) => (
                <Collapsible 
                    key={filter.id}
                    ref={ref} 
                    className="w-[90%] mx-auto my-2 transition-all duration-300 ease-in-out"
                    open={openSections[filter.id]}
                    onOpenChange={() => toggleSection(filter.id)}
                >
                    <CollapsibleTrigger className="w-40 font-inter font-medium text-[#261354] mx-auto border-b border-gray-200 flex flex-row justify-between py-2">
                        {filter.name} 
                        {openSections[filter.id] ? 
                            <ChevronUp className="ml-2 w-4 h-4 mt-1" /> : 
                            <ChevronDown className="ml-2 mt-1 w-4 h-4" />
                        }
                    </CollapsibleTrigger>
                    <CollapsibleContent className="w-32 mx-auto py-2">
                        <div className="flex flex-col gap-4">
                            {filter.children.map((child) => (
                                <div 
                                    key={child.id}
                                    onClick={() => handleFilterClick(child.id)} 
                                    className={`flex flex-col gap-2 border rounded-md py-2 px-4 border-gray-200 cursor-pointer ${
                                        selectedFilters.includes(child.id) 
                                            ? 'bg-[#331d6710] border-2 border-[#261354] text-[#331d67]' 
                                            : ''
                                    }`}
                                >
                                    <p className="text-sm font-medium">{child.name}</p>
                                </div>
                            ))}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            ))}
        </div>
    )
}










   