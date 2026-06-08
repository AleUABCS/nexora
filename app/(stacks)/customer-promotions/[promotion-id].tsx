import { colors, globalStyles } from "@/constants/globalStyles";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const chip_icon = require('../../../assets/images/chip.png')

export default function PromotionView () {
    const {
        id,
        name,
        description,
        times,
        end_date,
        tokens_earned,
        business_id,
    } = useLocalSearchParams()
    console.log('tienes: '+tokens_earned+' fichas')

    const promotion_info = {
        name: name,
        description: description,
        completed: tokens_earned == null ? 0: tokens_earned, // Cuantas fichas lleva
        needed: times, // Cuantas necesita para conseguir la promoción
    }

    const {'promotion-id' : promotion_id} = useLocalSearchParams()
    
    return (
        <SafeAreaView style = {globalStyles.mainContainer}>
            <View style = {globalStyles.secondContainer}>

                <Text style = {{...globalStyles.titleText, marginTop: 50, color: colors.promotionText}}>{promotion_info.name}</Text>
                <View style = {{...globalStyles.card, marginTop: 40}}>
                    <Text style = {{fontSize: 16}}>Descripción</Text>
                    <Text style = {{fontSize: 14, color: colors.regularText, marginTop: 10, overflow: 'scroll', maxHeight: 200}}>{promotion_info.description}</Text>
                    <Text style = {{fontSize: 14}}>Válida hasta el {end_date}</Text>
                </View>

                <View style = {{justifyContent: 'center', flexDirection: 'row'}}>
                    <Image source={chip_icon} style = {{width: 65, height: 65}} />
                    <Text style = {{fontSize: 12, color: colors.regularText, alignSelf: 'center'}}>Tienes </Text>
                    <Text style = {{fontSize: 12, color: '#000', alignSelf: 'center'}}>{promotion_info.completed}/{promotion_info.needed}</Text>
                    <Text style = {{fontSize: 12, color: colors.regularText, alignSelf: 'center'}}> fichas de esta promoción</Text>
                </View>

                <TouchableOpacity 
                style = {{ ...globalStyles.button, backgroundColor: colors.promotion, marginTop: 50, alignSelf: "flex-end"}}
                onPress={() => {
                    router.push({
                        pathname: `/customer-promotions/redeem`,
                        params: {promotion_id : promotion_id, business_id: business_id}
                    })
                    console.log(business_id)
                }}
                    
                >
                    <Text style = {{color: '#ffffff', fontSize: 16, fontWeight: 'bold'}}>Conseguir ficha</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}