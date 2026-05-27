import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, globalStyles } from "../../../constants/globalStyles";


export default function ReviewDetailsView () {
    // id de la reseña. se obtiene con la id de la reseña a la que se le hizo click en la pantalla de reseñas
    const {id} = useLocalSearchParams()
    // Aquí va la información de la review, me imagino que la conseguirás con la id en la base de datos
    // Datos necesarios: Estrellas, comentario de la reseña, id del negocio.
    // En este arreglo van a ir los datos reales.
    let review_data =  {business_name: 'Nombre del negocio', stars: 4, description: 'No me gustó, etc comentario...', business_id: 1}

    return (
        // Contenedor padre
        <SafeAreaView style = {globalStyles.mainContainer}>
            <View style = {[globalStyles.secondContainer]}>
                <View style = {{alignItems: 'center', flex: 1}}>
                    <Ionicons 
                    name="star-outline" 
                    color={colors.mainBlue} 
                    size={63}
                    style = {{marginTop: 40}}
                    />
                    <Text style = {{fontSize: 32, color: colors.regularText}}>{review_data.business_name}</Text>
                </View>
                {/* Contenedor con estilo de tarjeta */}
                <View style = {{...globalStyles.card, marginTop: 25, paddingTop: 40}}>
                    <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1}}>
                        <Text style = {styles.boldText}>Calificación</Text>
                        <View style = {{flexDirection: 'row'}}>
                            {
                                [...Array(review_data.stars)].map((_, index) => (
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
                        <Text style = {styles.boldText}> {review_data.stars}/5 </Text>
                    </View>

                    <View style = {{marginTop: 30}}>
                        <Text style = {styles.boldText}>Reseña</Text>
                        <Text style = {{fontSize: 16, color: colors.regularText, marginTop: 10}}>{review_data.description}</Text>

                    </View>
                </View>
            </View>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create ({
    boldText: {
        fontWeight: 'bold',
        fontSize: 16,
    }
})