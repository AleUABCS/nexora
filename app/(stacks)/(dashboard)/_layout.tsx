import { Stack } from 'expo-router';

export default function DashboardLayout () {
  return (
    <Stack>
      <Stack.Screen 
        name="[id]" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}