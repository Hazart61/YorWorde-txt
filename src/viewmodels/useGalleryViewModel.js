import { useCallback, useEffect, useState } from 'react';
import { CharacterRepository } from '../data/repositories/CharacterRepository';
import { useLoadable } from './useLoadable';

/** ViewModel галереи персонажей с пагинацией. */
export function useGalleryViewModel() {
  const [page, setPage] = useState(1);

  const loader = useCallback(() => CharacterRepository.getPage(page), [page]);
  const { state, load, isLoading, isError } = useLoadable(
    loader,
    { items: [], hasNext: true },
    'Ошибка загрузки данных'
  );

  useEffect(() => {
    load();
  }, [load]);

  const canGoBack = page > 1 && !isLoading;
  const canGoForward = state.data.hasNext && !isLoading;

  return {
    characters: state.data.items,
    page,
    isLoading,
    isError,
    error: state.error,
    canGoBack,
    canGoForward,
    prevPage: () => canGoBack && setPage((p) => p - 1),
    nextPage: () => canGoForward && setPage((p) => p + 1),
    retry: load,
  };
}
