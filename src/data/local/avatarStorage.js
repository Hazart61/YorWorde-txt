// Источник данных: файл аватара и ссылка на него.
// Камера и галерея отдают фото во временный кэш, который система может очистить,
// поэтому копируем его в постоянную папку приложения (Paths.document).
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Paths } from 'expo-file-system';

const KEY_AVATAR = '@avatar_uri';

export async function getAvatarUri() {
  return await AsyncStorage.getItem(KEY_AVATAR);
}

export async function setAvatarUri(uri) {
  await AsyncStorage.setItem(KEY_AVATAR, uri);
}

export async function clearAvatarUri() {
  await AsyncStorage.removeItem(KEY_AVATAR);
}

/** Копирует временный файл в документы приложения, возвращает новый uri. */
export async function persistImage(tempUri) {
  // В браузере файловой системы приложения нет — ссылка от пикера уже готова к хранению.
  if (Platform.OS === 'web') return tempUri;

  const ext = tempUri.split('.').pop()?.split('?')[0] || 'jpg';
  const target = new File(Paths.document, `avatar_${Date.now()}.${ext}`);
  await new File(tempUri).copy(target);
  return target.uri;
}

/** Удаляет старый файл аватара (если он наш и ещё существует). */
export function deleteImage(uri) {
  if (!uri || Platform.OS === 'web') return;
  try {
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch (e) {
    console.warn('Не удалось удалить старый аватар:', e);
  }
}
