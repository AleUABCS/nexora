import { useReviewsStore } from '@/store/review-store';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, globalStyles } from "../../../constants/globalStyles";

export default function ReviewDetailsView () {
    const router = useRouter()
    
    // id de la reseña. se obtiene con la id de la reseña a la que se le hizo click en la pantalla de reseñas
    const {id} = useLocalSearchParams()
    
    // Aquí va la información de la review, me imagino que la conseguirás con la id en la base de datos
    // Datos necesarios: Estrellas, comentario de la reseña, id del negocio.
    // En este arreglo van a ir los datos reales.
    const review_data =  {review_id: 1, business_name: 'Nombre del negocio', stars: 4, description: 'No me gustó, etc comentario...', business_id: 1}

    const { removeReview } = useReviewsStore ()

    function handleRemoveReview (id: string) {
        // Se tiene que eliminar en el back en el store/review-store.ts
        removeReview(id)

        router.back()
    }

    const alertOnDelete = () => {
        Alert.alert(
            '',
            '¿Quieres eliminar esta reseña?',
            [
                {text: 'Cancelar', style: 'cancel'},
                {text: 'Eliminar', onPress: () => handleRemoveReview(review_data.review_id.toString())}
            ]
        )
    }


    return (
        // Contenedor padre
        <SafeAreaView style = {globalStyles.mainContainer}>

            <View style = {[globalStyles.secondContainer]}>

                <View style = {{alignItems: 'center'}}>

                    <Ionicons 
                    name="star-outline" 
                    color={colors.mainBlue} 
                    size={63}
                    style = {{marginTop: 40}}
                    />
                    <Text style = {{fontSize: 32, color: colors.regularText, marginTop: 40}}>{review_data.business_name}</Text>
                
                </View>
                {/* Contenedor con estilo de tarjeta */}
                <View style = {{...globalStyles.card, marginTop: 25, paddingTop: 40}}>

                    <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        
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
                        <ScrollView style = {{maxHeight: 200}}>
                            <Text style = {{fontSize: 16, color: colors.regularText, marginTop: 10}}>{review_data.description}</Text>
                        </ScrollView>
                    
                    </View>

                    <View style = {{alignItems: 'flex-end', alignSelf:'flex-end', marginTop: 20, width: '60%'}}>
                        {/* Botón "Ver negocio" */}
                        <TouchableOpacity 
                        style = {{...globalStyles.button, width: '100%'}}
                        onPress={ () => router.push(`/(stacks)/(business)/${id}`)}
                        // Aquí tiene que llevar al negocio con la id. Aún no ha sido programada la pantalla de negocio/[id]
                        >
                            <Ionicons name = 'arrow-redo-outline' color= '#FFFFFF' size = {24} style = {{paddingRight: 5}}></Ionicons>
                            <Text style = {globalStyles.buttonText}>Ver negocio</Text>
                        </TouchableOpacity>

                        {/* Botón "Eliminar reseña" */}
                        <TouchableOpacity 
                        style = {{...globalStyles.button, 
                        backgroundColor: colors.warn, 
                        width: '100%'}}
                        onPress={() => alertOnDelete()}
                        >
                            <Ionicons name = 'trash-outline' color = '#FFFFFF' size = {24} style = {{paddingRight: 5}}></Ionicons>
                            <Text style = {globalStyles.buttonText}>Eliminar reseña</Text>
                        </TouchableOpacity>

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