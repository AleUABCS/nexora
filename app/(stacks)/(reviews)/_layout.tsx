import { Stack } from 'expo-router';

export default function ReviewLayout() {
  // Configuración del enrutador principal para el flujo de visualización de reseñas
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}