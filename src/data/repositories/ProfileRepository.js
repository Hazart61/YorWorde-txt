// Репозиторий профиля («О пользователе»). Источник данных — SQLite.
import * as db from '../local/database';

const DEFAULT_ABOUT =
  'Люблю изучать новые языки и программировать на Python. Здесь я собираю свои словари!';

export const ProfileRepository = {
  async getAbout() {
    const text = await db.getAboutText();
    return text ?? DEFAULT_ABOUT;
  },

  async saveAbout(text) {
    await db.saveAboutText(text);
  },
};
