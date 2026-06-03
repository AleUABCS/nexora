import { Stack } from 'expo-router';

export default function DashboardLayout () {
  return (
    <Stack>
      <Stack.Screen 
        name="[id-dashboard]" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}