import api from "@/lib/axios"
import { useAuthStore } from "@/store/authStore"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {OrderResponse} from "@/types/orders"
import { OrderDetailResponse } from "@/types/order-detail";

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
                       
                  }
            }
      )
}

export const getUserOrders = () => {
      const token = useAuthStore((state) => state.accessToken);
      return useQuery({
            queryKey: ["getUserOrders"],
            queryFn: async () => {
                  const response = await api.get<OrderResponse>("/orders/order/my-orders/", {
                        headers: {
                              Authorization: `Bearer ${token}`,
                        },
                  });
                  return response.data;
            },
      });
}
export const useUserOrderDetail = (orderId: number, options ={}) => {
      const token = useAuthStore((s) => s.accessToken);
    
      return useQuery({
        queryKey: ["getUserOrdersDetail", orderId],
        queryFn: async () => {
          const response = await api.get<OrderDetailResponse>(
            `/orders/order/detail/?order_id=${orderId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return response.data;
        },
        enabled: !!orderId, 
      });
    };


export interface OrderTableResponse {
      order_id: number;
      date: string;
      customer: string;
      total: string;
      payment_status: string;
      items: number;
      status: string;
}


export const useAdminOrderTable = () => {
      const token = useAuthStore((s) => s.accessToken);
      return useQuery({
            queryKey: ["adminOrderTable"],
            queryFn: async () => {
                  const response = await api.get<OrderTableResponse>("/orders/order/admin-table/", {
                        headers: {
                              Authorization: `Bearer ${token}`,
                        },
                  });
                  return response.data;
            },
      });
}

