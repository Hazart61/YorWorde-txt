// Источник данных: настройки приложения в AsyncStorage.
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_THEME = '@theme';

/** @returns {Promise<'dark' | 'light' | null>} */
export async function getTheme() {
  return await AsyncStorage.getItem(KEY_THEME);
}

/** @param {'dark' | 'light'} theme */
export async function saveTheme(theme) {
  await AsyncStorage.setItem(KEY_THEME, theme);
}
