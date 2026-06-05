import { StyleSheet } from "react-native"

export const colors = {
    placeHolder: "#A1A1A1",
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
    },
    input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#000',
    backgroundColor: '#FAFAFA',
  },
  button: {
    backgroundColor: '#0056D2', 
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
})