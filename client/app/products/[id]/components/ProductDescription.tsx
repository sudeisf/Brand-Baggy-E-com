"use client";

interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({
  description,
}: ProductDescriptionProps) {
  return (
    <div className="rounded-xl border border-gray-200 p-5 sm:p-6 space-y-3 bg-white h-full">
      <h2 className="text-lg text-[#331d67] font-semibold">Description & fit</h2>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-wrap">
        {description || "No description available for this product."}
      </p>
    </div>
  );
}
