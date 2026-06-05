import { create } from 'zustand';

interface Business {
  id: string;
  name: string;
}

interface FavoritesStore {
  favorites: Business[];
  addFavorite: (business: Business) => void;
  removeSaved: (id: string) => void;
  clearFavorites: () => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: [],

  addFavorite: (business) =>
    set((state) => ({
      favorites: state.favorites.some((b) => b.id === business.id)
        ? state.favorites
        : [...state.favorites, business],
    })),

  removeSaved: (id) =>
    set((state) => ({
      favorites: state.favorites.filter((b) => b.id !== id),
    })),

  clearFavorites: () => set({ favorites: [] }),

  isFavorite: (id) => get().favorites.some((b) => b.id === id),
}));