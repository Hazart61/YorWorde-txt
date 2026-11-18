import { useMemo, useState } from 'react';
import { DictionaryRepository } from '../data/repositories/DictionaryRepository';
import { ok, fail } from '../models/LoadState';
import { useLoadable } from './useLoadable';

/** ViewModel экрана «Мои словари». */
export function useMyDictionariesViewModel() {
  const [query, setQuery] = useState('');
  const { state, load, isLoading, isError } = useLoadable(
    DictionaryRepository.getAll,
    [],
    'Не удалось загрузить словари'
  );

  const dictionaries = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.data.filter((d) => d.title.toLowerCase().includes(q));
  }, [state.data, query]);

  const deleteDictionary = async (id) => {
    try {
      await DictionaryRepository.remove(id);
      await load();
      return ok();
    } catch (e) {
      console.warn('Ошибка удаления словаря:', e);
      return fail('Не удалось удалить словарь');
    }
  };

  return {
    dictionaries,
    isLoading,
    isError,
    error: state.error,
    query,
    setQuery,
    clearQuery: () => setQuery(''),
    load,
    deleteDictionary,
  };
}
