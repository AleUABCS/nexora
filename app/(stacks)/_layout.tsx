import { Stack } from 'expo-router';

export default function AppStackLayout() {
  // Configuración centralizada de las rutas de la pila (Stack) de la aplicación
  return (
    <Stack>
      <Stack.Screen 
        name="add_business" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="set_schedule" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="saved" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="(reviews)" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="business_images" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="(dashboard)" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="(business)" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="customer_promotions" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}