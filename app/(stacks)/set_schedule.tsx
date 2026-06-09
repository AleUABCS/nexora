import { colors, globalStyles } from "@/constants/global_styles";
import appFirebase from "@/credentials.js";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
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
import {
  emptySchedule,
  Schedule,
  TimeSlot,
  useBusinessStore,
} from "../../store/business_store";

const db = getFirestore(appFirebase);

const dayButtons: { label: string; key: keyof Schedule }[] = [
  { label: "Lu", key: "lunes" },
  { label: "Ma", key: "martes" },
  { label: "Mi", key: "miercoles" },
  { label: "Ju", key: "jueves" },
  { label: "Vi", key: "viernes" },
  { label: "Sa", key: "sabado" },
  { label: "Do", key: "domingo" },
];

export default function SetScheduleView() {
  const { setSchedule: saveToStore } = useBusinessStore();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<Schedule>(emptySchedule);
  const [selectedDay, setSelectedDay] = useState<keyof Schedule>("lunes");

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const docRef = doc(db, "negocios", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().horario) {
          setSchedule(docSnap.data().horario as Schedule);
        }
      } catch (error) {
        Alert.alert("Error", "No se pudo cargar el horario existente.");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [id]);

  const saveSchedule = async () => {
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
      Alert.alert("Error", "No se pudo guardar el horario.");
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = () => {
    const daySlots = schedule[selectedDay];
    const newId =
      daySlots.length > 0 ? Math.max(...daySlots.map((s) => s.id)) + 1 : 1;
    setSchedule((prev) => ({
      ...prev,
      [selectedDay]: [...daySlots, { id: newId, opening: "", closing: "" }],
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
    field: keyof TimeSlot,
    text: string,
  ) => {
    const formatted = text.replace(/[^0-9]/g, "").slice(0, 4);
    let displayValue = formatted;
    if (formatted.length >= 3) {
      displayValue = `${formatted.slice(0, 2)}:${formatted.slice(2)}`;
    }

    setSchedule((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((slot) =>
        slot.id === slotId ? { ...slot, [field]: displayValue } : slot,
      ),
    }));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={globalStyles.mainContainer}>
        <Text style={globalStyles.titleText}>Horario</Text>
        <View style={globalStyles.secondContainer}>
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

          <View style={globalStyles.card}>
            <Text style={{ ...styles.cardText, alignSelf: "center" }}>
              Horario
            </Text>
            <View style={globalStyles.horizontalLine} />
            {schedule[selectedDay].length === 0 ? (
              <Text style={styles.emptyText}>Sin horarios configurados</Text>
            ) : (
              schedule[selectedDay].map((slot, index) => (
                <View key={slot.id} style={styles.slotRow}>
                  <Text style={styles.cardText}>Bloque {index + 1}</Text>
                  <TextInput
                    style={styles.timeInput}
                    placeholder="00:00"
                    value={slot.opening}
                    onChangeText={(text) =>
                      handleTimeInput(slot.id, "opening", text)
                    }
                    keyboardType="numeric"
                  />
                  <Text style={styles.cardText}>a</Text>
                  <TextInput
                    style={styles.timeInput}
                    placeholder="00:00"
                    value={slot.closing}
                    onChangeText={(text) =>
                      handleTimeInput(slot.id, "closing", text)
                    }
                    keyboardType="numeric"
                  />
                  <TouchableOpacity onPress={() => removeScheduleSlot(slot.id)}>
                    <Ionicons
                      name="close-circle-outline"
                      color="#ff3333"
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
              ))
            )}
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
  cardText: { color: "#555555", fontSize: 16 },
  emptyText: {
    color: colors.placeHolder,
    textAlign: "center",
    marginVertical: 20,
  },
  dayButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  dayButton: {
    width: 38,
    height: 38,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  dayButtonActive: { backgroundColor: "#007AFF" },
  dayButtonText: { color: "#555555", fontSize: 14, fontWeight: "600" },
  dayButtonTextActive: { color: "#FFFFFF" },
  slotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  timeInput: { ...globalStyles.input, width: 70, height: 40 },
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
  addBlockButtonText: { color: "#A1A1A1", fontSize: 14, paddingLeft: 10 },
});
