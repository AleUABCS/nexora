import { colors, globalStyles } from "@/constants/global_styles";
import appFirebase from "@/credentials";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
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
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);
const chip_icon = require("../../../../assets/images/chip.png");

const useBusinessPromotions = (businessId: string) => {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!businessId) {
        setLoading(false);
        return;
      }

      const ref = collection(db, "negocios", businessId, "promociones");
      const unsub = onSnapshot(
        ref,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            startDate: doc.data().startDate?.toDate().toLocaleDateString("es-MX"),
            endDate: doc.data().endDate?.toDate().toLocaleDateString("es-MX"),
          }));
          setPromotions(data);
          setLoading(false);
        },
        (error) => {
          Alert.alert("Error", "No se pudieron cargar las promociones del negocio.");
          setLoading(false);
        }
      );

      return () => unsub();
    }, [businessId])
  );

  return { promotions, loading };
};

const useMyPromotions = (userId: string) => {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!userId) {
        setLoading(false);
        return;
      }

      const ref = collection(db, "userPromotions");
      const unsub = onSnapshot(
        ref,
        async (snapshot) => {
          try {
            const myDocs = snapshot.docs.filter((d) => d.id.startsWith(userId));
            const data = await Promise.all(
              myDocs.map(async (docSnap) => {
                const d = docSnap.data();
                const promoSnap = await getDoc(
                  doc(db, "negocios", d.business_id, "promociones", d.promotion_id)
                );
                const promo = promoSnap.data();

                return {
                  id: docSnap.id,
                  tokensEarned: d.tokensEarned,
                  isCompleted: d.isCompleted,
                  name: promo?.name,
                  description: promo?.description,
                  totalTokens: promo?.totalTokens,
                  startDate: promo?.startDate?.toDate().toLocaleDateString("es-MX"),
                  endDate: promo?.endDate?.toDate().toLocaleDateString("es-MX"),
                  businessId: d.business_id,
                };
              })
            );
            setPromotions(data);
          } catch (error) {
            Alert.alert("Error", "No se pudieron procesar tus promociones guardadas.");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          Alert.alert("Error", "Hubo un problema al conectar con el servidor.");
          setLoading(false);
        }
      );

      return () => unsub();
    }, [userId])
  );

  return { promotions, loading };
};

export default function PromotionView() {
  const { business_id } = useLocalSearchParams();
  const businessIdString = business_id as string;
  const router = useRouter();

  const { promotions: businessPromotions, loading: loadingBusiness } =
    useBusinessPromotions(businessIdString);
  
  const { promotions: myPromotions, loading: loadingMine } = useMyPromotions(
    auth.currentUser?.uid as string
  );

  if (loadingBusiness || loadingMine)
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View style={globalStyles.secondContainer}>
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <Image source={chip_icon} />
          <Text style={globalStyles.titleText}>Promociones en curso</Text>
        </View>

        <View style={{ ...globalStyles.card, maxHeight: "50%", marginTop: 20 }}>
          <FlatList
            data={businessPromotions}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", marginTop: 20, color: colors.placeHolder }}>
                No hay promociones activas en este momento.
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
                      pathname: "/promotions/promotion",
                      params: {
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        start_date: item.startDate,
                        end_date: item.endDate,
                        times: item.totalTokens,
                        business_id: businessIdString,
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

                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={chip_icon}
                      style={{ width: 26, height: 26 }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
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
            style={{
              ...globalStyles.button,
              width: "100%",
              backgroundColor: colors.promotion,
            }}
            onPress={() =>
              router.push({
                pathname: "/promotions/new",
                params: { business_id: businessIdString },
              })
            }
          >
            <Ionicons
              name="add"
              color="#FFFFFF"
              size={24}
              style={{ paddingRight: 5 }}
            />
            <Text style={globalStyles.buttonText}>Crear promoción</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              ...globalStyles.button,
              width: "100%",
              backgroundColor: colors.promotion,
            }}
            onPress={() => {
              router.push({
                pathname: "/promotions/redeem",
                params: { business_id: businessIdString },
              });
            }}
          >
            <Ionicons
              name="cash"
              color="#FFFFFF"
              size={24}
              style={{ paddingRight: 5 }}
            />
            <Text style={globalStyles.buttonText}>Canjear promoción</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}