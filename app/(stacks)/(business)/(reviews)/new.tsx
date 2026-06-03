import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, globalStyles } from "../../../../constants/globalStyles";

    interface StarRatingProps {
    onChange?: (rating: number) => void
    }

export default function NewReview ({onChange}: StarRatingProps) {
    const router = useRouter()
    
    // id de la reseña
    const {'business-id' : business_id} = useLocalSearchParams()
    const business_name =  'Nombre del negocio'

    const [rating, setRating] = useState(0)
    const [review_description, setDescription] = useState('')

    let review_data = {
        business_id: business_id, // id del negocio al que se le está haciendo la reseña (se obtiene con el useLocalSearchParams() pero tiene que haberse pasado la id en la pantalla del negocio)
        rate: rating, // Calificación
        description: review_description // Descripción
    }
    function hanldeReviewUpload () {
        // Guardar review en la bdd
        console.log(review_data)

        router.back()
    }
    return (
        // Contenedor padre
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style = {globalStyles.mainContainer}>

            <View style = {[globalStyles.secondContainer]}>

                <View style = {{alignItems: 'center'}}>

                    <Ionicons 
                    name="star-outline" 
                    color={colors.mainBlue} 
                    size={63}
                    style = {{marginTop: 40}}
                    />
                    <Text style = {{fontSize: 32, color: colors.regularText, marginTop: 40}}>{business_name}</Text>
                
                </View>
                {/* Contenedor con estilo de tarjeta */}
                <View style = {{...globalStyles.card, marginTop: 25, paddingTop: 40}}>

                    <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        
                        <Text style = {styles.boldText}>Calificación</Text>

                        <View style={{ flexDirection: 'row', gap: 8 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Pressable
                            key={star}
                            onPress={() => {
                                setRating(star)
                                onChange?.(star)
                            }}
                            >
                            <Ionicons
                                name={star <= rating ? 'star' : 'star-outline'}
                                size={24}
                                color={colors.mainBlue}
                            />
                            </Pressable>
                        ))}
                        </View>

                    </View>

                    <View style = {{marginTop: 30}}>

                        <Text style = {styles.boldText}>Reseña</Text>
                        <ScrollView style = {{maxHeight: 200}}>
                        <TextInput
                            textAlignVertical="top"
                            multiline
                            style={{...styles.textArea, height: 150, marginTop: 20 }}
                            placeholder="Escribe tu reseña"
                            placeholderTextColor="#A0A0A0"
                            value={review_description}
                            onChangeText={setDescription}
                        />
                        </ScrollView>
                    
                    </View>

                    <View style = {{alignItems: 'flex-end', alignSelf:'flex-end', marginTop: 20, width: '60%'}}>
                        {/* Botón "Ver negocio" */}
                        <TouchableOpacity 
                        style = {{...globalStyles.button, width: '100%'}}
                        onPress={hanldeReviewUpload}
                        // Aquí tiene que llevar al negocio con la id. Aún no ha sido programada la pantalla de negocio/[id]
                        >
                            <Ionicons name = 'arrow-up' color= '#FFFFFF' size = {24} style = {{paddingRight: 5}}></Ionicons>
                            <Text style = {globalStyles.buttonText}>Publicar</Text>
                        </TouchableOpacity>

                        {/* Botón "Cancelar" */}
                        <TouchableOpacity 
                        style = {{...globalStyles.button, 
                        backgroundColor: colors.mainBlue, 
                        width: '100%'}}
                        onPress={() => router.back()}
                        >
                            <Text style = {globalStyles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </View>

        </SafeAreaView>
    </TouchableWithoutFeedback>
    )

}

const styles = StyleSheet.create ({
    boldText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    textArea: {
        ...globalStyles.input,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10
    }
})