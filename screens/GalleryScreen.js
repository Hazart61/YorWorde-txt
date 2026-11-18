import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 30;

export default function GalleryScreen({ navigation }) {
  const [chars, setChars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchCharacters = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`https://rickandmortyapi.com/api/character?page=${pageNum}`);
      const json = await res.json();
      setChars(json.results);
    } catch (e) {
      alert('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters(page);
  }, [page]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('CharacterDetail', { id: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardTextWrapper}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Назад</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Галерея Rick & Morty</Text>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={chars}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
        />
      )}

      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]}
          onPress={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          <Text style={styles.pageBtnText}>← Назад</Text>
        </TouchableOpacity>
        
        <Text style={styles.pageNumber}>Стр. {page}</Text>

        <TouchableOpacity
          style={styles.pageBtn}
          onPress={() => setPage((p) => p + 1)}
        >
          <Text style={styles.pageBtnText}>Вперед →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
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
  title: { fontSize: 22, fontWeight: 'bold', color: colors.textPrimary },
  
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 15, paddingBottom: 20 },
  row: { justifyContent: 'space-between', marginBottom: 15 },
  
  card: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  image: { width: '100%', height: cardWidth },
  cardTextWrapper: { padding: 10, alignItems: 'center' },
  name: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  pageBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  pageBtnDisabled: { backgroundColor: colors.textDisabled },
  pageBtnText: { color: '#fff', fontWeight: '600' },
  pageNumber: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary },
});