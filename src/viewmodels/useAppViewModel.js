import { useCallback, useEffect } from 'react';
import { SettingsRepository } from '../data/repositories/SettingsRepository';
import { AuthRepository } from '../data/repositories/AuthRepository';
import { useLoadable } from './useLoadable';

/**
 * ViewModel запуска приложения:
 * создаёт таблицы БД и проверяет, есть ли сохранённая сессия.
 */
export function useAppViewModel() {
  const bootstrap = useCallback(async () => {
    await SettingsRepository.initStorage();
    const user = await AuthRepository.getCurrentUser();
    return { user };
  }, []);

  const { state, load, isLoading, isError } = useLoadable(
    bootstrap,
    { user: null },
    'Не удалось подготовить базу данных'
  );

  useEffect(() => {
    load();
  }, [load]);

  const user = state.data.user;

  return {
    isLoading,
    isError,
    error: state.error,
    retry: load,
    initialRoute: user ? 'MainTabs' : 'Login',
    initialParams: user ? { userName: user.name, userEmail: user.email } : undefined,
  };
}
