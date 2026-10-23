import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../styles/colors';
import { getAllDictionaries, deleteDictionary, getWordCountByDictionary } from '../db/database';

export default function MyDictionariesScreen({ userName, navigation }) {
  const [query, setQuery] = useState('');
  const [dictionaries, setDictionaries] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDictionaries = async () => {
    try {
      const list = await getAllDictionaries();
      const withCounts = await Promise.all(
        list.map(async (dict) => ({
          ...dict,
          wordCount: await getWordCountByDictionary(dict.id),
        }))
      );
      setDictionaries(withCounts);
    } catch (e) {
      console.warn('Ошибка загрузки словарей:', e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      (async () => {
        try {
          const list = await getAllDictionaries();
          const withCounts = await Promise.all(
            list.map(async (dict) => ({
              ...dict,
              wordCount: await getWordCountByDictionary(dict.id),
            }))
          );
          if (active) setDictionaries(withCounts);
        } catch (e) {
          console.warn('Ошибка загрузки словарей:', e);
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  const filtered = dictionaries.filter((d) =>
    d.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  const handleDeleteDictionary = (id, title) => {
    Alert.alert(
      'Удалить словарь?',
      `Словарь «${title}» и все его слова будут удалены.`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDictionary(id);
              loadDictionaries();
            } catch (e) {
              console.warn('Ошибка удаления словаря:', e);
              Alert.alert('Ошибка', 'Не удалось удалить словарь');
            }
          },
        },
      ]
    );
  };

  const handleOpenDictionary = (dict) => {
    navigation.navigate('Words', {
      dictionaryId: dict.id,
      dictionaryTitle: dict.title,
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => handleOpenDictionary(item)}
      onLongPress={() => handleDeleteDictionary(item.id, item.title)}
    >
      <View style={[styles.cardIcon, { backgroundColor: item.color || colors.primary }]}>
        <Text style={styles.cardIconText}>{item.emoji || '❐'}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardMeta}>
          {item.wordCount} слов · {item.description || 'Без описания'}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteIconBtn}
        onPress={() => handleDeleteDictionary(item.id, item.title)}
      >
        <Text style={styles.deleteIconText}>🗑</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.hello}>Добро пожаловать,</Text>
          <Text style={styles.nick} numberOfLines={1}>
            {userName}!
          </Text>
        </View>
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.title}>Мои словари</Text>
      </View>

      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск словарей"
          placeholderTextColor={colors.textDisabled}
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Словарей пока нет</Text>
              <Text style={styles.emptyText}>
                Нажмите «+», чтобы создать первый словарь.
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('CreateDictionary')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    marginBottom: 12,
  },
  hello: { fontSize: 14, color: colors.textSecondary },
  nick: { fontSize: 22, fontWeight: 'bold', color: colors.textPrimary },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  title: { fontSize: 26, fontWeight: 'bold', color: colors.textPrimary },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: colors.textPrimary },
  clearIcon: { fontSize: 16, color: colors.textDisabled, paddingHorizontal: 4 },

  listContent: { paddingTop: 16, paddingBottom: 100 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  cardMeta: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  deleteIconBtn: { padding: 8 },
  deleteIconText: { fontSize: 18 },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyBox: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 32, lineHeight: 34, marginTop: -2 },
});