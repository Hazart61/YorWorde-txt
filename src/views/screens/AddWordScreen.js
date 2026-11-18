import React from 'react';
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
import { useTheme } from '../../theme/ThemeContext';
import { useAddWordViewModel } from '../../viewmodels/useAddWordViewModel';

export default function AddWordScreen({ navigation, route }) {
  const { isDark, colors } = useTheme();
  const dictionaryId = route.params?.dictionaryId;
  const dictionaryTitle = route.params?.dictionaryTitle || 'Словарь';

  const vm = useAddWordViewModel(dictionaryId);

  const handleSave = async () => {
    const result = await vm.save();
    if (result.ok) {
      navigation.goBack();
    } else {
      Alert.alert('Ошибка', result.error);
    }
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

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
            <Text style={styles.title}>Новое слово</Text>
            <Text style={styles.subtitle}>
              Добавим новое слово в словарь «{dictionaryTitle}»?
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
              value={vm.word}
              onChangeText={vm.setWord}
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Категория</Text>
            <TextInput
              style={styles.input}
              placeholder="Например: существительное"
              placeholderTextColor={colors.textDisabled}
              autoCapitalize="none"
              value={vm.category}
              onChangeText={vm.setCategory}
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Описание</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Что означает это слово..."
              placeholderTextColor={colors.textDisabled}
              multiline
              textAlignVertical="top"
              value={vm.description}
              onChangeText={vm.setDescription}
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Пример</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Предложение, где используется это слово..."
              placeholderTextColor={colors.textDisabled}
              multiline
              textAlignVertical="top"
              value={vm.example}
              onChangeText={vm.setExample}
            />

            <TouchableOpacity
              style={[styles.primaryBtn, vm.isSaving && styles.primaryBtnDisabled]}
              onPress={handleSave}
              activeOpacity={0.85}
              disabled={vm.isSaving}
            >
              <Text style={styles.primaryBtnText}>
                {vm.isSaving ? 'Сохранение...' : 'Сохранить'}
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

const createStyles = (colors) => StyleSheet.create({
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
    lineHeight: 20,
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
  textArea: { minHeight: 100 },

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