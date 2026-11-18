import { DictionaryRepository } from '../data/repositories/DictionaryRepository';
import { AuthRepository } from '../data/repositories/AuthRepository';
import { ok, fail } from '../models/LoadState';

/** ViewModel экрана настроек. Тема — в ThemeContext (глобальное состояние). */
export function useSettingsViewModel() {
  const clearAllData = async () => {
    try {
      await DictionaryRepository.clearAll();
      return ok('Все данные успешно удалены.');
    } catch (e) {
      console.warn('Ошибка очистки:', e);
      return fail('Не удалось очистить данные.');
    }
  };

  const logout = async () => {
    try {
      await AuthRepository.logout();
      return ok();
    } catch (e) {
      console.warn('Ошибка выхода:', e);
      return fail('Не удалось выйти из аккаунта.');
    }
  };

  return { clearAllData, logout };
}
