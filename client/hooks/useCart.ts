import { useCartStore } from "@/store/cartStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

export const useCart = ()=>{
      const setCart = useCartStore((state)=> state.setCart);
      return useQuery({
            queryKey: ['cart'],
            queryFn: async () => {
                   const res = await api.get('/cart/get-cart/')
                   setCart(res.data.items)
                   return res.data.items
      }
})}


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