import { create } from 'zustand';

interface BusinessStore {
  images: string[];
  setImages: (images: string[]) => void;
  addImage: (url: string) => void;
  removeImage: (url: string) => void;
  clearImages: () => void;
}

export const useBusinessStore = create<BusinessStore>((set) => ({
  images: [],
  setImages: (images) => set({ images }),
  addImage: (url) => set((state) => ({ images: [...state.images, url] })),
  removeImage: (url) => set((state) => ({ images: state.images.filter((img) => img !== url) })),
  clearImages: () => set({ images: [] }),
}));