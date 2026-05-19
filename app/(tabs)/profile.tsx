import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import appFirebase from '../../credenciales.js';

const auth = getAuth(appFirebase);

export default function ProfileScreen() {

  const menuItems = [
    { id: '1', title: 'Guardados', icon: 'bookmark-outline' },
    { id: '2', title: 'Reseñas publicadas', icon: 'star-outline' },
    { id: '3', title: 'Citas agendadas', icon: 'calendar-outline' },
    { id: '4', title: 'Fichas conseguidas', icon: 'ribbon-outline' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.mainContainer} contentContainerStyle={styles.contentContainer}>
      
      <View style={styles.avatarContainer}>
        <View style={styles.avatarBackground}>
          <Ionicons name="person" size={85} color="#4D82F3" style={styles.avatarIcon} />
        </View>
      </View>

      <View style={styles.card}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem} activeOpacity={0.6}>
            <View style={styles.iconWrapper}>
              <Ionicons name={item.icon as any} size={22} color="#155EEF" />
            </View>
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} activeOpacity={0.7}>
        <Ionicons name="log-out-outline" size={18} color="#D92D20" />
        <Text style={styles.signOutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 40,
  },
  avatarContainer: {
    marginBottom: 40,
  },
  avatarBackground: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#E4EFFF', 
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarIcon: {
    marginTop: 15, 
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '85%',
    paddingVertical: 14,
    paddingHorizontal: 20,
    // Sombras para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    // Sombras para Android
    elevation: 4,
    marginBottom: 50,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  iconWrapper: {
    width: 30,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#475467',
    fontWeight: '500',
    marginLeft: 14,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#FEF3F2', 
    borderWidth: 1,
    borderColor: '#FECDCA',
  },
  signOutText: {
    fontSize: 14,
    color: '#B42318',
    fontWeight: '600',
    marginLeft: 8,
  },
});