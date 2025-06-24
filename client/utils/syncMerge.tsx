import { useCartStore } from "@/store/cartStore";
import api from "@/lib/axios";

export async function syncMerge() {
  try {
    const cartRaw = localStorage.getItem('cart-store');
    const guestCart = cartRaw ? JSON.parse(cartRaw)?.state?.items || [] : [];

    const favRaw = localStorage.getItem('favorites-store');
    const guestFavorites = favRaw ? JSON.parse(favRaw)?.state?.items || [] : [];
    console.log(guestCart)
    if (guestCart.length > 0) {
     
      await api.post('/cart/merge/', {"items" : guestCart});
      localStorage.removeItem('cart-store');
      console.log("✅ Cart merged");

    }
    if (guestFavorites.length > 0) {
      const payload = guestFavorites.map((item: any) => ({
        product_id: item.id,
      }));
      await api.post('/product/favorite-product/merged', payload);
      localStorage.removeItem('favorites-store');
      console.log("✅ Favorites merged");
    }
  } catch (error) {
    console.error("❌ Merge failed:", error);
  }
}
