import { useFavoritesStore } from "@/store/saved-store";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../../components/Themed";
import { colors, globalStyles } from "../../../constants/globalStyles";
import appFirebase from "../../../credenciales.js";

const auth = getAuth(appFirebase)

const db = getFirestore(appFirebase);

const width = Dimensions.get("window").width;

const container_width = width;
const space = 10;

export default function BusinessView() {
  const [totalReviews, setTotalReviews] = useState(0);
  const [promedioRating, setPromedioRating] = useState(0);
  const { id } = useLocalSearchParams();
  const [negocio, setNegocio] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  const { addFavorite, removeSaved, favorites } = useFavoritesStore();
  const isFavorite = favorites.some((fav) => fav.id === (id as string));

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

  const sendWhatsApp = () => {
    const limpiaNumero = negocio.telefonoNegocio.replace(/[^0-9]/g, "");

    const phoneNumber = limpiaNumero;
    const message = "¡Hola! Me comunico desde la app Nexora.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert(
            "Error",
            "WhatsApp no está instalado en este dispositivo.",
          );
        }
      })
      .catch((err) => console.error("Error al abrir WhatsApp:", err));
  };

  useEffect(() => {
    const calcularPromedioYTotal = async () => {
      try {
        const q = query(
          collection(db, "reviews"),
          where("business_id", "==", id),
        );

        const countSnapshot = await getCountFromServer(q);
        const total = countSnapshot.data().count;
        setTotalReviews(total);

        if (total > 0) {
          const querySnapshot = await getDocs(q);
          let sumaReviews = 0;

          querySnapshot.forEach((doc) => {
            sumaReviews += doc.data().rating;
          });

          const promedio = sumaReviews / total;
          setPromedioRating(Number(promedio.toFixed(2)));
        } else {
          setPromedioRating(0);
        }
      } catch (error) {
        console.error("Error calculando el promedio:", error);
      }
    };

    if (id) calcularPromedioYTotal();
  }, [id]);

    const useCustomerPromotions = (business_id: string, user_id: string) => {
    const [promotions, setPromotions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const now = new Date();

      const ref = collection(db, 'negocios', business_id, 'promociones');
      const q = query(
        ref,
        where('endDate', '>=', Timestamp.fromDate(now))
      );

      const unsub = onSnapshot(q, async (snapshot) => {
        const data = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const d = docSnap.data();

            const userPromoRef = doc(db, 'userPromotions', `${user_id}_${docSnap.id}`);
            const userPromoSnap = await getDoc(userPromoRef);
            const tokensEarned = userPromoSnap.exists()
              ? userPromoSnap.data().tokensEarned
              : 0;

            return {
              id: docSnap.id,
              ...d,
              startDate: d.startDate?.toDate().toLocaleDateString('es-MX'),
              endDate: d.endDate?.toDate().toLocaleDateString('es-MX'),
              tokensEarned,
            };
          })
        );

        setPromotions(data);
        setLoading(false);
      });

      return () => unsub();
    }, [business_id, user_id]);

    return { promotions, loading };
  };

  const {promotions, loading} = useCustomerPromotions(id as string, auth.currentUser?.uid as string)

  if (cargando)
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  if (!negocio) return <Text>Negocio no encontrado</Text>;

  const business_data = {
    info: {
      business_id: id,
      name: negocio.nombreNegocio,
      rate: promedioRating,
      reviews: totalReviews,
      description: negocio.descripcion,
      email: negocio.emailNegocio,
      phone: negocio.telefonoNegocio,
    },
    coordinates: {
      // Coordenadas en latitud y longitud
      latitude: 24.1426,
      longitude: -110.3128,
    },
    promotions: [
      // Promociones con id y su nombre
      { id: 1, promotion_name: "Nombre de la promoción 1" },
      {
        id: 2,
        promotion_name:
          "Nombre de la promociódsaddasdasasdasdadsadasdsdssdsan dos",
      },
    ],
    shedule: {
      // Horario
      lunes: [
        { open: "07:00", close: "12:00" },
        { open: "01:00", close: "18:00" },
      ],
      martes: [{ open: "07:00", close: "12:00" }],
      miercoles: [{ open: "07:00", close: "12:00" }],
      jueves: [{ open: "07:00", close: "12:00" }],
      viernes: [{ open: "07:00", close: "12:00" }],
      sabado: [{ open: "07:00", close: "12:00" }],
      domingo: [{ open: "07:00", close: "12:00" }],
    },
  };


  
  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <ScrollView>
        {/* Carrusel con las fotos del negocio */}
        <View>
          <FlatList
            data={negocio.imagenes ?? []}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{}} // Estilos
            decelerationRate={0}
            scrollEventThrottle={16}
            snapToInterval={container_width}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <View style={{ width: container_width }}>
                  <View
                    style={{
                      marginHorizontal: space,
                      padding: space,
                      borderRadius: 34,
                      backgroundColor: "#FFFFFF",
                      alignItems: "center",
                    }}
                  >
                    <Image source={{ uri: item }} style={styles.posterImage} />
                  </View>
                </View>
              );
            }}
          />
        </View>
        <View style={{ ...globalStyles.secondContainer, marginTop: 0 }}>
          {/* Primer contenedor de la información */}
          <View style={{ ...styles.infoContainer, marginHorizontal: 0 }}>
            {/* Parte izquierda */}
            <View style={{ width: "60%" }}>
              <Text style={styles.name}>{business_data.info.name} </Text>
              {/* Estrellas con sus números */}
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                {/* Estrellas */}
                <View style={{ flexDirection: "row", marginTop: 20 }}>
                  {[...Array(Math.round(business_data.info.rate))].map(
                    (_, index) => (
                      <Ionicons
                        key={index}
                        name="star"
                        color={colors.mainBlue}
                        size={16}
                        style={{ paddingRight: 3, paddingBottom: 1 }}
                      ></Ionicons>
                    ),
                  )}
                </View>
                <Text
                  style={{ color: "#000", fontWeight: "bold", paddingLeft: 10 }}
                >
                  {" "}
                  {business_data.info.rate} estrellas
                </Text>
                <Text
                  style={{
                    color: colors.placeHolder,
                    paddingLeft: 5,
                    textDecorationLine: "underline",
                  }}
                  onPress={() =>
                    router.push({
                      pathname: "/(stacks)/(business)/(reviews)/reviews",
                      params: { business_id: business_data.info.business_id },
                    })
                  }
                >
                  {" "}
                  {business_data.info.reviews} reseñas{" "}
                </Text>
              </View>
              <Text
                onPress={() =>
                  router.push(
                    `/(reviews)/new?id=${business_data.info.business_id}`,
                  )
                }
                style={{
                  fontSize: 14,
                  color: colors.mainBlue,
                  textDecorationLine: "underline",
                  marginTop: 10,
                }}
              >
                Escribir una reseña
              </Text>
            </View>

            {/* Parte derecha (botones) */}
            <View style={{ width: "auto", flex: 1, alignItems: "flex-end" }}>
              <TouchableOpacity
                style={{
                  ...styles.button,
                  width: 60,
                  height: 38,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  if (isFavorite) {
                    removeSaved(id as string);
                  } else {
                    addFavorite({
                      id: business_data.info.business_id.toString(),
                      name: business_data.info.name,
                    });
                  }
                }}
              >
                <Ionicons
                  name={isFavorite ? "bookmark" : "bookmark-outline"}
                  size={20}
                  color={colors.mainBlue}
                />
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={{
                  ...styles.button,
                  height: 38,
                  width: 100,
                  marginTop: 15,
                }}
              >
                <Text style={{ color: colors.mainBlue, fontSize: 10 }}>
                  Agendar cita
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>

          {/* Promociones */}
          <View style={{ marginTop: 20, marginHorizontal: 5 }}>
            <Text style={styles.text}>Promociones activas </Text>
            <View style={{ marginTop: 15 }}>
              {promotions.map((promo, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    router.push({
                      pathname: `/customer-promotions/${promo.id}`,
                      params: {id: promo.id, name: promo.name, description: promo.description, times: promo.totalTokens, start_date: promo.startDate, end_date: promo.endDate, tokens_earned: promo.tokensEarned, business_id: business_data.info.business_id}
                    })
                    console.log ('id del negocio: ' + business_data.info.business_id)
                  }}
                  style={styles.promotion}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {promotions[index].name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tarjetas de información */}
          <View style={{ marginTop: 20 }}>
            {/* Descripción */}
            <View style={{ ...styles.card, marginHorizontal: 5 }}>
              <Text style={{ ...styles.text }}>Descripción</Text>
              <Text
                style={{ color: colors.regularText, fontSize: 16, padding: 10 }}
              >
                {business_data.info.description}
              </Text>
            </View>

            {/* Ubicación */}
            <View style={{ ...styles.card, marginHorizontal: 5 }}>
              <Text style={{ ...styles.text }}>Ubicación </Text>
              <View style={styles.mapPlaceholder}>
                <Text>Aquí va el mapa</Text>
              </View>
            </View>

            {/* Horario */}
            <View style={{ ...styles.card, marginHorizontal: 5 }}>
              <Text
                style={{
                  ...styles.text,
                  alignSelf: "center",
                  marginBottom: 10,
                  fontSize: 17,
                }}
              >
                Horario
              </Text>
              {negocio.horario ? (
                Object.entries(negocio.horario).map(
                  ([day, slots]: [string, any]) => (
                    <View key={day} style={{ marginBottom: 8 }}>
                      <View style={{ flexDirection: "row", width: "100%" }}>
                        <Text
                          style={{
                            fontWeight: "bold",
                            color: "#000",
                            fontSize: 14,
                          }}
                        >
                          {day === "lunes" && "Lunes"}
                          {day === "martes" && "Martes"}
                          {day === "miercoles" && "Miércoles"}
                          {day === "jueves" && "Jueves"}
                          {day === "viernes" && "Viernes"}
                          {day === "sabado" && "Sábado"}
                          {day === "domingo" && "Domingo"}
                        </Text>
                        <View style={{ flex: 1, alignItems: "flex-end" }}>
                          {slots.length === 0 ? (
                            <Text
                              style={{
                                color: colors.placeHolder,
                                fontSize: 12,
                              }}
                            >
                              Cerrado
                            </Text>
                          ) : (
                            slots.map((slot: any, index: number) => (
                              <Text
                                style={{
                                  color: colors.regularText,
                                  fontSize: 12,
                                }}
                                key={index}
                              >
                                {slot.opening} - {slot.closing}
                              </Text>
                            ))
                          )}
                        </View>
                      </View>
                    </View>
                  ),
                )
              ) : (
                <Text
                  style={{ color: colors.placeHolder, textAlign: "center" }}
                >
                  Sin horario registrado
                </Text>
              )}
            </View>

            {/* Contacto */}
            <View style={{ ...styles.card, marginHorizontal: 10 }}>
              <Text
                style={{
                  ...styles.text,
                  alignSelf: "center",
                  marginBottom: 10,
                }}
              >
                Contacto
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                <TouchableOpacity
                  style={{ paddingLeft: 10, flex: 1 }}
                  onPress={sendWhatsApp}
                >
                  <Text style={{ fontSize: 14, color: "#313131" }}>
                    {business_data.info.phone}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row", marginTop: 15 }}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.mainBlue}
                />
                <Text style={{ ...styles.text, fontSize: 15, paddingLeft: 10 }}>
                  {business_data.info.email}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainImage: {
    width: 400,
    height: 400,
  },
  posterImage: {
    width: "100%",
    height: container_width * 0.6,
    resizeMode: "cover",
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
  name: {
    fontSize: 26,
    color: "#000000",
    fontWeight: "bold",
  },
  infoContainer: {
    flexDirection: "row",
  },
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
  text: {
    fontSize: 16,
    color: "#333",
  },
  card: {
    ...globalStyles.card,
    marginBottom: 15,
    padding: 15,
  },
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
