"use client";
import { ProductList } from "./ProductList";
import { ProductPagination } from "./pagination";
import { AppliedFilters } from "./AppliedFilters";
import { SideMenu } from "./SideMenu";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useProductFilterStore } from "@/store/productStore";
import { useEffect } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  main_image: string;
  description: string;
  category?: string;
}

interface ProductsViewProps {
  initialData: {
    products: Product[];
    count: number;
    next: string | null;
    previous: string | null;
  };
}

export default function ProductsView({ initialData }: ProductsViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { getParentCategory, getChildCategories } = useProductFilterStore();

  // Get current page from URL or default to 1
  const currentPage = parseInt(searchParams.get('page') || '1');
  const totalItems = initialData.count;
  const totalPages = Math.ceil(totalItems / 20);

  return (
    <div className="flex flex-col md:flex-row w-full gap-0 md:gap-4">
      {/* SideMenu: Responsive */}
      <div className="w-full md:w-64 mb-0 md:mb-0">
        <SideMenu />
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-4 px-0 sm:px-2 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-gray-200 pb-4 px-2 md:px-0">
          <AppliedFilters />
        </div>
        <div className="px-2 md:px-0">
          <ProductList initialProducts={initialData.products} />
          <ProductPagination 
            totalItems={totalItems}
            itemsPerPage={20}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
}