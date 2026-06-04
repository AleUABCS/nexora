import { colors, globalStyles } from "@/constants/globalStyles";
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, Keyboard, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const chip_icon = require('../../../../assets/images/chip.png')

export default function NewPromotionView () {
    const {'id' : business_id} = useLocalSearchParams()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStart, setShowStart] = useState(Platform.OS === 'ios');
    const [showEnd, setShowEnd] = useState(Platform.OS === 'ios');

    function createPromotion () {
        // Guardar promoción en el back

        router.back()
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={globalStyles.mainContainer}>
                <View style={globalStyles.secondContainer}>

                        <Image source={chip_icon} style = {{width: 65, height: 65, marginTop: 30, alignSelf: 'center'}} />
                        <Text style={{...globalStyles.titleText, marginTop: 30, fontSize: 24, color: colors.regularText}}>Publicar una promoción</Text>
                    
                    <View style={{marginTop: 40}} />

                    <View>
                        <Text style={styles.inputLabel}>Nombre</Text>
                        <TextInput
                            textAlignVertical="top"
                            style={{...styles.textArea, height: 50, marginTop: 20}}
                            placeholder="Escribe tu reseña"
                            placeholderTextColor="#A0A0A0"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={{marginTop: 30}} />

                    <View>
                        <Text style={styles.inputLabel}>Descripción</Text>
                        <TextInput
                            textAlignVertical="top"
                            multiline
                            style={{...styles.textArea, height: 150, marginTop: 20}}
                            placeholder="Escribe tu reseña"
                            placeholderTextColor="#A0A0A0"
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    <View style={{marginTop: 30}} />

                    <View style = {{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20}}>
                    {/* Fecha de inicio */}
                        <View>
                            <Text style={styles.inputLabel}>Fecha de inicio</Text>
                            {Platform.OS === 'android' && (
                                <TouchableOpacity
                                    onPress={() => setShowStart(!showStart)}
                                    style={{...globalStyles.button, ...styles.dateButton}}
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


                    <View style={{marginTop: 20}} />

                    {/* Fecha de fin */}
                        <View>
                            <Text style={styles.inputLabel}>Fecha de fin</Text>
                            {Platform.OS === 'android' && (
                                <TouchableOpacity
                                    onPress={() => setShowEnd(!showEnd)}
                                    style={{...globalStyles.button, ...styles.dateButton}}
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

                    <TouchableOpacity style = {{...globalStyles.button, marginTop: 30, height:50, width: '60%', alignSelf: 'flex-end'}}
                    onPress={() => createPromotion()}
                    >
                        <Text style = {{...globalStyles.buttonText, fontSize: 14}}>Publicar promoción</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style = {{...globalStyles.button, backgroundColor: colors.warn, height: 50, width: '60%', alignSelf: 'flex-end'}}
                    onPress={router.back}
                    >
                        <Text style = {{...globalStyles.buttonText, fontSize: 14}}>Cancelar</Text>
                    </TouchableOpacity>

                </View>
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
})