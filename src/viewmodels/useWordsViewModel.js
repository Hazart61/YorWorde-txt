import { useCallback, useMemo, useState } from 'react';
import { WordRepository } from '../data/repositories/WordRepository';
import { wordMatches } from '../models/Word';
import { ok, fail } from '../models/LoadState';
import { useLoadable } from './useLoadable';

/** ViewModel экрана со словами одного словаря. */
export function useWordsViewModel(dictionaryId) {
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const loader = useCallback(
    () => WordRepository.getByDictionary(dictionaryId),
    [dictionaryId]
  );
  const { state, load, isLoading, isError } = useLoadable(
    loader,
    [],
    'Не удалось загрузить слова'
  );

  const words = useMemo(
    () => state.data.filter((w) => wordMatches(w, query)),
    [state.data, query]
  );

  const deleteWord = async (id) => {
    try {
      await WordRepository.remove(id);
      await load();
      return ok();
    } catch (e) {
      console.warn('Ошибка удаления слова:', e);
      return fail('Не удалось удалить слово');
    }
  };

  return {
    words,
    totalCount: state.data.length,
    isLoading,
    isError,
    error: state.error,
    query,
    setQuery,
    clearQuery: () => setQuery(''),
    expandedId,
    toggleExpand: (id) => setExpandedId((prev) => (prev === id ? null : id)),
    load,
    deleteWord,
  };
}
