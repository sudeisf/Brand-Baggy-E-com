"use client"

import { useCartStore } from "@/store/cartStore"
import { useFavoritesStore } from "@/store/favStore";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react"




export default function FavBadge(){
      // const [count, setCount] = useState<number>(0);
      // const [totlal, setTotal] = useState<number>(0);

      const totalFavorite = useFavoritesStore((state)=> state.totalFavorite);
      // const subscribe = useCartStore((state) => state.subscribe);

      // useEffect(()=>{
      //       setCount(totalQuantity)
      //       setTotal(totalPrice)
      //       const unsubscribe = subscribe(()=>{
      //             setCount(totalQuantity)
      //             setTotal(totalPrice)
      //       })
      //       return unsubscribe
      // },[subscribe])

      return(
            <>
          <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center border border-gray-400 relative">
                        <Link href="/favorites" className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2">
                            <Heart className="text-[#2d1a4d] w-4 h-4 sm:w-5 sm:h-5" />
                        </Link>
                        { totalFavorite() > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {totalFavorite()}
                            </span>
                        )}
                    </div>
            </>
      )
}

