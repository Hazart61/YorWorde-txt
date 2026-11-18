import { useState } from 'react';
import { DictionaryRepository } from '../data/repositories/DictionaryRepository';
import { ok, fail } from '../models/LoadState';

/** ViewModel экрана создания словаря. */
export function useCreateDictionaryViewModel(defaultColor) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [firstWord, setFirstWord] = useState('');
  const [firstWordDesc, setFirstWordDesc] = useState('');
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [isSaving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const save = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Введите название словаря');
      return fail('Введите название словаря');
    }

    setSaving(true);
    setError(null);
    try {
      const id = await DictionaryRepository.create({
        title: trimmedTitle,
        description: description.trim(),
        color: selectedColor,
        firstWord: firstWord.trim()
          ? { word: firstWord.trim(), description: firstWordDesc.trim() }
          : null,
      });
      return ok(id);
    } catch (e) {
      console.warn('Ошибка создания словаря:', e);
      setError('Не удалось создать словарь');
      return fail('Не удалось создать словарь');
    } finally {
      setSaving(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    firstWord,
    setFirstWord,
    firstWordDesc,
    setFirstWordDesc,
    selectedColor,
    setSelectedColor,
    isSaving,
    error,
    save,
  };
}
