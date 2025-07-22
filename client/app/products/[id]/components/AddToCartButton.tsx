"use client"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cartStore";
import { useFavoritesStore } from "@/store/favStore";
import { Heart } from "lucide-react";
import {useAddCartMutation} from "@/hooks/useCart";
import { error } from "console";
import { useAuthStore } from "@/store/authStore";
import { useAddFavoriteItemMutation } from "@/hooks/useFav";
import { number } from "zod";



interface CartItem {
    id : string;
    main_image : string;
    name : string;
    size : string;
    quantity : number;
    price : string;
    in_stock : boolean;
    discount : {
        discount_value : string;
        discount_type :string;
        discount_start_date :string;
        discount_end_date :string;
        discount_is_valid :boolean;
        discount_is_active :boolean;
    }
}

interface AddToCartButtonProps{
    cartItem : CartItem;
    isSizeSelected: boolean
    product_id : number
}

export default function AddToCartButton({
    product_id,
    isSizeSelected,
    cartItem, 
    }:AddToCartButtonProps){

    const addToCart = useCartStore((state)=> state.addCartItem)
    const isAuthenticated = useAuthStore((state)=>state.isAuthenticated)
    const mutation = useAddCartMutation();
    const fav_Mutation = useAddFavoriteItemMutation()
    const payload =  {
        product_id : Number(cartItem.id),
        quantity: Number(cartItem.quantity),
        size : cartItem.size,
    }

    const handleAddToCart = () => {
        const storeCartItem = {
            id: Number(cartItem.id),
            main_image: cartItem.main_image,
            name: cartItem.name,
            size: cartItem.size,
            quantity: cartItem.quantity,
            price: Number(cartItem.price),
            discount_type: cartItem.discount.discount_type === "fixed_amount" || cartItem.discount.discount_type === "percentage"
                ? cartItem.discount.discount_type as "fixed_amount" | "percentage"
                : null,
            discount_value: cartItem.discount.discount_value,
            final_price: Number(cartItem.price), 
            subtotal: Number(cartItem.price) * cartItem.quantity,
        };

        if (isAuthenticated) {
            mutation.mutate(
                payload,
                {
                    onError: (error) => {
                        console.error("Failed to add to cart:", error);
                    }
                }
            );
        }else{
            addToCart(storeCartItem);
        }
    };


    const { isFavorite, toggleFavorite } = useFavoritesStore();
    const handleToggleFavorite = () => {
       
        if(isAuthenticated){
            fav_Mutation.mutate(
                {product_id : product_id}
            )
        }else{
            toggleFavorite({
                id: cartItem.id,
                main_image: cartItem.main_image,
                name: cartItem.name,
                price: cartItem.price,
                in_stock : cartItem.in_stock
              });
        }
      };
    return(
        <div className="flex mt-4 gap-2 sm:gap-4 lg:gap-2 w-full items-center">
            <Button
                disabled={!isSizeSelected}
                onClick={handleAddToCart}
                className="
                    bg-[#331d67] 
                    py-7 sm:py-5 md:py-6 lg:py-8
                    text-lg sm:text-base md:text-lg lg:text-2xl
                    font-medium text-white rounded-md
                    w-[80%] md:w-[85%] lg:w-[90%]
                    hover:bg-[#331d67]/80
                    transition-all
                "
            >
                Add to Cart
            </Button>
            <button
                type="button"
                aria-label="Add to favorites"
                className="
                    flex justify-center items-center
                    border-2 border-gray-300 rounded-full
                    w-14 h-14  lg:w-16 lg:h-16
                    transition-all
                    hover:border-red-400
                    focus:outline-none
                    bg-white
                    p-4
                "
                onClick={handleToggleFavorite}
            >
                <Heart
                    className={`
                        transition-all
                        w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-8 lg:h-8
                        ${isFavorite(cartItem.id) ? "fill-red-500 stroke-red-500" : "text-gray-500"}
                    `}
                />
            </button>
        </div>
    )
}
