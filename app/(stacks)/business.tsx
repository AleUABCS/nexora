import * as React from "react";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../../constants/globalStyles";

const carousel_images = [
  { id: '1', source: require('../../assets/images/cuyo1.jpg') },
  { id: '2', source: require('../../assets/images/cuyo2.jpg') },
  { id: '3', source: require('../../assets/images/cuyo3.jpg') },
];

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const container_width = width;
const space = 10;
export default function BusinessView () {
    return (

        <SafeAreaView style = {globalStyles.mainContainer}> 

            <FlatList
                data = {carousel_images}
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
})
