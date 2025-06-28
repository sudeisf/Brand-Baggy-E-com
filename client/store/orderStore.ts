import { create } from 'zustand';

interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    main_image: string;
  };
  quantity: number;
  price: number;
  subtotal: number;
}

interface ShippingInfo {
  id: number;
  full_name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone: string;
  email: string;
}

interface Order {
  id: number;
  user: number;
  cart: number;
  total_price: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  order_date: string;
  shipping_info: ShippingInfo;
  items: OrderItem[];
}

interface OrderStore {
  // State
  currentOrder: Order | null;
  orders: Order[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentOrder: (order: Order | null) => void;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: number, status: Order['status']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  // Initial state
  currentOrder: null,
  orders: [],
  isLoading: false,
  error: null,

  // Actions
  setCurrentOrder: (order) => set({ currentOrder: order }),
  
  setOrders: (orders) => set({ orders }),
  
  addOrder: (order) => set((state) => ({
    orders: [order, ...state.orders],
    currentOrder: order
  })),
  
  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ),
    currentOrder: state.currentOrder?.id === orderId 
      ? { ...state.currentOrder, status }
      : state.currentOrder
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
  
  reset: () => set({
    currentOrder: null,
    orders: [],
    isLoading: false,
    error: null
  })
}));
