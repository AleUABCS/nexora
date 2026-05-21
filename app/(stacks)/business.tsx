import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../../constants/globalStyles";

export default function BusinessView () {

    return (
        <SafeAreaView style = {globalStyles.mainContainer}> 

         <View><Text>hola</Text></View>

        </SafeAreaView>
    )

}