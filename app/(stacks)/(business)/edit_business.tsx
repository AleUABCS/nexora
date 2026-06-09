import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import Select, { ISelectItem } from "rn-custom-select-dropdown";
import { colors } from "../../../constants/global_styles";
import appFirebase from "../../../credentials.js";
import { pickImages, useBusinessStore } from "../../../store/business_store";

const storage = getStorage(appFirebase);
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
  const { id } = useLocalSearchParams();
  const businessId = id as string;

  const [loading, setLoading] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [selectedValue, setSelectedValue] = useState<ISelectItem<string> | null>(null);

  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const {
    images,
    setImages,
    clearImages,
    schedule,
    setSchedule,
    clearSchedule,
  } = useBusinessStore();

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "negocios", businessId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setBusinessName(data.nombreNegocio || "");
          setDescription(data.descripcion || "");
          setEmail(data.emailNegocio || "");
          setPhone(data.telefonoNegocio || "");
          setSelectedLocation(data.location || null);

          if (data.categoriaNegocio) {
            setSelectedValue({
              label: data.categoriaNegocio,
              value: data.categoriaNegocio,
            });
          }

          if (data.imagenes && data.imagenes.length > 0) {
            setImages(data.imagenes);
          } else {
            clearImages();
          }

          if (data.horario) {
            setSchedule(data.horario);
          } else {
            clearSchedule();
          }
        } else {
          Alert.alert("Aviso", "No se encontraron los datos del negocio.");
          router.back();
        }
      } catch (error) {
        Alert.alert("Error de conexión", "No se pudieron cargar los datos del negocio.");
      } finally {
        setLoading(false);
      }
    };

    if (businessId) fetchBusinessData();
  }, [businessId]);

  const validateFields = () => {
    const trimmedName = businessName.trim();
    const trimmedDesc = description.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();

    if (
      trimmedName === "" ||
      trimmedDesc === "" ||
      trimmedPhone === "" ||
      trimmedEmail === "" ||
      selectedValue === null
    ) {
      return false;
    }
    if (!phoneRegex.test(trimmedPhone)) return false;
    if (!emailRegex.test(trimmedEmail)) return false;
    return true;
  };

  const handleUpdateBusiness = async () => {
    if (!validateFields()) {
      Alert.alert("Aviso", "Por favor, llena correctamente todos los campos sin dejar espacios en blanco.");
      return;
    }

    try {
      setLoading(true);

      let imageUrls: string[] = [];

      for (const imageUri of images) {
        if (imageUri.startsWith("file://")) {
          const response = await fetch(imageUri);
          const blob = await response.blob();

          const filename = `negocios/${businessId}/imagen_${Date.now()}.jpg`;
          const storageRef = ref(storage, filename);

          await uploadBytes(storageRef, blob);
          const downloadUrl = await getDownloadURL(storageRef);
          imageUrls.push(downloadUrl);
        } else {
          imageUrls.push(imageUri);
        }
      }

      const docRef = doc(db, "negocios", businessId);
      await updateDoc(docRef, {
        nombreNegocio: businessName.trim(),
        descripcion: description.trim(),
        emailNegocio: email.trim(),
        telefonoNegocio: phone.trim(),
        categoriaNegocio: selectedValue?.value,
        imagenes: imageUrls,
        location: selectedLocation ?? null, 
      });

      Alert.alert("Éxito", "Negocio actualizado correctamente.");
      router.back();
    } catch (error) {
      Alert.alert("Error", "No se pudieron guardar los cambios. Revisa tu conexión a internet.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBusiness = () => {
    Alert.alert(
      "Eliminar negocio",
      "¿Estás seguro de que quieres eliminar tu negocio? Esta acción no se puede deshacer.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const docRef = doc(db, "negocios", businessId);
              await deleteDoc(docRef);
              Alert.alert("Éxito", "El negocio ha sido eliminado correctamente.");
              router.replace("/(tabs)"); 
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el negocio. Inténtalo más tarde.");
            }
          },
        },
      ]
    );
  };

  const askForImages = () => {
    if (images.length > 0) {
      router.push("/business_images");
    } else {
      pickImages();
    }
  };

  const [preview, setPreview] = useState(images[0]);

  useEffect(() => {
    if (images[0]) setPreview(images[0]);

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
  }, [images]);

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
          <View style={styles.headerContainer}>
            <Text style={styles.titleText}>Editar negocio</Text>
          </View>

          <View style={styles.card}>
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
                value={businessName}
                onChangeText={setBusinessName}
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

            <TouchableOpacity
              style={{
                ...styles.button,
                width: width * 0.6,
                alignSelf: "flex-end",
              }}
              onPress={() =>
                router.push({
                  pathname: "/set_schedule",
                  params: { id: businessId },
                })
              }
            >
              <Text style={{ ...styles.buttonText, fontSize: 14 }}>
                Editar horario
              </Text>
            </TouchableOpacity>

            <View style={styles.locationContainer}>
              <View style={styles.card}>
                <Text style={styles.label}>Ubicación</Text>
                <MapView
                  style={{ width: width * 0.8, height: width * 0.5 }}
                  region={{
                    latitude: userLocation?.latitude ?? 24.1426,
                    longitude: userLocation?.longitude ?? -110.3128,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
                >
                  {selectedLocation && <Marker coordinate={selectedLocation} />}
                </MapView>
                <TouchableOpacity
                  style={{ ...styles.iconButton, backgroundColor: colors.warn }}
                  onPress={() => setSelectedLocation(null)}
                >
                  <Ionicons
                    name="remove"
                    size={24}
                    color="#ffffff"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={{ ...styles.buttonText, fontSize: 14 }}>
                    Eliminar
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

            <TouchableOpacity
              style={{
                ...styles.button,
                marginTop: 10,
                backgroundColor: colors.warn,
              }}
              onPress={handleDeleteBusiness}
            >
              <Text style={styles.buttonText}>Eliminar negocio</Text>
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
    color: "#ffffff",
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