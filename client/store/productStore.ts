// store/productFilterStore.ts
import { create } from 'zustand';

interface ProductFilterState {
  selectedCategories: string[];
  selectedSubcategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  setSelectedSubcategories: (subcategories: string[]) => void;
  clearFilters: () => void;
}

export const useProductFilterStore = create<ProductFilterState>((set) => ({
  selectedCategories: [],
  selectedSubcategories: [],
  setSelectedCategories: (categories) => set({ selectedCategories: categories }),
  setSelectedSubcategories: (subcategories) => set({ selectedSubcategories: subcategories }),
  clearFilters: () => set({ selectedCategories: [], selectedSubcategories: [] }),
}));