import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './src/views/screens/LoginScreen';
import RegisterScreen from './src/views/screens/RegisterScreen';
import MainTabsScreen from './src/views/screens/MainTabsScreen';
import WordsScreen from './src/views/screens/WordsScreen';
import AddWordScreen from './src/views/screens/AddWordScreen';
import CreateDictionaryScreen from './src/views/screens/CreateDictionaryScreen';
import GalleryScreen from './src/views/screens/GalleryScreen';
import CharacterDetailScreen from './src/views/screens/CharacterDetailScreen';
import LoadingView from './src/views/components/LoadingView';
import ErrorView from './src/views/components/ErrorView';

import { ThemeProvider } from './src/theme/ThemeContext';
import { useAppViewModel } from './src/viewmodels/useAppViewModel';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const vm = useAppViewModel();

  if (vm.isLoading) return <LoadingView />;
  if (vm.isError) return <ErrorView message={vm.error} onRetry={vm.retry} />;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={vm.initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="MainTabs"
          component={MainTabsScreen}
          initialParams={vm.initialParams}
        />
        <Stack.Screen name="Words" component={WordsScreen} />
        <Stack.Screen name="AddWord" component={AddWordScreen} />
        <Stack.Screen name="CreateDictionary" component={CreateDictionaryScreen} />
        <Stack.Screen name="Gallery" component={GalleryScreen} />
        <Stack.Screen name="CharacterDetail" component={CharacterDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
