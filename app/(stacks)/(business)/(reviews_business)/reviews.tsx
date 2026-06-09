import { colors, globalStyles } from "@/constants/global_styles";
import appFirebase from "@/credentials.js";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const db = getFirestore(appFirebase);

interface Review {
  id: string;
  userId: string;
  username: string;
  review: string;
  rating: number;
}

export default function BusinessReviewView() {
  const { businessId, businessName } = useLocalSearchParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchReviews = async () => {
        setLoading(true);
        try {
          const q = query(
            collection(db, "reviews"),
            where("business_id", "==", businessId)
          );
          const snapshot = await getDocs(q);

          const data = await Promise.all(
            snapshot.docs.map(async (docSnap) => {
              const d = docSnap.data();

              const userQuery = query(
                collection(db, "usuarios"),
                where("uid", "==", d.userId)
              );
              const userSnap = await getDocs(userQuery);
              const nombre = !userSnap.empty
                ? userSnap.docs[0].data().nombre
                : "Usuario desconocido";

              return {
                id: docSnap.id,
                userId: d.userId,
                username: nombre,
                review: d.review,
                rating: d.rating,
              };
            })
          );

          setReviews(data);
        } catch (error) {
          Alert.alert("Error", "No se pudieron cargar las reseñas en este momento.");
        } finally {
          setLoading(false);
        }
      };

      fetchReviews();
    }, [businessId])
  );

  const renderStars = (count: number) => (
    <View style={{ flexDirection: "row", marginBottom: 8 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Ionicons
          key={i}
          name={i < count ? "star" : "star-outline"}
          size={16}
          color={colors.mainBlue}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View style={{ marginTop: 15, height: "100%" }}>
        <Text
          style={{ ...globalStyles.titleText, marginTop: 20, marginBottom: 15 }}
        >
          {businessName || "Reseñas"}
        </Text>

        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingTop: 20 }}
            ListEmptyComponent={
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  color: colors.placeHolder,
                }}
              >
                Este negocio aún no tiene reseñas.
              </Text>
            }
            renderItem={({ item }) => (
              <View
                style={{
                  ...globalStyles.card,
                  marginBottom: 12,
                  marginHorizontal: 10,
                }}
              >
                <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
                  {item.username}
                </Text>
                {renderStars(item.rating)}
                <Text>{item.review}</Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}