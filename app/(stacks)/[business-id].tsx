import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from '../../components/Themed';
import { colors, globalStyles } from "../../constants/globalStyles";

// Imágenes del carrusel
const carousel_images = [
  
];

// rate es el promedio de las reseñas
const business_data = {
    info: {
        business_id: 1,
        name: 'Nombre del negocio',
        rate: 4.0,
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
        {id: 2, promorion_name: 'Nombre de la promoción 2'}
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
            {/* Carrusel con las fotos del negocio */}
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
            <View style = {globalStyles.secondContainer}>

                <View style = {styles.infoContainer}>
                    <Text style = {styles.name}>{business_data.info.name}</Text>
                    <View style = {{flexDirection: 'row'}}>
                            {
                                [...Array(business_data.info.rate)].map((_, index) => (
                                    <Ionicons
                                    key={index}
                                    name='star'
                                    color = {colors.mainBlue}
                                    size={14}
                                    style = {{marginLeft: 5}}
                                    >
                                    </Ionicons>
                                ))
                            }
                        </View>
                </View>

            </View>
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
    },
    infoContainer: {
        flexDirection: 'row',
    }
})
