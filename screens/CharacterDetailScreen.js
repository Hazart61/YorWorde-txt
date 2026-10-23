import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';

export default function CharacterDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [char, setChar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://rickandmortyapi.com/api/character/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setChar(data);
        setLoading(false);
      })
      .catch(() => {
        alert('Ошибка загрузки персонажа');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Назад</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Информация о персонаже</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: char.image }} style={styles.image} />
        <Text style={styles.name}>{char.name}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoRow}>🧬 Статус: {char.status}</Text>
          <Text style={styles.infoRow}>👽 Вид: {char.species}</Text>
          <Text style={styles.infoRow}>🚻 Пол: {char.gender}</Text>
          <Text style={styles.infoRow}>🌍 Локация: {char.location.name}</Text>
        </View>

        <TouchableOpacity style={styles.backBtnBottom} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnTextBottom}>← Назад</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backBtn: { marginBottom: 8 },
  backText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.textPrimary },

  content: { padding: 20, alignItems: 'center' },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  name: { fontSize: 26, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 20 },

  infoBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.divider,
    marginBottom: 20,
  },
  infoRow: { fontSize: 16, color: colors.textPrimary, marginBottom: 10, fontWeight: '500' },

  backBtnBottom: {
    backgroundColor: '#67BA80', // Зеленый цвет как в методичке
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 10,
  },
  backBtnTextBottom: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});