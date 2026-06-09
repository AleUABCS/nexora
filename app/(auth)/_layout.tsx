import { Stack } from 'expo-router';

export default function AuthLayout() {
  // Configuración del enrutador para el flujo de autenticación, omitiendo las cabeceras superiores
  return (
    <Stack>
      <Stack.Screen 
        name="login" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}