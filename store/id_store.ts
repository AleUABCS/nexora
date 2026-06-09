import { create } from 'zustand';

interface idStore {
    id: string;
    setId: (images: string) => void;

}

export const useIdStore = create<idStore>((set) => ({
    id: '',
    setId: (id) => set({ id }),
}));