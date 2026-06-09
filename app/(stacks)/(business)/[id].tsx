import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../../components/Themed";
import { colors, globalStyles } from "../../../constants/global_styles";
import appFirebase from "../../../credentials.js";
import { useFavoritesStore } from "../../../store/saved_store";

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

const width = Dimensions.get("window").width;
const containerWidth = width;
const space = 10;

export default function BusinessView() {
  const { id } = useLocalSearchParams();
  const businessId = id as string;

  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [businessData, setBusinessData] = useState<any>(null);
  const [activePromotions, setActivePromotions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { addFavorite, removeSaved, favorites } = useFavoritesStore();
  const isFavorite = favorites.some((fav: { id: string }) => fav.id === businessId);

  // ── Datos del negocio y reviews: solo una vez al montar ──
  useEffect(() => {
    if (!businessId) return;

    const fetchBusinessData = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, "negocios", businessId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBusinessData(docSnap.data());
        } else {
          Alert.alert("Aviso", "No se encontró la información del negocio.");
          router.back();
          return;
        }

        const reviewsQuery = query(
          collection(db, "reviews"),
          where("business_id", "==", businessId),
        );
        const countSnapshot = await getCountFromServer(reviewsQuery);
        const total = countSnapshot.data().count;
        setTotalReviews(total);

        if (total > 0) {
          const querySnapshot = await getDocs(reviewsQuery);
          let sumReviews = 0;
          querySnapshot.forEach((doc) => { sumReviews += doc.data().rating; });
          setAverageRating(Number((sumReviews / total).toFixed(2)));
        } else {
          setAverageRating(0);
        }
      } catch (error) {
        Alert.alert("Error de conexión", "No se pudieron cargar los datos del negocio.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessData();
  }, [businessId]);

  // ── Promociones: se recarga cada vez que vuelves a la pantalla ──
  useFocusEffect(
    useCallback(() => {
      if (!businessId) return;

      const now = new Date();
      const promotionsRef = collection(db, "negocios", businessId, "promociones");
      const activePromotionsQuery = query(
        promotionsRef,
        where("endDate", ">=", Timestamp.fromDate(now)),
      );

      const unsubPromotions = onSnapshot(activePromotionsQuery, async (snapshot) => {
        const userId = auth.currentUser?.uid;

        const data = await Promise.all(
          snapshot.docs.map(async (promoSnap) => {
            const d = promoSnap.data();
            let tokensEarned = 0;

            if (userId) {
              const userPromoRef = doc(db, "userPromotions", `${userId}_${promoSnap.id}`);
              const userPromoSnap = await getDoc(userPromoRef);
              if (userPromoSnap.exists()) {
                tokensEarned = userPromoSnap.data().tokensEarned;
              }
            }

            return {
              id: promoSnap.id,
              ...d,
              startDate: d.startDate?.toDate().toLocaleDateString("es-MX"),
              endDate: d.endDate?.toDate().toLocaleDateString("es-MX"),
              tokensEarned,
            };
          }),
        );

        setActivePromotions(data);
      });

      return () => unsubPromotions();
    }, [businessId]),
  );

  const sendWhatsApp = () => {
    if (!businessData?.telefonoNegocio) return;
    const cleanNumber = businessData.telefonoNegocio.replace(/[^0-9]/g, "");
    const message = "¡Hola! Me comunico desde la app Nexora.";
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) return Linking.openURL(url);
        else Alert.alert("Error", "WhatsApp no está instalado en este dispositivo.");
      })
      .catch(() => Alert.alert("Error", "No se pudo abrir WhatsApp."));
  };

  const openInMapNativeApp = () => {
    if (businessData?.location) {
      const lat = businessData.location.latitude;
      const lng = businessData.location.longitude;
      const scheme = Platform.select({ ios: "maps:", android: "geo:" });
      const url = scheme === "ios"
        ? `maps:${lat},${lng}?q=${lat},${lng}`
        : `geo:${lat},${lng}?q=${lat},${lng}`;

      Linking.canOpenURL(url).then((supported) => {
        if (supported) Linking.openURL(url);
        else Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
      });
    }
  };

  if (isLoading)
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  if (!businessData)
    return <Text style={{ textAlign: "center", marginTop: 50 }}>Negocio no encontrado</Text>;

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <ScrollView>
        <View>
          <FlatList
            data={businessData.imagenes ?? []}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            decelerationRate={0}
            scrollEventThrottle={16}
            snapToInterval={containerWidth}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              <View style={{ width: containerWidth, alignItems: "center", padding: 20 }}>
                <Text style={{ color: colors.placeHolder }}>No hay imágenes disponibles</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={{ width: containerWidth }}>
                <View style={{ marginHorizontal: space, padding: space, borderRadius: 34, backgroundColor: "#FFFFFF", alignItems: "center" }}>
                  <Image source={{ uri: item }} style={styles.posterImage} />
                </View>
              </View>
            )}
          />
        </View>

        <View style={{ ...globalStyles.secondContainer, marginTop: 0 }}>
          <View style={{ ...styles.infoContainer, marginHorizontal: 0 }}>
            <View style={{ width: "60%" }}>
              <Text style={styles.name}>{businessData.nombreNegocio}</Text>
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <View style={{ flexDirection: "row", marginTop: 20 }}>
                  {[...Array(Math.round(averageRating || 0))].map((_, index) => (
                    <Ionicons key={index} name="star" color={colors.mainBlue} size={16} style={{ paddingRight: 3, paddingBottom: 1 }} />
                  ))}
                </View>
                <Text style={{ color: "#000", fontWeight: "bold", paddingLeft: 10 }}>
                  {averageRating} estrellas
                </Text>
                <Text
                  style={{ color: colors.placeHolder, paddingLeft: 5, textDecorationLine: "underline" }}
                  onPress={() => router.push({
                    pathname: "/(stacks)/(business)/(reviews_business)/reviews",
                    params: { businessId, businessName: businessData.nombreNegocio },
                  })}
                >
                  {totalReviews} reseñas
                </Text>
              </View>
              <Text
                onPress={() => router.push({
                  pathname: "/(stacks)/(business)/(reviews_business)/new",
                  params: { id: businessId },
                })}
                style={{ fontSize: 14, color: colors.mainBlue, textDecorationLine: "underline", marginTop: 10 }}
              >
                Escribir una reseña
              </Text>
            </View>

            <View style={{ width: "auto", flex: 1, alignItems: "flex-end" }}>
              <TouchableOpacity
                style={{ ...styles.button, width: 60, height: 38, alignItems: "center", justifyContent: "center" }}
                onPress={() => {
                  if (isFavorite) removeSaved(businessId);
                  else addFavorite({ id: businessId, name: businessData.nombreNegocio });
                }}
              >
                <Ionicons name={isFavorite ? "bookmark" : "bookmark-outline"} size={20} color={colors.mainBlue} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Promociones */}
          <View style={{ marginTop: 20, marginHorizontal: 5 }}>
            <Text style={styles.text}>Promociones activas</Text>
            <View style={{ marginTop: 15 }}>
              {activePromotions.length > 0 ? (
                activePromotions.map((promo, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => router.push({
                      pathname: "/(stacks)/customer_promotions/[promotion_id]",
                      params: {
                        promotion_id: promo.id,
                        name: promo.name,
                        description: promo.description,
                        times: promo.totalTokens,
                        start_date: promo.startDate,
                        end_date: promo.endDate,
                        tokens_earned: promo.tokensEarned,
                        business_id: businessId,
                      },
                    })}
                    style={styles.promotion}
                  >
                    <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }} numberOfLines={1} ellipsizeMode="tail">
                      {promo.name}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={{ color: colors.placeHolder, fontSize: 14 }}>
                  No hay promociones activas por el momento.
                </Text>
              )}
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            {/* Descripción */}
            <View style={{ ...styles.card, marginHorizontal: 5 }}>
              <Text style={styles.text}>Descripción</Text>
              <Text style={{ color: colors.regularText, fontSize: 16, padding: 10 }}>
                {businessData.descripcion}
              </Text>
            </View>

            {/* Ubicación */}
            {businessData.location && (
              <View style={styles.card}>
                <Text style={{ ...styles.text, marginBottom: 10 }}>Ubicación</Text>
                <MapView
                  onPress={openInMapNativeApp}
                  style={{ width: width * 0.8, height: width * 0.5, borderRadius: 12, alignSelf: "center" }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  rotateEnabled={false}
                  pitchEnabled={false}
                  initialRegion={{
                    latitude: businessData.location.latitude,
                    longitude: businessData.location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker coordinate={{ latitude: businessData.location.latitude, longitude: businessData.location.longitude }} />
                </MapView>
              </View>
            )}

            {/* Horario */}
            <View style={{ ...styles.card, marginHorizontal: 5 }}>
              <Text style={{ ...styles.text, alignSelf: "center", marginBottom: 10, fontSize: 17 }}>
                Horario
              </Text>
              {businessData.horario ? (
                Object.entries(businessData.horario).map(([day, slots]: [string, any]) => (
                  <View key={day} style={{ marginBottom: 8 }}>
                    <View style={{ flexDirection: "row", width: "100%" }}>
                      <Text style={{ fontWeight: "bold", color: "#000", fontSize: 14, textTransform: "capitalize" }}>
                        {day}
                      </Text>
                      <View style={{ flex: 1, alignItems: "flex-end" }}>
                        {slots.length === 0 ? (
                          <Text style={{ color: colors.placeHolder, fontSize: 12 }}>Cerrado</Text>
                        ) : (
                          slots.map((slot: any, index: number) => (
                            <Text style={{ color: colors.regularText, fontSize: 12 }} key={index}>
                              {slot.opening} - {slot.closing}
                            </Text>
                          ))
                        )}
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={{ color: colors.placeHolder, textAlign: "center" }}>Sin horario registrado</Text>
              )}
            </View>

            {/* Contacto */}
            <View style={{ ...styles.card, marginHorizontal: 10 }}>
              <Text style={{ ...styles.text, alignSelf: "center", marginBottom: 10 }}>Contacto</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                <TouchableOpacity style={{ paddingLeft: 10, flex: 1 }} onPress={sendWhatsApp}>
                  <Text style={{ fontSize: 14, color: "#313131" }}>{businessData.telefonoNegocio}</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row", marginTop: 15 }}>
                <Ionicons name="mail-outline" size={20} color={colors.mainBlue} />
                <Text style={{ ...styles.text, fontSize: 15, paddingLeft: 10 }}>{businessData.emailNegocio}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainImage: { width: 400, height: 400 },
  posterImage: {
    width: "100%",
    height: containerWidth * 0.6,
    resizeMode: "cover",
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
  name: { fontSize: 26, color: "#000000", fontWeight: "bold" },
  infoContainer: { flexDirection: "row" },
  button: {
    backgroundColor: colors.secondaryBlue,
    borderRadius: 12,
    marginVertical: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  promotion: {
    backgroundColor: colors.promotion,
    height: 45,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: colors.mainBlue,
    shadowOpacity: 0.42,
    shadowRadius: 10,
    justifyContent: "center",
  },
  text: { fontSize: 16, color: "#333" },
  card: { ...globalStyles.card, marginBottom: 15, padding: 15 },
  mapPlaceholder: {
    alignSelf: "center",
    alignItems: "center",
    margin: 10,
    height: 200,
    width: "100%",
    backgroundColor: colors.placeHolder,
    borderRadius: 5,
  },
});