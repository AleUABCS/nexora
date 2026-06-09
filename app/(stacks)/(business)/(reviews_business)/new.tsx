import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  getDocs,
  query,
  where,
  updateDoc,  
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { colors, globalStyles } from "../../../../constants/global_styles";
import appFirebase from "../../../../credentials.js";

const db = getFirestore(appFirebase);

interface StarRatingProps {
  onChange?: (rating: number) => void;
}

export default function NewReview({ onChange }: StarRatingProps) {
  const router = useRouter();
  const auth = getAuth(appFirebase);
  const { id } = useLocalSearchParams();
  const [businessData, setBusinessData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [reviewDescription, setReviewDescription] = useState("");

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const docRef = doc(db, "negocios", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBusinessData(docSnap.data());
        } else {
          Alert.alert("Error", "No se encontró la información del negocio.");
          router.back();
        }
      } catch (error) {
        Alert.alert(
          "Error de conexión",
          "No se pudieron cargar los datos del negocio.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchBusinessData();
  }, [id]);

  if (isLoading)
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  if (!businessData) return <Text>Negocio no encontrado</Text>;

  const handleReviewUpload = async () => {
    const currentUser = auth.currentUser;
    const trimmedDescription = reviewDescription.trim();

    if (!currentUser) {
      Alert.alert("Aviso", "Debes iniciar sesión para publicar una reseña");
      return;
    }
    if (trimmedDescription === "") {
      Alert.alert("Aviso", "Por favor escribe una descripción para tu reseña");
      return;
    }
    if (rating === 0) {
      Alert.alert(
        "Aviso",
        "Por favor selecciona una calificación de estrellas",
      );
      return;
    }

    try {
      const newReview = {
        userId: currentUser.uid,
        business_id: id,
        review: trimmedDescription,
        rating: rating,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "reviews"), newReview);
      const reviewsQuery = query(
        collection(db, "reviews"),
        where("business_id", "==", id),
      );
      const snapshot = await getDocs(reviewsQuery);
      let sum = 0;
      snapshot.forEach((d) => {
        sum += d.data().rating;
      });
      const newAverage = Number((sum / snapshot.size).toFixed(2));

      await updateDoc(doc(db, "negocios", id as string), {
        ratingPromedio: newAverage,
      });

      Alert.alert("Éxito", "Tu reseña ha sido publicada");
      router.back();

      Alert.alert("Éxito", "Tu reseña ha sido publicada");
      router.back();
    } catch (error) {
      Alert.alert(
        "Error",
        "Ocurrió un problema al subir tu reseña. Inténtalo más tarde.",
      );
    }
  };

  return (
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
              {businessData.nombreNegocio}
            </Text>
          </View>

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
                  value={reviewDescription}
                  onChangeText={setReviewDescription}
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
              <TouchableOpacity
                style={{ ...globalStyles.button, width: "100%" }}
                onPress={handleReviewUpload}
              >
                <Ionicons
                  name="arrow-up"
                  color="#FFFFFF"
                  size={24}
                  style={{ paddingRight: 5 }}
                />
                <Text style={globalStyles.buttonText}>Publicar</Text>
              </TouchableOpacity>

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
