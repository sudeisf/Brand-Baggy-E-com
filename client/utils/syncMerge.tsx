import { useCartStore } from "@/store/cartStore";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

export async function syncMerge() {
  try {
    const { items: guestCart } = useCartStore.getState();
    const { accessToken } = useAuthStore.getState();

    if (!accessToken || guestCart.length === 0) return;

    const itemsToMerge = guestCart.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      size: item.size,
    }));

    const { data } = await api.post('/cart/merge/', { items: itemsToMerge }, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("Merge response:", data);

    const favRaw = localStorage.getItem('favorites-store');
    const guestFavorites = favRaw ? JSON.parse(favRaw)?.state?.favorites || [] : [];
    
    if (guestFavorites.length > 0) {
      await api.post('/product/favorite-product/merged', {
        items: guestFavorites
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      localStorage.removeItem('favorites-store');
    }

    return data;
  } catch (error) {
    console.error("❌ Merge failed:", error);
    throw error;
  }
}