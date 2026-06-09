import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import appFirebase from "../../credentials.js";
import { globalStyles } from "../../constants/global_styles";

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

export default function BusinessManagementView() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchBusinesses = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        try {
          const q = query(
            collection(db, "negocios"),
            where("userId", "==", currentUser.uid),
          );
          const snapshot = await getDocs(q);
          setBusinesses(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
          );
        } catch (error) {
          Alert.alert("Error", "No se pudieron cargar tus negocios.");
        }
      };

      fetchBusinesses();
    }, []),
  );

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.titleSection}>
          <MaterialCommunityIcons name="storefront" size={80} color="#004EEB" />
          <Text style={styles.mainTitle}>Negocios</Text>
        </View>

        <View style={styles.cardTable}>
          {businesses.map((business, index) => (
            <View key={business.id} style={styles.tableRow}>
              <Text style={styles.businessName}>{business.nombreNegocio}</Text>

              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    router.push(`/(stacks)/(dashboard)/${business.id}`)
                  }
                >
                  <Ionicons name="trending-up" size={18} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    router.push(`/(stacks)/(business)/${business.id}`)
                  }
                >
                  <Ionicons name="eye" size={18} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    router.push({
                      pathname: "/(stacks)/(business)/edit_business",
                      params: { id: business.id },
                    })
                  }
                >
                  <Ionicons name="pencil" size={16} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    router.push({
                      pathname: "/(stacks)/(business)/promotions",
                      params: { business_id: business.id },
                    })
                  }
                >
                  <Ionicons name="pricetag" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {index < businesses.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <Pressable
          style={styles.createButton}
          onPress={() => router.push("/add_business")}
        >
          <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Crear un negocio</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, paddingTop: 60, backgroundColor: "#FFFFFF" },
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 35,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "500",
    color: "#555555",
    marginLeft: 16,
  },
  cardTable: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "100%",
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 40,
  },
  tableRow: { width: "100%", marginBottom: 20 },
  businessName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#101828",
    marginBottom: 10,
  },
  actionsContainer: { flexDirection: "row", gap: 8, marginBottom: 16 },
  actionButton: {
    backgroundColor: "#004EEB",
    width: 38,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#E4E7EC",
    width: "100%",
    marginTop: 4,
  },
  createButton: {
    flexDirection: "row",
    backgroundColor: "#004EEB",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    elevation: 3,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
