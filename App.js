import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainTabsScreen from './screens/MainTabsScreen';
import WordsScreen from './screens/WordsScreen';
import AddWordScreen from './screens/AddWordScreen';
import CreateDictionaryScreen from './screens/CreateDictionaryScreen';
import GalleryScreen from './screens/GalleryScreen';
import CharacterDetailScreen from './screens/CharacterDetailScreen';

import { initDatabase } from './db/database';
import { colors } from './styles/colors';
import { ThemeProvider } from './styles/ThemeContext'; // Новый путь импорта

const Stack = createNativeStackNavigator();

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await initDatabase();
      } catch (e) {
        console.warn('Ошибка инициализации БД:', e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  if (!ready) {
    return (
      <SafeAreaProvider>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="MainTabs" component={MainTabsScreen} />
            <Stack.Screen name="Words" component={WordsScreen} />
            <Stack.Screen name="AddWord" component={AddWordScreen} />
            <Stack.Screen name="CreateDictionary" component={CreateDictionaryScreen} />
            <Stack.Screen name="Gallery" component={GalleryScreen} />
            <Stack.Screen name="CharacterDetail" component={CharacterDetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});