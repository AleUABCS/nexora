import { colors, globalStyles } from "@/constants/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BusinessReviewView() {

  const {business_id} = useLocalSearchParams()

  const business_name = "Nombre del negocio";

  const reviews = [
    { review_id: 1, stars: 4, description: "Descripción de la reseña 1", username: "User name 1" },
    { review_id: 2, stars: 5, description: "Descripción de la reseña 2", username: "Nombre de usuario 2" },
  ];

  const renderStars = (count: number) => (
    <View style={{ flexDirection: "row", marginBottom: 15 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Ionicons
          key={i}
          name={i < count ? "star" : "star-outline"}
          size={16}
          color={colors.mainBlue}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.mainContainer}>

        <View style = {{marginTop: 15, height: '100%'}}>
          <Text style={{ ...globalStyles.titleText, marginTop: 20, marginBottom: 15}}>{business_name}</Text>
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.review_id.toString()}
            contentContainerStyle={{ paddingTop: 20 }}
            renderItem={({ item }) => (
              <View style={{ ...globalStyles.card, marginBottom: 12, marginHorizontal: 10 }}>
                <Text style={{ fontWeight: "bold", marginBottom: 8 }}>{item.username}</Text>
                {renderStars(item.stars)}
                <Text>{item.description}</Text>
              </View>
            )}
          />          
        </View>
        
      </SafeAreaView>
  );
}