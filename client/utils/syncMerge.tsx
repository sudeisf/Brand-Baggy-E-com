import { useCartStore } from "@/store/cartStore";
import api from "@/lib/axios";

export async function syncMerge() {
  try {
    const cartRaw = localStorage.getItem('cart-store');
    const guestCart = cartRaw ? JSON.parse(cartRaw)?.state?.items || [] : [];

    const favRaw = localStorage.getItem('favorites-store');
    const guestFavorites = favRaw ? JSON.parse(favRaw)?.state?.favorites || [] : [];
    console.log(guestCart)
    console.log(guestFavorites)
    if (guestCart.length > 0) {
     
      await api.post('/cart/merge/', {"items" : guestCart});
      localStorage.removeItem('cart-store');
    }
    if (guestFavorites.length > 0) {
      await api.post('/product/favorite-product/merged', {"items": guestFavorites});
      localStorage.removeItem('favorites-store');
      console.log("fave merge")
    }
  } catch (error) {   
    console.error("❌ Merge failed:", error);
  }
}
