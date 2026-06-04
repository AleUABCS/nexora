import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import appFirebase from "../../credenciales.js";
const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function BusinessScreen() {
  const router = useRouter();
  const [negocios, setNegocios] = useState<any[]>([]);

  useEffect(() => {
    const obtenerNegocios = async () => {
      const usuarioActual = auth.currentUser;

      if (!usuarioActual) {
        console.log("No hay usuario autenticado");
        return;
      }

      try {
        const userId = usuarioActual.uid;

        const consultaFiltrada = query(
          collection(db, "negocios"),
          where("userId", "==", userId),
        );

        const querySnapshot = await getDocs(consultaFiltrada);

        const lista = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setNegocios(lista);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      }
    };

    obtenerNegocios();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.titleSection}>
          <MaterialCommunityIcons name="storefront" size={80} color="#004EEB" />
          <Text style={styles.mainTitle}>Negocios</Text>
        </View>

        <View style={styles.cardTable}>
          {negocios.map((negocio, index) => (
            <View key={negocio.id} style={styles.tableRow}>
              <Text style={styles.businessName}>{negocio.nombreNegocio}</Text>

              <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={ () => router.push(`../(stacks)/(dashboard)/${'hola'}` as Href)}>
                  <Ionicons name="trending-up" size={18} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionButton}
                    onPress={() => router.push(`../(stacks)/(business)/${negocio.id}`)}
                    >
                  <Ionicons name="eye" size={18} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionButton}
                    onPress={() => router.push({
                    pathname: '/(stacks)/(business)/edit-business',
                    params: {id: negocio.id}
                  })}                  >
                  <Ionicons name="pencil" size={16} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={() => router.push({
                    pathname: '../(stacks)/(business)/promotions',
                    params: {id: negocio.id}
                  })}
                  >
                  <Ionicons name="pricetag" size={16} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push({
                    pathname: '../(stacks)/(business)/appointments/schedule',
                    params: {id: negocio.id}
                  })}
                >
                  <Ionicons name="calendar" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {index < negocios.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <Pressable
          style={styles.createButton}
          onPress={() => router.push("/add-business")}
        >
          <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Crear un negocio</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    fontSize: 16,
    color: "#333333",
    marginLeft: 8,
    fontWeight: "500",
  },
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 35,
    width: "100%",
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
    paddingTop: 24,
    paddingHorizontal: 20,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  tableRow: {
    width: "100%",
    marginBottom: 20,
  },
  businessName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#101828",
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
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
    shadowColor: "#004EEB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
