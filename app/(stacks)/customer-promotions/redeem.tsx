import { colors, globalStyles } from "@/constants/globalStyles"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const chip_icon = require('../../../assets/images/chip.png')

export default function RedeemView () {
    
    const { 'promotion-id' : promotion_id } = useLocalSearchParams()

    const promotion_info = {
        id: promotion_id, // id de la promoción
        completed: 2, // Cuantas fichas lleva
        needed: 3, // Cuantas necesita para conseguir la promoción       
        generated_code: 1234 // Se tiene que generar un código de cuatro dígitos y una función para validarlo 
    }

    console.log(promotion_info)

    function validatePromotion () : boolean {
        if (true) {
            // Cuando el dueño ingrese el código de cuatro dígitos, se tiene que sumar 1 a las fichas (completed)
            return true
        }
        else { }
    }

    // Aquí se tiene que validar que el dueño haya introducido el mismo código que el cliente y aceptado
    function validateCode () {
        
        return true // provisional
    }

    useEffect(() => {
    const interval = setInterval(async () => {
        const result = await validateCode();

        if (result == true) {
            clearInterval(interval);
            router.dismissAll();
            router.replace(`/customer-promotions/completed?promotion-id=${promotion_id}`);
        }
    }, 3000); // comprobar cada tres segundos

    return () => clearInterval(interval);
    }, []);

    return (

        <SafeAreaView style = {globalStyles.mainContainer}>
            <View style = {globalStyles.secondContainer}>
                <Image source={chip_icon} style = {{width: 120, height: 120, alignSelf: 'center', marginTop: 50}} />
                <Text 
                    style = {styles.text}
                >Muéstrale este código al encargado del negocio para poder obtener tu ficha</Text>
                
                <View style = {{...globalStyles.card, alignItems: 'center', marginTop: 40}}>
                    <Text style = {{color: colors.regularText, fontSize: 16}}>Código</Text>
                    <Text style = {{color: colors.regularText, fontSize: 42, fontWeight: '500', marginTop: 20}}>{promotion_info.generated_code}</Text>
                    { validatePromotion() ?
                        <Text style = {{color: colors.promotion, fontSize: 14, marginTop: 20, textAlign: 'center', fontWeight: 'bold'}}>Al conseguir esta ficha se hará válida la promoción</Text>
                        : ''
                    }
                </View>
                    <TouchableOpacity 
                        style = {{
                            ...globalStyles.button, backgroundColor: colors.promotion, height: 50
                        }}
                        onPress={ () => router.back()
                        }
                        >
                        <Text style = {{color: '#FFFFFF'}}>Volver</Text>
                    </TouchableOpacity>

                    <Text style = {styles.text}>Este código será válido duratne 3 minutos
                    </Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create ({
    text: {
        fontSize: 16, 
        color: colors.regularText, 
        alignSelf: 'center', 
        marginTop: 20, 
        width: '80%', 
        textAlign: 'justify'
    }
})