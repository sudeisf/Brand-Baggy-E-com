import {create} from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"


interface CartItem {
      id : string;
      main_image : string;
      name : string;
      size : string;
      quantity : number;
      price : number;
}

interface CartStore {
      items : CartItem[];
      setCart : (items:CartItem[]) => void;
      addCartItem : (item:CartItem) => void;
      removeItem : (id : string ,size: string) => void;
      updateItmeQuantity : (id:string , quantity : number , size: string) => void;
      clearCart: () => void;
      mergeCart: (items: CartItem[]) => void;
      totalQuantity :() => number;
      totalPrice : () => number;
}

export const useCartStore = create<CartStore>()(persist(
      (set,get) => ({
            items : [],
            setCart: (items) => set({ items }),
            addCartItem : (newItem) => {
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
            removeItem : (id , size) => {
                  set((state) => ({
                        items: state.items.filter((i) => !(i.id === id && i.size === size)),
                      }));
            },
            updateItmeQuantity : (id , quantity , size) => {
                  if (quantity <= 0) {
                        get().removeItem(id , size);
                        return;
                  }
                  set({
                        items : get().items.map(item => 
                              item.id === id && item.size === size ? 
                              { ...item , quantity } : item
                        )
                  });
            },
            clearCart: () => {
                  set({items:[]})
            },
            totalQuantity: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
            totalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
            mergeCart: (newItems) => {
                  const currentItems  =  get().items;
                  const merged = [...currentItems]
                  newItems.forEach(newItem => {
                        const index = merged.findIndex(i => i.id === newItem.id);
                        if(index > -1){
                              merged[index].quantity += newItem.quantity;
                        }else{
                              merged.push(newItem);
                        }
                  })
                  set({ items: merged });
            }
      }),
      {
      name: "cart-store",
      storage: createJSONStorage(() => localStorage),
}));