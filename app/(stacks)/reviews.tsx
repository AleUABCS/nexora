import { Ionicons } from '@expo/vector-icons';
import * as React from "react";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, globalStyles } from "../../constants/globalStyles";
export default function () {
    // const removeSaved = (savedId: number) => {
        
    // }

    const [saved, setSaved] = useState ([
        {id: 0, name: 'Reseña 1', reviewId: '', stars: 5},
        {id: 1, name: 'Resheña 2', reviewId: '', stars: 4},
        {id: 2, name: 'Resña 3', reviewId: '', stars: 2}
    ])

    const removeSaved = (savedId: number) => {
        setSaved(prev => prev.filter (item => item.id !== savedId))
    }

    return (
        <SafeAreaView style = {globalStyles.mainContainer}> 
        <View style = {globalStyles.card}>
            <FlatList
            data={saved}
            keyExtractor={(item => item.id.toString())}
            renderItem={({item}) => (
                <View
                style = {globalStyles.listItem}
                >
                    <Text style={globalStyles.listItemText}>{item.name}</Text>
                    <TouchableOpacity style = {globalStyles.listItem} onPress={() => removeSaved(item.id)}>
                        {
                            [...Array(item.stars)].map((_, index) => (
                                <Ionicons
                                key={index}
                                name='star'
                                style={{color: colors.mainBlue}}
                                />
                            ))
                        }
                    </TouchableOpacity>
                </View>
            )}
            >
                <View></View>
            </FlatList>
        </View>
    </SafeAreaView>
    )
}