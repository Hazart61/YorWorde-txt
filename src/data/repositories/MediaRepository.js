// Репозиторий возможностей устройства: разрешения + выбор фото.
// ViewModel получает уже понятные PermissionState, а не ответы Expo.
import * as picker from '../device/imagePicker';
import { permissionFromExpo } from '../../models/Permission';

export const MediaRepository = {
  /** @returns {Promise<string>} PermissionState */
  async checkPermission(source) {
    return permissionFromExpo(await picker.getPermission(source));
  },

  /** Показывает системное окно запроса. @returns {Promise<string>} PermissionState */
  async requestPermission(source) {
    return permissionFromExpo(await picker.requestPermission(source));
  },

  /** @returns {Promise<string | null>} uri или null, если пользователь отменил */
  async pickImage(source) {
    return await picker.launch(source);
  },
};
