import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import { colors } from '../styles/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email.trim()) {
      alert('Введите логин');
      return;
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home', params: { userName: email.trim() } }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

          <View style={styles.header}>
            <Text style={styles.title}>Вход в аккаунт</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="example@mail.com"
              placeholderTextColor={colors.textDisabled}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Пароль</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, { flex: 1, borderWidth: 0 }]}
                placeholder="••••••••"
                placeholderTextColor={colors.textDisabled}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(v => !v)}>
                <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotWrapper}>
              <Text style={styles.forgotText}>Забыли пароль?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>Войти</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>или</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.85} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.secondaryBtnText}>Зарегистрироваться</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32, justifyContent: 'space-between' },
  header: { marginTop: 0, marginBottom: 32 },
  title: { fontSize: 28, lineHeight: 36, fontWeight: 'bold', color: colors.textPrimary, textAlign: 'center', marginTop: 100 },
  form: { flex: 1, justifyContent: 'center' },
  label: { fontSize: 14, lineHeight: 20, color: colors.textSecondary, marginBottom: 8, fontWeight: '500' },
  input: { height: 52, backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.divider, paddingHorizontal: 16, fontSize: 16, color: colors.textPrimary },
  passwordWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.divider, height: 52, paddingRight: 8 },
  eyeBtn: { paddingHorizontal: 12 },
  eyeText: { fontSize: 18 },
  forgotWrapper: { alignSelf: 'flex-end', marginTop: 12, marginBottom: 24 },
  forgotText: { fontSize: 14, lineHeight: 20, color: colors.primary, fontWeight: '500' },
  primaryBtn: { height: 52, backgroundColor: colors.primary, borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 4 },
  primaryBtnText: { fontSize: 16, lineHeight: 20, fontWeight: '600', color: '#FFFFFF' },
  secondaryBtn: { height: 52, backgroundColor: 'transparent', borderRadius: 12, borderWidth: 1.5, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { fontSize: 16, lineHeight: 20, fontWeight: '600', color: colors.primary },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.divider },
  dividerText: { marginHorizontal: 12, fontSize: 14, color: colors.textSecondary },
});