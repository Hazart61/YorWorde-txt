import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';
import { logout } from '../storage/userStorage';

const DICTIONARIES = [
  {
    id: '1',
    title: 'Тестовый словарь',
    description: 'Слова, которые вы добавите, попадут сюда',
    color: colors.purple,
  },
];

export default function MyDictionariesScreen({ userName, navigation, onLogout }) {
  const [query, setQuery] = useState('');

  const filtered = DICTIONARIES.filter((d) =>
    d.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  const handleLogout = () => {
    Alert.alert('Выйти из аккаунта?', 'Данные словаря сохранятся в БД.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: async () => {
          await logout();
          if (onLogout) onLogout();
        },
      },
    ]);
  };

  const handleOpenDictionary = (dict) => {
    navigation.navigate('Words', { dictionaryTitle: dict.title });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => handleOpenDictionary(item)}
    >
      <View style={[styles.cardIcon, { backgroundColor: item.color }]}>
        <Text style={styles.cardIconText}>❐</Text>
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardMeta}>{item.description}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
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
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Выйти</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Мои словари</Text>

      {/* Поиск словарей */}
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

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.empty}>Словари не найдены</Text>
        }
      />
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
  logoutBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  logoutText: { color: colors.primary, fontWeight: '600', fontSize: 14 },

  title: { fontSize: 26, fontWeight: 'bold', color: colors.textPrimary, marginTop: 8 },

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

  listContent: { paddingTop: 16, paddingBottom: 20 },
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
  chevron: { fontSize: 26, color: colors.textDisabled, marginLeft: 8 },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 20 },
});