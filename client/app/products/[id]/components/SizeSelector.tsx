"use client";

interface SizeSelectorProps {
  selectedSize: string;
  onSizeChange: (size: string) => void;
  availableSizes: string[];
}

export default function SizeSelector({
  selectedSize,
  onSizeChange,
  availableSizes = [],
}: SizeSelectorProps) {
  const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-600">Select size</h2>
        {selectedSize ? (
          <span className="text-sm text-[#331d67] font-medium">{selectedSize}</span>
        ) : (
          <span className="text-sm text-gray-400">Required</span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {allSizes.map((size) => {
          const isAvailable = availableSizes.includes(size);
          const isSelected = selectedSize === size;

          return (
            <button
              key={size}
              type="button"
              disabled={!isAvailable}
              onClick={() => isAvailable && onSizeChange(size)}
              className={`
                min-w-[52px] h-12 px-3 rounded-lg border-2 text-sm font-medium transition-all
                ${isSelected ? "bg-[#331d67] text-white border-[#331d67]" : ""}
                ${
                  isAvailable
                    ? "border-gray-200 text-gray-800 hover:border-[#331d67]"
                    : "border-gray-100 text-gray-300 cursor-not-allowed line-through"
                }
              `}
            >
              {size}
            </button>
          );
        })}
      </div>

      {availableSizes.length === 0 && (
        <p className="text-sm text-red-500">No sizes currently in stock.</p>
      )}
    </div>
  );
}
