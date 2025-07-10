"use client"

import { Button } from "@/components/ui/button"
import { MoveRightIcon } from "lucide-react"
import Image from "next/image"
import { useCartStore } from "@/store/cartStore"

type Props = {
    onPlaceOrder?: () => void;
}

export default function Summery({ onPlaceOrder }: Props) {
    const items = useCartStore(s => s.items)
    const total = useCartStore(state => state.total)
    const discount = useCartStore(state=> state.totalDiscount)
    const Subtotal = useCartStore(s => s.subtotal)
    
    const handlePlaceOrder = () => {
        if (onPlaceOrder) {
            onPlaceOrder();
        }
    };

    return (
        <div className="border-1 space-y-4 border-gray-200 rounded-xl w-full p-6 h-fit">
            <div className="flex flex-col gap-4 p-2">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Image src={item.main_image} alt={item.name} width={50} height={50} className="rounded-sm" />
                            <p className="font-medium text-gray-500">{item.name} x {item.quantity}</p>
                        </div>  
                        <div className="flex items-center gap-4">
                            <p className="font-medium text-gray-500 font-roboto">${item.price * item.quantity}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="space-y-2 mt-4 border-t-2 border-t-gray-200 pt-4">
                <div className="flex justify-between">
                    <p className="font-medium text-gray-500">Subtotal</p>
                    <p className="font-medium tracking-wider">${Subtotal()}<span className="text-sm">ETB</span></p>
                </div>
                <div className="flex justify-between">
                    <p className="font-medium text-gray-500">Discount</p>
                    <p className="font-medium tracking-wider">{discount().toFixed(2)} <span className="">ETB</span></p>
                </div>
                <div className="flex justify-between">
                    <p className="font-medium text-gray-500">Delivery Fee</p>
                    <p className="font-medium tracking-wider">Free</p>
                </div>
            </div>
            <div className="flex justify-between border-t-2 border-gray-200 pt-2">
                <p className="font-medium text-gray-500">Total</p>
                <p className="lg:text-2xl font-medium tracking-wider">${total()}<span className="">ETB</span></p>
            </div>
            
            <div className="flex justify-center items-center">
                <Button 
                    onClick={handlePlaceOrder}
                    className="w-full py-6 rounded-md flex items-center justify-center gap-2 font-medium tracking-wider bg-[#331d67] text-white hover:bg-[#331d67]/80"
                >
                    Place Order
                    <MoveRightIcon className="w-8 h-8 stroke-3" />
                </Button>
            </div>
        </div>
    )
}