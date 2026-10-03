"use client";
import Image from "next/image";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useProductsList } from "../queries/useProductList";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  main_image: string;
  category?: string;
};

type Props = {
  initialProducts?: Product[];
};

export function ProductList({ initialProducts }: Props) {
  const { data: products, isLoading, error } = useProductsList();
  const displayProducts = products || initialProducts || [];

  return (
    <div className="w-full">
      <div
        className="relative w-full max-h-[calc(100vh-100px)] overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#d1d5db transparent",
        }}
      >
        <style jsx>{`
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
        `}</style>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm my-2">
            Failed to load products. Please check your connection and try again.
          </div>
        )}

        {isLoading && displayProducts.length === 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-4 px-0 sm:px-0">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-xs animate-pulse w-full max-w-[400px] h-[22rem] sm:h-[24rem] flex flex-col justify-between mx-auto overflow-hidden p-3"
              >
                <div className="w-full h-48 sm:h-56 bg-gray-200 rounded-lg" />
                <div className="space-y-2 mt-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && displayProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg border border-dashed border-gray-300 my-4">
            <p className="text-lg font-medium text-gray-700">No products found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search keywords.</p>
          </div>
        )}

        {displayProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-4 px-0 sm:px-0">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-xs transition-shadow duration-300 w-full max-w-[400px] h-[22rem] sm:h-[24rem] flex flex-col justify-evenly group mx-auto"
              >
                <div className="overflow-hidden rounded-t-lg w-full h-48 sm:h-56">
                  <Link href={`/products/${product.id}`}>
                    <Image
                      src={product.main_image}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
                <div className="flex flex-col items-start justify-start px-3 py-2 w-full">
                  <Link href={`/products/${product.id}`}>
                    <h2 className="text-md sm:text-lg font-medium font-rubik text-gray-900 py-1 sm:py-2 text-left line-clamp-1">{product.name}</h2>
                  </Link>
                  <div className="flex justify-between w-full items-center">
                    <p className="text-base sm:text-lg mb-2 font-bold text-[#331d67]">${product.price}</p>
                    <div className="flex justify-end items-center w-full">
                      <Link
                        href={`/products/${product.id}`}
                        className="w-fit h-fit bg-[#331d67] rounded-full shadow-xs text-sm px-1.5 py-1.5 sm:px-4 font-inter flex items-center justify-center text-white"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <Plus className="text-white w-4 h-4 md:mr-1.5" />
                        <div className="hidden md:block p-0 m-0">Add</div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}