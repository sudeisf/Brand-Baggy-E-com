import api from "@/lib/axios"
import { useAuthStore } from "@/store/authStore"
import {useQuery, useMutation} from "@tanstack/react-query"

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  is_registered: boolean;
}

export interface OrderSummary {
  total_orders: number;
  completed_orders: number;
  canceled_orders: number;
  total_spent: number;
}

export interface CustomerOrder {
  order_id: string;
  product_name: string;
  date: string;
  status: string;
  payment_status: string;
  payment_method: string;
  price: number;
  quantity: number;
}

export interface CustomerDetailResponse {
  customer_info: CustomerInfo;
  summary: OrderSummary;
  orders: CustomerOrder[];
}

export interface CustomerListItem {
  name: string;
  email: string;
  is_registered: boolean;
  order_count: number;
  total_spent: string; 
  last_order_date: string; 
  country: string;
  city: string;
  main_image: string | null;
}

export interface CustomerListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CustomerListItem[];
}

export const useFetchCustomerList = () => {
  const token = useAuthStore(s => s.accessToken);
  return useQuery({
    queryKey: ["customerListFetch"],
    queryFn: async () => {
      const response = await api.get<CustomerListResponse>("/orders/order/customers/");
      return response.data;
    },
    enabled: Boolean(token),
  });
};

export const useFeatchCustomerLsit = useFetchCustomerList;

export const useFetchCustomerDetails = (email: string) => {
  const token = useAuthStore(s => s.accessToken);
  return useQuery({
    queryKey: ["customerDetailFetch", email],
    queryFn: async ({ queryKey }) => {
      const [_key, emailParam] = queryKey;
      const response = await api.get<CustomerDetailResponse>(
        `/orders/customers/${emailParam}/`
      );
      return response.data;
    },
    enabled: !!email && !!token,
  });
};