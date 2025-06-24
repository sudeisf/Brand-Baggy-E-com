// store/favoritesStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface FavoriteItem {
  id: string;
  main_image: string;
  name: string;
  price: string;
  in_stock : boolean
}

interface FavoritesStore {
  favorites: FavoriteItem[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
  removeItem : (id: string) => void;
  clearAllItem : () => void;
  totalFavorite : ()=> number;
  setFav : (items: FavoriteItem[]) => void,
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      setFav : (items) => set({favorites: items}),
      isFavorite: (id: string) => {
        return get().favorites.some(item => item.id === id);
      },
      totalFavorite: () => {
        return get().favorites.length;
      },
      removeItem: (id) => {
        set(state => ({
          favorites: state.favorites.filter(fav => fav.id !== id)
        }));
      },
      clearAllItem : ()=> {set({favorites: []})},
      toggleFavorite: (item: FavoriteItem) => {
        set(state => {
          if (state.favorites.some(fav => fav.id === item.id)) {
            return { favorites: state.favorites.filter(fav => fav.id !== item.id) };
          } else {
            return { favorites: [...state.favorites, item] };
          }
        });
      }
    }),
    {
      name: "favorites-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);