import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { produce } from "immer";
import { subscribeWithSelector } from 'zustand/middleware';

interface CartItem {
  id: number; // Changed from string to number to match API
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

interface CartStore {
  items: CartItem[];
  setCart: (items: CartItem[]) => void;
  addCartItem: (item: CartItem) => void;
  removeItem: (id: number, size: string) => void; // id changed to number
  updateItemQuantity: (id: number, quantity: number, size: string) => void; // id changed to number
  clearCart: () => void;
  mergeCart: (items: CartItem[]) => void;
  totalQuantity: () => number;
  subtotal: () => number; // Added to match API
  totalDiscount: () => number; // Added to calculate total discounts
  total: () => number; // Added to match API
  hasDiscount: (itemId: number) => boolean;
  getDiscountAmount: (itemId: number) => number;
  subscribers: (() => void)[];
  subscribe: (callback: () => void) => void;
}

export const useCartStore = create<CartStore>()(persist(
  subscribeWithSelector(
    (set, get) => ({
      items: [],
      subscribers: [],
      subscribe: (callback) => {
        set(
          produce((state) => {
            state.subscribers.push(callback);
          })
        );
        return () =>
          set(
            produce((state) => {
              state.subscribers = state.subscribers.filter((sub: () => void) => sub !== callback);
            })
          );
      },
      setCart: (items) => {
        set({ items });
        get().subscribers.forEach(cb => cb());
      },
      addCartItem: (newItem) => {
        const existingItem = get().items.find(item => item.id === newItem.id && item.size === newItem.size);
        if (existingItem) {
          set({
            items: get().items.map(item =>
              item.id === newItem.id && item.size === newItem.size
                ? { 
                    ...item, 
                    quantity: item.quantity + newItem.quantity,
                    subtotal: item.final_price * (item.quantity + newItem.quantity)
                  }
                : item
            )
          });
        } else {
          set({ items: [...get().items, newItem] });
        }
      },
      removeItem: (id, size) => {
        set((state) => ({
          items: state.items.filter((i) => !(i.id === id && i.size === size)),
        }));
      },
      updateItemQuantity: (id, quantity, size) => {
        if (quantity <= 0) {
          get().removeItem(id, size);
          return;
        }
        set({
          items: get().items.map(item =>
            item.id === id && item.size === size
              ? { 
                  ...item, 
                  quantity,
                  subtotal: item.final_price * quantity
                } 
              : item
          )
        });
      },
      clearCart: () => {
        set({ items: [] });
      },
      totalQuantity: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      subtotal: () => get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
      totalDiscount: () => {
        return get().items.reduce((acc, item) => {
          return acc + (item.price * item.quantity - item.final_price * item.quantity);
        }, 0);
      },
      total: () => get().items.reduce((acc, item) => acc + item.subtotal, 0),
      hasDiscount: (itemId) => {
        const item = get().items.find(i => i.id === itemId);
        return item ? item.discount_type !== null : false;
      },
      getDiscountAmount: (itemId) => {
        const item = get().items.find(i => i.id === itemId);
        if (!item || !item.discount_type) return 0;
        
        if (item.discount_type === 'percentage') {
          return parseFloat(item.discount_value);
        } else {
          return item.price - item.final_price;
        }
      },
      mergeCart: (newItems) => {
        const currentItems = get().items;
        const merged = [...currentItems];
        newItems.forEach(newItem => {
          const index = merged.findIndex(i => i.id === newItem.id && i.size === newItem.size);
          if (index > -1) {
            merged[index].quantity += newItem.quantity;
            merged[index].subtotal = merged[index].final_price * merged[index].quantity;
          } else {
            merged.push(newItem);
          }
        });
        set({ items: merged });
      }
    })
  ),
  {
    name: "cart-store",
    storage: createJSONStorage(() => localStorage),
  }));