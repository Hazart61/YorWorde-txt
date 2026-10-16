import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';
import { addWord } from '../db/database';

export default function AddWordScreen({ navigation }) {
  const [word, setWord] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmedWord = word.trim();
    if (!trimmedWord) {
      Alert.alert('Ошибка', 'Введите слово');
      return;
    }

    try {
      setSaving(true);
      await addWord({
        word: trimmedWord,
        category: category.trim(),
        description: description.trim(),
      });
      navigation.goBack();
    } catch (e) {
      console.warn('Ошибка сохранения слова:', e);
      Alert.alert('Ошибка', 'Не удалось сохранить слово');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backText}>← Назад</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Новое слово</Text>
            <Text style={styles.subtitle}>
              Добавим новое слово в словарь?
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Слово *</Text>
            <TextInput
              style={styles.input}
              placeholder="Например: serendipity"
              placeholderTextColor={colors.textDisabled}
              autoCapitalize="none"
              autoCorrect={false}
              value={word}
              onChangeText={setWord}
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Категория</Text>
            <TextInput
              style={styles.input}
              placeholder="Например: существительное"
              placeholderTextColor={colors.textDisabled}
              autoCapitalize="none"
              value={category}
              onChangeText={setCategory}
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Описание</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Что означает это слово..."
              placeholderTextColor={colors.textDisabled}
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />

            <TouchableOpacity
              style={[styles.primaryBtn, saving && styles.primaryBtnDisabled]}
              onPress={handleSave}
              activeOpacity={0.85}
              disabled={saving}
            >
              <Text style={styles.primaryBtnText}>
                {saving ? 'Сохранение...' : 'Сохранить'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryBtnText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 40 },

  header: { marginBottom: 24 },
  backBtn: { alignSelf: 'flex-start', paddingVertical: 4 },
  backText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },

  form: { flex: 1 },

  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.textPrimary,
  },
  textArea: { minHeight: 120 },

  primaryBtn: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  secondaryBtn: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  secondaryBtnText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
});