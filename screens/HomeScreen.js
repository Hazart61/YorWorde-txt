import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { colors } from '../styles/colors';

export default function HomeScreen({ route, navigation }) {
  // Достаём логин, переданный через параметры навигации
  const userName = route.params?.userName ?? 'Гость';

  const handleLogout = () => {
    // Сброс стека: возвращаемся на экран входа, убирая всё из истории
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        <Text style={styles.hello}>Добро пожаловать,</Text>
        <Text style={styles.name}>{userName}!</Text>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Выйти</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  hello: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 40,
    textAlign: 'center',
  },
  primaryBtn: {
    height: 52,
    width: '100%',
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
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});