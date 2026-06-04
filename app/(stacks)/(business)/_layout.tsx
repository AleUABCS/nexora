import { Stack } from 'expo-router';

export default function ReviewsLayout () {
  return (
    <Stack>
      <Stack.Screen 
        name="[business-id]" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="(reviews)/new" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="promotions" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="edit-business" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}