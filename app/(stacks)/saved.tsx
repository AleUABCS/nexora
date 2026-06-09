import { colors, globalStyles } from "@/constants/global_styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFavoritesStore } from "../../store/saved_store";

export default function SavedBusinessView() {
  const router = useRouter();
  const { removeSaved, favorites } = useFavoritesStore();

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View style={globalStyles.secondContainer}>
        <Text
          style={{ ...globalStyles.titleText, marginTop: 50, marginBottom: 30 }}
        >
          Guardados
        </Text>
        
        <View style={{ ...globalStyles.card, maxHeight: "50%" }}>
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={globalStyles.listItem}>
                <TouchableOpacity
                  style={{ width: "80%" }}
                  onPress={() => router.push(`/(stacks)/(business)/${item.id}`)}
                >
                  <Text style={globalStyles.listItemText}>{item.name}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => removeSaved(item.id.toString())}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={24}
                    style={{ color: colors.warn }}
                  />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <Text
                style={{
                  textAlign: "center",
                  color: colors.placeHolder,
                  padding: 20,
                }}
              >
                No tienes negocios guardados aún.
              </Text>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}