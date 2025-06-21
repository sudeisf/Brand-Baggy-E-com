"use client";
import Image from "next/image";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useProductsList } from "../queries/useProductList";
import { useQueryClient } from "@tanstack/react-query";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  main_image: string;
};
type Props = {
  products: Product[];
};

export function ProductList({ products }: Props) {
  const queryClient = useQueryClient();
  queryClient.setQueryData(['productsList'], products); // Initialize cache
  const { data, isLoading, error } = useProductsList();

  return (
    <div>
      <div className="relative w-full">
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error loading products</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 w-full ml-0">
          {(data || products).map((product) => (
            <div
              key={product.id}
              className="bg-inherit rounded-md transition-shadow duration-300 w-64 md:w-96 h-[22rem] md:h-[24rem] flex flex-col flex-shrink-0 snap-start justify-between group border items-start border-gray-200"
            >
              <div className="overflow-hidden rounded-t-md w-full h-48 md:h-56">
                <Link href={`/products/${product.id}`}>
                  <Image
                    src={product.main_image}
                    alt={product.name}
                    width={220}
                    height={220}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>
              <div className="flex flex-col items-start justify-start px-4 w-full">
                <Link href={`/products/${product.id}`}>
                  <h2 className="text-base md:text-lg font-semibold text-gray-900 py-2 mb-1 md:mb-2 text-left">{product.name}</h2>
                </Link>
                <p className="text-sm md:text-base text-gray-600 mb-2 line-clamp-2 text-left">{product.description}</p>
                <div className="flex justify-between w-full mt-2 mb-2">
                  <p className="text-base md:text-lg font-bold text-[#331d67]">${product.price}</p>
                  <button
                    className="w-fit h-fit bg-[#331d67] rounded-md shadow-xs text-sm space-x-2 px-3 py-2 font-roboto capitalize flex items-center text-white"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <Plus className="text-white w-4 h-4 md:w-4 md:h-4 mr-2" /> add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}