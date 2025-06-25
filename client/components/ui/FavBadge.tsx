"use client"

import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore"
import { useFavoritesStore } from "@/store/favStore";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react"




export default function FavBadge(){

      const totalFavorite = useFavoritesStore((state)=> state.totalFavorite);
      const [count,setCount] = useState<number>(0)
      const [mounted,setMounted] = useState<boolean>(false)
      const isAuthenticated = useAuthStore((state)=>state.isAuthenticated)
      
      useEffect(()=>{
            setMounted(true)
      },[]);
      useEffect(()=>{
      if(!mounted || !isAuthenticated) return;
      const unsubscribe =useFavoritesStore.subscribe(
                  (state) => state.favorites,
                  () => {
                  setCount(totalFavorite());
                  },
                  { fireImmediately: true }
      );
      return () => unsubscribe();
      },[mounted,totalFavorite]);

      return(
            <>
          <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center border border-gray-400 relative">
                        <Link href="/favorites" className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2">
                            <Heart className="text-[#2d1a4d] w-4 h-4 sm:w-5 sm:h-5" />
                        </Link>
                        { count > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {count}
                            </span>
                        )}
                    </div>
            </>
      )
}

