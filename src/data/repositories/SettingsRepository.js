// Репозиторий настроек приложения (тема). Источник данных — AsyncStorage.
import * as prefs from '../local/preferencesStorage';
import * as db from '../local/database';

export const SettingsRepository = {
  /** @returns {Promise<boolean | null>} null — тема ещё не выбиралась */
  async isDarkTheme() {
    const theme = await prefs.getTheme();
    return theme === null ? null : theme === 'dark';
  },

  async setDarkTheme(isDark) {
    await prefs.saveTheme(isDark ? 'dark' : 'light');
  },

  /** Создаёт таблицы БД при старте приложения. */
  async initStorage() {
    await db.initDatabase();
  },
};
