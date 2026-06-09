import { globalStyles } from "@/constants/global_styles";
import { useRouter } from "expo-router";
import { 
  FlatList, 
  Image, 
  Text, 
  TouchableOpacity, 
  View 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { pickImages, useBusinessStore } from "../../store/business_store";

export default function BusinessImageView() {
  const router = useRouter();
  const { images, removeImage } = useBusinessStore();

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View style={globalStyles.secondContainer}>
        <Text style={globalStyles.titleText}>Fotos</Text>

        <View style={{ ...globalStyles.card, height: 500, marginTop: 20 }}>
          <FlatList
            data={images}
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
            // Alineación correcta para cuadrícula de 3 columnas
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", marginTop: 20, color: "#A0A0A0" }}>
                No hay fotos seleccionadas.
              </Text>
            }
            renderItem={({ item }) => (
              <View style={{ position: "relative" }}>
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

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => pickImages()}
          >
            <Text style={globalStyles.buttonText}>Añadir fotos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              ...globalStyles.button,
              marginLeft: 20,
            }}
            onPress={() => router.back()}
          >
            <Text style={globalStyles.buttonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}