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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';
import { addDictionary, addWord } from '../db/database';

const COLORS = [
  { id: 'purple', value: colors.purple, name: 'Фиолетовый' },
  { id: 'yellow', value: colors.yellow, name: 'Жёлтый' },
  { id: 'green', value: '#2E7D32', name: 'Зелёный' },
  { id: 'blue', value: colors.blue, name: 'Синий' },
  { id: 'red', value: colors.error, name: 'Красный' },
  { id: 'pink', value: '#EC407A', name: 'Розовый' },
];

export default function CreateDictionaryScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [firstWord, setFirstWord] = useState('');
  const [firstWordDesc, setFirstWordDesc] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      Alert.alert('Ошибка', 'Введите название словаря');
      return;
    }

    try {
      setSaving(true);
      
      const result = await addDictionary({
        title: trimmedTitle,
        description: description.trim(),
        color: selectedColor,
        emoji: '📘',
      });

      if (firstWord.trim()) {
        const dictionaryId = result.lastInsertRowId; 
        
        await addWord({
          dictionary_id: dictionaryId,
          word: firstWord.trim(),
          category: '',
          description: firstWordDesc.trim(),
          example: '',
        });
      }

      navigation.goBack();
    } catch (e) {
      console.warn('Ошибка создания словаря:', e);
      Alert.alert('Ошибка', 'Не удалось создать словарь');
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
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backText}>← Назад</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Создать словарь</Text>
            <Text style={styles.subtitle}>Давай создадим новый словарь!</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Название *</Text>
            <TextInput
              style={styles.input}
              placeholder="Например: Python"
              placeholderTextColor={colors.textDisabled}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Описание</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="О чём этот словарь?"
              placeholderTextColor={colors.textDisabled}
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Выбери цвет!</Text>
            <View style={styles.colorRow}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color.id}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color.value },
                    selectedColor === color.value && styles.colorCircleSelected,
                  ]}
                  onPress={() => setSelectedColor(color.value)}
                  activeOpacity={0.7}
                >
                  {selectedColor === color.value && (
                    <Text style={styles.colorCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.divider} />

            <Text style={styles.label}>Твое первое слово?</Text>
            <TextInput
              style={styles.input}
              placeholder="Слово (необязательно)"
              placeholderTextColor={colors.textDisabled}
              value={firstWord}
              onChangeText={setFirstWord}
            />

            <TextInput
              style={[styles.input, styles.textAreaSmall, { marginTop: 12 }]}
              placeholder="Описание первого слова..."
              placeholderTextColor={colors.textDisabled}
              multiline
              textAlignVertical="top"
              value={firstWordDesc}
              onChangeText={setFirstWordDesc}
            />
            
            {/* Отступ, чтобы контент не перекрывался кнопками */}
            <View style={{ height: 100 }} />
          </View>
        </ScrollView>

        {/* Блок с кнопками, закрепленный внизу */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.primaryBtn, saving && styles.primaryBtnDisabled]}
            onPress={handleSave}
            activeOpacity={0.85}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Создать</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryBtnText}>Отмена</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 20 },

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
  textArea: { minHeight: 80 },
  textAreaSmall: { minHeight: 60 },

  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorCircleSelected: { borderColor: colors.textPrimary },
  colorCheck: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 20,
  },

  // Нижняя панель с кнопками
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  primaryBtn: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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