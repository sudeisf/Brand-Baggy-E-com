"use client"

import { useState } from "react"
import { Plus , Minus} from "lucide-react"

interface QuantityButtonProps {
    quantity: number
    onQuantityChange: (quantity: number) => void
}

export default function QuantityButton({ quantity, onQuantityChange }: QuantityButtonProps) {
    const [quantityState, setQuantityState] = useState<number>(1);
    const handleQuantityChange = (value: number) => {
        setQuantityState(value);
        onQuantityChange(value);
    }
    return (
        <div className="flex items-center justify-center border w-24 mx-auto border-gray-300 rounded-full py-1">
            <button onClick={() => handleQuantityChange( quantityState > 1 ? quantityState - 1 : 1 )} className="">
                <Minus className="w-4 h-4" />
            </button>
            <input type="text" className="w-10 text-center" value={quantityState} readOnly />
            <button onClick={() => handleQuantityChange(quantityState + 1)} className="">
                <Plus className="w-4 h-4" />
            </button>
        </div>
    )
}
