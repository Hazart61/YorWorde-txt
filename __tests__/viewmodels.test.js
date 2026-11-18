// Тесты слоя ViewModel: репозитории подменяются моками,
// проверяются переходы состояний Loading → Success / Error.
import { renderHook, act, waitFor } from '@testing-library/react-native';

import { useWordsViewModel } from '../src/viewmodels/useWordsViewModel';
import { useMyDictionariesViewModel } from '../src/viewmodels/useMyDictionariesViewModel';
import { useLoginViewModel } from '../src/viewmodels/useLoginViewModel';
import { useAddWordViewModel } from '../src/viewmodels/useAddWordViewModel';
import { WordRepository } from '../src/data/repositories/WordRepository';
import { DictionaryRepository } from '../src/data/repositories/DictionaryRepository';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('../src/data/repositories/WordRepository', () => ({
  WordRepository: { getByDictionary: jest.fn(), add: jest.fn(), remove: jest.fn() },
}));
jest.mock('../src/data/repositories/DictionaryRepository', () => ({
  DictionaryRepository: { getAll: jest.fn(), remove: jest.fn() },
}));

const WORDS = [
  { id: 1, dictionaryId: 7, word: 'serendipity', category: 'noun', description: 'счастливая случайность', example: '' },
  { id: 2, dictionaryId: 7, word: 'run', category: 'verb', description: 'бежать', example: '' },
];

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  console.warn.mockRestore();
});

describe('useWordsViewModel', () => {
  it('Loading → Success: загружает слова через репозиторий', async () => {
    WordRepository.getByDictionary.mockResolvedValue(WORDS);
    const { result } = renderHook(() => useWordsViewModel(7));

    expect(result.current.isLoading).toBe(true);

    await act(() => result.current.load());

    expect(WordRepository.getByDictionary).toHaveBeenCalledWith(7);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.words).toHaveLength(2);
    expect(result.current.totalCount).toBe(2);
  });

  it('Loading → Error: при ошибке репозитория показывает сообщение', async () => {
    WordRepository.getByDictionary.mockRejectedValue(new Error('db is down'));
    const { result } = renderHook(() => useWordsViewModel(7));

    await act(() => result.current.load());

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe('Не удалось загрузить слова');
  });

  it('фильтрует слова по поисковому запросу', async () => {
    WordRepository.getByDictionary.mockResolvedValue(WORDS);
    const { result } = renderHook(() => useWordsViewModel(7));
    await act(() => result.current.load());

    act(() => result.current.setQuery('бежать'));

    expect(result.current.words.map((w) => w.word)).toEqual(['run']);
    expect(result.current.totalCount).toBe(2);
  });

  it('удаляет слово и перезагружает список', async () => {
    WordRepository.getByDictionary
      .mockResolvedValueOnce(WORDS)
      .mockResolvedValueOnce([WORDS[1]]);
    WordRepository.remove.mockResolvedValue();
    const { result } = renderHook(() => useWordsViewModel(7));
    await act(() => result.current.load());

    let res;
    await act(async () => {
      res = await result.current.deleteWord(1);
    });

    expect(res.ok).toBe(true);
    expect(WordRepository.remove).toHaveBeenCalledWith(1);
    expect(result.current.words).toHaveLength(1);
  });
});

describe('useMyDictionariesViewModel', () => {
  it('ищет словари по названию', async () => {
    DictionaryRepository.getAll.mockResolvedValue([
      { id: 1, title: 'English', wordCount: 3 },
      { id: 2, title: 'Python', wordCount: 5 },
    ]);
    const { result } = renderHook(() => useMyDictionariesViewModel());
    await act(() => result.current.load());

    act(() => result.current.setQuery('py'));

    expect(result.current.dictionaries.map((d) => d.title)).toEqual(['Python']);
  });

  it('возвращает ошибку, если удаление не удалось', async () => {
    DictionaryRepository.getAll.mockResolvedValue([]);
    DictionaryRepository.remove.mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useMyDictionariesViewModel());

    let res;
    await act(async () => {
      res = await result.current.deleteDictionary(1);
    });

    expect(res).toEqual({ ok: false, value: null, error: 'Не удалось удалить словарь' });
  });
});

describe('useLoginViewModel', () => {
  it('не вызывает login при пустых полях', async () => {
    const login = jest.fn();
    const { result } = renderHook(() => useLoginViewModel({ login }));

    let res;
    await act(async () => {
      res = await result.current.submit();
    });

    expect(res.ok).toBe(false);
    expect(result.current.error).toBe('Введите email');
    expect(login).not.toHaveBeenCalled();
  });

  it('передаёт обрезанные данные в репозиторий и возвращает пользователя', async () => {
    const login = jest.fn().mockResolvedValue({ name: 'Иван', email: 'a@b.c' });
    const { result } = renderHook(() => useLoginViewModel({ login }));

    act(() => {
      result.current.setEmail('  a@b.c ');
      result.current.setUserName(' Иван ');
      result.current.setPassword(' 123 ');
    });

    let res;
    await act(async () => {
      res = await result.current.submit();
    });

    expect(login).toHaveBeenCalledWith({ userName: 'Иван', email: 'a@b.c', password: '123' });
    expect(res.ok).toBe(true);
    expect(res.value.name).toBe('Иван');
    expect(result.current.isSubmitting).toBe(false);
  });
});

describe('useAddWordViewModel', () => {
  it('сохраняет слово в нужный словарь', async () => {
    WordRepository.add.mockResolvedValue();
    const { result } = renderHook(() => useAddWordViewModel(7));

    act(() => {
      result.current.setWord(' hello ');
      result.current.setCategory('noun');
    });

    let res;
    await act(async () => {
      res = await result.current.save();
    });

    expect(res.ok).toBe(true);
    expect(WordRepository.add).toHaveBeenCalledWith({
      dictionaryId: 7,
      word: 'hello',
      category: 'noun',
      description: '',
      example: '',
    });
  });

  it('не сохраняет пустое слово', async () => {
    const { result } = renderHook(() => useAddWordViewModel(7));

    let res;
    await act(async () => {
      res = await result.current.save();
    });

    expect(res.ok).toBe(false);
    expect(result.current.error).toBe('Введите слово');
    expect(WordRepository.add).not.toHaveBeenCalled();
  });
});
