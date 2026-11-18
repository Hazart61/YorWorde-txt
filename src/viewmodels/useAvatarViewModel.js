import { useCallback, useEffect, useState } from 'react';
import { MediaRepository } from '../data/repositories/MediaRepository';
import { AvatarRepository } from '../data/repositories/AvatarRepository';
import {
  PermissionState,
  PickFailure,
  pickOk,
  pickFail,
} from '../models/Permission';
import { ok, fail } from '../models/LoadState';

/**
 * ViewModel фото профиля: полный цикл обработки разрешений.
 *
 *   choosePhoto(source)
 *     ├─ GRANTED      → открыть камеру/галерею → сохранить фото
 *     ├─ UNDETERMINED → системный запрос → (да) открыть / (нет) DENIED
 *     ├─ DENIED       → NEEDS_RATIONALE: View показывает пояснение,
 *     │                  затем вызывает requestAndChoose(source)
 *     └─ BLOCKED      → BLOCKED: View предлагает открыть настройки
 *
 * Диалоги и переходы в настройки — забота View, здесь только логика и состояние.
 */
export function useAvatarViewModel() {
  const [avatarUri, setAvatarUri] = useState(null);
  const [isBusy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    AvatarRepository.getAvatar()
      .then((uri) => active && setAvatarUri(uri))
      .catch((e) => console.warn('Ошибка загрузки аватара:', e));
    return () => {
      active = false;
    };
  }, []);

  /** Открыть камеру/галерею и сохранить результат. Разрешение уже есть. */
  const pickAndSave = useCallback(async (source) => {
    setBusy(true);
    try {
      const tempUri = await MediaRepository.pickImage(source);
      if (!tempUri) return pickFail(PickFailure.CANCELED, source);

      const uri = await AvatarRepository.saveAvatar(tempUri);
      setAvatarUri(uri);
      return pickOk(uri);
    } catch (e) {
      console.warn('Ошибка выбора фото:', e);
      return pickFail(PickFailure.ERROR, source, 'Не удалось установить фото');
    } finally {
      setBusy(false);
    }
  }, []);

  /** Показать системный запрос и при согласии сразу открыть источник. */
  const requestAndChoose = useCallback(
    async (source) => {
      try {
        const state = await MediaRepository.requestPermission(source);
        if (state === PermissionState.GRANTED) return pickAndSave(source);
        return pickFail(
          state === PermissionState.BLOCKED ? PickFailure.BLOCKED : PickFailure.DENIED,
          source
        );
      } catch (e) {
        console.warn('Ошибка запроса разрешения:', e);
        return pickFail(PickFailure.ERROR, source, 'Не удалось запросить разрешение');
      }
    },
    [pickAndSave]
  );

  /** Точка входа: проверить разрешение и пойти по нужной ветке. */
  const choosePhoto = useCallback(
    async (source) => {
      let state;
      try {
        state = await MediaRepository.checkPermission(source);
      } catch (e) {
        console.warn('Ошибка проверки разрешения:', e);
        return pickFail(PickFailure.ERROR, source, 'Не удалось проверить разрешение');
      }

      switch (state) {
        case PermissionState.GRANTED:
          return pickAndSave(source);
        case PermissionState.UNDETERMINED:
          return requestAndChoose(source);
        case PermissionState.DENIED:
          return pickFail(PickFailure.NEEDS_RATIONALE, source);
        default:
          return pickFail(PickFailure.BLOCKED, source);
      }
    },
    [pickAndSave, requestAndChoose]
  );

  const removeAvatar = useCallback(async () => {
    try {
      await AvatarRepository.removeAvatar();
      setAvatarUri(null);
      return ok();
    } catch (e) {
      console.warn('Ошибка удаления аватара:', e);
      return fail('Не удалось удалить фото');
    }
  }, []);

  return {
    avatarUri,
    hasAvatar: Boolean(avatarUri),
    isBusy,
    choosePhoto,
    requestAndChoose,
    removeAvatar,
  };
}
