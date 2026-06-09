import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { create } from 'zustand';

type DayKey = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';
export type Schedule = { [key in DayKey]: TimeSlot[] };

export const emptySchedule: Schedule = {
  lunes: [], martes: [], miercoles: [], jueves: [],
  viernes: [], sabado: [], domingo: [],
};

interface BusinessStore {
  images: string[];
  setImages: (images: string[]) => void;
  addImage: (url: string) => void;
  removeImage: (url: string) => void;
  clearImages: () => void;

  schedule: Schedule;
  setSchedule: (schedule: Schedule) => void;
  clearSchedule: () => void;
}
export type TimeSlot = { 
  id: number; 
  opening: string; 
  closing: string 
};

export const useBusinessStore = create<BusinessStore>((set) => ({
  images: [],
  setImages: (images) => set({ images }),
  addImage: (url) => set((state) => ({ images: [...state.images, url] })),
  removeImage: (url) => set((state) => ({ images: state.images.filter((img) => img !== url) })),
  clearImages: () => set({ images: [] }),

  schedule: emptySchedule,
  setSchedule: (schedule) => set({ schedule }),
  clearSchedule: () => set({ schedule: emptySchedule }),
}));

export async function pickImages() {
  const { addImage } = useBusinessStore.getState();

  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    Alert.alert("Sin permisos", "Se requieren permisos para acceder a la galería");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    quality: 1,
  });

  if (!result.canceled) {
    result.assets.forEach((asset) => addImage(asset.uri));
  }
}