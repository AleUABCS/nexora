import { colors, globalStyles } from "@/constants/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import { addDoc, collection, getFirestore, serverTimestamp, Timestamp } from "firebase/firestore";
import { useState } from "react";
import { Alert, Image, Keyboard, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import appFirebase from "../../../../credenciales.js";

const db = getFirestore(appFirebase);
const auth = getAuth(appFirebase)

const chip_icon = require('../../../../assets/images/chip.png')

export default function NewPromotionView () {
    const {business_id} = useLocalSearchParams()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [times, setTimes] = useState(1)

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStart, setShowStart] = useState(Platform.OS === 'ios');
    const [showEnd, setShowEnd] = useState(Platform.OS === 'ios');

    const createPromotion = async (business_id: any, data: any) => {
        // Guardar promoción en el back
        const {name, description, startDate, endDate, times } = data
        const ref = collection(db, 'negocios', business_id, 'promociones')

        if (name == '' && description == '') {
            Alert.alert('Campos vacíos', 'Tienes que llenar todos los campos')
        } else {

            
            await addDoc(ref, {
                name,
                description,
                startDate : Timestamp.fromDate(new Date(startDate)),
                endDate : Timestamp.fromDate(new Date(endDate)),
                totalTokens: Number(times),
                isActive: true,
                createdBy: auth.currentUser?.uid,
                createdAt: serverTimestamp()
            })
            
            // console.log(name, description, startDate, endDate, times)
            router.back()
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={globalStyles.mainContainer}>
                <ScrollView>
                    <View style={globalStyles.secondContainer}>

                        <Image source={chip_icon} style={{ width: 65, height: 65, marginTop: 30, alignSelf: 'center' }} />
                        <Text style={{ ...globalStyles.titleText, marginTop: 30, fontSize: 24, color: colors.regularText }}>Publicar una promoción</Text>

                        <View style={{ marginTop: 40 }} />

                        <View>
                            <Text style={styles.inputLabel}>Nombre</Text>
                            <TextInput
                                textAlignVertical="top"
                                style={{ ...styles.textArea, height: 50, marginTop: 20 }}
                                placeholder="Nombre de la promoción"
                                placeholderTextColor="#A0A0A0"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={{ marginTop: 30 }} />

                        <View>
                            <Text style={styles.inputLabel}>Descripción</Text>
                            <TextInput
                                textAlignVertical="top"
                                multiline
                                style={{ ...styles.textArea, height: 150, marginTop: 20 }}
                                placeholder="Escribe la descripción de la promoción"
                                placeholderTextColor="#A0A0A0"
                                value={description}
                                onChangeText={setDescription}
                            />
                        </View>

                        <View style={{ marginTop: 30 }} />

                        <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
                            <Text 
                                style = {{...styles.inputLabel, color: colors.mainBlue, textDecorationLine: 'underline'}}
                                onPress={() => Alert.alert('Fichas', 'La cantidad de fichas necesarias indica cuántas veces el cliente tiene que validar la promoción para completarla y conseguirla')}
                                >Fichas necesarias </Text>
                            <TouchableOpacity style = {styles.timesButton}
                                onPress={() => setTimes(times > 1 ? times - 1 : 1)}
                                >
                                <Ionicons name='remove' size={20}></Ionicons>
                            </TouchableOpacity>

                            <TextInput  
                                style = {{...styles.textArea, width: 50, textAlign: 'center'}}
                                value={times.toString()}
                                editable={false}
                                
                            />
                                
                            <TouchableOpacity style = {styles.timesButton}
                                onPress={() => setTimes(times + 1)}
                            >
                                <Ionicons name='add-outline' size={20}></Ionicons>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20 }}>
                            {/* Fecha de inicio */}
                            <View>
                                <Text style={styles.inputLabel}>Fecha de inicio</Text>
                                {Platform.OS === 'android' && (
                                    <TouchableOpacity
                                        onPress={() => setShowStart(!showStart)}
                                        style={{ ...globalStyles.button, ...styles.dateButton }}
                                    >
                                        <Text style={styles.dateButtonText}>{startDate.toLocaleDateString()}</Text>
                                    </TouchableOpacity>
                                )}
                                {showStart && (
                                    <DateTimePicker
                                        value={startDate}
                                        mode="date"
                                        themeVariant="light"
                                        onChange={(event, selectedDate) => {
                                            if (Platform.OS === 'android') setShowStart(false);
                                            if (selectedDate) setStartDate(selectedDate);
                                        }}
                                    />
                                )}
                            </View>
                            <View style={{ marginTop: 20 }} />

                            {/* Fecha de fin */}
                            <View>
                                <Text style={styles.inputLabel}>Fecha de fin</Text>
                                {Platform.OS === 'android' && (
                                    <TouchableOpacity
                                        onPress={() => setShowEnd(!showEnd)}
                                        style={{ ...globalStyles.button, ...styles.dateButton }}
                                    >
                                        <Text style={styles.dateButtonText}>{endDate.toLocaleDateString()}</Text>
                                    </TouchableOpacity>
                                )}
                                {showEnd && (
                                    <DateTimePicker
                                        value={endDate}
                                        mode="date"
                                        themeVariant="light"
                                        onChange={(event, selectedDate) => {
                                            if (Platform.OS === 'android') setShowEnd(false);
                                            if (selectedDate) setEndDate(selectedDate);
                                        }}
                                    />
                                )}
                            </View>
                        </View>

                        <TouchableOpacity style={{ ...globalStyles.button, marginTop: 30, height: 50, width: '60%', alignSelf: 'flex-end' }}
                            onPress={() => createPromotion(business_id, {name, description, startDate, endDate, times})}
                        >
                            <Text style={{ ...globalStyles.buttonText, fontSize: 14 }}>Publicar promoción</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ ...globalStyles.button, backgroundColor: colors.warn, height: 50, width: '60%', alignSelf: 'flex-end' }}
                            onPress={router.back}
                        >
                            <Text style={{ ...globalStyles.buttonText, fontSize: 14 }}>Cancelar</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    input: {
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.placeHolder,
        fontSize: 16,
        backgroundColor: colors.warn
    },
    inputLabel: {
        color: '#333',
        fontSize: 14,
    },
    textArea: {
        ...globalStyles.input,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10
    },
    dateButton: {
        backgroundColor: colors.secondaryBlue,
        marginTop: 10,
    },
    dateButtonText: {
        color: colors.mainBlue
    },
    timesButton: {
        marginHorizontal: 5,
        backgroundColor: colors.secondaryBlue,
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 12,
    }
})