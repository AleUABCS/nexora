import { colors, globalStyles } from "@/constants/globalStyles"
import { router, useLocalSearchParams } from "expo-router"
import { useRef, useState } from "react"
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function ValidatePromotionView() {

    const { 'promotion-id': promotion_id } = useLocalSearchParams<{ 'promotion-id': string }>()
    const [code, setCode] = useState(['', '', '', ''])
    const [error, setError] = useState(false)
    const inputs = useRef<(TextInput | null)[]>([])

    // Este es el código generado que le sale al cliente y el dueño lo tiene que introducir
    const generated_code = 1234

    function handleInput(value: string, index: number) {
        if (!/^\d?$/.test(value)) return

        const newCode = [...code]
        newCode[index] = value
        setCode(newCode)
        setError(false)

        if (value && index < 3) {
            inputs.current[index + 1]?.focus()
        }
    }

    function handleKeyPress(key: string, index: number) {
        if (key === 'Backspace' && !code[index] && index > 0) {
            inputs.current[index - 1]?.focus()
        }
    }

    function handleValidate() {
        const enteredCode = parseInt(code.join(''))
        if (enteredCode === generated_code) {
            // sumar 1 a completed, marcar promoción como válida, etc.

            Alert.alert(
                'Código correcto',
                'El cliente ha obtenido una ficha',
                [
                    {
                        text: 'Aceptar',
                        onPress: () => router.dismissAll(),
                    },
                ]
            )
        } else {
            setError(true)
            setCode(['', '', '', ''])
            inputs.current[0]?.focus()
        }
    }

    return (
        <SafeAreaView style={globalStyles.mainContainer}>
            <View style={globalStyles.secondContainer}>

                <Text style={styles.title}>Validar ficha</Text>
                <Text style={styles.text}>
                    Ingresa el código de 4 dígitos que muestra el cliente para validar la ficha
                </Text>

                <View style={styles.codeContainer}>
                    {code.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => { inputs.current[index] = ref }}
                            style={[styles.codeInput, error && styles.codeInputError]}
                            value={digit}
                            onChangeText={(val) => handleInput(val, index)}
                            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            textAlign="center"
                        />
                    ))}
                </View>

                {error && (
                    <Text style={styles.errorText}>Código incorrecto, intenta de nuevo</Text>
                )}

                <TouchableOpacity
                    style={{
                        ...globalStyles.button,
                        backgroundColor: colors.promotion,
                        height: 50,
                        marginTop: 40,
                    }}
                    onPress={handleValidate}
                    disabled={code.some(d => d === '')}
                >
                    <Text style={{...globalStyles.buttonText}}>Validar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ ...globalStyles.button, height: 50 }}
                    onPress={() => router.back()}
                >
                    <Text style={{ ...globalStyles.buttonText }}>Cancelar</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.regularText,
        alignSelf: 'center',
        marginTop: 50,
    },
    text: {
        fontSize: 16,
        color: colors.regularText,
        alignSelf: 'center',
        marginTop: 20,
        width: '80%',
        textAlign: 'justify',
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginTop: 40,
    },
    codeInput: {
        width: 60,
        height: 70,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.promotion,
        fontSize: 32,
        fontWeight: '500',
        color: colors.regularText,
    },
    codeInputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 12,
        fontSize: 14,
    },
})