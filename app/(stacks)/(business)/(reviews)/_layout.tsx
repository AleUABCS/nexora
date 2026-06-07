import { Stack } from 'expo-router';

export default function BusinessReviewsLayout () {
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