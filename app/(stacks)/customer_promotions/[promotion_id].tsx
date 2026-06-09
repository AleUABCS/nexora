import { colors, globalStyles } from "@/constants/global_styles";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const chip_icon = require("../../../assets/images/chip.png");

export default function CustomerPromotionDetailView() {
  const { 
    id, 
    promotion_id, 
    name, 
    description, 
    times, 
    end_date: endDate, 
    tokens_earned: tokensEarned, 
    business_id: businessId 
  } = useLocalSearchParams();

  const activePromotionId = promotion_id || id;

  const safeTokensEarned = tokensEarned ? Number(tokensEarned) : 0;
  const safeNeededTokens = times ? Number(times) : 1;

  const promotionInfo = {
    name: name as string,
    description: description as string,
    completed: safeTokensEarned, 
    needed: safeNeededTokens, 
  };

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View style={globalStyles.secondContainer}>
        <Text
          style={{
            ...globalStyles.titleText,
            marginTop: 50,
            color: colors.promotionText,
          }}
        >
          {promotionInfo.name}
        </Text>
        <View style={{ ...globalStyles.card, marginTop: 40 }}>
          <Text style={{ fontSize: 16 }}>Descripción</Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.regularText,
              marginTop: 10,
              overflow: "scroll",
              maxHeight: 200,
            }}
          >
            {promotionInfo.description}
          </Text>
          <Text style={{ fontSize: 14, marginTop: 15 }}>
            Válida hasta el {endDate}
          </Text>
        </View>

        <View style={{ justifyContent: "center", flexDirection: "row", alignItems: "center" }}>
          <Image source={chip_icon} style={{ width: 65, height: 65 }} />
          <Text
            style={{
              fontSize: 12,
              color: colors.regularText,
              marginLeft: 10,
            }}
          >
            Tienes{" "}
          </Text>
          <Text style={{ fontSize: 12, color: "#000", fontWeight: "bold" }}>
            {promotionInfo.completed}/{promotionInfo.needed}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.regularText,
            }}
          >
            {" "}
            fichas de esta promoción
          </Text>
        </View>

        <TouchableOpacity
          style={{
            ...globalStyles.button,
            backgroundColor: colors.promotion,
            marginTop: 50,
            alignSelf: "flex-end",
          }}
          onPress={() => {
            router.push({
              pathname: `/customer_promotions/redeem`,
              params: { promotion_id: activePromotionId, business_id: businessId },
            });
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "bold" }}>
            Conseguir ficha
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}