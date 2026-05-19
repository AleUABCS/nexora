import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  FlatList, 
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const CATEGORIES = [
  { id: '1', name: 'Gimnasio', icon: 'dumbbell', type: 'FontAwesome5' },
  { id: '2', name: 'Purificadora', icon: 'water', type: 'Ionicons' },
  { id: '3', name: 'Tienda de regalos', icon: 'gift', type: 'FontAwesome5' },
  { id: '4', name: 'Supermercado', icon: 'shopping-bag', type: 'FontAwesome5' },
];

export default function HomeScreen() {

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

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        
        {/* 3. Barra de Búsqueda */}
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.searchInput}
            placeholder="Buscar..."
            placeholderTextColor="#A0A0A0"
          />
          <Ionicons name="search" size={22} color="#A0A0A0" style={styles.searchIcon} />
        </View>

        {/* 4. Lista Horizontal de Categorías */}
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

        {/* Aquí colocaremos las tiendas más adelante */}

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
});