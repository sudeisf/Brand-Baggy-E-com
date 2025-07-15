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
      <div className="flex flex-wrap justify-center sm:justify-start mt-3 gap-2 sm:gap-3 md:gap-4 w-full items-center">
        {allSizes.map((size) => {
          const isAvailable = availableSizes.includes(size);
          const isSelected = selectedSize === size;
          
          return (
            <button
              key={size}
              disabled={!isAvailable}
              className={`
                rounded-full
                min-w-[36px] sm:min-w-[44px] md:min-w-[64px]
                px-2 py-1 sm:px-3 sm:py-1.5 md:px-6 md:py-4
                w-fit border-2
                transition-all duration-200 ease-in-out
                ${isSelected ? "bg-[#331d67] text-white border-[#331d67]" : ""}
                ${isAvailable ? 
                  "border-gray-200 hover:border-[#331d67] hover:bg-[#331d6710] cursor-pointer" : 
                  "border-gray-100 text-gray-400 cursor-not-allowed"}
                flex items-center justify-center
              `}
              onClick={() => isAvailable && onSizeChange(size)}
            >
              <span className="text-xs sm:text-sm md:text-base font-medium font-roboto">
                {size}
                {!isAvailable && (
                  <span className="text-[8px] sm:text-[10px] md:text-xs block text-gray-400">(Out of stock)</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}