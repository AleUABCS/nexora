import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { collection, getDocs, getFirestore } from 'firebase/firestore';

import React, { useEffect, useState } from 'react';

import {

  FlatList,

  StyleSheet,

  Text,

  TextInput,

  TouchableOpacity,

  View

} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import appFirebase from '../../credenciales.js';



const db = getFirestore(appFirebase);



const CATEGORIES = [

  { id: '1', name: 'Abarrotes y Tienditas', icon: 'store', type: 'FontAwesome5' },

  { id: '2', name: 'Barberías', icon: 'cut', type: 'Ionicons' },

  { id: '3', name: 'Cafeterías', icon: 'coffee', type: 'FontAwesome5' },

  { id: '4', name: 'Farmacias', icon: 'medkit', type: 'Ionicons' },

  { id: '5', name: 'Ferreterías', icon: 'hammer', type: 'FontAwesome5' },

  { id: '6', name: 'Gimnasios', icon: 'dumbbell', type: 'FontAwesome5' },

  { id: '7', name: 'Mecánicos y Talleres', icon: 'wrench', type: 'FontAwesome5' },

  { id: '8', name: 'Pizzerías', icon: 'pizza-slice', type: 'FontAwesome5' },

  { id: '9', name: 'Purificadoras', icon: 'water', type: 'Ionicons' },

  { id: '10', name: 'Veterinarias', icon: 'paw', type: 'FontAwesome5' },

];



export default function HomeScreen() {

  const [negocios, setNegocios] = useState<any[]>([]);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);



  useEffect(() => {

    const obtenerNegocios = async () => {

      try {

        const querySnapshot = await getDocs(collection(db, 'negocios'));

        const lista = querySnapshot.docs.map(doc => ({

          id: doc.id,

          ...doc.data()

        }));

        setNegocios(lista);

      } catch (error) {

        console.error("Error al obtener los datos: ", error);

      }

    };



    obtenerNegocios();

  }, []);



  const manejarSeleccionCategoria = (nombreCategoria: string) => {

    if (categoriaSeleccionada === nombreCategoria) {

      setCategoriaSeleccionada(null);

    } else {

      setCategoriaSeleccionada(nombreCategoria);

    }

  };





  const negociosFiltrados = categoriaSeleccionada

    ? negocios.filter(negocio => negocio?.categoriaNegocio?.toLowerCase() === categoriaSeleccionada.toLowerCase())

    : negocios;



  const renderCategoryItem = ({ item }: { item: any }) => {

    const estaSeleccionado = categoriaSeleccionada === item.name;



    return (

      <TouchableOpacity 

        style={styles.categoryButton}

        onPress={() => manejarSeleccionCategoria(item.name)}

      >

        <View style={[styles.iconContainer, estaSeleccionado && styles.iconContainerSelected]}>

          {item.type === 'FontAwesome5' && <FontAwesome5 name={item.icon} size={22} color={estaSeleccionado ? '#FFFFFF' : '#155EEF'} />}

          {item.type === 'Ionicons' && <Ionicons name={item.icon} size={24} color={estaSeleccionado ? '#FFFFFF' : '#155EEF'} />}

          {item.type === 'MaterialCommunityIcons' && <MaterialCommunityIcons name={item.icon} size={24} color={estaSeleccionado ? '#FFFFFF' : '#155EEF'} />}

        </View>

        <Text style={[styles.categoryText, estaSeleccionado && styles.categoryTextSelected]} numberOfLines={2}>

          {item.name}

        </Text>

      </TouchableOpacity>

    );

  };



  const renderBusiness = ({ item }: { item: any }) => {

    return (

      <View style={styles.businessCard}>

        <Text style={styles.businessName}>{item.nombreNegocio || item.nombre}</Text>

        <Text style={styles.businessDetail}>Categoría: {item.categoriaNegocio || 'Sin categoría'}</Text>

        <Text style={styles.businessDetail}>Descripción: {item.descripcion}</Text>

        <Text style={styles.businessDetail}>Teléfono: {item.telefonoNegocio}</Text>

        <Text style={styles.businessDetail}>Email: {item.emailNegocio}</Text>

      </View>

    );

  };



  return (

    <SafeAreaView style={styles.mainContainer}>

      <View style={styles.innerContainer}>

        

        <View style={styles.searchContainer}>

          <TextInput 

            style={styles.searchInput}

            placeholder="Buscar..."

            placeholderTextColor="#A0A0A0"

          />

          <Ionicons name="search" size={22} color="#A0A0A0" style={styles.searchIcon} />

        </View>



        <View style={styles.categoriesSection}>

          <FlatList

            data={CATEGORIES}

            renderItem={renderCategoryItem}

            keyExtractor={(item) => item.id}

            horizontal

            showsHorizontalScrollIndicator={false}

            contentContainerStyle={styles.categoriesList}

          />

        </View>



        <View style={styles.businessSection}>

          <FlatList

            data={negociosFiltrados}

            renderItem={renderBusiness}

            keyExtractor={(item) => item.id}

            showsVerticalScrollIndicator={false}

            ListEmptyComponent={

              <Text style={{ textAlign: 'center', marginTop: 20, color: '#667085' }}>

                No hay negocios disponibles en esta categoría.

              </Text>

            }

          />

        </View>



      </View>

    </SafeAreaView>

  );

}



const styles = StyleSheet.create({

  mainContainer: {

    flex: 1,

    backgroundColor: '#FFFFFF',

  },

  innerContainer: {

    flex: 1,

    paddingHorizontal: 20,

    paddingTop: 10,

  },

  searchContainer: {

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#FFFFFF',

    borderWidth: 1,

    borderColor: '#E5E5E5',

    borderRadius: 20,

    paddingHorizontal: 15,

    height: 50,

    marginBottom: 25,

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.05,

    shadowRadius: 5,

    elevation: 2,

  },

  searchInput: {

    flex: 1,

    fontSize: 16,

    color: '#000000',

  },

  searchIcon: {

    marginLeft: 10,

  },

  categoriesSection: {

    marginBottom: 20,

  },

  categoriesList: {

    paddingVertical: 5,

  },

  categoryButton: {

    alignItems: 'center',

    width: 75,

    marginRight: 12,

  },

  iconContainer: {

    borderRadius: 8,

    width: 60,

    height: 60,

    backgroundColor: '#EEF4FF', 

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 8,

  },

  iconContainerSelected: {

    backgroundColor: '#155EEF',

  },

  categoryText: {

    fontSize: 11,

    color: '#155EEF',

    textAlign: 'center',

    fontWeight: '500',

  },

  categoryTextSelected: {

    fontWeight: 'bold',

    color: '#003fbd',

  },

  businessSection: {

    flex: 1,

    marginTop: 10,

  },

  businessCard: {

    backgroundColor: '#FFFFFF',

    borderWidth: 1,

    borderColor: '#F0F0F0',

    borderRadius: 12,

    padding: 16,

    marginBottom: 12,

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.03,

    shadowRadius: 4,

    elevation: 1,

  },

  businessName: {

    fontSize: 16,

    fontWeight: 'bold',

    color: '#101828',

    marginBottom: 6,

  },

  businessDetail: {

    fontSize: 13,

    color: '#667085',

    marginBottom: 2,

  },

});