import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  addDoc,
  collection,
} from "firebase/firestore";
import {
  Alert,
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, globalStyles } from "../../../../constants/globalStyles";
import appFirebase from "../../../../credenciales.js";
const db = getFirestore(appFirebase);

interface StarRatingProps {
  onChange?: (rating: number) => void;
}

export default function NewReview({ onChange }: StarRatingProps) {
  const router = useRouter();
  const auth = getAuth(appFirebase);
  const { id } = useLocalSearchParams();
  const [negocio, setNegocio] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  const [rating, setRating] = useState(0);
  const [review_description, setDescription] = useState("");

  useEffect(() => {
    const obtenerNegocio = async () => {
      try {
        const docRef = doc(db, "negocios", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setNegocio(docSnap.data());
        } else {
          console.log("No existe el negocio");
        }
      } catch (error) {
        console.error("Error consultando Firebase:", error);
      } finally {
        setCargando(false);
      }
    };

    if (id) obtenerNegocio();
  }, [id]);

  if (cargando)
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  if (!negocio) return <Text>Negocio no encontrado</Text>;

  let review_data = {
    business_id: id,
    name_business: negocio.nombreNegocio,
    rate: rating, // Calificación
    description: review_description, // Descripción
  };
  const hanldeReviewUpload = async () => {
    const usuarioActual = auth.currentUser;
    if (!usuarioActual) {
      Alert.alert("Aviso", "Usuario no logueado");
      return;
    }
    if (review_description === "") {
      Alert.alert("Aviso", "Por favor llena todos los campos");
      return;
    }
    try {
      const newReview = {
        userId: usuarioActual.uid,
        business_id: id,
        review: review_description,
        rating: rating,

        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "reviews"), newReview);

      Alert.alert("Éxito", "Review añadida");
      router.back();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo añadir la review");
    }

    router.back();
  };
  return (
    // Contenedor padre
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={globalStyles.mainContainer}>
        <View style={[globalStyles.secondContainer]}>
          <View style={{ alignItems: "center" }}>
            <Ionicons
              name="star-outline"
              color={colors.mainBlue}
              size={63}
              style={{ marginTop: 40 }}
            />
            <Text
              style={{ fontSize: 32, color: colors.regularText, marginTop: 40 }}
            >
              {review_data.name_business}
            </Text>
          </View>
          {/* Contenedor con estilo de tarjeta */}
          <View style={{ ...globalStyles.card, marginTop: 25, paddingTop: 40 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.boldText}>Calificación</Text>

              <View style={{ flexDirection: "row", gap: 8 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Pressable
                    key={star}
                    onPress={() => {
                      setRating(star);
                      onChange?.(star);
                    }}
                  >
                    <Ionicons
                      name={star <= rating ? "star" : "star-outline"}
                      size={24}
                      color={colors.mainBlue}
                    />
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={{ marginTop: 30 }}>
              <Text style={styles.boldText}>Reseña</Text>
              <ScrollView style={{ maxHeight: 200 }}>
                <TextInput
                  textAlignVertical="top"
                  multiline
                  style={{ ...styles.textArea, height: 150, marginTop: 20 }}
                  placeholder="Escribe tu reseña"
                  placeholderTextColor="#A0A0A0"
                  value={review_description}
                  onChangeText={setDescription}
                />
              </ScrollView>
            </View>

            <View
              style={{
                alignItems: "flex-end",
                alignSelf: "flex-end",
                marginTop: 20,
                width: "60%",
              }}
            >
              {/* Botón "Ver negocio" */}
              <TouchableOpacity
                style={{ ...globalStyles.button, width: "100%" }}
                onPress={hanldeReviewUpload}
              >
                <Ionicons
                  name="arrow-up"
                  color="#FFFFFF"
                  size={24}
                  style={{ paddingRight: 5 }}
                ></Ionicons>
                <Text style={globalStyles.buttonText}>Publicar</Text>
              </TouchableOpacity>

              {/* Botón "Cancelar" */}
              <TouchableOpacity
                style={{
                  ...globalStyles.button,
                  backgroundColor: colors.mainBlue,
                  width: "100%",
                }}
                onPress={() => router.back()}
              >
                <Text style={globalStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  boldText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  textArea: {
    ...globalStyles.input,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
});
