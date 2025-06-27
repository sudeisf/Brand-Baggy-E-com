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
        refetchOnWindowFocus: false, 
        staleTime: 5 * 60 * 1000, 
      });
    }


interface AddPayLoad {
      product_id: number;
      size: string;
      quantity: number;
    }

export const useAddCartMutation = ()=>{
      const addItem  = useCartStore((state)=> state.addCartItem)
      const token  = useAuthStore((state)=> state.accessToken)
      const queryClient = useQueryClient()
      return useMutation(
            {
                  mutationKey : ["addCart"],
                  mutationFn: async (payload : AddPayLoad) => {
                        const response = await api.post("/cart/add/",
                              payload,
                              {headers : {
                                          "Authorization" : `Bearer ${token} `
                                    }
                              }
                        );
                        return response.data
                  },
                  onSuccess: (data) => {
                        queryClient.invalidateQueries({ queryKey: ['cart'] });
                  }
            }
      )
}

interface Removepayload {
      cart_id: number;
    }

export const useRemoveCartItem = () =>{
      const token  = useAuthStore((state)=> state.accessToken)
      const queryClient = useQueryClient()
      return useMutation(
            {
                  mutationKey : ["removeCart"],
                  mutationFn: async (payload: Removepayload) => {
                        const response = await api.delete("/cart/remove/", {
                              data: payload,
                              headers: {
                                    "Authorization": `Bearer ${token} `
                              }
                        });
                        return response.data
                  },
                  onSuccess(data, variables, context) {
                        queryClient.invalidateQueries({ queryKey: ['cart'] });
                  }
            },
      )
}


interface UpdatePayload{
      id: number;
      quantity: number;
      size: string;
}
export const useUpdateCartItemQuantity = () =>{
      const token  = useAuthStore((state)=> state.accessToken)
      const queryClient = useQueryClient()
      return useMutation(
            {
                  mutationKey : ["updateCartItem"],
                  mutationFn: async (payload:UpdatePayload) => {
                        const response = await api.patch(`/cart/${payload.id}/update/`,
                              payload,
                              {headers : {
                                          "Authorization" : `Bearer ${token} `
                                    }
                              }
                        );
                        return response.data
                  },
                  onSuccess: (data) => {
                        queryClient.invalidateQueries({ queryKey: ['cart'] });
                  }
            }
      )
}