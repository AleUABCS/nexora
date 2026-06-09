import { colors, globalStyles } from "@/constants/global_styles";
import appFirebase from "@/credentials";
import { router, useLocalSearchParams } from "expo-router";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const db = getFirestore(appFirebase);

export default function PromotionView() {
  const { 
    id, 
    name, 
    description, 
    start_date: startDate, 
    end_date: endDate, 
    times, 
    business_id: businessId 
  } = useLocalSearchParams();

  const promotionInfo = {
    name: name as string,
    description: description as string,
  };

  const alertOnDelete = () => {
    Alert.alert(
      "Eliminar promoción",
      "¿Estás seguro de que quieres eliminar esta promoción?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive", 
          onPress: () => {
            deletePromotion(businessId as string, id as string);
          },
        },
      ]
    );
  };

  const deletePromotion = async (businessId: string, promotionId: string) => {
    try {
      await deleteDoc(doc(db, "negocios", businessId, "promociones", promotionId));
      
      Alert.alert("Éxito", "La promoción ha sido eliminada correctamente.");
      router.back();
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar la promoción. Revisa tu conexión e intenta de nuevo.");
    }
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

          <View style={{ justifyContent: "center", marginTop: 20 }}>
            <Text>Fecha de inicio: {startDate}</Text>
            <Text>Fecha de fin: {endDate}</Text>
            <Text>Fichas necesarias: {times}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={{
            ...globalStyles.button,
            backgroundColor: colors.warn,
            marginTop: 50,
            alignSelf: "flex-end",
          }}
          onPress={alertOnDelete}
        >
          <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "bold" }}>
            Eliminar promoción
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}