import { Stack } from 'expo-router';

export default function PromotionsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="[promotion-id]" 
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