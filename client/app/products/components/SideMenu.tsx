"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

interface Category {
  id: number;
  name: string;
  children?: Category[];
}

export function SideMenu() {
  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({});
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  // Fetch hierarchical category data
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['category-filter'],
    queryFn: () => 
      api.get('/product/category-filter/')
        .then(res => res.data),
    staleTime: 1000 * 60 * 15, // 15 minutes cache
  });

  const toggleSection = (id: number) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFilterClick = (filterId: number) => {
    setSelectedFilters(prev => 
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  if (isLoading) return <div className="w-[300px] p-4">Loading categories...</div>;

  return (
    <div className="w-[300px] h-[calc(100vh-100px)] border-gray-200 *:font-inter">
      {categories?.map((category) => (
        <Collapsible 
          key={category.id}
          ref={ref}
          className="w-[90%] mx-auto my-2 transition-all duration-300 ease-in-out"
          open={openSections[category.id]}
          onOpenChange={() => toggleSection(category.id)}
        >
          <CollapsibleTrigger className="w-40 font-inter font-medium text-[#261354] mx-auto border-b border-gray-200 flex flex-row justify-between py-2">
            {category.name} 
            {openSections[category.id] ? 
              <ChevronUp className="ml-2 w-4 h-4 mt-1" /> : 
              <ChevronDown className="ml-2 mt-1 w-4 h-4" />
            }
          </CollapsibleTrigger>
          <CollapsibleContent className="w-32 mx-auto py-2">
            <div className="flex flex-col gap-4">
              {category.children?.map((subcategory) => (
                <div 
                  key={subcategory.id}
                  onClick={() => handleFilterClick(subcategory.id)} 
                  className={`flex flex-col gap-2 border rounded-md py-2 px-4 border-gray-200 cursor-pointer ${
                    selectedFilters.includes(subcategory.id) 
                      ? 'bg-[#331d6710] border-2 border-[#261354] text-[#331d67]' 
                      : ''
                  }`}
                >
                  <p className="text-sm font-medium">{subcategory.name}</p>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}