import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, globalStyles } from '../../constants/globalStyles';


export default function SetSchedule() {

    let blockCount = 1

    const [time, setTime] = useState('');

    const handleTimeInput = (text: string) => {
    // Solo números
    const numbers = text.replace(/[^0-9]/g, '');
    
    if (numbers.length > 4) return;
    
    // Formato: HH:MM
    let format = numbers;
    if (numbers.length >= 3) {
      format = numbers.slice(0, 2) + ':' + numbers.slice(2);
    }
    
    setTime(format);
    };

    return (
        // Contenedor padre
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

                        <TouchableOpacity style = {styles.dayButton}>
                            <Text>Lu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.dayButton}>
                            <Text>Ma</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.dayButton}>
                            <Text>Mi</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.dayButton}>
                            <Text>Ju</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.dayButton}>
                            <Text>Vi</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.dayButton}>
                            <Text>Sa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.dayButton}>
                            <Text>Do</Text>
                        </TouchableOpacity>

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
                        <View style = {{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>

                            <Text style = {styles.cardText}>
                                Bloque {blockCount}
                            </Text>
                            <TextInput 
                            style = {{...globalStyles.input, width: 70, height: 40}}
                            placeholder='00:00'
                            placeholderTextColor={colors.placeHolder}
                            value = {time}
                            keyboardType='numeric'
                            maxLength={5}
                            onChangeText={handleTimeInput}
                            ></TextInput>

                            <Text style = {styles.cardText}>
                                a
                            </Text>

                            <TextInput 
                            style = {{...globalStyles.input, width: 70, height: 40}}
                            placeholder='00:00'
                            placeholderTextColor={colors.placeHolder}
                            value = {time}
                            keyboardType='numeric'
                            maxLength={5}
                            onChangeText={handleTimeInput}
                            ></TextInput>
                        </View>
                    </View>

                    <TouchableOpacity style = {styles.addBlockButton}>
                        <Ionicons name="add-outline" color={colors.placeHolder}></Ionicons>
                        <Text style = {styles.addBlockButtonText}>
                            Agregar bloque
                        </Text>
                    </TouchableOpacity>

                </View>

                <TouchableOpacity style = {{...globalStyles.button, width: 200, alignSelf: 'flex-end'}}>
                    <Text style  = {globalStyles.buttonText}>
                        Guardar horario
                    </Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
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
        shadowOpacity: 0.7,
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
        flexDirection: 'row'
    },
    addBlockButtonText: {
        color: '#A1A1A1',
        fontSize: 14,
        marginVertical: 5,
        paddingLeft: 10,
    }
})