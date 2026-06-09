import { Stack } from 'expo-router';

export default function CustomerPromotionLayout() {
  // Configuración del enrutador para el flujo de promociones desde la vista del cliente
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="[promotion_id]" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="redeem" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="completed" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}