import { useAuthStore } from "@/store/authStore";
import { useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { useFavoritesStore } from "@/store/favStore";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";


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
  options?: Omit<UseQueryOptions<FavApiResponse>, 'queryKey' | 'queryFn'>
) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token  = useAuthStore((state)=> state.accessToken);
  const setFav = useFavoritesStore((store)=> store.setFav);

  return useQuery<FavApiResponse>({
    queryKey: ['favorites'],
    queryFn: async ()  => {
      try {
        const { data } = await api.get<FavApiResponse>('/product/favorite-products/', {
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
    enabled: Boolean(token), // Only enabled if authenticated
    refetchOnWindowFocus: false, 
    staleTime: 5 * 60 * 1000,
  });
}


interface favPayload {
  product_id : number;
}
export const useAddFavoriteItemMutation = () => {
    const token  = useAuthStore((state)=> state.accessToken);
    const queryClient = useQueryClient()
    return useMutation({
      mutationKey : ["addFavItem"],
      mutationFn : async (payload:favPayload) =>{
        const response = await api.post(`product/favorites/add/${payload.product_id}/`, {
          headers : {
                "Authorization" : `Bearer ${token}`
          }
    })
    return response.data;
  },
  onSuccess :() =>{
            queryClient.invalidateQueries({queryKey : ["favorites"]})
  }
    })
}


export const useRemoveFavorite = ()=>{
  const token  = useAuthStore((state)=> state.accessToken);
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey : ["removeItem"],
    mutationFn : async (payload:favPayload) =>{
      const response = await api.post(`product/favorites/remove/${payload.product_id}/`, {
        headers : {
              "Authorization" : `Bearer ${token}`
        }
  })
  return response.data;
},
onSuccess :() =>{
          queryClient.invalidateQueries({queryKey : ["favorites"]})
}
  })
}
export const useRemoveAllFavorites = ()=>{
  const token  = useAuthStore((state)=> state.accessToken);
    const queryClient = useQueryClient()
    return useMutation({
      mutationKey : ["removeAllItem"],
      mutationFn : async () =>{
        const response = await api.post(`product/favorite-products/removeAll/`, {
          headers : {
                "Authorization" : `Bearer ${token}`
          }
    })
    return response.data;
  },
  onSuccess :() =>{
            queryClient.invalidateQueries({queryKey : ["favorites"]})
  }
    })
}