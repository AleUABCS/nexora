import { colors, globalStyles } from "@/constants/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import {
    collection,
    doc,
    getCountFromServer,
    getDoc,
    getDocs,
    getFirestore,
    query,
    where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";
import appFirebase from "../../../credenciales.js";

const db = getFirestore(appFirebase);

export default function DashboardView() {
  const [datosSemana, setDatosSemana] = useState<any[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [promedioRating, setPromedioRating] = useState(0);
  const { id } = useLocalSearchParams();
  const [negocio, setNegocio] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [clicksTotales, setClicksTotales] = useState(0);
  const [clicksHoy, setClicksHoy] = useState(0);

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

    if (id) {
      obtenerNegocio();
    } else {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    const calcularMetricasClicks = async () => {
      try {
        // 1. Clicks Totales
        const qTotal = query(
          collection(db, "clicks_negocios"),
          where("business_id", "==", id),
        );
        const snapTotal = await getCountFromServer(qTotal);
        setClicksTotales(snapTotal.data().count);

        // 2. Clicks de Hoy
        const inicioDeHoy = new Date();
        inicioDeHoy.setHours(0, 0, 0, 0);

        const qHoy = query(
          collection(db, "clicks_negocios"),
          where("business_id", "==", id),
          where("created_at", ">=", inicioDeHoy),
        );
        const snapHoy = await getCountFromServer(qHoy);
        setClicksHoy(snapHoy.data().count);

        // 3. Clicks Semanales
        const sieteDiasAtras = new Date();
        sieteDiasAtras.setDate(sieteDiasAtras.getDate() - 6);
        sieteDiasAtras.setHours(0, 0, 0, 0);

        const qSemana = query(
          collection(db, "clicks_negocios"),
          where("business_id", "==", id),
          where("created_at", ">=", sieteDiasAtras),
        );

        const querySnapshot = await getDocs(qSemana);

        const diasLetras = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
        const conteoDias: { [key: string]: number } = {};
        const ordenDias: string[] = [];

        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const nombreDia = diasLetras[d.getDay()];
          conteoDias[nombreDia] = 0;
          ordenDias.push(nombreDia);
        }

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.created_at) {
            const fechaClick = data.created_at.toDate();
            const nombreDiaClick = diasLetras[fechaClick.getDay()];
            if (conteoDias[nombreDiaClick] !== undefined) {
              conteoDias[nombreDiaClick] += 1;
            }
          }
        });

        const datosFormateados = ordenDias.map((dia) => ({
          value: conteoDias[dia],
          label: dia,
          frontColor: colors.mainBlue,
          topLabelComponent: () => (
            <Text
              style={{
                fontSize: 10,
                fontWeight: "bold",
                marginBottom: 4,
                color: "#333",
              }}
            >
              {conteoDias[dia] > 0 ? conteoDias[dia] : ""}
            </Text>
          ),
        }));

        setDatosSemana(datosFormateados);
      } catch (error) {
        console.error("Error calculando métricas de clicks:", error);
      }
    };

    if (id) calcularMetricasClicks();
  }, [id]);

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
          let sumaCalificaciones = 0;

          querySnapshot.forEach((doc) => {
            sumaCalificaciones += doc.data().rating;
          });

          const promedio = sumaCalificaciones / total;
          setPromedioRating(Number(promedio.toFixed(1)));
        } else {
          setPromedioRating(0);
        }
      } catch (error) {
        console.error("Error calculando el promedio:", error);
      }
    };

    if (id) calcularPromedioYTotal();
  }, [id]);

  if (cargando)
    return (
      <ActivityIndicator
        size="large"
        style={{ marginTop: 50 }}
        color={colors.mainBlue}
      />
    );

  if (!negocio && !cargando)
    return (
      <Text style={{ textAlign: "center", marginTop: 50 }}>
        Negocio no encontrado
      </Text>
    );

  // Datos mockeados y calculados
  const info = {
    business_id: id,
    name: negocio?.nombreNegocio || "Nombre no disponible",
    clicks: clicksTotales, // Actualizado a total real
    rate: promedioRating,
    reviews: totalReviews,
    active_promotions: [
      { id: 1, name: "Nombre promoción 1", redeemed: 3 },
      { id: 2, name: "Promoción 2 nombre", redeemed: 1 },
    ],
    clicksPastDay: 1222,
    clicksNow: clicksHoy,
  };

  const percentage = (info.clicksNow / info.clicksPastDay) * 100;
  const barValue = Math.min(percentage, 100);

  const data = [
    {
      value: barValue,
      label: "",
      topLabelComponent: () => (
        <Text style={{ fontSize: 12, fontWeight: "bold" }}>
          {percentage.toFixed(0)}%
        </Text>
      ),
    },
  ];

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      {/* Añadimos un ScrollView para que no se desborde el contenido si la pantalla es pequeña */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      >
        <View style={globalStyles.secondContainer}>
          <Text
            style={{
              ...globalStyles.titleText,
              marginTop: 10,
              fontSize: 32,
              textAlign: "center",
            }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {info.name}
          </Text>

          {/* Tarjetas Superiores (Totales, Calificación, Clicks Hoy) */}
          <View
            style={{
              flexDirection: "row",
              marginTop: 20,
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View style={{ width: "48%", justifyContent: "space-between" }}>
              {/* Clicks totales */}
              <View style={{ ...styles.card, height: 200, width: "100%" }}>
                <Text style={{ ...styles.cardText, fontSize: 20 }}>
                  Clicks Totales
                </Text>
                <Text style={styles.cardInfoText}>{info.clicks}</Text>
              </View>

              {/* Calificación */}
              <View style={{ ...styles.card, height: 200, width: "100%" }}>
                <Text style={{ ...styles.cardText, fontSize: 20 }}>
                  Calificación
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                >
                  <Text style={{ ...styles.cardInfoText, marginTop: 0 }}>
                    {info.rate}
                  </Text>
                  <Ionicons
                    name="star"
                    size={28}
                    color={colors.mainBlue}
                    style={{ marginLeft: 5 }}
                  />
                </View>

                <Text style={styles.smallText}>{info.reviews} Reseñas</Text>
              </View>
            </View>

            <View style={{ width: "48%" }}>
              <View
                style={{
                  ...styles.card,
                  height: 410,
                  width: "100%",
                  padding: 10,
                }}
              >
                <Text
                  style={{ ...styles.cardText, fontSize: 20, marginBottom: 5 }}
                >
                  Clicks hoy
                </Text>
                <Text
                  style={{
                    ...styles.cardInfoText,
                    marginTop: 0,
                    marginBottom: 20,
                  }}
                >
                  {info.clicksNow}
                </Text>

                <BarChart
                  data={data}
                  barWidth={60}
                  maxValue={100}
                  noOfSections={5}
                  formatYLabel={(val) => Math.round(Number(val)).toString()}
                  barBorderRadius={6}
                  frontColor={colors.mainBlue}
                  yAxisThickness={1}
                  xAxisThickness={1}
                  width={80}
                  height={150}
                  overflowTop={20}
                  spacing={0}
                  yAxisTextStyle={{ fontSize: 10 }}
                  hideRules
                />

                <Text
                  style={{
                    ...styles.smallText,
                    fontSize: 11,
                    width: "100%",
                    marginTop: 15,
                  }}
                >
                  {percentage.toFixed(0)}% respecto al mismo día de la semana
                  pasada
                </Text>
              </View>
            </View>
          </View>

          {/* Nueva Tarjeta: Rendimiento Semanal */}
          <View
            style={{
              ...styles.card,
              width: "100%",
              height: 260,
              marginTop: 15,
              paddingVertical: 15,
            }}
          >
            <Text
              style={{
                ...styles.cardText,
                fontSize: 20,
                marginBottom: 15,
                textAlign: "left",
                width: "100%",
                paddingHorizontal: 10,
              }}
            >
              Visitas de la semana
            </Text>

            <View style={{ alignSelf: "center", marginLeft: -20 }}>
              <BarChart
                data={datosSemana}
                barWidth={22}
                spacing={18}
                barBorderRadius={4}
                dashGap={0}
                yAxisThickness={0}
                xAxisThickness={1}
                xAxisColor={"#E5E5E5"}
                yAxisTextStyle={{ color: colors.placeHolder, fontSize: 10 }}
                xAxisLabelTextStyle={{
                  color: colors.regularText,
                  fontSize: 11,
                  fontWeight: "500",
                }}
                height={140}
                hideRules
                noOfSections={3}
              />
            </View>
          </View>

          {/* Tarjeta inferior: Promociones */}
          <View
            style={{
              ...styles.card,
              minHeight: 250,
              marginTop: 10,
              width: "100%",
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{ ...styles.cardText, marginBottom: 20, fontSize: 22 }}
            >
              Promociones activas
            </Text>

            {info.active_promotions.length > 0 ? (
              info.active_promotions.map((item) => (
                <View key={item.id} style={{ width: "100%", marginBottom: 15 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        ...styles.cardText,
                        fontSize: 14,
                        textAlign: "left",
                        flex: 1,
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        ...styles.smallText,
                        fontSize: 11,
                        marginTop: 0,
                        color: colors.placeHolder,
                      }}
                    >
                      {item.redeemed} canjeadas
                    </Text>
                  </View>
                  <View
                    style={{
                      ...globalStyles.horizontalLine,
                      width: "100%",
                      marginTop: 10,
                    }}
                  />
                </View>
              ))
            ) : (
              <Text style={{ textAlign: "center", color: colors.placeHolder }}>
                No hay promociones activas
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    ...globalStyles.card,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  cardText: {
    fontSize: 24,
    color: colors.regularText,
    textAlign: "center",
  },
  cardInfoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    marginTop: 10,
  },
  smallText: {
    fontSize: 14,
    color: colors.regularText,
    textAlign: "center",
    marginTop: 10,
  },
});
