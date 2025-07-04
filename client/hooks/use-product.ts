import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";


interface APIResponse{
      id: number;
      name : string;
      size : string[];
}

export const useListProducts = () =>{
      const token = useAuthStore(s=> s.accessToken)
      return useQuery({
            queryKey : ["sellerProductsLoop"],
            queryFn: async ()=>{
                  const response = await api.get<APIResponse>('/product/seller/product-select-list/',{headers:{Authorization:`Beare ${token}`}})
                  return response.data
            }
      })
}