import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logout } from '../storage/userStorage';
import { clearAllData } from '../db/database';
import { useTheme } from '../styles/ThemeContext'; // Новый путь импорта

export default function SettingsScreen({ onLogout, navigation }) {
  const { isDark, toggleTheme, colors } = useTheme();

  const handleClearData = () => {
    Alert.alert(
      'Удалить все данные?',
      'Все ваши словари и слова будут безвозвратно удалены. Это действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить всё',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert('Успех', 'Все данные успешно удалены.');
            } catch (e) {
              console.warn('Ошибка очистки:', e);
              Alert.alert('Ошибка', 'Не удалось очистить данные.');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Выйти из аккаунта?', 'Данные сохранятся в приложении.', [
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

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Настройки</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Внешний вид</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Тёмная тема</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.divider, true: colors.primary }}
              thumbColor={'#fff'}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Данные</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={handleClearData}>
            <Text style={[styles.rowLabel, { color: colors.error }]}>
              Удалить все словари
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Аккаунт</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={handleLogout}>
            <Text style={[styles.rowLabel, { color: colors.error }]}>Выйти из аккаунта</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.versionWrapper} 
          onPress={() => navigation.navigate('Gallery')}
          activeOpacity={0.6}
        >
          <Text style={styles.version}>YorWorde-txt v1.0.0</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.textPrimary },
  content: { paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.divider,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  rowLabel: { fontSize: 16, color: colors.textPrimary },
  versionWrapper: { marginTop: 30, alignItems: 'center', paddingVertical: 10 },
  version: { fontSize: 12, color: colors.textDisabled },
});