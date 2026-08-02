"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useFavoritesStore } from "@/store/favStore";
import { Heart, Loader2Icon } from "lucide-react";
import { useAddCartMutation } from "@/hooks/useCart";
import { useAuthStore } from "@/store/authStore";
import { useAddFavoriteItemMutation, useRemoveFavorite } from "@/hooks/useFav";
import { toast } from "sonner";

interface CartItem {
  id: string;
  main_image: string;
  name: string;
  size: string;
  quantity: number;
  price: string;
  in_stock: boolean;
  discount: {
    discount_value: string | number;
    discount_type: string;
    discount_start_date?: string;
    discount_end_date?: string;
    discount_is_valid: boolean;
    discount_is_active: boolean;
  };
}

interface AddToCartButtonProps {
  cartItem: CartItem;
  isSizeSelected: boolean;
  product_id: number;
}

export default function AddToCartButton({
  product_id,
  isSizeSelected,
  cartItem,
}: AddToCartButtonProps) {
  const addToCart = useCartStore((state) => state.addCartItem);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const mutation = useAddCartMutation();
  const favMutation = useAddFavoriteItemMutation();
  const removeFavMutation = useRemoveFavorite();
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  const payload = {
    product_id: Number(cartItem.id),
    quantity: Number(cartItem.quantity),
    size: cartItem.size,
  };

  const handleAddToCart = () => {
    if (!isSizeSelected) {
      toast.error("Please select a size");
      return;
    }

    const storeCartItem = {
      id: Number(cartItem.id),
      main_image: cartItem.main_image,
      name: cartItem.name,
      size: cartItem.size,
      quantity: cartItem.quantity,
      price: Number(cartItem.price),
      discount_type:
        cartItem.discount.discount_type === "fixed_amount" ||
        cartItem.discount.discount_type === "percentage"
          ? (cartItem.discount.discount_type as "fixed_amount" | "percentage")
          : null,
      discount_value: String(cartItem.discount.discount_value ?? ""),
      final_price: Number(cartItem.price),
      subtotal: Number(cartItem.price) * cartItem.quantity,
    };

    if (isAuthenticated) {
      mutation.mutate(payload, {
        onSuccess: () => toast.success("Added to cart"),
        onError: () => toast.error("Failed to add to cart"),
      });
    } else {
      addToCart(storeCartItem);
      toast.success("Added to cart");
    }
  };

  const handleToggleFavorite = () => {
    const favorited = isFavorite(cartItem.id);
    if (isAuthenticated) {
      if (favorited) {
        removeFavMutation.mutate({ product_id });
      } else {
        favMutation.mutate({ product_id });
      }
    } else {
      toggleFavorite({
        id: cartItem.id,
        main_image: cartItem.main_image,
        name: cartItem.name,
        price: cartItem.price,
        in_stock: cartItem.in_stock,
      });
    }
  };

  const favorited = isFavorite(cartItem.id);

  return (
    <div className="flex gap-3 w-full items-center">
      <Button
        disabled={!isSizeSelected || mutation.isPending || !cartItem.in_stock}
        onClick={handleAddToCart}
        className="flex-1 h-14 bg-[#331d67] text-base font-medium text-white rounded-lg hover:bg-[#331d67]/90 disabled:opacity-60"
      >
        {mutation.isPending ? (
          <>
            <Loader2Icon className="w-4 h-4 animate-spin mr-2" />
            Adding...
          </>
        ) : !cartItem.in_stock ? (
          "Out of stock"
        ) : (
          "Add to cart"
        )}
      </Button>

      <button
        type="button"
        aria-label="Add to favorites"
        onClick={handleToggleFavorite}
        className="flex justify-center items-center border-2 border-gray-200 rounded-full w-14 h-14 hover:border-red-300 bg-white transition-colors shrink-0"
      >
        <Heart
          className={`w-5 h-5 ${
            favorited ? "fill-red-500 stroke-red-500" : "text-gray-500"
          }`}
        />
      </button>
    </div>
  );
}
