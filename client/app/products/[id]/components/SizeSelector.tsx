"use client"

interface SizeSelectorProps {
  selectedSize: string;
  onSizeChange: (size: string) => void;
  availableSizes: string[];
}

export default function SizeSelector({
  selectedSize,
  onSizeChange,
  availableSizes = [] 
}: SizeSelectorProps) {
 
  const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="mt-4 w-full">
      <h1 className="text-sm text-gray-500 font-medium font-rubik">Select Size</h1>
      <div className="flex mt-4 gap-4 w-full items-center flex-wrap">
        {allSizes.map((size) => {
          const isAvailable = availableSizes.includes(size);
          const isSelected = selectedSize === size;
          
          return (
            <button
              key={size}
              disabled={!isAvailable}
              className={`
                rounded-full px-11 py-2 w-fit border-2
                ${isSelected ? "bg-[#331d67] text-white border-[#331d67]" : ""}
                ${isAvailable ? 
                  "border-gray-200 hover:border-[#331d67] cursor-pointer" : 
                  "border-gray-100 text-gray-400 cursor-not-allowed"}
              `}
              onClick={() => isAvailable && onSizeChange(size)}
            >
              <h1 className="text-lg font-medium font-roboto">
                {size}
                {!isAvailable && (
                  <span className="text-xs block text-gray-400">(Out of stock)</span>
                )}
              </h1>
            </button>
          );
        })}
      </div>
    </div>
  );
}