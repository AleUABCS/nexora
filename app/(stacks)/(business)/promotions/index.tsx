import { colors, globalStyles } from "@/constants/globalStyles";
import appFirebase from "@/credenciales";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const db = getFirestore(appFirebase);

const chip_icon = require('../../../../assets/images/chip.png')

export default function PromotionsView () {
    const {business_id} = useLocalSearchParams()

    const router = useRouter()
    //Datos de prueba
    // Needed es la cantidad de fichas necesarias para conseguir la promoción
    // Completed es la cantidad de fichas que el usuario ya tiene de esa promoción
    // const [promotions, setPromotions] = useState ([
    //     {id: 0, name: 'Promocion 1', completed: 1, needed: 3},
    //     {id: 1, name: 'Promocion promoisodsojda', completed: 2, needed: 3},
    //     {id: 2, name: 'NO sé promo ayuda', completed: 2, needed: 4}
    // ])
    
    const useBusinessPromotions = (business_id: string) => {
        const [promotions, setPromotions] = useState<any[]>([])
        const [loading, setLoading] = useState(true)

        useEffect(() => {
            const ref = collection(db, 'negocios', business_id, 'promociones')

            const unsub = onSnapshot(ref, (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    startDate: doc.data().startDate?.toDate().toLocaleDateString('es-MX'),
                    endDate: doc.data().endDate?.toDate().toLocaleDateString('es-MX'),
                }))
                setPromotions(data)
                setLoading(false)
            })
            return () => unsub()
        }, [business_id])
        return {promotions, loading}
    }

    // const removeSaved = (savedId: number) => {
    //     setPromotions(prev => prev.filter (item => item.id !== savedId))
    // } 

    const {promotions, loading} = useBusinessPromotions(business_id as string)

    if (loading) return <ActivityIndicator/>

    return (
        <SafeAreaView style = {globalStyles.mainContainer}> 
            <View style = {globalStyles.secondContainer}>
                <View style = {{alignItems: 'center', marginTop: 10}}>
                    <Image
                    source={chip_icon}
                    />
                    <Text style = {globalStyles.titleText}>Promociones activas</Text>
                </View>
                <View style = {{...globalStyles.card, maxHeight: '50%', marginTop: 20}}>
                    <FlatList
                    data={promotions}
                    keyExtractor={(item => item.id.toString())}
                    renderItem={({item}) => (
                        <View
                        style = {globalStyles.listItem}
                        >
                            <TouchableOpacity style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                flex: 1
                                }}
                                onPress={() => {
                                    router.push({pathname: '/promotions/promotion', params: {
                                        id: item.id, name: item.name, description: item.description, start_date: item.startDate, end_date: item.endDate, times: item.totalTokens, business_id: business_id
                                    }
                                    })
                                }}
                                >
                                <Text 
                                    numberOfLines = {1} 
                                    ellipsizeMode="tail" 
                                    style={{
                                        ...globalStyles.listItemText,
                                        maxWidth: '80%'
                                    }}
                                >{item.name}</Text>

                            </TouchableOpacity>
                        </View>
                    )}
                    >
                    </FlatList>
                </View>
                
                <View style = {{alignItems: 'flex-end', alignSelf:'flex-end', marginTop: 20, width: '60%'}}>
                    {/* Botón "Crear promoción" */}
                    <TouchableOpacity 
                    style = {{...globalStyles.button, width: '100%', backgroundColor: colors.promotion}}
                    onPress={ () => router.push({pathname: '/promotions/new', params: {business_id : business_id}})}
                    >
                        <Ionicons name = 'add' color= '#FFFFFF' size = {24} style = {{paddingRight: 5}}></Ionicons>
                        <Text style = {globalStyles.buttonText}>Crear promoción</Text>
                    </TouchableOpacity>
                    {/* Botón "Canjear promoción" */}
                    <TouchableOpacity 
                    style = {{...globalStyles.button, width: '100%', backgroundColor: colors.promotion}}
                    onPress={ () => {
                        router.push({
                            pathname: '/promotions/redeem',
                            params: {business_id: business_id}
                        })
                    }}
                    >
                        <Ionicons name = 'cash' color= '#FFFFFF' size = {24} style = {{paddingRight: 5}}></Ionicons>
                        <Text style = {globalStyles.buttonText}>Canjear promoción</Text>
                    </TouchableOpacity>

                </View>

                
            </View>
        </SafeAreaView>
    )
}