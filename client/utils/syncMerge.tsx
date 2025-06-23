import api from '@/lib/axios'

export async function syncMerge(){
      const raw = localStorage.getItem('cart-store')
      const guestCart = raw ? JSON.parse(raw)?.state?.items || [] : []

      const favRaw = localStorage.getItem('favorites-store')
      const guestFavorites = favRaw ? JSON.parse(favRaw)?.state?.items || [] : []
      
      if(guestCart > 0){
            await api.post('/cart/merge/' , guestCart);
            localStorage.removeItem('cart')
      }
      if (guestFavorites.length > 0) {
            const payload = guestFavorites.map((id: any) => ({ product_id: id }))
            await api.post('/product/favorite-product/merged', payload)
            localStorage.removeItem('favorites')
          }
}