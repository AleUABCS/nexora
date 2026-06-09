import { Stack } from 'expo-router';

export default function PromotionLayout() {
  // Configuración del enrutador para el flujo de promociones del negocio 
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="promotion" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="new" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="redeem" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}