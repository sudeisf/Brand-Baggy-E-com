"use client";

import { useProuductSuggestion, SuggestedProduct } from "@/hooks/use-product";
import Image from "next/image";
import Link from "next/link";

interface RelatedProductsProps {
  product_id: number;
}

export default function RelatedProducts({ product_id }: RelatedProductsProps) {
  const { data: Products, isLoading } = useProuductSuggestion(product_id);

  if (isLoading) {
    return (
      <div className="text-center text-gray-500 py-8">Loading suggestions...</div>
    );
  }

  if (!Products?.data?.length) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-6 md:gap-8">
      <h2 className="text-center font-medium text-2xl sm:text-3xl md:text-4xl text-gray-900">
        You might also like
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {Products.data.map((product: SuggestedProduct) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group w-full bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
              {product.main_image ? (
                <Image
                  src={product.main_image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                  No image
                </div>
              )}
            </div>

            <div className="p-3 space-y-1">
              <h3 className="text-sm sm:text-base font-medium text-gray-800 line-clamp-2 capitalize">
                {product.name}
              </h3>
              <p className="font-semibold text-[#331d67]">
                {Number(product.price).toFixed(2)}{" "}
                <span className="text-xs font-medium">ETB</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
