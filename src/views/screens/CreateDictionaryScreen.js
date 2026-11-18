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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { useCreateDictionaryViewModel } from '../../viewmodels/useCreateDictionaryViewModel';

export default function CreateDictionaryScreen({ navigation }) {
  const { isDark, colors } = useTheme();
  const vm = useCreateDictionaryViewModel(colors.primary);

  // Палитра зависит от темы — это часть отображения, поэтому она во View.
  const COLORS = [
    { id: 'purple', value: colors.purple, name: 'Фиолетовый' },
    { id: 'yellow', value: colors.yellow, name: 'Жёлтый' },
    { id: 'green', value: colors.green, name: 'Зелёный' },
    { id: 'blue', value: colors.blue, name: 'Синий' },
    { id: 'red', value: colors.error, name: 'Красный' },
    { id: 'pink', value: '#EC407A', name: 'Розовый' },
  ];

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
            <Text style={styles.title}>Создать словарь</Text>
            <Text style={styles.subtitle}>Давай создадим новый словарь!</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Название *</Text>
            <TextInput
              style={styles.input}
              placeholder="Например: Python"
              placeholderTextColor={colors.textDisabled}
              value={vm.title}
              onChangeText={vm.setTitle}
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Описание</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="О чём этот словарь?"
              placeholderTextColor={colors.textDisabled}
              multiline
              textAlignVertical="top"
              value={vm.description}
              onChangeText={vm.setDescription}
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Выбери цвет!</Text>
            <View style={styles.colorRow}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color.id}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color.value },
                    vm.selectedColor === color.value && styles.colorCircleSelected,
                  ]}
                  onPress={() => vm.setSelectedColor(color.value)}
                  activeOpacity={0.7}
                >
                  {vm.selectedColor === color.value && (
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
              value={vm.firstWord}
              onChangeText={vm.setFirstWord}
            />

            <TextInput
              style={[styles.input, styles.textAreaSmall, { marginTop: 12 }]}
              placeholder="Описание первого слова..."
              placeholderTextColor={colors.textDisabled}
              multiline
              textAlignVertical="top"
              value={vm.firstWordDesc}
              onChangeText={vm.setFirstWordDesc}
            />
            
            <View style={{ height: 100 }} />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.primaryBtn, vm.isSaving && styles.primaryBtnDisabled]}
            onPress={handleSave}
            activeOpacity={0.85}
            disabled={vm.isSaving}
          >
            {vm.isSaving ? (
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

const createStyles = (colors) => StyleSheet.create({
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