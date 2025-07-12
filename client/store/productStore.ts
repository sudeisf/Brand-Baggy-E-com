import { create } from 'zustand';

interface FilterItem {
  id: string;
  name: string;  
  isParent?: boolean;
}

interface ProductFilterState {
  selectedSubcategories: FilterItem[];
  addSubcategory: (subcategory: FilterItem) => void;
  removeSubcategory: (id: string) => void;
  toggleSubcategory: (subcategory: FilterItem) => void;
  clearFilters: () => void;
  getParentCategory: () => FilterItem | undefined;
  getChildCategories: () => FilterItem[];
}

export const useProductFilterStore = create<ProductFilterState>((set, get) => ({
  selectedSubcategories: [],
  
  addSubcategory: (subcategory) => set(state => {
 
    if (subcategory.isParent) {
      return {
        selectedSubcategories: [
          ...state.selectedSubcategories.filter(item => !item.isParent),
          subcategory
        ]
      };
    }

    return {
      selectedSubcategories: state.selectedSubcategories.some(item => item.id === subcategory.id)
        ? state.selectedSubcategories
        : [...state.selectedSubcategories, subcategory]
    };
  }),
  
  removeSubcategory: (id) => set(state => ({
    selectedSubcategories: state.selectedSubcategories.filter(item => item.id !== id)
  })),
  
  toggleSubcategory: (subcategory) => set(state => {

    if (subcategory.isParent) {
      const existingParent = state.selectedSubcategories.find(item => item.isParent);
      if (existingParent?.id === subcategory.id) {
        return {
          selectedSubcategories: state.selectedSubcategories.filter(item => item.id !== subcategory.id)
        };
      }
      return {
        selectedSubcategories: [
          ...state.selectedSubcategories.filter(item => !item.isParent),
          subcategory
        ]
      };
    }

    return {
      selectedSubcategories: state.selectedSubcategories.some(item => item.id === subcategory.id)
        ? state.selectedSubcategories.filter(item => item.id !== subcategory.id)
        : [...state.selectedSubcategories, subcategory]
    };
  }),
  
  clearFilters: () => set({ selectedSubcategories: [] }),
  

  getParentCategory: () => {
    return get().selectedSubcategories.find(item => item.isParent);
  },
  
  getChildCategories: () => {
    return get().selectedSubcategories.filter(item => !item.isParent);
  }
}));