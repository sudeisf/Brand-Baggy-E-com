import api from "@/lib/axios"
import { useAuthStore } from "@/store/authStore"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {OrderResponse} from "@/types/orders"
import { OrderDetailResponse } from "@/types/order-detail";
import { AnalyticsRevenueResponse, SellerOrderActivityResponse, SellerRecentOrderPaginatedResponse, SellerRecentOrderResponse } from "@/types/analytics";

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


interface SendProps {
      order_id: number;
      payment_status?: string
      order_status?: string
  }

  

export const useUpdateOrderStatus =() =>{
      const token = useAuthStore((s) => s.accessToken);
      const queryClient = useQueryClient()
      return useMutation({
            mutationKey: ["updateOrderState"],
            mutationFn: async (payload : SendProps) => {
                  const response = await api.patch("/orders/order/update-status/",
                        payload
                        , {
                        headers: {
                              Authorization: `Bearer ${token}`,
                        },
                  });
                  return response.data;
            },
            onSuccess : ()=>{
                  queryClient.invalidateQueries({queryKey :["adminOrderTable"]})
                  queryClient.invalidateQueries({queryKey :["orderAnalytics"]})
            }
            
      });
}



interface AanalyticsResponse {
      total_orders: number,
      avarge_orders: number,
      pending_orders: number,
      return_rate :number,
      deliverd_orders: number
}


export const useSellerDashboardAnalyticas = () =>{
      const token = useAuthStore((s) => s.accessToken);
      return useQuery({
            queryKey: ["orderAnalytics"],
            queryFn: async () => {
                  const response = await api.get<AanalyticsResponse>("/orders/order-dashboard/", {
                        headers: {
                              Authorization: `Bearer ${token}`,
                        },
                  });
                  return response.data;
            },
            staleTime : 5 * 60 * 1000
      });
}

export interface OrderItem {
  id: number;
  product_name: string;
  product_id: string;
  price: string;
  subtotal: string;
  quantity: number;
  main_image: string | null;
  description: string;
}

export interface UserData {
  id: number;
  full_name: string;
  email: string;
  phone: string;
}

export interface SellerOrderDetailsResponse {
  id: number;
  user_data: UserData;
  status: string;
  order_date: string; 
  payment_method: string | null;
  total_price : string
  items: OrderItem[];
}

export const useSellerOrderDetails = (order_id: number) => {
      const token = useAuthStore((s) => s.accessToken);
    
      return useQuery({
        queryKey: ["updateOrderState", order_id],
        queryFn: async ({ queryKey }) => {
          const [, id] = queryKey;
    
          const response = await api.get<SellerOrderDetailsResponse>(
            `orders/seller/order/${id}/detail/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
    
          return response.data;
        },
      });
    };

export const useRevenuChartDataForOrders = () =>{
      const token = useAuthStore((s) => s.accessToken);
    
      return useQuery({
        queryKey: ["RevenuChartDataForOrders"],
        queryFn: async () => {
          const response = await api.get<AnalyticsRevenueResponse>(
            `orders/seller/analytics/revenue/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
    
          return response.data;
        },
      });
    };

export const useSellerActivity = () =>{
      const token = useAuthStore((s) => s.accessToken);
    
      return useQuery({
        queryKey: ["sellerActivity"],
        queryFn: async () => {
          const response = await api.get<SellerOrderActivityResponse>(
            `orders/seller/recent-activity/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return response.data;
        },
      });
    };

export const useSellerRecentOrders = (page:number) =>{
      const token = useAuthStore((s) => s.accessToken);
    
      return useQuery({
        queryKey: ["sellerRecentOrders",page],
        queryFn: async () => {
          const response = await api.get<SellerRecentOrderPaginatedResponse>(
            `orders/seller/recent-orders/?page=${page+1}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return response.data;
        },
      });
    };