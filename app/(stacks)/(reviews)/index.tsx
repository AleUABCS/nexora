import { colors, globalStyles } from "@/constants/global_styles";
import appFirebase from "@/credentials.js";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const db = getFirestore(appFirebase);
const auth = getAuth(appFirebase);

interface Review {
  id: string;
  businessId: string;
  businessName: string;
  review: string;
  rating: number;
}

export default function ReviewView() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchReviews = async () => {
        setLoading(true);
        try {
          const uid = auth.currentUser?.uid;
          if (!uid) {
            setLoading(false);
            return;
          }

          const q = query(
            collection(db, "reviews"),
            where("userId", "==", uid)
          );
          const snapshot = await getDocs(q);

          const data = await Promise.all(
            snapshot.docs.map(async (docSnap) => {
              const d = docSnap.data();

              const negocioRef = doc(db, "negocios", d.business_id);
              const negocioSnap = await getDoc(negocioRef);
              
              const businessName = negocioSnap.exists()
                ? negocioSnap.data().nombreNegocio
                : "Negocio desconocido";

              return {
                id: docSnap.id,
                businessId: d.business_id,
                businessName,
                review: d.review,
                rating: d.rating || 0, 
              };
            })
          );

          setReviews(data);
        } catch (error) {
          Alert.alert("Error de conexión", "No se pudieron cargar tus reseñas publicadas.");
        } finally {
          setLoading(false);
        }
      };

      fetchReviews();
    }, [])
  );

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View style={globalStyles.secondContainer}>
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <Ionicons
            name="star-outline"
            color={colors.mainBlue}
            size={63}
            style={{ marginTop: 40 }}
          />
          <Text style={globalStyles.titleText}>Reseñas publicadas</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 50 }} color={colors.mainBlue} />
        ) : (
          <View style={globalStyles.card}>
            <FlatList
              data={reviews}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                <Text
                  style={{
                    textAlign: "center",
                    color: colors.placeHolder,
                    marginTop: 10,
                  }}
                >
                  No has publicado reseñas aún.
                </Text>
              }
              renderItem={({ item }) => (
                <View style={globalStyles.listItem}>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      flex: 1,
                    }}
                    onPress={() =>
                      router.push({
                        pathname: "/(stacks)/(reviews)/[id]",
                        params: {
                          id: item.id,
                          reviewId: item.id,
                          businessId: item.businessId,
                          businessName: item.businessName,
                          review: item.review,
                          rating: item.rating,
                        },
                      })
                    }
                  >
                    <Text style={globalStyles.listItemText}>
                      {item.businessName}
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      {[...Array(Math.max(0, item.rating))].map((_, index) => (
                        <Ionicons
                          key={index}
                          name="star"
                          color={colors.mainBlue}
                          size={14}
                          style={{ marginLeft: 5 }}
                        />
                      ))}
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}