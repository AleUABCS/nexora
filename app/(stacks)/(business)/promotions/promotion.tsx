import { colors, globalStyles } from "@/constants/globalStyles";
import appFirebase from "@/credenciales";
import { router, useLocalSearchParams } from "expo-router";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const db = getFirestore(appFirebase);
const chip_icon = require('../../../../assets/images/chip.png')

export default function PromotionView () {

    const {
        id,
        name,
        description,
        start_date,
        end_date,
        times,
        business_id,
    } = useLocalSearchParams()

    const promotion_info = {
        name: name,
        description: description,
    }

    function alertOnDelete () {
        Alert.alert(
            'Eliminar promoción',
            '¿Estás seguro de que quieres aliminar esta promoción?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Eliminar',
                    onPress: () => {deletePromotion(business_id as string, id as string)}
                }
            ]
        )
    }
    
    const deletePromotion = async (business_id: string, id: string) => {
        console.log('negocio aidi: '+business_id+' promocion aidi: '+id+' han sido bananeados')
        await deleteDoc(doc(db, 'negocios', business_id, 'promociones', id))
        router.back()
    }
    
    return (
        <SafeAreaView style = {globalStyles.mainContainer}>
            <View style = {globalStyles.secondContainer}>

                <Text style = {{...globalStyles.titleText, marginTop: 50, color: colors.promotionText}}>{promotion_info.name}</Text>
                <View style = {{...globalStyles.card, marginTop: 40}}>
                    <Text style = {{fontSize: 16}}>Descripción</Text>
                    <Text style = {{fontSize: 14, color: colors.regularText, marginTop: 10, overflow: 'scroll', maxHeight: 200}}>{promotion_info.description}</Text>
                    
                    <View style = {{justifyContent: 'center', marginTop: 20}}>
                    <Text>Fecha de inicio: {start_date}</Text>
                    <Text>Fecha de fin: {end_date}</Text>
                    <Text>Fichas necesarias: {times}</Text>   
                </View>

                </View>

                <TouchableOpacity 
                style = {{ ...globalStyles.button, backgroundColor: colors.warn, marginTop: 50, alignSelf: "flex-end"}}
                onPress={alertOnDelete}
                >
                    <Text style = {{color: '#ffffff', fontSize: 16, fontWeight: 'bold'}}>Eliminar promoción</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}