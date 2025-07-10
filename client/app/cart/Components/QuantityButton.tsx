"use client"

import { useEffect, useState } from "react"
import { Plus , Minus} from "lucide-react"
import { useUpdateCartItemQuantity } from "@/hooks/useCart"

interface QuantityButtonProps {
    id: number;
    quantity: number;
    size : string;
    onQuantityChange: (quantity: number) => void
}

export default function QuantityButton({ id,quantity,size, onQuantityChange }: QuantityButtonProps) {
    const mutate = useUpdateCartItemQuantity()
    const [quantityState, setQuantityState] = useState<number>(quantity);
        useEffect(() => {
            setQuantityState(quantity)
        }, [quantity])
    
      const handleQuantityChange = (value: number) => {
        if (value < 1) return
        setQuantityState(value)
        onQuantityChange(value)
        mutate.mutate({ id : Number(id), quantity: value , size : size });
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
