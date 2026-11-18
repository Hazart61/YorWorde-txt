// Репозиторий аватара пользователя: где лежит фото профиля.
import * as storage from '../local/avatarStorage';

export const AvatarRepository = {
  /** @returns {Promise<string | null>} */
  async getAvatar() {
    return await storage.getAvatarUri();
  },

  /**
   * Сохраняет выбранное фото навсегда и заменяет им старое.
   * @returns {Promise<string>} постоянный uri
   */
  async saveAvatar(tempUri) {
    const oldUri = await storage.getAvatarUri();
    const uri = await storage.persistImage(tempUri);
    await storage.setAvatarUri(uri);
    if (oldUri && oldUri !== uri) storage.deleteImage(oldUri);
    return uri;
  },

  async removeAvatar() {
    const oldUri = await storage.getAvatarUri();
    await storage.clearAvatarUri();
    storage.deleteImage(oldUri);
  },
};
