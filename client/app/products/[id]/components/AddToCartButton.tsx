"use client"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cartStore";
import { useFavoritesStore } from "@/store/favStore";
import { Heart } from "lucide-react";
import {useAddCartMutation} from "@/hooks/useCart";
import { error } from "console";


interface CartItem {
    id : string;
    main_image : string;
    name : string;
    size : string;
    quantity : number;
    price : string;
    in_stock : boolean;
}

interface AddToCartButtonProps{
    isHeart : boolean;
    onHeartClick : () => void ;
    cartItem : CartItem;
    onAddToCartSuccess?: () => void;
    isSizeSelected: boolean
}

export default function AddToCartButton({
    isHeart , 
    onHeartClick , 
    isSizeSelected,
    cartItem, 
    onAddToCartSuccess}:AddToCartButtonProps){

    const addToCart = useCartStore((state)=> state.addCartItem)
    const mutation = useAddCartMutation();
    const payload =  {
        product_id : Number(cartItem.id),
        quantity: Number(cartItem.quantity),
        size : cartItem.size
    }

    const handleAddToCart = () => {
        mutation.mutate(
            payload,{
                onSuccess:()=>{
                    addToCart({ ...cartItem, price: Number(cartItem.price) })
                    if (onAddToCartSuccess) onAddToCartSuccess();
                },onError : (error) =>{
                    console.error("Failed to add to cart:",error);
                }
            }
        );
    }


    const { isFavorite, toggleFavorite } = useFavoritesStore();
    const handleToggleFavorite = () => {
        toggleFavorite({
          id: cartItem.id,
          main_image: cartItem.main_image,
          name: cartItem.name,
          price: cartItem.price,
          in_stock : cartItem.in_stock
        });
      };
    return(
        <div className="flex mt-4 gap-4 w-full items-center">
            <Button
                disabled={!isSizeSelected}
                onClick={handleAddToCart}
                className="bg-[#331d67] py-7 hover:bg-[#331d67]/80 text-lg font-medium text-white rounded-full w-[88%]"
            >
                Add to Cart
            </Button>
            <div className="flex justify-center items-center gap-2 border-2 border-gray-300 rounded-full w-12 h-12" onClick={handleToggleFavorite}>
                <Heart className={`w-5 h-5 ${isFavorite(cartItem.id) ? "fill-red-500 stroke-red-500" : "text-gray-500"}`} />
            </div>
        </div>
    )
}
