"use client";

interface ProductHeaderProps {
  catagory: string;
  name: string;
  price: string | number;
  inStock?: boolean;
  brand?: string | null;
}

export default function ProductHeader({
  catagory,
  name,
  price,
  inStock = true,
  brand,
}: ProductHeaderProps) {
  const displayPrice =
    typeof price === "number" ? price.toFixed(2) : String(price || "0");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {catagory && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-[#331d67] font-medium capitalize border border-gray-200">
            {catagory}
          </span>
        )}
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium border ${
            inStock
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-600 border-red-200"
          }`}
        >
          {inStock ? "In stock" : "Out of stock"}
        </span>
      </div>

      {brand && (
        <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">
          {brand}
        </p>
      )}

      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-medium capitalize text-gray-900 leading-tight">
          {name}
        </h1>
        <p className="text-2xl md:text-3xl font-semibold text-[#331d67]">
          {displayPrice} <span className="text-base font-medium">ETB</span>
        </p>
      </div>
    </div>
  );
}
