import { colors, globalStyles } from "@/constants/global_styles";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import Select, { ISelectItem } from "rn-custom-select-dropdown";
import appFirebase from "../../credentials.js";
import { pickImages, useBusinessStore } from "../../store/business_store";

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);
const storage = getStorage(appFirebase);
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

export default function AddBusinessScreen() {
  const router = useRouter();

  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedValue, setSelectedValue] =
    useState<ISelectItem<string> | null>(null);

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const { images, clearImages, schedule, clearSchedule } = useBusinessStore();

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    };
    getLocation();
  }, []);

  const uploadImagesToStorage = async (userId: string): Promise<string[]> => {
    return Promise.all(
      images.map(async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const filename = `negocios/${userId}/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
        const imageRef = ref(storage, filename);
        await uploadBytes(imageRef, blob);
        return getDownloadURL(imageRef);
      }),
    );
  };

  const handleRegisterBusiness = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return Alert.alert("Aviso", "Usuario no autenticado");

    if (!validateFields()) {
      return Alert.alert(
        "Aviso",
        "Por favor, llena correctamente todos los campos sin espacios en blanco.",
      );
    }

    try {
      setUploading(true);
      const imageUrls = await uploadImagesToStorage(currentUser.uid);

      await addDoc(collection(db, "negocios"), {
        nombreNegocio: businessName.trim(),
        nombreBusqueda: businessName.toLowerCase().trim(),
        userId: currentUser.uid,
        descripcion: description.trim(),
        categoriaNegocio: selectedValue!.value,
        telefonoNegocio: phone.trim(),
        emailNegocio: email.trim(),
        ratingPromedio: 0,
        imagenes: imageUrls,
        horario: schedule,
        createdAt: new Date().toISOString(),
        location: selectedLocation,
      });

      clearImages();
      clearSchedule();
      Alert.alert("Éxito", "Negocio registrado correctamente");
      router.back();
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo registrar el negocio. Inténtalo nuevamente.",
      );
    } finally {
      setUploading(false);
    }
  };

  const validateFields = () => {
    return (
      businessName.trim() !== "" &&
      description.trim() !== "" &&
      phoneRegex.test(phone.trim()) &&
      emailRegex.test(email.trim()) &&
      selectedValue !== null
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.mainContainer}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.titleText}>Registrar negocio</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.setImageContainer}>
              <Image
                source={
                  !images[0]
                    ? require("../../assets/images/placeholder-image.jpg")
                    : { uri: images[0] }
                }
                style={styles.image}
              />
              <TouchableOpacity
                style={{ ...styles.button, width: width * 0.4 }}
                onPress={
                  images.length > 0
                    ? () => router.push("/business_images")
                    : pickImages
                }
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
                value={businessName}
                onChangeText={setBusinessName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                placeholder="Pon una descripcion"
                multiline
                style={[styles.input, { height: 100 }]}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View style={styles.inputGroup}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <Select
                  placeholder="Selecciona una categoría"
                  data={categories}
                  value={selectedValue}
                  onChange={setSelectedValue}
                />
              </GestureHandlerRootView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo de contacto</Text>
              <TextInput
                placeholder="correo@gmail.com"
                style={styles.input}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Teléfono</Text>
              <TextInput
                placeholder="### ### ####"
                style={styles.input}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <TouchableOpacity
              style={{
                ...styles.button,
                width: width * 0.5,
                alignSelf: "flex-end",
              }}
              onPress={() => router.push("/set_schedule")}
            >
              <Text style={styles.buttonText}>Establecer horario</Text>
            </TouchableOpacity>

            <View style={styles.locationContainer}>
              <Text style={styles.label}>Ubicación</Text>
              <MapView
                style={{ width: width * 0.8, height: width * 0.4 }}
                initialRegion={{
                  latitude: userLocation?.latitude ?? 24.1426,
                  longitude: userLocation?.longitude ?? -110.3128,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
              >
                {selectedLocation && <Marker coordinate={selectedLocation} />}
              </MapView>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleRegisterBusiness}
              disabled={uploading}
            >
              <Text style={styles.buttonText}>
                {uploading ? "Publicando..." : "Publicar negocio"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#FFFFFF" },
  headerContainer: { alignItems: "center", marginBottom: 20 },
  titleText: { fontSize: 32, fontWeight: "500" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    margin: 10,
    elevation: 5,
  },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 5, color: "#969696"},
  input: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    padding: 12,
  },
  button: {
    backgroundColor: colors.mainBlue,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontWeight: "bold" },
  setImageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  image: { width: 100, height: 100, borderRadius: 10 },
  locationContainer: { marginTop: 20, alignItems: "center" },
});
