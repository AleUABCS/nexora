import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import appFirebase from "../../credentials.js";

const auth = getAuth(appFirebase);

const MENU_ITEMS = [
  { id: "1", title: "Guardados", icon: "bookmark-outline", route: "/saved" },
  {
    id: "2",
    title: "Reseñas publicadas",
    icon: "star-outline",
    route: "/(stacks)/(reviews)",
  },
  {
    id: "5",
    title: "Promociones",
    icon: "chip",
    source: require("../../assets/images/chip.png"),
    route: "/(stacks)/customer_promotions",
  },
];

export default function ProfileView() {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar la sesión.");
    }
  };

  return (
    <ScrollView
      style={styles.mainContainer}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatarBackground}>
          <Ionicons
            name="person"
            size={85}
            color="#4D82F3"
            style={styles.avatarIcon}
          />
        </View>
      </View>

      <View style={styles.card}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            activeOpacity={0.6}
            onPress={() => router.push(item.route as any)}
          >
            <View style={styles.iconWrapper}>
              {item.source ? (
                <Image source={item.source} style={{ width: 24, height: 24 }} />
              ) : (
                <Ionicons name={item.icon as any} size={22} color="#155EEF" />
              )}
            </View>
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out-outline" size={18} color="#D92D20" />
        <Text style={styles.signOutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#FFFFFF" },
  contentContainer: { alignItems: "center", paddingTop: 70, paddingBottom: 40 },
  avatarContainer: { marginBottom: 40 },
  avatarBackground: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#E4EFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarIcon: { marginTop: 15 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "85%",
    paddingVertical: 14,
    paddingHorizontal: 20,
    elevation: 4,
    marginBottom: 50,
  },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  iconWrapper: { width: 30, alignItems: "center" },
  menuText: {
    fontSize: 16,
    color: "#475467",
    fontWeight: "500",
    marginLeft: 14,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#FEF3F2",
    borderWidth: 1,
    borderColor: "#FECDCA",
  },
  signOutText: {
    fontSize: 14,
    color: "#B42318",
    fontWeight: "600",
    marginLeft: 8,
  },
});
