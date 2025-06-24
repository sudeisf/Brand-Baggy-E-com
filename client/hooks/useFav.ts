import { useAuthStore } from "@/store/authStore";
import { UseQueryOptions } from "@tanstack/react-query";
import { useFavoritesStore } from "@/store/favStore";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";


interface FavProduct {
      id : number;
      main_image: string | null;
      name: string;
      price: string;
      in_stock : boolean;
}

interface FavoriteItem {
      id: number;
      product: FavProduct;
}    
type FavApiResponse = FavoriteItem[];
    
    export function useFav(
      options?: Omit<UseQueryOptions<FavApiResponse>, 'queryKey' | 'queryFn'> & {
        requireAuth?: boolean;
      }
    ) {
      const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
      const token  = useAuthStore((state)=> state.accessToken);
      const setFav = useFavoritesStore((store)=> store.setFav);
    
      return useQuery<FavApiResponse>({
        queryKey: ['favorites'],
        queryFn: async ()  => {
          try {
            const { data } = await api.get<FavApiResponse>('product/favorite-products/', {
                  headers : {
                        "Authorization" : `Bearer ${token}`
                  }
            });
            const flatFavorites = data.map(fav => ({
              id: String(fav.product.id),
              main_image: fav.product.main_image ?? "",
              name: fav.product.name,
              price: fav.product.price,
              in_stock: fav.product.in_stock,
            }));
            setFav(flatFavorites);
            return data;
          } catch (error: any) {

            if (error?.response?.status === 401) {
            setFav([])
            }
            throw error;
          }
        },
        ...options,
        enabled: options?.requireAuth ? isAuthenticated : true,
        refetchOnWindowFocus: false,
      });
    }
