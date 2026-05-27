import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import * as React from "react";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, globalStyles } from "../../../constants/globalStyles";
const router = useRouter()

export default function ReviewsView () {
    //Datos de prueba
    const [saved, setSaved] = useState ([
        {id: 0, name: 'Reseña 1', reviewId: '1', stars: 5},
        {id: 1, name: 'Resheña 2', reviewId: '2', stars: 4},
        {id: 2, name: 'Resña 3', reviewId: '3', stars: 2}
    ])

    const removeSaved = (savedId: number) => {
        setSaved(prev => prev.filter (item => item.id !== savedId))
    } 

    return (
        <SafeAreaView style = {globalStyles.mainContainer}> 
        <View style = {globalStyles.secondContainer}>
            <View style = {globalStyles.card}>
                <FlatList
                data={saved}
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