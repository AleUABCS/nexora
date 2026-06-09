import { Stack } from 'expo-router';

export default function BusinessReviewLayout() {
  // Configuración del enrutador para el flujo de reseñas de un negocio específico
  return (
    <Stack>
      <Stack.Screen 
        name="reviews" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="new" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}