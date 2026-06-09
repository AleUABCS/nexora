import { colors, globalStyles } from "@/constants/global_styles";
import appFirebase from "@/credentials.js";
import { useFocusEffect, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const db = getFirestore(appFirebase);
const auth = getAuth(appFirebase);

const chip_icon = require("../../../assets/images/chip.png");

export default function CustomerPromotionListView() {
  const router = useRouter();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        setLoading(false);
        return;
      }

      const ref = collection(db, "userPromotions");
      const unsub = onSnapshot(
        ref,
        async (snapshot) => {
          try {
            const myDocs = snapshot.docs.filter((d) => d.id.startsWith(uid));
            const data = await Promise.all(
              myDocs.map(async (docSnap) => {
                const d = docSnap.data();

                const promoSnap = await getDoc(
                  doc(
                    db,
                    "negocios",
                    d.business_id,
                    "promociones",
                    d.promotion_id,
                  ),
                );
                const promo = promoSnap.data();

                return {
                  id: docSnap.id,
                  tokensEarned: d.tokensEarned,
                  isCompleted: d.isCompleted,
                  name: promo?.name,
                  description: promo?.description,
                  totalTokens: promo?.totalTokens,
                  startDate: promo?.startDate
                    ?.toDate()
                    .toLocaleDateString("es-MX"),
                  endDate: promo?.endDate?.toDate().toLocaleDateString("es-MX"),
                  business_id: d.business_id,
                };
              }),
            );
            setPromotions(data);
          } catch (error) {
            Alert.alert("Error", "No se pudieron cargar tus promociones.");
          } finally {
            setLoading(false);
          }
        },
        () => {
          Alert.alert("Error", "Hubo un problema al conectar con el servidor.");
          setLoading(false);
        },
      );

      return () => unsub();
    }, []),
  );

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        style={{ marginTop: 50 }}
        color={colors.mainBlue}
      />
    );

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View style={globalStyles.secondContainer}>
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <Image source={chip_icon} />
          <Text style={globalStyles.titleText}> Promociones en curso</Text>
        </View>
        <View style={{ ...globalStyles.card, maxHeight: "50%", marginTop: 20 }}>
          <FlatList
            data={promotions}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text
                style={{
                  textAlign: "center",
                  color: colors.placeHolder,
                  marginTop: 10,
                }}
              >
                No tienes promociones activas.
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
                  onPress={() => {
                    router.push({
                      pathname: "/customer_promotions/[promotion_id]",
                      params: {
                        promotion_id: item.id,
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        times: item.totalTokens,
                        end_date: item.endDate,
                        tokens_earned: item.tokensEarned,
                        business_id: item.business_id,
                      },
                    });
                  }}
                >
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ ...globalStyles.listItemText, maxWidth: "80%" }}
                  >
                    {item.name}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={chip_icon}
                      style={{ width: 26, height: 26 }}
                    />
                    <Text style={{ marginLeft: 5 }}>
                      {item.tokensEarned}/{item.totalTokens}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
