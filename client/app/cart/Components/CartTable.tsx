"use client"
import Image from "next/image"
import QuantityButton from "@/app/cart/Components/QuantityButton"
import {useCartStore} from "@/store/cartStore"
import {  Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart, useRemoveCart } from "@/hooks/useCart"
import { useAuthStore } from "@/store/authStore"

interface CartItem {
    id : string;
    main_image : string;
    name : string;
    size : string;
    quantity : number;
    price : number;
}

export default function CartTable() {
    const items = useCartStore(state=>state.items);
    const updateItemQuantity = useCartStore((state) => state.updateItmeQuantity);
    const removeItem = useCartStore((state) => state.removeItem);
    const isAuthenticated = useAuthStore((state)=> state.isAuthenticated)
    const mutation = useRemoveCart()
    type removePayload = {
        cart_id: number,
    }
    const handleRemoveItem = (value : removePayload) =>{
        mutation.mutate(
            value
        )
    }

    const handleRemove = (item: CartItem) => {
        removeItem(item.id, item.size);
        if (isAuthenticated) {
            handleRemoveItem({
                cart_id: Number(item.id)
            });
        }
    };

    return (
        <div className=" *:font-roboto w-[70%] ">
        <div className="  border-gray-200 rounded-xl p-4">
          { items.length === 0 ?(
            <div className="text-center py-10 text-[#331d67]">
            <h2 className="text-xl font-semibold">🛒 Your cart is empty</h2>
            <Link href="/products" className="underline">
               <p className="text-sm mt-2">Start shopping and add items to your cart!</p>
            </Link>
          </div>
          ):(
            <>
            <div className="grid grid-cols-12 border-b-1 border-gray-200 gap-4 py-4">
            <div className="col-span-6 font-roboto text-[#331d67] font-medium">Product name</div>
            <div className="col-span-2 text-center font-roboto text-[#331d67] font-medium">Quantity</div>
            <div className="col-span-2 text-center font-roboto text-[#331d67] font-medium">Total</div>
            <div className="col-span-2 text-center font-roboto text-[#331d67] font-medium">Action</div>
        </div>
        <div className="space-y-6 py-4">
            {items.map((item :CartItem) => (
                <div key={`${item.id}-${item.size}`} className="grid not-last:border-b-1 *:font-roboto grid-cols-12 gap-4 items-center">
                <div className="col-span-6   flex items-center gap-4">
                    <Image src={item.main_image} 
                    alt={item.name} 
                    width={80} 
                    height={80}
                    className="rounded-md"
                     />
                    <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium font-roboto">{item.name}</h2>
                    <p className="text-sm font-roboto text-[#331d67]">Set Size: {item.size}</p>
                    </div>
                    </div>
                    <div className="col-span-2 text-center items-center font-roboto">
                        <QuantityButton quantity={item.quantity} onQuantityChange={(newQty) => {
                            updateItemQuantity(item.id, newQty , item.size)
                        }} />
                    </div>
                    <div className="col-span-2 text-[#331d67] text-center font-medium font-roboto">
                        <p>${item.quantity * item.price}</p>
                    </div>
                    <div className="col-span-2 text-center font-roboto">
                        <Button variant="ghost" onClick={() => handleRemove(item)}>
                        <Trash2  className="w-5 h-5 text-[#331d67] mx-auto" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
        </>
          ) }
        </div>
      </div>
    )
}


