import { useCallback, useEffect, useRef, useState } from 'react';
import { Status, idle, loading, success, failure } from '../models/LoadState';

/**
 * Базовый хук ViewModel для загрузки данных.
 * Держит состояние Loading / Success / Error и игнорирует
 * устаревшие ответы (если load вызван повторно или экран размонтирован).
 *
 * @template T
 * @param {() => Promise<T>} loader  стабильная функция (useCallback)
 * @param {T} initialData
 * @param {string} errorMessage      текст ошибки для пользователя
 */
export function useLoadable(loader, initialData, errorMessage) {
  const [state, setState] = useState(() => idle(initialData));
  const requestId = useRef(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    const id = ++requestId.current;
    const isActual = () => mounted.current && id === requestId.current;

    setState((prev) => loading(prev.data));
    try {
      const data = await loader();
      if (isActual()) setState(success(data));
    } catch (e) {
      console.warn(errorMessage, e);
      if (isActual()) setState((prev) => failure(errorMessage, prev.data));
    }
  }, [loader, errorMessage]);

  return {
    state,
    load,
    isLoading: state.status === Status.LOADING || state.status === Status.IDLE,
    isError: state.status === Status.ERROR,
  };
}
