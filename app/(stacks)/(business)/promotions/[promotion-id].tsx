import { colors, globalStyles } from "@/constants/globalStyles";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const chip_icon = require('../../../../assets/images/chip.png')

export default function PromotionView () {
    const promotion_info = {
        name: 'Nombre de la promoción',
        description: 'Descripción de la promoción descripción de la promoción descripción de la promoción descripción de la promoción',
        completed: 2, // Cuantas fichas lleva
        needed: 3, // Cuantas necesita para conseguir la promoción
    }

    const {'promotion-id' : promotion_id} = useLocalSearchParams()

    console.log(promotion_id)

    function deletePromotion () {
        // Eliminar promoción en el back

        router.back()
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
                    onPress: deletePromotion
                }
            ]
        )
    }
    
    return (
        <SafeAreaView style = {globalStyles.mainContainer}>
            <View style = {globalStyles.secondContainer}>

                <Text style = {{...globalStyles.titleText, marginTop: 50, color: colors.promotionText}}>{promotion_info.name}</Text>
                <View style = {{...globalStyles.card, marginTop: 40}}>
                    <Text style = {{fontSize: 16}}>Descripción</Text>
                    <Text style = {{fontSize: 14, color: colors.regularText, marginTop: 10, overflow: 'scroll', maxHeight: 200}}>{promotion_info.description}</Text>
                </View>

                <View style = {{justifyContent: 'center', flexDirection: 'row'}}>
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