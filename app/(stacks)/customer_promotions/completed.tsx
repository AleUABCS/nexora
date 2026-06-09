import { colors, globalStyles } from "@/constants/global_styles";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const chip_icon = require("../../../assets/images/chip.png");

export default function CompletedPromotionView() {
  const { name, description } = useLocalSearchParams();
  const promotionName = (name as string) || "Promoción completada";
  const promotionDesc = (description as string) || "¡Felicidades! Has completado esta promoción.";

  return (
    <SafeAreaView style={{ ...globalStyles.mainContainer }}>
      <View style={{ ...globalStyles.secondContainer }}>
        <Text
          style={{
            ...globalStyles.titleText,
            fontSize: 28,
            color: colors.promotionText,
            marginTop: 50,
          }}
        >
          ¡Completado!
        </Text>

        <Text
          style={{
            ...globalStyles.titleText,
            fontSize: 28,
            color: colors.promotionText,
            marginTop: 50,
            textAlign: "center",
          }}
        >
          {promotionName}
        </Text>

        <View
          style={{
            ...globalStyles.card,
            marginTop: 30,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: colors.regularText,
              textAlign: "justify",
            }}
          >
            {promotionDesc}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            gap: 12,
            marginTop: 20,
          }}
        >
          <Image source={chip_icon} style={{ width: 65, height: 65 }} />
          <Text
            style={{
              flex: 1,
              fontSize: 14,
              color: colors.regularText,
              textAlign: "justify",
            }}
          >
            Has conseguido todas las fichas, informa al encargado del negocio
            para que haga válida la promoción.
          </Text>
        </View>

        <TouchableOpacity
          style={{
            ...globalStyles.button,
            height: 50,
            backgroundColor: colors.promotion,
            marginTop: 70,
          }}
          onPress={() => {
            router.dismissAll();
            router.push("/customer_promotions");
          }}
        >
          <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "bold" }}>
            Volver
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}