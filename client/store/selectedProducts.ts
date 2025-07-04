import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface Product {
  id: number
  name: string
  size: string
  quantity: number
}

interface ProductStore {
  selectedProducts: Product[]
  addProduct: (product: Product) => void
  updateQuantity: (id: number, size: string, quantity: number) => void
  removeProduct: (id: number, size: string) => void
  clearProducts: () => void
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      selectedProducts: [],
      addProduct: (product) =>
        set((state) => {
          const exists = state.selectedProducts.find(
            (p) => p.id === product.id && p.size === product.size
          )
          if (exists) {
            return {
              selectedProducts: state.selectedProducts.map((p) =>
                p.id === product.id && p.size === product.size
                  ? { ...p, quantity: p.quantity + product.quantity }
                  : p
              ),
            }
          }
          return { selectedProducts: [...state.selectedProducts, product] }
        }),
      updateQuantity: (id, size, quantity) =>
        set((state) => ({
          selectedProducts: state.selectedProducts.map((p) =>
            p.id === id && p.size === size ? { ...p, quantity: Math.max(1, quantity) } : p
          ),
        })),
      removeProduct: (id, size) =>
        set((state) => ({
          selectedProducts: state.selectedProducts.filter(
            (p) => !(p.id === id && p.size === size)
          ),
        })),
      clearProducts: () => set({ selectedProducts: [] }),
    }),
    {
      name: "selected-product-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
)