import { colors, globalStyles } from "@/constants/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { BarChart } from 'react-native-gifted-charts';
import { SafeAreaView } from "react-native-safe-area-context";
export default function DashboardView () {
    
    const { 'id-dashboard' : id_dashboard } = useLocalSearchParams()
    console.log(id_dashboard)

    // Back
    const info = {
        business_name: 'Nombre del negocio',
        clicks: 100, // Clicks totales
        rate: 4, // Calificación (el promedio)
        reviews: 12, // Cantidad de reviews
        active_promotions: [ // redeemed es cuántas veces ha sido canjeada esa promoción
            {id: 1, name: 'Nombre promoción 1', redeemed: 3},
            {id: 2, name: 'Promoción 2 nomble', redeemed: 1},
        ],
        clicksPastDay: 289, // Clicks del mismo día pero de la semana pasada
        clicksNow: 1000, // Clicks del día de hoy
    }

    const percentage = (info.clicksNow / info.clicksPastDay) * 100;
    const barValue = Math.min(percentage, 100);

    const data = [{
        value: barValue,
        label: '',
        topLabelComponent: () => (
            <Text style={{ fontSize: 12 }}>{percentage.toFixed(0)}%</Text>
        )
    }];    return (
        <SafeAreaView style = {globalStyles.mainContainer}>
            <View style = {globalStyles.secondContainer}>
                <Text style = {{...globalStyles.titleText, marginTop: 0, fontSize: 30}}
                numberOfLines={2}
                ellipsizeMode="tail"
                >{info.business_name}</Text>
                {/* 3 tarjetas */}
                <View style = {{flexDirection: 'row', marginTop: 20, justifyContent: 'space-between'}}>
                    {/* Izquerda */}
                    <View style = {{width: '43%'}}>
                        {/* Clicks totales */}
                        <View 
                        style = {{
                            ...styles.card, 
                            height: 200,
                            width: 200,
                        }}
                        >
                            <Text style = {styles.cardText}>Clicks Totales</Text>
                            <Text style = {{...styles.cardInfoText}}>{info.clicks}</Text>
                        </View>

                        {/* Calificación */}
                        <View 
                        style = {{
                            ...styles.card, 
                            height: 200,
                            width: 200,
                        }}
                        >
                            <Text style = {{...styles.cardText, fontSize: 20}}>Calificación</Text>
                            <View style = {{flexDirection: 'row'}}>
                                <Text style = {{...styles.cardInfoText}}>{info.rate}</Text>
                                <Ionicons name = 'star' size = {32} color={colors.mainBlue} style = {{alignSelf: 'center', marginTop: 8}}/>
                            </View>
                            <Text style = {styles.smallText}>{info.reviews} Reseñas</Text>
                        </View>
                    </View>

                    {/* Derecha */}
                    <View style = {{width: '43%'}}>
                        {/* Gráfica */}
                        <View 
                        style = {{
                            ...styles.card,
                            height: 410,
                            width: '100%',
                            padding: 10,
                        }}
                        >
                            <Text style = {{...styles.cardText, fontSize: 20, marginBottom: 1}}>Clicks hoy</Text>
                            <Text style = {{...styles.cardInfoText, marginTop: 0, marginBottom: 20}}>{info.clicksNow}</Text>
                            <BarChart
                            data={data}
                            barWidth={60}
                            maxValue={100}
                            barBorderRadius={6}
                            frontColor={colors.mainBlue}
                            yAxisThickness={1}
                            xAxisThickness={1}
                            width={90}
                            height={150}
                            overflowTop={10}
                            spacing={10}
                            yAxisTextStyle={{fontSize: 10}}
                            /> 
                            <Text style = {{...styles.smallText, fontSize: 9, width: 150}}>{percentage.toFixed(0)}% respecto al mismo día de la semana pasada</Text>
                        </View>
                    </View>
                </View>  
                    
                {/* Promociones */}
                <View style = {{...styles.card, height: 300}}>
                    <Text style = {{...styles.cardText, marginBottom: 20}}>Promociones activas</Text>
                    <FlatList
                    data={info.active_promotions}
                    keyExtractor={(item => item.id.toString())}
                    renderItem={({item}) => (
                        <View style = {{width: 300}}
                        >
                            <View style = {{flexDirection: 'row'}}>
                                <Text style = {{...styles.cardText, fontSize: 12, width: 200, textAlign: 'left'}}>{item.name}</Text>
                                <Text style = {{...styles.smallText, fontSize: 10, marginTop: 0, marginLeft: 'auto', alignSelf: 'center'}}>{item.redeemed} canjeadas</Text>
                            </View>
                            <View style = {{...globalStyles.horizontalLine, width: '100%'}}></View>
                        </View>
                    )}
                    >
                        <View></View>
                    </FlatList>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create ({
    card: {
        ...globalStyles.card,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardText: {
        fontSize: 24,
        color: colors.regularText,
        textAlign: 'center',
    },
    cardInfoText: {
        fontSize: 26,
        color: '#222',
        textAlign: 'center',
        marginTop: 10
    },
    smallText : {
        fontSize: 16,
        color: colors.regularText,
        textAlign: 'center',
        marginTop: 10,
    }
})