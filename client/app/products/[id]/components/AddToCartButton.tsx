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
        // Map cartItem to match the store's CartItem type
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
            final_price: Number(cartItem.price), // or calculate with discount if needed
            subtotal: Number(cartItem.price) * cartItem.quantity, // or use discounted price
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
        <div className="flex mt-4 gap-2 sm:gap-4 w-full items-center">
            <Button
                disabled={!isSizeSelected}
                onClick={handleAddToCart}
                className="bg-[#331d67] py-4 sm:py-7 hover:bg-[#331d67]/80 text-base sm:text-lg font-medium text-white rounded-full w-[70%] sm:w-[88%]"
            >
                Add to Cart
            </Button>
            <div 
                className="flex justify-center items-center gap-2 border-2 border-gray-300 rounded-full w-10 h-10 sm:w-12 sm:h-12"
                onClick={handleToggleFavorite}
            >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite(cartItem.id) ? "fill-red-500 stroke-red-500" : "text-gray-500"}`} />
            </div>
        </div>
    )
}
