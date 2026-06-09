import { colors } from "@/constants/global_styles";
import appFirebase from "@/credentials.js";
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  getFirestore,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const db = getFirestore(appFirebase);

const CATEGORIES = [
  { id: "1", name: "Abarrotes y Tienditas", icon: "store", type: "FontAwesome5" },
  { id: "2", name: "Barberías", icon: "cut", type: "Ionicons" },
  { id: "3", name: "Cafeterías", icon: "coffee", type: "FontAwesome5" },
  { id: "4", name: "Farmacias", icon: "medkit", type: "Ionicons" },
  { id: "5", name: "Ferreterías", icon: "hammer", type: "FontAwesome5" },
  { id: "6", name: "Gimnasios", icon: "dumbbell", type: "FontAwesome5" },
  { id: "7", name: "Mecánicos y Talleres", icon: "wrench", type: "FontAwesome5" },
  { id: "8", name: "Pizzerías", icon: "pizza-slice", type: "FontAwesome5" },
  { id: "9", name: "Purificadoras", icon: "water", type: "Ionicons" },
  { id: "10", name: "Veterinarias", icon: "paw", type: "FontAwesome5" },
];

export default function HomeView() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchBusinesses = async () => {
        try {
          let q;
          if (searchQuery.trim() === "") {
            q = collection(db, "negocios");
          } else {
            q = query(
              collection(db, "negocios"),
              where("nombreBusqueda", ">=", searchQuery.toLowerCase().trim()),
              where("nombreBusqueda", "<=", searchQuery.trim().toLowerCase() + "\uf8ff")
            );
          }
          const snapshot = await getDocs(q);
          setBusinesses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
          Alert.alert("Error", "No se pudieron cargar los negocios.");
        }
      };

      fetchBusinesses();
    }, [searchQuery])
  );

  const filteredBusinesses = selectedCategory
    ? businesses.filter((b) => b.categoriaNegocio?.toLowerCase() === selectedCategory.toLowerCase())
    : businesses;

  const registerClick = async (businessId: string) => {
    try {
      await addDoc(collection(db, "clicks_negocios"), {
        business_id: businessId,
        created_at: serverTimestamp(),
      });
    } catch (error) {}
  };

  const ListHeader = (
    <>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
          placeholderTextColor="#A0A0A0"
          onChangeText={setSearchQuery}
        />
        <Ionicons name="search" size={22} color="#A0A0A0" style={styles.searchIcon} />
      </View>

      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        style={{ marginBottom: 20 }}
        renderItem={({ item }) => {
          const isSelected = selectedCategory === item.name;
          return (
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => setSelectedCategory(isSelected ? null : item.name)}
            >
              <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
                {item.type === "FontAwesome5" && (
                  <FontAwesome5 name={item.icon} size={22} color={isSelected ? "#FFFFFF" : "#155EEF"} />
                )}
                {item.type === "Ionicons" && (
                  <Ionicons name={item.icon as any} size={24} color={isSelected ? "#FFFFFF" : "#155EEF"} />
                )}
                {item.type === "MaterialCommunityIcons" && (
                  <MaterialCommunityIcons name={item.icon as any} size={24} color={isSelected ? "#FFFFFF" : "#155EEF"} />
                )}
              </View>
              <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        <FlatList
          data={filteredBusinesses}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No hay negocios disponibles.
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                registerClick(item.id);
                router.push(`/(stacks)/(business)/${item.id}`);
              }}
            >
              <View style={styles.businessCard}>
                <Image
                  source={{ uri: item.imagenes?.[0] || "https://via.placeholder.com/130" }}
                  style={styles.businessImage}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.businessName} numberOfLines={1}>
                    {item.nombreNegocio}
                  </Text>
                  <View style={{ flexDirection: "row", marginBottom: 10 }}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Ionicons
                        key={i}
                        name={i < Math.round(item.ratingPromedio || 0) ? "star" : "star-outline"}
                        size={16}
                        color={colors.mainBlue}
                      />
                    ))}
                  </View>
                  <Text style={styles.businessDetail}>
                    {item.categoriaNegocio || "Sin categoría"}
                  </Text>
                  <Text style={styles.businessDetail} numberOfLines={2}>
                    {item.descripcion}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#FFFFFF" },
  innerContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },
  searchInput: { flex: 1, fontSize: 16 },
  searchIcon: { marginLeft: 10 },
  categoryButton: { alignItems: "center", width: 75, marginRight: 12 },
  iconContainer: {
    borderRadius: 8,
    width: 60,
    height: 60,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainerSelected: { backgroundColor: "#155EEF" },
  categoryText: { fontSize: 11, color: "#155EEF", textAlign: "center", fontWeight: "500" },
  categoryTextSelected: { fontWeight: "bold", color: "#003fbd" },
  businessCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  businessImage: { width: 130, height: 130, borderRadius: 12, marginRight: 20 },
  businessName: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  businessDetail: { fontSize: 13, color: "#667085", marginVertical: 3 },
});