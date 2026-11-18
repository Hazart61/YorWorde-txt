// View: экран регистрации. Состояние и валидация — в useRegisterViewModel.
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
import { colors } from '../../theme/colors';
import { useRegisterViewModel } from '../../viewmodels/useRegisterViewModel';

export default function RegisterScreen({ navigation }) {
  const vm = useRegisterViewModel();

  const handleRegister = async () => {
    const result = await vm.submit();
    if (!result.ok) {
      if (result.error) Alert.alert('Ошибка', result.error);
      return;
    }
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'MainTabs',
          params: { userName: result.value.name, userEmail: result.value.email },
        },
      ],
    });
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
            <Text style={styles.title}>Создать аккаунт</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Логин</Text>
            <TextInput
              style={styles.input}
              placeholder="User Name"
              placeholderTextColor={colors.textDisabled}
              autoCapitalize="words"
              value={vm.name}
              onChangeText={vm.setName}
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="testemalelol@mail.com"
              placeholderTextColor={colors.textDisabled}
              keyboardType="email-address"
              autoCapitalize="none"
              value={vm.email}
              onChangeText={vm.setEmail}
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Пароль</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, { flex: 1, borderWidth: 0 }]}
                placeholder="*********"
                placeholderTextColor={colors.textDisabled}
                secureTextEntry={!vm.showPassword}
                value={vm.password}
                onChangeText={vm.setPassword}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={vm.toggleShowPassword}>
                <Text style={styles.eyeText}>{vm.showPassword ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { marginTop: 16 }]}>
              Подтвердите пароль
            </Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, { flex: 1, borderWidth: 0 }]}
                placeholder="*********"
                placeholderTextColor={colors.textDisabled}
                secureTextEntry={!vm.showConfirm}
                value={vm.confirmPassword}
                onChangeText={vm.setConfirmPassword}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={vm.toggleShowConfirm}>
                <Text style={styles.eyeText}>{vm.showConfirm ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.checkboxRow}
              activeOpacity={0.7}
              onPress={vm.toggleAgree}
            >
              <View style={[styles.checkbox, vm.agree && styles.checkboxChecked]}>
                {vm.agree && <Text style={styles.checkboxMark}>✓</Text>}
              </View>
              <Text style={styles.checkboxText}>
                Я согласен с{' '}
                <Text style={styles.checkboxLink}>условиями использования</Text>{' '}
                и <Text style={styles.checkboxLink}>политикой конфиденциальности</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryBtn, !vm.canSubmit && styles.primaryBtnDisabled]}
              onPress={handleRegister}
              activeOpacity={0.85}
              disabled={!vm.canSubmit}
            >
              <Text style={styles.primaryBtnText}>Зарегистрироваться</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>или</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.secondaryBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.secondaryBtnText}>Уже есть аккаунт? Войти</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  header: { marginBottom: 24 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 20,
  },
  form: { flex: 1, justifyContent: 'center' },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 52,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.textPrimary,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    height: 52,
    paddingRight: 8,
  },
  eyeBtn: { paddingHorizontal: 12 },
  eyeText: { fontSize: 18 },
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 20, marginBottom: 24 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkboxMark: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  checkboxText: { flex: 1, fontSize: 13, lineHeight: 19, color: colors.textSecondary },
  checkboxLink: { color: colors.primary, fontWeight: '500' },
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
  primaryBtnDisabled: { backgroundColor: colors.textDisabled, shadowOpacity: 0, elevation: 0 },
  primaryBtnText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  secondaryBtn: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { fontSize: 16, fontWeight: '600', color: colors.primary },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.divider },
  dividerText: { marginHorizontal: 12, fontSize: 14, color: colors.textSecondary },
});
