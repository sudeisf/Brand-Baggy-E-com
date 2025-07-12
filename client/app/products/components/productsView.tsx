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
    <div className="flex flex-row">
      <SideMenu />
      <div className="w-[1250px] flex flex-col gap-4">
        <div className="flex flex-row gap-4 items-center justify-between border-b border-gray-200 pb-4">
          <AppliedFilters />
        </div>
        <div>
          <ProductList initialProducts={initialData.products} />
          
          {/* Always show pagination */}
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