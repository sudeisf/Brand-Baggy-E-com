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
      addCartItem : (item:CartItem) => void;
      removeItem : (id : string) => void;
      updateItmeQuantity : (id:string , quantity : number) => void;
      clearCart: () => void;
      mergeCart: (items: CartItem[]) => void;
}

export const useCartStore = create<CartStore>()(persist(
      (set,get) => ({
            items : [],
            addCartItem : (newItem) =>{
                  const existingItem  = get().items.filter(item =>  item.id !== newItem.id);
                  if(existingItem){
                        set({
                              items : get().items.map(item =>
                                    item.id === newItem.id 
                                    ? {...item ,quantity : item.quantity + newItem.quantity }
                                    : item
                              )
                        });
                  } else {
                        set({ items: [...get().items, newItem] });
                  }
            },
            removeItem : (id) => {
                  set({items : get().items.filter(i => i.id != id)})
            },
            updateItmeQuantity : (id , quantity) => {
                  if (quantity <= 0) {
                        get().removeItem(id);
                        return;
                      }
                  set({
                        items : get().items.filter(item => 
                              item.id === id ? 
                              {
                              ...item , quantity 
                              } : item
                        )
                  })
            },
            clearCart: () => {
                  set({items:[]})
            },
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