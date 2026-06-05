import { colors, globalStyles } from "@/constants/globalStyles";
import { useReviewsStore } from "@/store/review-store";
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReviewsView () {
    const router = useRouter()
    // Datos de prueba
    // const [saved, setSaved] = useState ([
    //     {id: 0, name: 'Negocio 1', reviewId: '1', stars: 5},
    //     {id: 1, name: 'Ngosio 2', reviewId: '2', stars: 4},
    //     {id: 2, name: 'Negocio 3', reviewId: '3', stars: 2}
    // ])

    const { reviews } = useReviewsStore ()

    return (
        <SafeAreaView style = {globalStyles.mainContainer}> 
            <View style = {globalStyles.secondContainer}>
                <View style = {{alignItems: 'center', marginTop: 50}}>
                    <Ionicons
                        name="star-outline" 
                        color={colors.mainBlue} 
                        size={63}
                        style = {{marginTop: 40}}
                    />
                    <Text style = {globalStyles.titleText}>Reseñas publicadas</Text>
                </View>
                <View style = {globalStyles.card}>
                    <FlatList
                    data={reviews}
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
                                onPress={() => router.push(`/${item.id}` as Href)}
                                >
                                <Text style={globalStyles.listItemText}>{item.name}</Text>
                                <View style = {{flexDirection: 'row'}}>
                                    {
                                        [...Array(item.stars)].map((_, index) => (
                                            <Ionicons
                                            key={index}
                                            name='star'
                                            color = {colors.mainBlue}
                                            size={14}
                                            style = {{marginLeft: 5}}
                                            />
                                        ))
                                    }
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