import appFirebase from "@/credentials.js";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, globalStyles } from "../../../constants/global_styles";

const db = getFirestore(appFirebase);

export default function ReviewDetailsView() {
  const router = useRouter();
  const { reviewId, businessId, businessName, review, rating } = useLocalSearchParams();
  const safeRating = Number(rating) || 0;

  async function handleRemoveReview() {
    try {
      await deleteDoc(doc(db, "reviews", reviewId as string));
      router.back();
    } catch (error) {
      Alert.alert("Error de conexión", "No se pudo eliminar la reseña. Verifica tu conexión a internet e inténtalo de nuevo.");
    }
  }

  const alertOnDelete = () => {
    Alert.alert("Confirmación", "¿Estás seguro de que quieres eliminar esta reseña permanentemente?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: handleRemoveReview },
    ]);
  };

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View style={globalStyles.secondContainer}>
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
            {businessName}
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
            <View style={{ flexDirection: "row" }}>
              {[...Array(safeRating)].map((_, index) => (
                <Ionicons
                  key={index}
                  name="star"
                  color={colors.mainBlue}
                  size={14}
                  style={{ marginLeft: 5 }}
                />
              ))}
            </View>
            <Text style={styles.boldText}>{safeRating}/5</Text>
          </View>

          <View style={{ marginTop: 30 }}>
            <Text style={styles.boldText}>Reseña</Text>
            <ScrollView style={{ maxHeight: 200 }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.regularText,
                  marginTop: 10,
                }}
              >
                {review}
              </Text>
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
              onPress={() => router.push(`/(stacks)/(business)/${businessId}`)}
            >
              <Ionicons
                name="arrow-redo-outline"
                color="#FFFFFF"
                size={24}
                style={{ paddingRight: 5 }}
              />
              <Text style={globalStyles.buttonText}>Ver negocio</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                ...globalStyles.button,
                backgroundColor: colors.warn,
                width: "100%",
              }}
              onPress={alertOnDelete}
            >
              <Ionicons
                name="trash-outline"
                color="#FFFFFF"
                size={24}
                style={{ paddingRight: 5 }}
              />
              <Text style={globalStyles.buttonText}>Eliminar reseña</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  boldText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});