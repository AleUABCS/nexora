import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
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

export async function pickImages() {
  const { addImage } = useBusinessStore.getState()

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

// Falta función para subir las fotos, en el botón "Fotos" en la pantalla de crear negocio
// y en el botó "Guardar cambios" en la pantalla de fotos