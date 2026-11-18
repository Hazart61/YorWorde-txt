// Источник данных: возможности устройства (камера и галерея).
// Только обращения к expo-image-picker, без логики сценария.
import * as ImagePicker from 'expo-image-picker';
import { PhotoSource } from '../../models/Permission';

const PICKER_OPTIONS = {
  mediaTypes: ['images'],
  allowsEditing: true, // предпросмотр и кадрирование
  aspect: [1, 1],      // аватар — квадрат
  quality: 0.7,
};

export function getPermission(source) {
  return source === PhotoSource.CAMERA
    ? ImagePicker.getCameraPermissionsAsync()
    : ImagePicker.getMediaLibraryPermissionsAsync();
}

export function requestPermission(source) {
  return source === PhotoSource.CAMERA
    ? ImagePicker.requestCameraPermissionsAsync()
    : ImagePicker.requestMediaLibraryPermissionsAsync();
}

/**
 * Открывает камеру или системную галерею.
 * @returns {Promise<string | null>} uri выбранного фото или null при отмене
 */
export async function launch(source) {
  const result =
    source === PhotoSource.CAMERA
      ? await ImagePicker.launchCameraAsync(PICKER_OPTIONS)
      : await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);

  if (result.canceled || !result.assets?.length) return null;
  return result.assets[0].uri;
}
