import api from "@/lib/axios"
import { useAuthStore } from "@/store/authStore"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface ShippingInfo {
      full_name : string;
      address : string;
      city: string;
      state : string;
      zip_code : string;
      country : string;
      phone : string;
      email : string;
}

interface Payload {
      shipping_info: ShippingInfo;
}

export const useAddOrderMutation = () => {
      const token  = useAuthStore((state)=> state.accessToken)
      const queryClient = useQueryClient()
      return useMutation(
            {
                  mutationKey : ["addOrder"],
                  mutationFn: async (payload : Payload ) => {
                        const response = await api.post("orders/order/create/",
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