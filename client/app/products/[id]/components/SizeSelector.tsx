"use client"

interface SizeSelectorProps {
    selectedSize : string;
    onSizeChange : (size : string) => void;
}

export default function SizeSelector({selectedSize, onSizeChange} : SizeSelectorProps) {
    const sizes = ["S", "M", "L", "XL", "XXL"];
    return (
        <div className="mt-4 w-full">
            <h1 className="text-sm text-gray-500 font-medium font-rubik">Select Size</h1>
            <div className="flex mt-4 gap-4 w-full items-center">
                {sizes.map((size) => (
                    <div key={size} className={`rounded-full  px-11 py-2 w-fit border-2 border-gray-200 ${selectedSize === size ? "bg-[#331d67] text-white" : "bg-gray-100"}`} onClick={() => onSizeChange(size)}>
                        <h1 className="text-lg font-medium font-roboto">{size}</h1>
                    </div>
                ))}
            </div>
        </div>
    );
}
