import { Stack } from 'expo-router';

export default function DashboardLayout() {
  // Configuración del enrutador para el panel de control (dashboard) del negocio
  return (
    <Stack>
      <Stack.Screen 
        name="[id]" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}