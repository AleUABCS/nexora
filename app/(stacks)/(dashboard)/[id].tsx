import { colors, globalStyles } from "@/constants/global_styles";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";
import appFirebase from "../../../credentials.js";

const db = getFirestore(appFirebase);

export default function DashboardView() {
  const { id } = useLocalSearchParams();
  const businessId = id as string;

  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [businessData, setBusinessData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalClicks, setTotalClicks] = useState(0);
  const [todayClicks, setTodayClicks] = useState(0);
  const [yesterdayClicks, setYesterdayClicks] = useState(0);
  const [activePromotions, setActivePromotions] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!businessId) {
        setIsLoading(false);
        return;
      }

      const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
          const docRef = doc(db, "negocios", businessId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setBusinessData(docSnap.data());
          }

          // 2. Clicks Totales
          const qTotal = query(
            collection(db, "clicks_negocios"),
            where("business_id", "==", businessId)
          );
          const snapTotal = await getCountFromServer(qTotal);
          setTotalClicks(snapTotal.data().count);

          // 3. Clicks de Hoy y Ayer para la comparativa de porcentaje
          const startOfToday = new Date();
          startOfToday.setHours(0, 0, 0, 0);

          const startOfYesterday = new Date(startOfToday);
          startOfYesterday.setDate(startOfYesterday.getDate() - 1);

          const qToday = query(
            collection(db, "clicks_negocios"),
            where("business_id", "==", businessId),
            where("created_at", ">=", startOfToday)
          );
          const snapToday = await getCountFromServer(qToday);
          setTodayClicks(snapToday.data().count);

          const qYesterday = query(
            collection(db, "clicks_negocios"),
            where("business_id", "==", businessId),
            where("created_at", ">=", startOfYesterday),
            where("created_at", "<", startOfToday)
          );
          const snapYesterday = await getCountFromServer(qYesterday);
          setYesterdayClicks(snapYesterday.data().count || 1); 

          // 4. Clicks Semanales (Gráfica)
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
          sevenDaysAgo.setHours(0, 0, 0, 0);

          const qWeek = query(
            collection(db, "clicks_negocios"),
            where("business_id", "==", businessId),
            where("created_at", ">=", sevenDaysAgo)
          );
          const weekSnapshot = await getDocs(qWeek);

          const dayLabels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
          const daysCount: { [key: string]: number } = {};
          const daysOrder: string[] = [];

          for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayName = dayLabels[d.getDay()];
            daysCount[dayName] = 0;
            daysOrder.push(dayName);
          }

          weekSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.created_at) {
              const clickDate = data.created_at.toDate();
              const clickDayName = dayLabels[clickDate.getDay()];
              if (daysCount[clickDayName] !== undefined) {
                daysCount[clickDayName] += 1;
              }
            }
          });

          const formattedData = daysOrder.map((day) => ({
            value: daysCount[day],
            label: day,
            frontColor: colors.mainBlue,
            topLabelComponent: () => (
              <Text style={styles.chartTopLabel}>
                {daysCount[day] > 0 ? daysCount[day] : ""}
              </Text>
            ),
          }));
          setWeeklyData(formattedData);

          // 5. Métricas de Reseñas
          const qReviews = query(
            collection(db, "reviews"), 
            where("business_id", "==", businessId)
          );
          const reviewsCountSnap = await getCountFromServer(qReviews);
          const totalRev = reviewsCountSnap.data().count;
          setTotalReviews(totalRev);

          if (totalRev > 0) {
            const reviewsSnap = await getDocs(qReviews);
            let sumRatings = 0;
            reviewsSnap.forEach((doc) => {
              sumRatings += doc.data().rating;
            });
            setAverageRating(Number((sumRatings / totalRev).toFixed(1)));
          } else {
            setAverageRating(0);
          }

          // 6. Promociones Activas Reales
          const now = new Date();
          const qPromotions = query(
            collection(db, "negocios", businessId, "promociones"),
            where("endDate", ">=", Timestamp.fromDate(now))
          );
          const promosSnap = await getDocs(qPromotions);
          const promosData = promosSnap.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
          }));
          setActivePromotions(promosData);

        } catch (error) {
          Alert.alert("Error", "No se pudo cargar el panel de control. Revisa tu conexión a internet.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchDashboardData();
    }, [businessId])
  );

  if (isLoading)
    return (
      <ActivityIndicator
        size="large"
        style={{ marginTop: 50 }}
        color={colors.mainBlue}
      />
    );

  if (!businessData && !isLoading)
    return (
      <Text style={{ textAlign: "center", marginTop: 50 }}>
        Negocio no encontrado
      </Text>
    );

  const percentage = (todayClicks / yesterdayClicks) * 100;
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
            {businessData.nombreNegocio || "Nombre no disponible"}
          </Text>

          <View
            style={{
              flexDirection: "row",
              marginTop: 20,
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View style={{ width: "48%", justifyContent: "space-between" }}>
              <View style={{ ...styles.card, height: 200, width: "100%" }}>
                <Text style={{ ...styles.cardText, fontSize: 20 }}>
                  Clicks Totales
                </Text>
                <Text style={styles.cardInfoText}>{totalClicks}</Text>
              </View>

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
                    {averageRating}
                  </Text>
                  <Ionicons
                    name="star"
                    size={28}
                    color={colors.mainBlue}
                    style={{ marginLeft: 5 }}
                  />
                </View>
                <Text style={styles.smallText}>{totalReviews} Reseñas</Text>
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
                  {todayClicks}
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
                  {percentage.toFixed(0)}% respecto al día de ayer
                </Text>
              </View>
            </View>
          </View>

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
                data={weeklyData}
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

            {activePromotions.length > 0 ? (
              activePromotions.map((item) => (
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
  chartTopLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
});