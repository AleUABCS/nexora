import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, globalStyles } from '../../constants/globalStyles';


export default function SetSchedule() {

    const [time, setTime] = useState('');

    const saveSchedule = () => {
        // Aquí se tiene que guardar el horario en back
        
        router.back()
    }

    // Para renderizar los botones de los días
    const dayButtons: { label: string; key: DayKey }[] = [
        { label: 'Lu', key: 'lunes' },
        { label: 'Ma', key: 'martes' },
        { label: 'Mi', key: 'miercoles' },
        { label: 'Ju', key: 'jueves' },
        { label: 'Vi', key: 'viernes' },
        { label: 'Sa', key: 'sabado' },
        { label: 'Do', key: 'domingo' },
    ];
    // Los días en español pq no me los sé en inglés xd
    type DayKey = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';

    type TimeSlot = {
        id: number
        opening: string
        closing: string
    }

    type Schedule = {
        [key in DayKey]: TimeSlot[];
    }

    const [schedule, setSchedule] = useState<Schedule>({
        lunes: [],
        martes: [],
        miercoles: [],
        jueves: [],
        viernes: [],
        sabado: [],
        domingo: []
    })

    const [selectedDay, setSelectedDay] = useState<DayKey>('lunes');

    // Añadir un bloque de horario
    const addTimeSlot = () => {
        const newId = Math.max(
        0,
        ...schedule[selectedDay].map(s => s.id || 0)
        ) + 1;
        
        setSchedule(prev => ({
            ...prev,
            [selectedDay]: [
                ...prev[selectedDay],
                {id : newId, opening: '', closing: ''}
            ]
        }))
    }

    // Eliminar un bloque de horario
    const removeScheduleSlot = (slotId: number) => {
        setSchedule(prev => ( {
            ...prev,
            [selectedDay]: prev[selectedDay].filter(s => s.id !== slotId)
        }))
    }

    // Formatear inputs de horas
    const handleTimeInput = (slotId: number, field: 'opening' | 'closing', text: string) => {
        const numbers = text.replace(/[^0-9]/g, '')
        
        if (numbers.length > 4) return;
        
        let formatted = numbers;
        if (numbers.length >= 3) {
        formatted = numbers.slice(0, 2) + ':' + numbers.slice(2)
        }
    
        setSchedule(prev => ({
        ...prev,
        [selectedDay]: prev[selectedDay].map(slot =>
            slot.id === slotId
            ? { ...slot, [field]: formatted }
            : slot
        )
        }))
    }


    return (
        // Contenedor padre
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={globalStyles.mainContainer}>
                {/* Título: Horario */}
                <Text style = {globalStyles.titleText}>Horario</Text>

                <View style={globalStyles.secondContainer}>

                    {/* Tarjeta de los días */}
                    <View style = {globalStyles.card}>

                        <Text style = {{...styles.cardText, alignSelf: 'center'}}>
                            Días
                        </Text>

                        <View style = {globalStyles.horizontalLine}></View>

                        <View style = {styles.dayButtonsContainer}>

                            {/* Renderizar los botones de los días */}
                            {dayButtons.map(({ label, key }) => (
                                <TouchableOpacity
                                    key={key}
                                    style={[
                                        styles.dayButton,
                                        selectedDay === key && styles.dayButtonActive
                                    ]}
                                    onPress={() => setSelectedDay(key)}
                                >
                                    <Text
                                        style={[
                                            styles.dayButtonText,
                                            selectedDay === key && styles.dayButtonTextActive
                                        ]}
                                    >
                                        {label}
                                    </Text>
                                </TouchableOpacity>
                            ))}                    
                        </View>
                    </View> 
                    {/* Tarjeta de horario (cambia por cada día con los botones de Días) */}
                    <View style = {globalStyles.card}>  

                        <Text style = {{...styles.cardText, alignSelf: 'center'}}>
                            Horario
                        </Text>
                    
                        <View style = {globalStyles.horizontalLine}></View>

                        {/* Bloque de horario */}
                        <View>
                            <View style = {{justifyContent: 'space-around', alignItems: 'center'}}>
                            
                                {schedule[selectedDay].length === 0 ? (
                                    <Text
                                        style = {{
                                            ...styles.cardText,
                                            marginVertical: 20,
                                            color: colors.placeHolder,
                                            textAlign: 'center'
                                        }}
                                    >
                                        Sin horarios configurados
                                    </Text>
                                ) :  (
                                    schedule[selectedDay].map((slot, index) => (
                                            <View 
                                                style = {{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    width: '100%',
                                                    marginTop: 15,
                                                }}
                                                key = {slot.id}
                                            >
                                                <Text style = {styles.cardText}>
                                                    Bloque {index + 1}
                                                </Text>
                                                
                                                <TextInput
                                                style = {{...globalStyles.input, width: 70, height: 40}}
                                                placeholder='00:00'
                                                placeholderTextColor={colors.placeHolder}
                                                value={slot.opening}
                                                onChangeText={(text) => handleTimeInput(slot.id, 'opening', text)}
                                                keyboardType='numeric'
                                                maxLength={5}
                                                />
                                                
                                                <Text style = {styles.cardText}>
                                                    a
                                                </Text>

                                                <TextInput
                                                style = {{...globalStyles.input, width: 70, height: 40}}
                                                placeholder='00:00'
                                                placeholderTextColor={colors.placeHolder}
                                                value={slot.closing}
                                                onChangeText={(text) => handleTimeInput(slot.id, 'closing', text)}
                                                keyboardType='numeric'
                                                maxLength={5}
                                                />

                                                <TouchableOpacity
                                                onPress={() => removeScheduleSlot(slot.id)}
                                                style = {{width: 32, height: 32, alignItems: 'center', justifyContent: 'center'}}
                                                >
                                                    <Ionicons name="close-circle-outline" color={'#ff3333'} size={24} />
                                                </TouchableOpacity>
                                            </View>
                                    )))
                                }
                            </View>
                        </View>

                        <TouchableOpacity 
                        style = {styles.addBlockButton}
                        onPress={() => addTimeSlot()}
                        >
                            <Ionicons name="add-outline" color={colors.placeHolder}></Ionicons>
                            <Text style = {styles.addBlockButtonText}>
                                Agregar bloque
                            </Text>
                        </TouchableOpacity>
                        
                    </View>

                    <TouchableOpacity 
                        style = {{
                            ...globalStyles.button, width: 200, alignSelf: 'flex-end'
                        }}
                        onPress={saveSchedule}
                    >
                        <Text style  = {globalStyles.buttonText}>
                            Guardar horario
                        </Text>
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    dayButton: {
        width: 38,
        height: 38,
        backgroundColor: '#FFFFFF',
        fontSize: 14,
        color: '#555555',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 0, 
    },
    cardText: {
        color: '#555555',
        fontSize: 16,
    },
    dayButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    addBlockButton: {
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        borderWidth: 1,
        borderColor: '#B5B5B5',
        borderRadius: 10,
        flexDirection: 'row',
        height: 50,
    },
    addBlockButtonText: {
        color: '#A1A1A1',
        fontSize: 14,
        marginVertical: 5,
        paddingLeft: 10,
    },
    dayButtonActive: {
        backgroundColor: '#007AFF'
    },
    dayButtonText: {
        color: '#555555',
        fontSize: 14,
        fontWeight: '600'
    },
    dayButtonTextActive: {
        color: '#FFFFFF'
    },
})