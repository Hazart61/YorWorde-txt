import { useCallback, useEffect } from 'react';
import { CharacterRepository } from '../data/repositories/CharacterRepository';
import { useLoadable } from './useLoadable';

/** ViewModel карточки персонажа. */
export function useCharacterDetailViewModel(id) {
  const loader = useCallback(() => CharacterRepository.getById(id), [id]);
  const { state, load, isLoading, isError } = useLoadable(
    loader,
    null,
    'Ошибка загрузки персонажа'
  );

  useEffect(() => {
    load();
  }, [load]);

  return {
    character: state.data,
    isLoading,
    isError,
    error: state.error,
    retry: load,
  };
}
