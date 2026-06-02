import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from '../../components/Themed';
import { colors, globalStyles } from "../../constants/globalStyles";

// Reemplazar esta información con la real
const business_data = {
    info: {
        business_id: 1,
        name: 'Nombre del negocio',
        rate: 4.5,
        reviews: 3,
        description: 'Descripción del negocio, texto de ejemplo, etétera',
        email: 'correo@ejemplo.com',
        phone: '6131231234',
    },
    coordinates: { // Coordenadas en latitud y longitud 
        latitude: 24.1426,
        longitude: -110.3128
    },
    promotions: [ // Promociones con id y su nombre
        {id: 1, promotion_name: 'Nombre de la promoción 1'},
        {id: 2, promotion_name: 'Nombre de la promociódsaddasdasasdasdadsadasdsdssdsan dos'}
    ],
    images: [
        { id: '1', source: require('../../assets/images/cuyo1.jpg') },
        { id: '2', source: require('../../assets/images/cuyo2.jpg') },
        { id: '3', source: require('../../assets/images/cuyo3.jpg') },
    ],
    shedule: { // Horario
        lunes: [
            {open: '07:00', close: '12:00'},
            {open: '01:00', close: '18:00'}
        ],
        martes: [
            {open: '07:00', close: '12:00'},
        ],
        miercoles: [
            {open: '07:00', close: '12:00'},
        ],
        jueves: [
            {open: '07:00', close: '12:00'},
        ],
        viernes: [
            {open: '07:00', close: '12:00'},
        ],
        sabado: [
            {open: '07:00', close: '12:00'},
        ],
        domingo: [
            {open: '07:00', close: '12:00'},
        ]
    }
}

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const container_width = width;
const space = 10;
export default function BusinessView () {
    return (
        <SafeAreaView style = {globalStyles.mainContainer}> 
            <ScrollView>
                {/* Carrusel con las fotos del negocio */}
                <View>
                    <FlatList
                        data = {business_data.images}
                        horizontal = {true}
                        showsHorizontalScrollIndicator = {false}
                        contentContainerStyle = {{}} // Estilos
                        decelerationRate = {0}
                        scrollEventThrottle = {16}
                        snapToInterval = {container_width}
                        keyExtractor = {(item) => item.id}
                        renderItem = {({item, index}) => {
                            return (
                                <View style = {{width: container_width}}>
                                    <View
                                        style = {{
                                            marginHorizontal: space,
                                            padding: space,
                                            borderRadius: 34,
                                            backgroundColor: '#FFFFFF',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Image source = {item.source} style = {styles.posterImage}
                                        />
                                    </View>
                                </View>
                            )
                        }}
                    />
                </View>
                <View style = {{...globalStyles.secondContainer, marginTop: 0}}>
                    {/* Primer contenedor de la información */}
                    <View style = {styles.infoContainer}>
                        {/* Parte izquierda */}
                        <View style = {{width: '60%'}}>
                            <Text style = {styles.name}>{business_data.info.name} </Text>
                            {/* Estrellas con sus números */}
                            <View style = {{flexDirection: 'row', alignItems: 'flex-end'}}>
                                {/* Estrellas */}
                                <View style = {{flexDirection: 'row', marginTop: 20}}>
                                    {
                                        [...Array(Math.round(business_data.info.rate))].map((_, index) => (
                                            <Ionicons
                                            key={index}
                                            name='star'
                                            color = {colors.mainBlue}
                                            size={16}
                                            style = {{paddingRight: 3, paddingBottom: 1}}
                                            >
                                            </Ionicons>
                                        ))
                                    }
                                </View>
                                <Text style = {{color:'#000', fontWeight: 'bold', paddingLeft: 10}}> {business_data.info.rate} </Text>
                                <Text style = {{color: colors.placeHolder, paddingLeft: 5}}> {business_data.info.reviews} reseñas </Text>
                            </View>
                            <Text 
                                onPress = {() => console.log("holaaaaaaaaa")}
                                style = {{
                                    fontSize: 10, 
                                    color: colors.mainBlue, 
                                    textDecorationLine: 'underline',
                                    marginTop: 10,
                                }}
                            >
                                Escribir una reseña</Text>
                        </View>

                        {/* Parte derecha (botones) */}
                        <View style = {{width: 'auto', flex: 1, alignItems: 'flex-end'}}>
                            <TouchableOpacity style = {{
                                ...styles.button, 
                                width: 60, 
                                height: 38,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}> 
                                <Ionicons name="bookmark-outline" size={20} color={colors.mainBlue}/>
                            </TouchableOpacity>

                            <TouchableOpacity style = {{
                                ...styles.button,
                                height: 38,
                                width: 100,
                                marginTop: 15
                            }}>
                                <Text style = {{color: colors.mainBlue, fontSize: 10}}>Agendar cita</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Promociones */}
                    <View style = {{marginTop: 20}}>
                        <Text style = {styles.text}>Promociones activas </Text>
                        <View style = {{marginTop: 15}}>
                            {business_data.promotions.map((promo, index) => (
                                <TouchableOpacity
                                key={index}
                                onPress={() => console.log(promo)}
                                style={styles.promotion}
                                >
                                    <Text style={{ 
                                        color: 'white', 
                                        fontSize: 12, 
                                        fontWeight: 'bold'
                                        }} 
                                        numberOfLines={1}
                                        ellipsizeMode = 'tail'
                                        >
                                        {business_data.promotions[index].promotion_name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Tarjetas de información */}
                    <View style = {{marginTop: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
                        {/* Izquierda */}
                        <View style = {{width: '55%'}}>
                            {/* Descripción */}
                            <View style = {styles.card}>
                                <Text style = {{...styles.text}}>Descripción</Text>
                                <Text style = {{color: colors.regularText, fontSize: 12, marginTop: 10}}>{business_data.info.description}</Text>
                            </View>

                            {/* Ubicación (pendiente) */}
                            <View style = {styles.card}>
                                <Text style = {{...styles.text}}>Ubicación </Text>
                                <View style = {styles.mapPlaceholder}>
                                    <Text>Aquí va el mapa</Text>
                                </View>
                            </View>
                        </View>

                        {/* Derecha */}
                        <View style = {{width: '42%'}}>
                            <View style = {styles.card}>
                                {/* Horario */}
                                <Text style = {{...styles.text, alignSelf: 'center', marginBottom: 10}}>Horario</Text>
                                {Object.entries(business_data.shedule).map(([day, block]) => (
                                    <View key={day} style={{ marginBottom: 8 }}>
                                        <View style = {{flexDirection: 'row', width: '100%'}}>
                                            <Text style = {{fontWeight: 'bold', color: "#000", fontSize: 8}}>
                                                {day === 'lunes' && 'Lunes'} 
                                                {day === 'martes' && 'Martes'} 
                                                {day === 'miercoles' && 'Miércoles'} 
                                                {day === 'jueves' && 'Jueves'} 
                                                {day === 'viernes' && 'Viernes'} 
                                                {day === 'sabado' && 'Sábado'} 
                                                {day === 'domingo' && 'Domingo'} 
                                            </Text>
                                            <View style = {{flex: 1, alignItems: 'flex-end'}}>
                                                {block.map((turn, index) => (
                                                    <Text style = {{color: colors.regularText, fontSize: 8}} key={index}>{turn.open} - {turn.close}</Text>
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                ))}

                            </View>

                            <View style = {styles.card}>
                                <Text style = {{...styles.text, alignSelf: 'center', marginBottom: 10}}>Contacto</Text>
                                <View style = {{flexDirection: 'row'}}>
                                    <Ionicons name = 'call-outline' size={20} color={colors.mainBlue}></Ionicons>
                                    <Text style = {{...styles.text, fontSize: 12, paddingLeft: 10, width: '85%'}}>{business_data.info.email}</Text>
                                </View>
                                <View style = {{flexDirection: 'row', marginTop: 15}}>
                                    <Ionicons name = 'mail-outline' size={20} color={colors.mainBlue} ></Ionicons>
                                    <Text style = {{...styles.text, fontSize: 12, paddingLeft: 10}}>{business_data.info.phone}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
    },
    mainImage: {
        width: 400,
        height: 400,
    },
    posterImage: {
        width: '100%',
        height: container_width * 0.6,
        resizeMode: 'cover',
        borderRadius: 24,
        margin: 0,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        color: '#000000',
        fontWeight: 'bold',
    },
    infoContainer: {
        flexDirection: 'row',
    },
    button: {
        backgroundColor: colors.secondaryBlue,
        borderRadius: 12,
        marginVertical: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    promotion: {
        backgroundColor: colors.promotion,
        height: 45,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: colors.mainBlue,
        shadowOpacity: 0.42,
        shadowRadius: 10, 
        justifyContent: 'center',
    },
    text: {
        fontSize: 14,
        color: '#333'
    },
    card: {
        ...globalStyles.card, 
        marginBottom: 15,
        padding: 10,
    },
    mapPlaceholder: {
        alignSelf: 'center',
        alignItems: 'center',
        margin: 10,
        height: 100,
        width: '100%',
        backgroundColor: colors.placeHolder,
        borderRadius: 5,
    }
})
