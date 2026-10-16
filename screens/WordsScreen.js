import React, { useCallback, useMemo, useState } from 'react';
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
import { getAllWords, deleteWord } from '../db/database';

export default function WordsScreen({ route, navigation }) {
  const dictionaryTitle = route.params?.dictionaryTitle ?? 'Словарь';

  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const all = await getAllWords();
          if (active) setWords(all);
        } catch (e) {
          console.warn('Ошибка загрузки слов:', e);
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  // Фильтрация по слову / категории / описанию
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return words;
    return words.filter((w) => {
      const word = (w.word ?? '').toLowerCase();
      const cat = (w.category ?? '').toLowerCase();
      const desc = (w.description ?? '').toLowerCase();
      return word.includes(q) || cat.includes(q) || desc.includes(q);
    });
  }, [words, query]);

  const handleDelete = (id, word) => {
    Alert.alert('Удалить слово?', `«${word}» будет удалено из словаря.`, [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          await deleteWord(id);
          const all = await getAllWords();
          setWords(all);
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.word}>{item.word}</Text>
        {item.category ? (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        ) : null}
      </View>

      {item.description ? (
        <Text style={styles.description}>{item.description}</Text>
      ) : null}

      <TouchableOpacity
        onPress={() => handleDelete(item.id, item.word)}
        style={styles.deleteBtn}
      >
        <Text style={styles.deleteText}>Удалить</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => {
    if (loading) return null;
    const emptyText = query
      ? 'По запросу ничего не найдено'
      : 'Нажмите «+», чтобы добавить первое слово.';
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyTitle}>
          {query ? 'Ничего не найдено' : 'Словарь пуст'}
        </Text>
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Назад</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {dictionaryTitle}
        </Text>
        <Text style={styles.counter}>
          Всего слов: <Text style={styles.counterNumber}>{words.length}</Text>
        </Text>
      </View>

      {/* Поиск слов */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск слов"
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
          ListEmptyComponent={renderEmpty}
        />
      )}

      {/* Кнопка «+» — поднята выше от нижнего края */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('AddWord')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  backBtn: { alignSelf: 'flex-start', paddingVertical: 4 },
  backText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 8,
  },
  counter: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  counterNumber: { color: colors.primary, fontWeight: '700' },

  // Поиск
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: colors.textPrimary },
  clearIcon: { fontSize: 16, color: colors.textDisabled, paddingHorizontal: 4 },

  listContent: { paddingHorizontal: 20, paddingBottom: 180 },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  word: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  categoryBadge: {
    backgroundColor: '#EFEAFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  categoryText: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },
  deleteBtn: { alignSelf: 'flex-start', marginTop: 12 },
  deleteText: { color: colors.error, fontSize: 13, fontWeight: '600' },

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

  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
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