import { useCartStore } from "@/store/cartStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { UseQueryOptions } from "@tanstack/react-query";


interface CartItem {
      id: string;
      main_image: string;
      name: string;
      size: string;
      quantity: number;
      price: number;
    }
    
    interface CartApiResponse {
      items: CartItem[];
    }
    
    export function useCart(
      options?: Omit<UseQueryOptions<CartApiResponse>, 'queryKey' | 'queryFn'> & {
        requireAuth?: boolean;
      }
    ) {
      const setCart = useCartStore((state) => state.setCart);
      const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
      const token  = useAuthStore((state)=> state.accessToken)
    
      return useQuery<CartApiResponse>({
        queryKey: ['cart'],
        queryFn: async () => {
          try {
            const { data } = await api.get('cart/get-cart/', {
                  headers : {
                        "Authorization" : `Bearer ${token}`
                  }
            });
            setCart(data.items)
            return data;
          } catch (error: any) {

            if (error?.response?.status === 401) {
              setCart([]);
            }
            throw error;
          }
        },
        ...options,
        enabled: options?.requireAuth ? isAuthenticated : true,
        refetchOnWindowFocus: false, // Disable refetch on focus
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      });
    }


const useAddCart = ()=>{
      const addItem  = useCartStore((state)=> state.addCartItem)
      const token  = useAuthStore((state)=> state.accessToken)
      const queryClient = useQueryClient()
      return useMutation(
            {
                  mutationKey : ["addCart"],
                  mutationFn: async (payload) => {
                        const response = await api.post("/cart",
                              payload,
                              {headers : {
                                          "Authorization" : `Bearer ${token} `
                                    }
                              }
                        );
                        return response.data
                  },
                  onSuccess: (data) => {
                        addItem(data);
                        queryClient.invalidateQueries({ queryKey: ['cart'] });
                  }
            }
      )
}
const useRemoveCart = () =>{
      const addItem  = useCartStore((state)=> state.addCartItem)
      const token  = useAuthStore((state)=> state.accessToken)
      const queryClient = useQueryClient()
      return useMutation(
            {
                  mutationKey : ["removeCart"],
                  mutationFn: async (payload) => {
                        const response = await api.post("/cart",
                              payload,
                              {headers : {
                                          "Authorization" : `Bearer ${token} `
                                    }
                              }
                        );
                        return response.data
                  },
                  onSuccess: (data) => {
                        addItem(data);
                        queryClient.invalidateQueries({ queryKey: ['cart'] });
                  }
            }
      )
}
const useRemoveAllCart = () =>{
      const addItem  = useCartStore((state)=> state.addCartItem)
      const token  = useAuthStore((state)=> state.accessToken)
      const queryClient = useQueryClient()
      return useMutation(
            {
                  mutationKey : ["removeAllCartItem"],
                  mutationFn: async (payload) => {
                        const response = await api.post("/cart",
                              payload,
                              {headers : {
                                          "Authorization" : `Bearer ${token} `
                                    }
                              }
                        );
                        return response.data
                  },
                  onSuccess: (data) => {
                        addItem(data);
                        queryClient.invalidateQueries({ queryKey: ['cart'] });
                  }
            }
      )
}