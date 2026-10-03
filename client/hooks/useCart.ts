import { useCartStore } from "@/store/cartStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { UseQueryOptions } from "@tanstack/react-query";

interface CartItem {
  id: number;
  main_image: string;
  name: string;
  size: string;
  quantity: number;
  price: number;          
  discount_type: 'fixed_amount' | 'percentage' | null;
  discount_value: string;      
  final_price: number;         
  subtotal: number;            
}

interface CartApiResponse {
  items: CartItem[];
  total: number;
}

export function useCart(
  options?: Omit<UseQueryOptions<CartApiResponse>, 'queryKey' | 'queryFn'> & {
    requireAuth?: boolean;
  }
) {
  const setCart = useCartStore((state) => state.setCart);
  const token = useAuthStore((state) => state.accessToken);

  return useQuery<CartApiResponse>({
    queryKey: ['cart'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/cart/get-cart/');

        const normalizedItems: CartItem[] = (data.items || []).map((item: any) => ({
          id: item.id,
          main_image: item.main_image,
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: Number(item.price),
          discount_type: item.discount_type,
          discount_value: item.discount_value,
          final_price: Number(item.final_price),
          subtotal: Number(item.subtotal) || Number(item.final_price) * item.quantity
        }));

        setCart(normalizedItems);
        return { items: normalizedItems, total: data.total };
      } catch (error: any) {
        if (error?.response?.status === 401) {
          setCart([]);
        }
        throw error;
      }
    },
    ...options,
    enabled: options?.requireAuth !== false ? Boolean(token) : true,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
}

interface AddPayLoad {
  product_id: number;
  size: string;
  quantity: number;
}

export const useAddCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["addCart"],
    mutationFn: async (payload: AddPayLoad) => {
      const response = await api.post("/cart/add/", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
};

interface RemovePayload {
  cart_id: number;
}

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["removeCart"],
    mutationFn: async (payload: RemovePayload) => {
      const response = await api.delete("/cart/remove/", {
        data: payload
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
};

interface UpdatePayload {
  id: number;
  quantity: number;
  size: string;
}

export const useUpdateCartItemQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateCartItem"],
    mutationFn: async (payload: UpdatePayload) => {
      const response = await api.patch(`/cart/${payload.id}/update/`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
};