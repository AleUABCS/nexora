import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
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
  { id: '1', name: 'Gimnasios', icon: 'dumbbell', type: 'FontAwesome5' },
  { id: '2', name: 'Purificadoras', icon: 'water', type: 'Ionicons' },
  { id: '3', name: 'Tienda de regalos', icon: 'gift', type: 'FontAwesome5' },
  { id: '4', name: 'Supermercados', icon: 'shopping-bag', type: 'FontAwesome5' },
  { id: '5', name: 'Barberias', icon: 'cut', type: 'Ionicons' },
  { id: '6', name: 'Spa´s', icon: 'accessibility', type: 'Ionicons' },
];

export default function HomeScreen() {
  const router = useRouter()
  let selected_business_id = 1

  const [negocios, setNegocios] = useState<any[]>([]);

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

  const renderCategoryItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity style={styles.categoryButton}>
        <View style={styles.iconContainer}>
          {item.type === 'FontAwesome5' && <FontAwesome5 name={item.icon} size={22} color="#155EEF" />}
          {item.type === 'Ionicons' && <Ionicons name={item.icon} size={24} color="#155EEF" />}
          {item.type === 'MaterialCommunityIcons' && <MaterialCommunityIcons name={item.icon} size={24} color="#155EEF" />}
        </View>
        <Text style={styles.categoryText} numberOfLines={2}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderBusiness = ({ item }: { item: any }) => {
    return (
      <Pressable onPress = {() => router.push(`/(stacks)${selected_business_id}`)}>
        <View style={styles.businessCard}>
          <Text style={styles.businessName}>{item.nombreNegocio || item.nombre}</Text>
          <Text style={styles.businessDetail}>Descripción: {item.descripcion}</Text>
          <Text style={styles.businessDetail}>Teléfono: {item.telefonoNegocio}</Text>
          <Text style={styles.businessDetail}>Email: {item.emailNegocio}</Text>
        </View>
      </Pressable>
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
            data={negocios} 
            renderItem={renderBusiness}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false} // Cambiado a vertical para que se vea como lista hacia abajo
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
  categoryText: {
    fontSize: 11,
    color: '#155EEF',
    textAlign: 'center',
    fontWeight: '500',
  },
  // ESTILOS NUEVOS PARA QUE LOS NEGOCIOS SE VEAN BONITOS
  businessSection: {
    flex: 1,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
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