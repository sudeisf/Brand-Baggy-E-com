"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Menu } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useProductFilterStore } from "@/store/productStore";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
  // VisuallyHidden, // Uncomment if you want to visually hide the title
} from "@/components/ui/dialog";
import axios from "axios";

interface Category {
  id: number;
  name: string;
  slug: string;
  children?: Category[];
}

export function SideMenu() {
  const [openSections, setOpenSections] = useState<Partial<Record<number, boolean>>>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    selectedSubcategories,
    toggleSubcategory
  } = useProductFilterStore();

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['category-filter'],
    queryFn: () => 
      axios.get('http://localhost:8000/product/category-filter/')
        .then(res => res.data),
    staleTime: 1000 * 60 * 15, 
  });

  const toggleSection = (id: number) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFilterClick = (category: Category, isParent: boolean = false) => {
    toggleSubcategory({
      id: isParent ? `parent_${category.id}` : category.id.toString(),
      name: category.slug,
      isParent
    });
  };

  if (isLoading) return <div className="w-full md:w-[300px] p-4">Loading categories...</div>;

  return (
    <>
      {/* Mobile Dialog Menu */}
      <div className="block md:hidden w-full px-2 mb-4">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button
              className="w-full flex items-center justify-between px-4 py-2 border rounded-sm bg-white font-medium text-[#261354] shadow-xs"
              onClick={() => setDialogOpen(true)}
            >
              <span>Categories</span>
              <Menu className="w-5 h-5" />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-sm w-full max-h-[80vh] overflow-y-auto font-inter bg-white rounded-lg shadow-lg">
            {/* Accessible dialog title */}
            <DialogTitle asChild>
              <h2 className="text-lg font-semibold text-[#261354] px-4 pt-4">Categories</h2>
            </DialogTitle>
            <DialogDescription asChild>
              <p className="px-4 text-sm text-gray-500 mb-2">
                Browse and select a category to filter products.
              </p>
            </DialogDescription>
            <div className="flex flex-col gap-2 py-2 px-4">
              {categories?.map((category) => (
                <Collapsible 
                  key={category.id}
                  className="w-full my-2 transition-all duration-300 ease-in-out"
                  open={!!openSections[category.id]}
                  onOpenChange={() => toggleSection(category.id)}
                >
                  <CollapsibleTrigger className="w-full font-inter font-medium text-[#261354] border-b border-gray-200 flex flex-row justify-between py-2 text-base">
                    {category.name} 
                    {openSections[category.id] ? 
                      <ChevronUp className="ml-2 w-4 h-4 mt-1" /> : 
                      <ChevronDown className="ml-2 mt-1 w-4 h-4" />
                    }
                  </CollapsibleTrigger>
                  <CollapsibleContent
                    className="w-full py-2 transition-all duration-500 ease-in-out max-h-0 data-[state=open]:max-h-96 overflow-hidden"
                  >
                    <div className="flex flex-col gap-2">
                      {/* Parent category option */}
                      <div 
                        tabIndex={0}
                        role="button"
                        onClick={() => handleFilterClick(category, true)}
                        className={`flex flex-col gap-2 border rounded-md py-2 px-4 border-gray-200 cursor-pointer transition-colors duration-150 text-base ${
                          selectedSubcategories.some(item => item.id === `parent_${category.id}`)
                            ? 'bg-[#331d6710] border-2 border-[#261354] text-[#331d67]'
                            : ''
                        }`}
                      >
                        <p className="font-medium">All in {category.name}</p>
                      </div>
                      {/* Child categories */}
                      {category.children?.map((subcategory) => {
                        const isSelected = selectedSubcategories.some(item => item.id === subcategory.id.toString());
                        return (
                          <div 
                            key={subcategory.id}
                            tabIndex={0}
                            role="button"
                            onClick={() => handleFilterClick(subcategory)}
                            className={`flex flex-col gap-2 border rounded-md py-2 px-4 border-gray-200 cursor-pointer transition-colors duration-150 text-base mt-1 ${
                              isSelected
                                ? 'bg-[#331d6710] border-2 border-[#261354] text-[#331d67]'
                                : ''
                            }`}
                          >
                            <p className="font-medium">{subcategory.name}</p>
                          </div>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop Menu */}
      <div
        className="hidden md:block w-full md:w-[300px] max-h-60 md:max-h-[calc(100vh-100px)] overflow-x-auto md:overflow-x-visible overflow-y-auto border-gray-200 *:font-inter px-2 md:px-0 mb-2 md:mb-0"
      >
        {categories?.map((category) => (
          <Collapsible 
            key={category.id}
            className="w-full md:w-[90%] mx-auto my-2 transition-all duration-300 ease-in-out"
            open={!!openSections[category.id]}
            onOpenChange={() => toggleSection(category.id)}
          >
            <CollapsibleTrigger className="w-full md:w-40 font-inter font-medium text-[#261354] mx-auto border-b border-gray-200 flex flex-row justify-between py-2 text-base md:text-sm">
              {category.name} 
              {openSections[category.id] ? 
                <ChevronUp className="ml-2 w-4 h-4 mt-1" /> : 
                <ChevronDown className="ml-2 mt-1 w-4 h-4" />
              }
            </CollapsibleTrigger>
            <CollapsibleContent
              className="w-full md:w-32 mx-auto py-2 transition-all duration-500 ease-in-out max-h-0 data-[state=open]:max-h-96 overflow-hidden"
            >
              <div className="flex flex-col gap-2 md:gap-4">
                {/* Parent category option */}
                <div 
                  tabIndex={0}
                  role="button"
                  onClick={() => handleFilterClick(category, true)}
                  className={`flex flex-col gap-2 border rounded-md py-2 px-4 border-gray-200 cursor-pointer transition-colors duration-150 text-base md:text-sm ${
                    selectedSubcategories.some(item => item.id === `parent_${category.id}`) 
                      ? 'bg-[#331d6710] border-2 border-[#261354] text-[#331d67]' 
                      : ''
                  }`}
                >
                  <p className="font-medium">All in {category.name}</p>
                </div>

                {/* Child categories */}
                {category.children?.map((subcategory) => {
                  const isSelected = selectedSubcategories.some(item => item.id === subcategory.id.toString());
                  return (
                    <div 
                      key={subcategory.id}
                      tabIndex={0}
                      role="button"
                      onClick={() => handleFilterClick(subcategory)} 
                      className={`flex flex-col gap-2 border rounded-md py-2 px-4 border-gray-200 cursor-pointer transition-colors duration-150 text-base md:text-sm ${
                        isSelected 
                          ? 'bg-[#331d6710] border-2 border-[#261354] text-[#331d67]' 
                          : ''
                      }`}
                    >
                      <p className="font-medium">{subcategory.name}</p>
                    </div>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </>
  );
}