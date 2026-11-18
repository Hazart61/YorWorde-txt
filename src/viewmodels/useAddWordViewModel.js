import { useState } from 'react';
import { WordRepository } from '../data/repositories/WordRepository';
import { ok, fail } from '../models/LoadState';

/** ViewModel экрана добавления слова. */
export function useAddWordViewModel(dictionaryId) {
  const [word, setWord] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [example, setExample] = useState('');
  const [isSaving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const save = async () => {
    const trimmedWord = word.trim();
    if (!trimmedWord) {
      setError('Введите слово');
      return fail('Введите слово');
    }

    setSaving(true);
    setError(null);
    try {
      await WordRepository.add({
        dictionaryId,
        word: trimmedWord,
        category: category.trim(),
        description: description.trim(),
        example: example.trim(),
      });
      return ok();
    } catch (e) {
      console.warn('Ошибка сохранения слова:', e);
      setError('Не удалось сохранить слово');
      return fail('Не удалось сохранить слово');
    } finally {
      setSaving(false);
    }
  };

  return {
    word,
    setWord,
    category,
    setCategory,
    description,
    setDescription,
    example,
    setExample,
    isSaving,
    error,
    save,
  };
}
