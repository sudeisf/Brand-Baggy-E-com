import {create} from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import {produce} from "immer";
import { subscribeWithSelector } from 'zustand/middleware'
import { BlobOptions } from "buffer";



type Discount = {
      type: 'fixed_amount' | 'percentage' | null;
      value: string;
      start_date: string | null;
      end_date: string | null;
      is_valid: boolean | null;
      is_active: boolean | null;
}

interface CartItem {
      id: string;
      main_image: string;
      name: string;
      size: string;
      quantity: number;
      price: number;
      discount: Discount | null;
}

interface ItemDiscount{
      
}

interface CartStore {
      items: CartItem[];
      setCart: (items: CartItem[]) => void;
      addCartItem: (item: CartItem) => void;
      removeItem: (id: string, size: string) => void;
      updateItmeQuantity: (id: string, quantity: number, size: string) => void;
      clearCart: () => void;
      mergeCart: (items: CartItem[]) => void;
      totalQuantity: () => number;
      totalPrice: () => number;
      discountedPrice: () => number;
      isDiscountValid: (discount: Discount) => boolean;
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
                        set({ items })
                        get().subscribers.forEach(cb => cb());
                  },
                  addCartItem: (newItem) => {
                        const existingItem = get().items.find(item => item.id === newItem.id && item.size === newItem.size);
                        if (existingItem) {
                              set({
                                    items: get().items.map(item =>
                                          item.id === newItem.id && item.size === newItem.size
                                                ? { ...item, quantity: item.quantity + newItem.quantity }
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
                  updateItmeQuantity: (id, quantity, size) => {
                        if (quantity <= 0) {
                              get().removeItem(id, size);
                              return;
                        }
                        set({
                              items: get().items.map(item =>
                                    item.id === id && item.size === size ?
                                          { ...item, quantity } : item
                              )
                        });
                  },
                  clearCart: () => {
                        set({ items: [] })
                  },
                  totalQuantity: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
                  totalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
                  discountedPrice: () => {
                        return get().items.reduce((acc, item) => {
                              const itemTotal = item.price * item.quantity;
                              if (item.discount && get().isDiscountValid(item.discount)) {
                                    const discountValue = parseFloat(item.discount.value) || 0;
                                    if (item.discount.type === 'percentage') {
                                          return acc + (itemTotal - (itemTotal * discountValue / 100));
                                    } else {
                                          return acc + Math.max(0, itemTotal - discountValue);
                                    }
                              }
                              return acc + itemTotal;
                        }, 0);
                  },
                  isDiscountValid: (discount: Discount) => {
                        if (!discount || !discount.is_active || discount.is_valid === false) {
                              return false;
                        }
                        
                        const now = new Date();
                        
                        if (discount.start_date) {
                              const startDate = new Date(discount.start_date);
                              if (now < startDate) return false;
                        }
                        
                        if (discount.end_date) {
                              const endDate = new Date(discount.end_date);
                              if (now > endDate) return false;
                        }
                        
                        return true;
                  },
                  mergeCart: (newItems) => {
                        const currentItems = get().items;
                        const merged = [...currentItems]
                        newItems.forEach(newItem => {
                              const index = merged.findIndex(i => i.id === newItem.id && i.size === newItem.size);
                              if (index > -1) {
                                    merged[index].quantity += newItem.quantity;
                              } else {
                                    merged.push(newItem);
                              }
                        })
                        set({ items: merged });
                  }
            })
      ),
      {
            name: "cart-store",
            storage: createJSONStorage(() => localStorage),
      }));