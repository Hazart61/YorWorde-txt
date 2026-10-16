import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_NICK = 'user_nick';
const KEY_EMAIL = 'user_email';
const KEY_LOGGED_IN = 'is_logged_in';

/**
 * Сохраняет ник пользователя.
 * @param {string} nick
 */
export async function saveNick(nick) {
  await AsyncStorage.setItem(KEY_NICK, nick);
}

/**
 * Читает ник пользователя.
 * @returns {Promise<string | null>}
 */
export async function getNick() {
  return await AsyncStorage.getItem(KEY_NICK);
}

/**
 * Сохраняет email пользователя.
 * @param {string} email
 */
export async function saveEmail(email) {
  await AsyncStorage.setItem(KEY_EMAIL, email);
}

/**
 * Читает email пользователя.
 * @returns {Promise<string | null>}
 */
export async function getEmail() {
  return await AsyncStorage.getItem(KEY_EMAIL);
}

/**
 * Устанавливает флаг «залогинен».
 * @param {boolean} value
 */
export async function setLoggedIn(value) {
  await AsyncStorage.setItem(KEY_LOGGED_IN, value ? '1' : '0');
}

/**
 * Проверяет, залогинен ли пользователь.
 * @returns {Promise<boolean>}
 */
export async function isLoggedIn() {
  const v = await AsyncStorage.getItem(KEY_LOGGED_IN);
  return v === '1';
}

/**
 * Полный выход: чистим ник, email и флаг.
 */
export async function logout() {
  await AsyncStorage.multiRemove([KEY_NICK, KEY_EMAIL, KEY_LOGGED_IN]);
}
