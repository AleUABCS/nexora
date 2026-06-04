import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as React from "react";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, globalStyles } from "../../constants/globalStyles";
import { useFavoritesStore } from '../../store/saved-store';

export default function SavedView() {
    // const removeSaved = (savedId: number) => {
        
    // }

    const [saved, setSaved] = useState ([
        {id: 0, name: 'negocio 1', businessId: ''},
        {id: 1, name: 'negocio 2', businessId: ''},
        {id: 2, name: 'negocio 3', businessId: ''}
    ])

    const {removeSaved} = useFavoritesStore ()

    return (
        <SafeAreaView style = {globalStyles.mainContainer}> 
        <View style = {globalStyles.secondContainer}>
            <Text style = {{...globalStyles.titleText, marginTop: 50, marginBottom: 30}}>Guardados</Text>
            <View style = {{...globalStyles.card, maxHeight: '50%'}}>
                <FlatList
                data={saved}
                keyExtractor={(item => item.id.toString())}
                renderItem={({item}) => (
                    <View
                    style = {globalStyles.listItem}
                    >
                        <TouchableOpacity style = {{width: '80%'}} onPress={() => router.push(`/(business)${item.businessId}`)}>
                            <Text style={globalStyles.listItemText}>{item.name}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => removeSaved(item.id.toString())}>
                            <Ionicons name="close-circle-outline" size={24} style={{color: colors.warn}}></Ionicons>
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