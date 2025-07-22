"use client";
import Image from "next/image";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useProductsList } from "../queries/useProductList";
import { useProductFilterStore } from "@/store/productStore";

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
        {isLoading && <p className="text-gray-600 p-4">Loading...</p>}
        {error && <p className="text-red-500 p-4">Error loading products</p>}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-4 px-0 sm:px-0 ">
          {displayProducts?.map((product) => (
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
                  <h2 className="text-md sm:text-lg font-medium font-rubik   text-gray-900 py-1 sm:py-2 text-left ">{product.name}</h2>
                </Link>
               <div className="flex justify-between  w-full items-center">
               <p className="text-base sm:text-lg mb-2 font-bold text-[#331d67]">${product.price}</p>

{/* <p className="text-sm text-gray-500 mb-2 line-clamp-2 font-sans font-normal text-left -leading-1.5">{product.description}</p> */}
                <div className="flex justify-end items-center w-full ">
                  <Link
                    href={`/products/${product.id}`}
                    className="w-fit h-fit bg-[#331d67] rounded-full shadow-xs text-sm px-1.5 py-1.5 sm:px-4  font-inter flex items-center justify-center text-white "
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
      </div>
    </div>
  );
}