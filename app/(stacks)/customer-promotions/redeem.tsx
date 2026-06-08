import { colors, globalStyles } from "@/constants/globalStyles"
import appFirebase from "@/credenciales"
import { router, useLocalSearchParams } from "expo-router"
import { getAuth } from "firebase/auth"
import { doc, getDoc, getFirestore, serverTimestamp, setDoc, Timestamp } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const auth = getAuth(appFirebase)

const db = getFirestore(appFirebase);

const chip_icon = require('../../../assets/images/chip.png')

export default function RedeemView () {
    const [code, setCode] = useState<string>('')
    const [loadingCode, setLoadingCode] = useState(true)
    const { promotion_id, business_id } = useLocalSearchParams()
    console.log('busindisadnaisdnasid: ' + business_id)

    function validatePromotion () : boolean {
        if (true) {
            // Cuando el dueño ingrese el código de cuatro dígitos, se tiene que sumar 1 a las fichas (completed)
            return true
        }
        else { }
    }

    const generateValidationCode = async (user_id: any, promotion_id: any, business_id: any) => {

    // En lugar de query, buscar directamente si existe algún código activo
    // Simplemente generamos uno nuevo siempre, o reutilizamos buscando diferente
    
    const code = String(Math.floor(1000 + Math.random() * 9000));

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    await setDoc(doc(db, 'validationCodes', code), {
        code,
        user_id,
        promotion_id,
        business_id,
        createdAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(expiresAt),
        used: false,
    });

    return code;
    };
    
    useEffect(() => {
    const init = async () => {
        const generatedCode = await generateValidationCode(
        auth.currentUser?.uid,
        promotion_id,
        business_id,
        );
        setCode(generatedCode);
        setLoadingCode(false);
    };
    init();
    }, []);

    // Aquí se tiene que validar que el dueño haya introducido el mismo código que el cliente y aceptado
    function validateCode () {
        
        return true // provisional
    }

    useEffect(() => {
    if (!code) return;

    const interval = setInterval(async () => {
        const codeSnap = await getDoc(doc(db, 'validationCodes', code));
        if (codeSnap.exists() && codeSnap.data().used === true) {
        clearInterval(interval);
        router.dismissAll();
        router.replace(`/customer-promotions/completed?promotion-id=${promotion_id}`);
        }
    }, 3000);

    return () => clearInterval(interval);
    }, [code]);

    return (

        <SafeAreaView style = {globalStyles.mainContainer}>
            <View style = {globalStyles.secondContainer}>
                <Image source={chip_icon} style = {{width: 120, height: 120, alignSelf: 'center', marginTop: 50}} />
                <Text 
                    style = {styles.text}
                >Muéstrale este código al encargado del negocio para poder obtener tu ficha</Text>
                
                <View style = {{...globalStyles.card, alignItems: 'center', marginTop: 40}}>
                    <Text style = {{color: colors.regularText, fontSize: 16}}>Código</Text>
                    <Text style = {{color: colors.regularText, fontSize: 42, fontWeight: '500', marginTop: 20}}>{loadingCode ? '...' : code}</Text>
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