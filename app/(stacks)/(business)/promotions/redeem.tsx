import { colors, globalStyles } from "@/constants/global_styles";
import appFirebase from "@/credentials";
import { router, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

export default function ValidatePromotionView() {
  const { business_id } = useLocalSearchParams();
  const businessId = business_id as string; 

  const [code, setCode] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  function handleInput(value: string, index: number) {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError(false);

    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(key: string, index: number) {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  const validateCode = async (inputCode: string, currentBusinessId: string) => {
    const codeRef = doc(db, "validationCodes", inputCode);
    const codeSnap = await getDoc(codeRef);

    if (!codeSnap.exists()) throw new Error("Código inválido");

    const { 
      user_id: userId, 
      promotion_id: promotionId, 
      used, 
      expiresAt 
    } = codeSnap.data();

    if (used) throw new Error("Este código ya fue usado");
    if (expiresAt.toDate() < new Date())
      throw new Error("Este código ya expiró");

    const promoRef = doc(
      db,
      "negocios",
      currentBusinessId,
      "promociones",
      promotionId
    );
    const promoSnap = await getDoc(promoRef);
    const { totalTokens } = promoSnap.data()!;

    const userPromoRef = doc(
      db,
      "userPromotions",
      `${userId}_${promotionId}`
    );

    const result = await runTransaction(db, async (tx) => {
      const userPromoSnap = await tx.get(userPromoRef);

      const currentTokens = userPromoSnap.exists()
        ? userPromoSnap.data().tokensEarned
        : 0;

      const newTokens = currentTokens + 1;
      const isCompleted = newTokens >= totalTokens;

      tx.set(
        userPromoRef,
        {
          user_id: userId,
          promotion_id: promotionId,
          business_id: currentBusinessId,
          tokensEarned: newTokens,
          isCompleted,
          completedAt: isCompleted ? serverTimestamp() : null,
        },
        { merge: true }
      );

      tx.update(codeRef, { used: true });

      return { newTokens, totalTokens, isCompleted };
    });

    return result;
  };

  async function handleValidate() {
    try {
      const result = await validateCode(code.join(""), businessId);

      if (result.isCompleted) {
        Alert.alert(
          "¡Promoción completada!",
          "Entrégale la promoción al cliente"
        );
      } else {
        Alert.alert(
          "Ficha agregada",
          `El cliente lleva ${result.newTokens} de ${result.totalTokens} fichas`
        );
      }
      router.back();
    } catch (error: any) {
      if (error.message === "Código inválido" || error.message === "Este código ya fue usado" || error.message === "Este código ya expiró") {
        setError(true);
        Alert.alert("Aviso", error.message);
      } else {
        Alert.alert("Error de conexión", "No se pudo validar el código en este momento. Inténtalo de nuevo.");
      }
    }
  }

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View style={globalStyles.secondContainer}>
        <Text style={styles.title}>Validar ficha</Text>
        <Text style={styles.text}>
          Ingresa el código de 4 dígitos que muestra el cliente para validar la
          ficha
        </Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputs.current[index] = ref;
              }}
              style={[styles.codeInput, error && styles.codeInputError]}
              value={digit}
              onChangeText={(val) => handleInput(val, index)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        {error && (
          <Text style={styles.errorText}>
            Código incorrecto o expirado, intenta de nuevo
          </Text>
        )}

        <TouchableOpacity
          style={{
            ...globalStyles.button,
            backgroundColor: colors.promotion,
            height: 50,
            marginTop: 40,
          }}
          onPress={handleValidate}
          disabled={code.some((d) => d === "")}
        >
          <Text style={{ ...globalStyles.buttonText }}>Validar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ ...globalStyles.button, height: 50 }}
          onPress={() => router.back()}
        >
          <Text style={{ ...globalStyles.buttonText }}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.regularText,
    alignSelf: "center",
    marginTop: 50,
  },
  text: {
    fontSize: 16,
    color: colors.regularText,
    alignSelf: "center",
    marginTop: 20,
    width: "80%",
    textAlign: "justify",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 40,
  },
  codeInput: {
    width: 60,
    height: 70,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.promotion,
    fontSize: 32,
    fontWeight: "500",
    color: colors.regularText,
  },
  codeInputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
  },
});