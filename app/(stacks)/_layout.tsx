import { Stack } from 'expo-router';

export default function StackLayout () {
  return (
    <Stack>
      <Stack.Screen 
        name="add-business" 
        options={{ headerShown: false }} 
      />
      
      <Stack.Screen 
        name="set-schedule" 
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
        name="[business-id]" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="business-images" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="(dashboard)" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}