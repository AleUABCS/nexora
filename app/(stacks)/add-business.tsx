import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import React, { useState } from "react";
import {
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
import { SafeAreaView } from "react-native-safe-area-context";
import Select, { ISelectItem } from "rn-custom-select-dropdown";
import appFirebase from "../../credenciales.js";
import { useBusinessStore } from '../store/business-store';

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);
const width = Dimensions.get("window").width;
const categories: Array<ISelectItem<string>> = [
  {
    label: "Farmacias",
    value: "Farmacias",
  },
  {
    label: "Peluquerias",
    value: "Peluquerias",
  },
  {
    label: "Restaurantes",
    value: "Restaurantes",
  },
];

export default function registerBusinessScreen() {
  const [nameBusiness, setNameBusiness] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const [selectedValue, setSelectedValue] =
    useState<ISelectItem<string> | null>(null);
  //para saber si es numero valido
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  //Para saber si es un email valido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const location = null; // Backend: Obtener ubicación del usuario

  const handleRegisterBusiness = async () => {
    const usuarioActual = auth.currentUser;
    if (!usuarioActual) {
      Alert.alert('Aviso', 'Usuario no logueado');
      return;
    }
    if (nameBusiness === '' || description === '' || phone === '' || email === '') {
      Alert.alert('Aviso', 'Por favor llena todos los campos');
      return;
    }
    if (!regex.test(phone)) {
      Alert.alert('Aviso', 'El numero no es valido');
      return;
    }
    if (!emailRegex.test(email)) {
      Alert.alert('Aviso', 'El email no es valido');
      return;
    }

    try {
      const newBusiness = {
        nombreNegocio: nameBusiness,
        userId: usuarioActual.uid,
        descripcion: description,
        telefonoNegocio: phone,
        emailNegocio: email,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, "negocios"), newBusiness);

      Alert.alert('Éxito', 'Negocio registrado');
      router.back();
    } catch (error) {
      console.log(error)
    }
  };

  // Funciones de business-store para guardar la url de las imágenes y pasarlas entre pantallas
  const { addImage, images, setImages } = useBusinessStore()

  const askForIamges = () => {
    if (images) {
      router.push('/business-images')
    } else {
      pickImages()
    }
  }



  const pickImages = async () => {

  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permissionResult.granted) {
        Alert.alert('Sin permisos', 'Se requieren permisos para acceder a la galería')
        return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 1,
    });

    console.log(result)

    if (!result.canceled) {
        const uris = result.assets.map(asset => asset.uri)
        setImages(uris)
    }

  }

  return (
    <SafeAreaView style={{ ...styles.mainContainer }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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

          {/* Aquí inicia el contenido */}
          {/* Título de la pantalla */}
          <View style={styles.headerContainer}>
            <Text style={styles.titleText}>Registrar negocio</Text>
          </View>

          <View style={styles.card}>

            {/* Contenedor de imagen y botón para subir imagen */}
            {/* Falta back */}
            <View style={styles.setImageContainer}>
              <Image source={require('../../assets/images/placeholder-image.jpg')} style={styles.image} />
              <TouchableOpacity
                style={{
                  ...styles.button,
                  width: width * 0.4, 
                  flexDirection: 'row', 
                  justifyContent: 'center', 
                  alignItems: 'center'
                }}
                onPress={() => askForIamges()}
                >
                <Ionicons name="images-outline" size={24} color="#ffffff" marginRight={10} />
                <Text style={{ ...styles.buttonText, fontSize: 14 }}>Fotos</Text>
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
                placeholder="Añade una breve descripcion de tu negocio"
                placeholderTextColor="#A0A0A0"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View style={styles.inputGroup}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <Select
                  placeholder="Selecciona una categoria"
                  data={categories}
                  inputContainerStyle={{
                    borderWidth: 1,
                    borderColor: "#E5E5E5",
                    borderRadius: 20,
                    backgroundColor: "#FAFAFA",
                  }}
                  placeholderStyle={{
                    
                    color: "#505050",
                  }}
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
                  onChange={(newValue: any) => {
                    setSelectedValue(newValue);
                  }}
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

            {/* Botón para establecer horario */}
            <TouchableOpacity
              style={{
                ...styles.button,
                width: width * 0.6,
                alignSelf: "flex-end",
              }}
              onPress={() => router.push("/set-schedule")}
            >
              <Text style={{ ...styles.buttonText, fontSize: 14 }}>
                Establecer horario
              </Text>
            </TouchableOpacity>

            {/* Cuadro de ubicación en el mapa*/}
            <View style={styles.locationContainer}>
              <View style={styles.card}>
                <Text style={styles.label}>Ubicación</Text>
                <View style={styles.mapContainer}>
                  {!location ? ( // Si no hay ubicación, como debería ser al crear el negocio, mostrar placeholder
                    <Text
                      style={{
                        ...styles.placeHolderTextColor,
                        textAlign: "center",
                        margin: 20,
                      }}
                    >
                      Añade una ubicación para que tus futuros clientes puedan
                      encontrar tu negocio
                    </Text>
                  ) : (
                    // Mostrar el mapa con la ubicación, no sé si te sirva esta esctructura xd
                    <Text>Mapa con ubicación</Text>
                  )}
                </View>
                {/* Botón para ubicación */}
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons
                    name="location-outline"
                    size={24}
                    color="#ffffff"
                    marginRight={10}
                  ></Ionicons>
                  <Text style={{ ...styles.buttonText, fontSize: 14 }}>
                    Ubicación
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleRegisterBusiness}
            >
              <Text style={styles.buttonText}>Publicar negocio</Text>
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
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
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
    color: "#0056D2",
    fontWeight: "600",
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
