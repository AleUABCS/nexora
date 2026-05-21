import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore"; 
import { getFirestore } from "firebase/firestore";
import appFirebase from '../credenciales.js'
import {getAuth} from 'firebase/auth';
const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';

export default function registerBusinessScreen(){
    const [nameBusiness, setNameBusiness] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const router = useRouter();
    //para saber si es numero valido
    const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    //Para saber si es un email valido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleRegisterBusiness = async() => {
      const usuarioActual = auth.currentUser;
      if(!usuarioActual){
        Alert.alert('Aviso', 'Usuario no logueado');
          return;
      }
      if(nameBusiness === '' || description === '' ||  phone === '' || email === '') {
          Alert.alert('Aviso', 'Por favor llena todos los campos');
          return;
      }
      if(!regex.test(phone)){
          Alert.alert('Aviso', 'El numero no es valido');
          return;
      }
      if(!emailRegex.test(email)){
          Alert.alert('Aviso', 'El email no es valido');
          return;
      }
      
      try {
          const newBusiness = {
            nombreNegocio :nameBusiness,
            userId:usuarioActual.uid,
            descripcion: description,
            telefonoNegocio: phone,
            emailNegocio:email,
            createdAt: new Date().toISOString()
          };
          await addDoc(collection(db, "negocios"), newBusiness);
    
          Alert.alert('Éxito', 'Negocio registrado');
          router.back();
      } catch (error) {
        console.log(error)
      }
    };

    return (
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.mainContainer}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.innerContainer}>
              
              <View style={styles.headerContainer}>
                
                <Text style={styles.titleText}>Registro negocio</Text>
              </View>

              <View style={styles.card}>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nombre del Negocio</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="nombre del completo"
                    placeholderTextColor="#A0A0A0"
                    value={nameBusiness}
                    onChangeText={setNameBusiness}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Correo del Negocio</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="correo@gmail.com"
                    placeholderTextColor="#A0A0A0"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Numero Celular</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="612-210-2101"
                    placeholderTextColor="#A0A0A0"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
    
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Descripcion</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="· · · · · · · ·"
                    placeholderTextColor="#A0A0A0"
                    value={description}
                    onChangeText={setDescription}
                    secureTextEntry
                  />
                </View>
    
                <TouchableOpacity style={styles.button} onPress={handleRegisterBusiness}>
                  <Text style={styles.buttonText}>Registrar Negocio</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#155EEF', 
    fontStyle: 'italic',
    marginBottom: 20,
    letterSpacing: 1,
  },
  titleText: {
    fontSize: 32,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 8,
    fontWeight: '500',
    marginLeft: 4,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#333333',
  },
  registerText: {
    fontSize: 14,
    color: '#0056D2', 
    fontWeight: '600',
  },
});