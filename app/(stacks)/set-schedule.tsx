import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { emptySchedule, useBusinessStore } from "../../store/business-store";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, globalStyles } from "../../constants/globalStyles";
import appFirebase from "../../credenciales.js";

const db = getFirestore(appFirebase);

type DayKey =
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes"
  | "sabado"
  | "domingo";

type TimeSlot = {
  id: number;
  opening: string;
  closing: string;
};

type Schedule = {
  [key in DayKey]: TimeSlot[];
};

const dayButtons: { label: string; key: DayKey }[] = [
  { label: "Lu", key: "lunes" },
  { label: "Ma", key: "martes" },
  { label: "Mi", key: "miercoles" },
  { label: "Ju", key: "jueves" },
  { label: "Vi", key: "viernes" },
  { label: "Sa", key: "sabado" },
  { label: "Do", key: "domingo" },
];

export default function SetSchedule() {
  const { setSchedule: saveToStore } = useBusinessStore();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<Schedule>(emptySchedule);
  const [selectedDay, setSelectedDay] = useState<DayKey>("lunes");

  // Cargar horario existente si viene con id (edición)
  useEffect(() => {
    const cargarHorario = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const docRef = doc(db, "negocios", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().horario) {
          setSchedule(docSnap.data().horario as Schedule);
        }
      } catch (error) {
        console.error("Error al cargar horario:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarHorario();
  }, [id]);

  const saveSchedule = async () => {
    // Si no hay id (viene del registro), solo regresa
    // El horario se guardará cuando se registre el negocio (pendiente integrar con store)
    if (!id) {
      saveToStore(schedule); 
      router.back();
      return;
    }

    try {
      setLoading(true);
      const docRef = doc(db, "negocios", id);
      await updateDoc(docRef, { horario: schedule });
      Alert.alert("Éxito", "Horario guardado correctamente.");
      router.back();
    } catch (error) {
      console.error("Error al guardar horario:", error);
      Alert.alert("Error", "No se pudo guardar el horario.");
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = () => {
    const newId =
      Math.max(0, ...schedule[selectedDay].map((s) => s.id || 0)) + 1;
    setSchedule((prev) => ({
      ...prev,
      [selectedDay]: [
        ...prev[selectedDay],
        { id: newId, opening: "", closing: "" },
      ],
    }));
  };

  const removeScheduleSlot = (slotId: number) => {
    setSchedule((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].filter((s) => s.id !== slotId),
    }));
  };

  const handleTimeInput = (
    slotId: number,
    field: "opening" | "closing",
    text: string,
  ) => {
    const numbers = text.replace(/[^0-9]/g, "");
    if (numbers.length > 4) return;

    let formatted = numbers;
    if (numbers.length >= 3) {
      formatted = numbers.slice(0, 2) + ":" + numbers.slice(2);
    }

    setSchedule((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((slot) =>
        slot.id === slotId ? { ...slot, [field]: formatted } : slot,
      ),
    }));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={globalStyles.mainContainer}>
        <Text style={globalStyles.titleText}>Horario</Text>

        <View style={globalStyles.secondContainer}>
          {/* Tarjeta de días */}
          <View style={globalStyles.card}>
            <Text style={{ ...styles.cardText, alignSelf: "center" }}>
              Días
            </Text>
            <View style={globalStyles.horizontalLine} />
            <View style={styles.dayButtonsContainer}>
              {dayButtons.map(({ label, key }) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.dayButton,
                    selectedDay === key && styles.dayButtonActive,
                  ]}
                  onPress={() => setSelectedDay(key)}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      selectedDay === key && styles.dayButtonTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tarjeta de horario */}
          <View style={globalStyles.card}>
            <Text style={{ ...styles.cardText, alignSelf: "center" }}>
              Horario
            </Text>
            <View style={globalStyles.horizontalLine} />

            <View>
              <View
                style={{ justifyContent: "space-around", alignItems: "center" }}
              >
                {schedule[selectedDay].length === 0 ? (
                  <Text
                    style={{
                      ...styles.cardText,
                      marginVertical: 20,
                      color: colors.placeHolder,
                      textAlign: "center",
                    }}
                  >
                    Sin horarios configurados
                  </Text>
                ) : (
                  schedule[selectedDay].map((slot, index) => (
                    <View
                      key={slot.id}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        marginTop: 15,
                      }}
                    >
                      <Text style={styles.cardText}>Bloque {index + 1}</Text>

                      <TextInput
                        style={{ ...globalStyles.input, width: 70, height: 40 }}
                        placeholder="00:00"
                        placeholderTextColor={colors.placeHolder}
                        value={slot.opening}
                        onChangeText={(text) =>
                          handleTimeInput(slot.id, "opening", text)
                        }
                        keyboardType="numeric"
                        maxLength={5}
                      />

                      <Text style={styles.cardText}>a</Text>

                      <TextInput
                        style={{ ...globalStyles.input, width: 70, height: 40 }}
                        placeholder="00:00"
                        placeholderTextColor={colors.placeHolder}
                        value={slot.closing}
                        onChangeText={(text) =>
                          handleTimeInput(slot.id, "closing", text)
                        }
                        keyboardType="numeric"
                        maxLength={5}
                      />

                      <TouchableOpacity
                        onPress={() => removeScheduleSlot(slot.id)}
                        style={{
                          width: 32,
                          height: 32,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons
                          name="close-circle-outline"
                          color="#ff3333"
                          size={24}
                        />
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>
            </View>

            <TouchableOpacity
              style={styles.addBlockButton}
              onPress={addTimeSlot}
            >
              <Ionicons name="add-outline" color={colors.placeHolder} />
              <Text style={styles.addBlockButtonText}>Agregar bloque</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{
              ...globalStyles.button,
              width: 200,
              alignSelf: "flex-end",
              opacity: loading ? 0.6 : 1,
            }}
            onPress={saveSchedule}
            disabled={loading}
          >
            <Text style={globalStyles.buttonText}>
              {loading ? "Guardando..." : "Guardar horario"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  dayButton: {
    width: 38,
    height: 38,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 0,
  },
  cardText: {
    color: "#555555",
    fontSize: 16,
  },
  dayButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addBlockButton: {
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#B5B5B5",
    borderRadius: 10,
    flexDirection: "row",
    height: 50,
  },
  addBlockButtonText: {
    color: "#A1A1A1",
    fontSize: 14,
    marginVertical: 5,
    paddingLeft: 10,
  },
  dayButtonActive: {
    backgroundColor: "#007AFF",
  },
  dayButtonText: {
    color: "#555555",
    fontSize: 14,
    fontWeight: "600",
  },
  dayButtonTextActive: {
    color: "#FFFFFF",
  },
});
