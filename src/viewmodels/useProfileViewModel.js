import { useCallback, useState } from 'react';
import { DictionaryRepository } from '../data/repositories/DictionaryRepository';
import { ProfileRepository } from '../data/repositories/ProfileRepository';
import { ok, fail } from '../models/LoadState';
import { useLoadable } from './useLoadable';

/** ViewModel экрана профиля. */
export function useProfileViewModel() {
  const loader = useCallback(async () => {
    const [about, dictionaries] = await Promise.all([
      ProfileRepository.getAbout(),
      DictionaryRepository.getAll(),
    ]);
    return { about, dictionaries };
  }, []);

  const { state, load, isLoading, isError } = useLoadable(
    loader,
    { about: '', dictionaries: [] },
    'Не удалось загрузить профиль'
  );

  // Сохранённый текст из БД может быть перезаписан локально после сохранения.
  const [savedAbout, setSavedAbout] = useState(null);
  const [aboutDraft, setAboutDraft] = useState('');
  const [isSavingAbout, setSavingAbout] = useState(false);

  const about = savedAbout ?? state.data.about;
  const { dictionaries } = state.data;

  const reload = useCallback(async () => {
    setSavedAbout(null);
    await load();
  }, [load]);

  /** Начать редактирование: черновик = текущий текст. */
  const startEditAbout = () => setAboutDraft(about);

  const saveAbout = async () => {
    setSavingAbout(true);
    try {
      await ProfileRepository.saveAbout(aboutDraft);
      setSavedAbout(aboutDraft);
      return ok();
    } catch (e) {
      console.warn('Ошибка сохранения описания:', e);
      return fail('Не удалось сохранить описание');
    } finally {
      setSavingAbout(false);
    }
  };

  return {
    about,
    aboutDraft,
    setAboutDraft,
    startEditAbout,
    saveAbout,
    isSavingAbout,
    dictionaries,
    totalDictionaries: dictionaries.length,
    totalWords: dictionaries.reduce((sum, d) => sum + d.wordCount, 0),
    isLoading,
    isError,
    error: state.error,
    load: reload,
  };
}
