//Estas son todas las importaciones que necesita 
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

// estas son las importaciones para firebase
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import appFirebase from "../credenciales.js";
const auth = getAuth(appFirebase);

import { useColorScheme } from "@/components/useColorScheme";
export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

//Funcion que se usa para cargar algun error y cargar las fuentes, si sale true que ya cargo manda al rootLayoutNav
export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav/>;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  // user: Guarda el usuario autenticado o null si no hay sesión
  //initializing: true mientras Firebase verifica si hay sesión activa
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  // listener para saber si hay usuario logueado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      //si hay user tiene sus datos y si no es null
      setUser(currentUser);
      //Marca que Firebase ya terminó de verificar el estado de autenticación
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  //REDIRECCIÓN AUTOMÁTICA
  useEffect(() => {
    if (initializing) return;
    if (user) {
      // Si hay usuario, directo a la pestaña principal
      router.replace("/(tabs)");
    } else {
      // Si no hay usuario, directo a tu pantalla login
      router.replace("/(auth)/login");
    }
  }, [user, initializing]);

  if (initializing) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-business" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </ThemeProvider>
  );
}
