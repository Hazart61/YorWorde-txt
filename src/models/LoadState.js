// Состояния экрана: Loading / Success / Error (+ Idle до первой загрузки).
export const Status = Object.freeze({
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
});

/**
 * Единый формат состояния для ViewModel.
 * @template T
 * @typedef {{ status: string, data: T, error: string | null }} LoadState
 */

export const idle = (data) => ({ status: Status.IDLE, data, error: null });
export const loading = (data) => ({ status: Status.LOADING, data, error: null });
export const success = (data) => ({ status: Status.SUCCESS, data, error: null });
export const failure = (error, data) => ({ status: Status.ERROR, data, error });

/**
 * Результат операции (сохранение, удаление, вход),
 * который ViewModel возвращает во View вместо Alert/навигации.
 */
export const ok = (value) => ({ ok: true, value, error: null });
export const fail = (error) => ({ ok: false, value: null, error });
