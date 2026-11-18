// Модель разрешений и результата выбора фото.

/** Откуда берём фото. */
export const PhotoSource = Object.freeze({
  GALLERY: 'gallery',
  CAMERA: 'camera',
});

/**
 * Состояние разрешения, приведённое к 4 веткам сценария:
 * - GRANTED      — разрешено, можно открывать камеру/галерею;
 * - UNDETERMINED — ещё не спрашивали, показываем системный запрос;
 * - DENIED       — отказали, но спросить снова можно (сначала показываем пояснение);
 * - BLOCKED      — отказали навсегда, помочь могут только настройки телефона.
 */
export const PermissionState = Object.freeze({
  GRANTED: 'granted',
  UNDETERMINED: 'undetermined',
  DENIED: 'denied',
  BLOCKED: 'blocked',
});

/** Превращает ответ Expo { status, granted, canAskAgain } в PermissionState. */
export function permissionFromExpo(response) {
  if (!response) return PermissionState.UNDETERMINED;
  if (response.granted || response.status === 'granted') return PermissionState.GRANTED;
  if (response.status === 'undetermined') return PermissionState.UNDETERMINED;
  return response.canAskAgain ? PermissionState.DENIED : PermissionState.BLOCKED;
}

/**
 * Почему фото не установлено. View по этой причине решает, какой диалог показать.
 */
export const PickFailure = Object.freeze({
  NEEDS_RATIONALE: 'needs_rationale', // показать пояснение и спросить ещё раз
  DENIED: 'denied',                   // пользователь отказал в системном окне
  BLOCKED: 'blocked',                 // отказ навсегда → предложить настройки
  CANCELED: 'canceled',               // закрыл камеру/галерею без выбора
  ERROR: 'error',                     // сбой камеры или сохранения файла
});

export const pickOk = (uri) => ({ ok: true, uri, reason: null, source: null, error: null });
export const pickFail = (reason, source, error = null) => ({
  ok: false,
  uri: null,
  reason,
  source,
  error,
});
