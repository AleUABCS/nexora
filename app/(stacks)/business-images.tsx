import { globalStyles } from "@/constants/globalStyles";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBusinessStore } from "../../store/business-store";

export default function BusinessImagesScreen() {
  const { images, addImage, removeImage } = useBusinessStore();

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View style={globalStyles.secondContainer}>
        <Text style={globalStyles.titleText}>Fotos</Text>

        <View style={{...globalStyles.card, height: 500, marginTop: 20}}>
          <FlatList
            data={images}
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle = {{flexWrap: 'wrap', flexDirection: "column"}}
            renderItem={({ item }) => (
              <View style={{ position: "relative", margin: 5}}>
                <Image
                  source={{ uri: item }}
                  style={{ width: 100, height: 100, borderRadius: 8 }}
                />
                <TouchableOpacity
                  onPress={() => removeImage(item)}
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    borderRadius: 10,
                    padding: 2,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 12 }}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
