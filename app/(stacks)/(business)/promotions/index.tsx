import { globalStyles } from "@/constants/globalStyles";
import appFirebase from "@/credenciales";
import { useRouter } from 'expo-router';
import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getFirestore, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const auth = getAuth(appFirebase)

const db = getFirestore(appFirebase);


const chip_icon = require('../../../../assets/images/chip.png')

export default function PromotionsView () {
    const router = useRouter()
    //Datos de prueba
    // Needed es la cantidad de fichas necesarias para conseguir la promoción
    // Completed es la cantidad de fichas que el usuario ya tiene de esa promoción
    // const [promotions, setPromotions] = useState ([
    //     {id: 0, name: 'Promocion 1', completed: 1, needed: 3},
    //     {id: 1, name: 'Promocion promoisodsojda', completed: 2, needed: 3},
    //     {id: 2, name: 'NO sé promo ayuda', completed: 2, needed: 4}
    // ])
    
    // const removeSaved = (savedId: number) => {
    //     setPromotions(prev => prev.filter (item => item.id !== savedId))
    // } 

    const useMyPromotions = (user_id: string) => {
    const [promotions, setPromotions] = useState<any[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ref = collection(db, 'userPromotions')

        const unsub = onSnapshot(ref, async (snapshot) => {
        // Filtrar manualmente los que son del usuario
        const myDocs = snapshot.docs.filter(d => d.id.startsWith(user_id));

        const data = await Promise.all(
            myDocs.map(async (docSnap) => {
            const d = docSnap.data();

            const promoSnap = await getDoc(
                doc(db, 'negocios', d.business_id, 'promociones', d.promotion_id)
            );
            const promo = promoSnap.data()

            return {
                id: docSnap.id,
                tokensEarned: d.tokensEarned,
                isCompleted: d.isCompleted,
                name: promo?.name,
                description: promo?.description,
                totalTokens: promo?.totalTokens,
                startDate: promo?.startDate?.toDate().toLocaleDateString('es-MX'),
                endDate: promo?.endDate?.toDate().toLocaleDateString('es-MX'),
                business_id: d.business_id,
                };
            })
        );

        setPromotions(data);
        setLoading(false);
        });

        return () => unsub();
    }, [user_id]);

    return { promotions, loading }
    }

    const {promotions, loading} = useMyPromotions(auth.currentUser?.uid as string)


    if (loading) return <ActivityIndicator/>
    
    return (
        <SafeAreaView style = {globalStyles.mainContainer}> 
            <View style = {globalStyles.secondContainer}>
                <View style = {{alignItems: 'center', marginTop: 50}}>
                    <Image
                    source={chip_icon}
                    />
                    <Text style = {globalStyles.titleText}>  Promociones   en curso</Text>
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
                                    router.push({
                                        pathname: `/customer-promotions/${item.id}`,
                                        params: {id: item.id, name: item.name, description: item.description, times: item.totalTokens, end_date: item.endDate, tokens_earned: item.tokensEarned, business_id: item.business_id}
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

                                <View style = {{flexDirection: 'row'}}>
                                    <Image source={chip_icon} style = {{width: 26, height: 26}}/> 
                                    <Text style = {{alignSelf: 'center', textAlign: 'right'}}>{item.tokensEarned}/{item.totalTokens}</Text>
                                </View>
                            </TouchableOpacity>
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