import { StyleSheet } from "react-native"
export const colors = {
    placeHolder: "#A1A1A1",
    warn: "#ff0800",
    mainBlue: "#0056D2",
    regularText: "#656565",
    secondaryBlue: "#E7EEFF",
    promotion: "#3900BF",
    promotionText: "#2A008C",
    disabled: '#CCCCCC',
}

export const iconStyles = {
    listIcon: {
        size: 32,
    },
    mainBlue: "#0056D2",
    secondaryBlue: "#E8F0FE",
    regularText: "#555555",
    promotion: "#0056D2",
}

export const globalStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    secondContainer: {
        backgroundColor: '#FFFFFF',
        margin: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5, 
        marginBottom: 30,
    },
    horizontalLine: {
        borderBottomColor: '#CCCCCC',
        borderBottomWidth: 1,
        marginBottom: 20,
        marginTop: 10,
    },
    
    titleText: {
        fontSize: 38,
        alignSelf: 'center',
        marginTop: 20,
        textAlign: 'center',
    },
    input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 20,
    paddingVertical: 0,
    paddingHorizontal: 6,
    fontSize: 15,
    color: '#000',
    backgroundColor: '#FAFAFA',
    },
    button: {
        backgroundColor: '#0056D2', 
        borderRadius: 12,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 15,
        flexDirection: 'row'
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    listItem: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    listItemText: {
        color: colors.regularText,
        fontSize: 16,
    },
})