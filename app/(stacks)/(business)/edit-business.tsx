import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Select, { ISelectItem } from "rn-custom-select-dropdown";
import appFirebase from "../../../credenciales.js";
import { pickImages, useBusinessStore } from "../../../store/business-store";

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);
const width = Dimensions.get("window").width;

const categories: Array<ISelectItem<string>> = [
  { label: "Abarrotes y Tienditas", value: "Abarrotes y Tienditas" },
  { label: "Barberías", value: "Barberías" },
  { label: "Cafeterías", value: "Cafeterías" },
  { label: "Farmacias", value: "Farmacias" },
  { label: "Ferreterías", value: "Ferreterías" },
  { label: "Gimnasios", value: "Gimnasios" },
  { label: "Mecánicos y Talleres", value: "Mecánicos y Talleres" },
  { label: "Pizzerías", value: "Pizzerías" },
  { label: "Purificadoras", value: "Purificadoras" },
  { label: "Veterinarias", value: "Veterinarias" },
];

export default function EditBusinessScreen() {
  const router = useRouter();
  const { 'id' : business_id } = useLocalSearchParams()
  
  const [loading, setLoading] = useState(false);
  const [nameBusiness, setNameBusiness] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [selectedValue, setSelectedValue] =
    useState<ISelectItem<string> | null>(null);

  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const location = null; // Backend: Obtener ubicación del negocio

  const handleUpdateBusiness = async () => {
    // Lógica editar back

    router.back()
  }


  const { addImage, images, setImages, clearImages } = useBusinessStore();

  const askForImages = () => {
    if (images.length > 0) {
      router.push("/business-images");
    } else {
      pickImages();
    }
  };

  const [preview, setPreview] = useState(images[0]);

  useEffect(() => {
    if (images[0]) setPreview(images[0]);
  });

  const validateFields = () => {
    if (
      nameBusiness === "" ||
      description === "" ||
      phone === "" ||
      email === "" ||
      selectedValue === null
    ) {
      return false;
    }
    if (!regex.test(phone)) return false;
    if (!emailRegex.test(email)) return false;
    return true;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0056D2" />
          <Text style={styles.loadingText}>Cargando negocio...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.mainContainer}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={() => Keyboard.dismiss()}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          nestedScrollEnabled={true}
        >
          {/* Título de la pantalla */}
          <View style={styles.headerContainer}>
            <Text style={styles.titleText}>Editar negocio</Text>
          </View>

          <View style={styles.card}>
            {/* Contenedor de imagen */}
            <View style={styles.setImageContainer}>
              <Image
                source={
                  !images[0]
                    ? require("../../../assets/images/placeholder-image.jpg")
                    : { uri: preview }
                }
                style={styles.image}
              />
              <TouchableOpacity
                style={{
                  ...styles.button,
                  width: width * 0.4,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => askForImages()}
              >
                <Ionicons
                  name="images-outline"
                  size={24}
                  color="#ffffff"
                  style={{ marginRight: 10 }}
                />
                <Text style={{ ...styles.buttonText, fontSize: 14 }}>
                  Fotos
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre del Negocio</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre del negocio"
                placeholderTextColor="#A0A0A0"
                value={nameBusiness}
                onChangeText={setNameBusiness}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                textAlignVertical="top"
                multiline
                style={[styles.input, { height: 200 }]}
                placeholder="Añade una breve descripción de tu negocio"
                placeholderTextColor="#A0A0A0"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View style={styles.inputGroup}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <Select
                  placeholder="Selecciona una categoría"
                  data={categories}
                  inputContainerStyle={{
                    borderWidth: 1,
                    borderColor: "#E5E5E5",
                    borderRadius: 20,
                    backgroundColor: "#FAFAFA",
                  }}
                  placeholderStyle={{ color: "#505050" }}
                  dropdownItemStyle={{
                    margin: 1,
                    borderColor: "#E5E5E5",
                    backgroundColor: "#cccccc",
                  }}
                  itemLabelColor="#A0A0A0"
                  selectedItemLabelColor="#000000"
                  itemBackgroundColor="#FAFAFA"
                  arrowColor="#0056D2"
                  value={selectedValue}
                  onChange={(newValue: any) => setSelectedValue(newValue)}
                />
              </GestureHandlerRootView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo de contacto</Text>
              <TextInput
                style={styles.input}
                placeholder="correo@ejemplo.com"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Teléfono de contacto</Text>
              <TextInput
                style={styles.input}
                placeholder="### ### ####"
                placeholderTextColor="#A0A0A0"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Botón para editar horario */}
            <TouchableOpacity
              style={{
                ...styles.button,
                width: width * 0.6,
                alignSelf: "flex-end",
              }}
              onPress={() =>
                router.push({
                  pathname: "/set-schedule",
                  params: { business_id },
                })
              }
            >
              <Text style={{ ...styles.buttonText, fontSize: 14 }}>
                Editar horario
              </Text>
            </TouchableOpacity>

            {/* Cuadro de ubicación en el mapa */}
            <View style={styles.locationContainer}>
              <View style={styles.card}>
                <Text style={styles.label}>Ubicación</Text>
                <View style={styles.mapContainer}>
                  {!location ? (
                    <Text
                      style={{
                        ...styles.placeHolderTextColor,
                        textAlign: "center",
                        margin: 20,
                      }}
                    >
                      Añade una ubicación para que tus clientes puedan
                      encontrar tu negocio
                    </Text>
                  ) : (
                    <Text>Mapa con ubicación</Text>
                  )}
                </View>
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons
                    name="location-outline"
                    size={24}
                    color="#ffffff"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={{ ...styles.buttonText, fontSize: 14 }}>
                    Ubicación
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleUpdateBusiness}
            >
              <Text style={styles.buttonText}>Guardar cambios</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#555555",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
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
    fontSize: 15,
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
  setImageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: width * 0.4,
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 26,
    marginBottom: 25,
  },
  image: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: 26,
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    alignSelf: "center",
  },
  mapContainer: {
    width: width * 0.8,
    height: width * 0.5,
    backgroundColor: "#D9D9D9",
    alignSelf: "center",
  },
  placeHolderTextColor: {
    color: "#A1A1A1",
  },
  iconButton: {
    backgroundColor: "#0056D2",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    width: width * 0.4,
    alignSelf: "flex-end",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
});