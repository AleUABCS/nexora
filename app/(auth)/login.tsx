import appFirebase from "@/credentials";
import { useRouter } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const auth = getAuth(appFirebase);

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  
  // Expresión regular para verificar que el formato del correo tenga estructura válida
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async () => {
    // Se eliminan los espacios en blanco al inicio y al final para evitar falsos ingresos
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (trimmedEmail === "" || trimmedPassword === "") {
      Alert.alert("Aviso", "Por favor llena todos los campos");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert("Aviso", "El correo electrónico no es válido");
      return;
    }

    if (trimmedPassword.length < 8) {
      Alert.alert("Aviso", "La contraseña debe tener al menos 8 caracteres");
      return;
    }

    try {
      // Intento de autenticación
      await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
    } catch (error) {
      // Se captura el error de Firebase y se muestra un mensaje
      Alert.alert(
        "Error de autenticación", 
        "Correo o contraseña incorrectos. Verifica tus datos e intenta de nuevo."
      );
    }
  };

  const handleRegister = () => {
    router.push("/(auth)/register");
  };

  return (
    // Se usa KeyboardAvoidingView para evitar que el teclado nativo oculte los inputs al escribir
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.mainContainer}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.logoText}>NEXORA</Text>
            <Text style={styles.titleText}>Bienvenido</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo</Text>
              <TextInput
                style={styles.input}
                placeholder="correo@gmail.com"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="· · · · · · · ·"
                placeholderTextColor="#A0A0A0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerText}>Registrarse</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "900",
    color: "#155EEF",
    fontStyle: "italic",
    marginBottom: 20,
    letterSpacing: 1,
  },
  titleText: {
    fontSize: 32,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: "#333333",
    marginBottom: 8,
    fontWeight: "500",
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#000",
    backgroundColor: "#FAFAFA",
  },
  button: {
    backgroundColor: "#0056D2",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#333333",
  },
  registerText: {
    fontSize: 14,
    color: "#0057d1",
    fontWeight: "600",
  },
});