import { colors, globalStyles } from '@/constants/globalStyles';
import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const chip_icon = require('../../../assets/images/chip.png')
export default function CompletedView () {
    const name = 'Nombre de la promoción'
    const description = 'Descripción de la promoción prdsadas dask dasd klasdk lksaldkaslks'

    return (
        <SafeAreaView style = {{...globalStyles.mainContainer}}>
            <View style = {{...globalStyles.secondContainer}}>

                <Text 
                    style = {{
                        ...globalStyles.titleText,
                        fontSize: 28,
                        color: colors.promotionText,
                        marginTop: 50
                    }}
                >¡Completado!</Text>

                <Text 
                    style = {{
                        ...globalStyles.titleText,
                        fontSize: 28,
                        color: colors.promotionText,
                        marginTop: 50
                    }}
                >{name}</Text>

                <View style = {{
                        ...globalStyles.card,
                        marginTop: 30,
                    }}
                >
                    <Text style = {{fontSize: 16, color: colors.regularText, textAlign: 'justify'}}>{description}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 12 }}>
                    <Image source={chip_icon} style={{ width: 65, height: 65 }} />
                    <Text style={{ flex: 1, fontSize: 14, color: colors.regularText, textAlign: 'justify' }}>
                        Has conseguido todas las fichas, informa al encargado del negocio para que haga válida la promoción
                    </Text>
                </View>

                <TouchableOpacity 
                    style = {{
                        ...globalStyles.button, 
                        height: 50, 
                        backgroundColor: colors.promotion, 
                        marginTop: 70
                        }}
                        onPress={
                            () => {
                                router.dismissAll()
                                router.push('/customer-promotions')
                        }}
                        >
                    <Text style = {{color: '#FFF', fontSize: 16, fontWeight: 'bold'}}>Volver</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}