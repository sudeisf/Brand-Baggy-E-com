"use client";

import { useCart } from "@/hooks/useCart";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartBadge() {

    const [count, setCount] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [mounted,setMounted] = useState<boolean>(false)
    const isAuthenticated = useAuthStore(state=>state.isAuthenticated)
 
    const totalQuantity = useCartStore((state)=>state.totalQuantity)
    const totalPrice = useCartStore((state)=>state.totalPrice)

    useEffect(()=>{
            setMounted(true)
    },[]);
    useEffect(()=>{
      if(!mounted || !isAuthenticated) return;
      const unsubscribe =useCartStore.subscribe(
            (state) => state.items,
            () => {
                  setCount(totalQuantity());
                  setTotal(totalPrice());
            },
            { fireImmediately: true }
      );
      return () => unsubscribe();
    },[mounted,totalQuantity,totalPrice]);

    return (
        <div className="bg-white rounded-md p-1 sm:p-2 border relative">
            <Link href="/cart" className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2">
                <ShoppingCart className="text-[#2d1a4d] w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline text-[#2d1a4d] text-sm font-semibold">
                    ${total ? total.toFixed(2) : "0.00"}
                </span>
            </Link>
            {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {count}
                </span>
            )}
        </div>
    );
}