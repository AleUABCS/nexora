import { Stack } from 'expo-router';

export default function BusinessLayout() {
  // Configuración del enrutador principal para la gestión y vista de un negocio
  return (
    <Stack>
      <Stack.Screen 
        name="[id]" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="promotions" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="edit_business" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="(reviews_business)" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}