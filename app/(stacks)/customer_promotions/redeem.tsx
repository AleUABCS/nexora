import { colors, globalStyles } from "@/constants/global_styles";
import appFirebase from "@/credentials";
import { router, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

const chip_icon = require("../../../assets/images/chip.png");

export default function RedeemView() {
  const [code, setCode] = useState<string>("");
  const [loadingCode, setLoadingCode] = useState(true);
  const { promotion_id, business_id } = useLocalSearchParams();
  const promotionId = promotion_id as string;
  const businessId = business_id as string;

  const generateValidationCode = async (userId: string, promoId: string, busId: string) => {
    const generatedCode = String(Math.floor(1000 + Math.random() * 9000));
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    await setDoc(doc(db, "validationCodes", generatedCode), {
      code: generatedCode,
      user_id: userId,
      promotion_id: promoId,
      business_id: busId,
      createdAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(expiresAt),
      used: false,
    });

    return generatedCode;
  };

  useEffect(() => {
    const init = async () => {
      const uid = auth.currentUser?.uid;
      if (uid && promotionId && businessId) {
        const generatedCode = await generateValidationCode(uid, promotionId, businessId);
        setCode(generatedCode);
        setLoadingCode(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!code) return;

    const interval = setInterval(async () => {
      try {
        const codeSnap = await getDoc(doc(db, "validationCodes", code));
        if (codeSnap.exists() && codeSnap.data().used === true) {
          clearInterval(interval);
          router.dismissAll();
          router.replace(`/customer_promotions/completed?promotion-id=${promotionId}`);
        }
      } catch (error) {
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [code]);

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View style={globalStyles.secondContainer}>
        <Image
          source={chip_icon}
          style={{ width: 120, height: 120, alignSelf: "center", marginTop: 50 }}
        />
        <Text style={styles.text}>
          Muéstrale este código al encargado del negocio para obtener tu ficha.
        </Text>

        <View style={{ ...globalStyles.card, alignItems: "center", marginTop: 40 }}>
          <Text style={{ color: colors.regularText, fontSize: 16 }}>Código</Text>
          <Text style={styles.codeText}>
            {loadingCode ? "..." : code}
          </Text>
          <Text style={styles.infoText}>
            Al conseguir esta ficha se hará válida la promoción.
          </Text>
        </View>

        <TouchableOpacity
          style={{ ...globalStyles.button, backgroundColor: colors.promotion, height: 50 }}
          onPress={() => router.back()}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>Volver</Text>
        </TouchableOpacity>

        <Text style={styles.text}>Este código será válido durante 5 minutos.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: colors.regularText,
    alignSelf: "center",
    marginTop: 20,
    width: "80%",
    textAlign: "justify",
  },
  codeText: {
    color: colors.regularText,
    fontSize: 42,
    fontWeight: "500",
    marginTop: 20,
  },
  infoText: {
    color: colors.promotion,
    fontSize: 14,
    marginTop: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
});