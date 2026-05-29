import { Stack } from 'expo-router';

export default function ReviewsLayout() {
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
      <Stack.Screen 
        name="prueba" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}