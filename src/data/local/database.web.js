// Источник данных для web-версии.
// expo-sqlite в браузере требует SharedArrayBuffer и COOP/COEP-заголовков,
// которые dev-сервер Expo не отдаёт. Поэтому на web Metro берёт этот файл
// вместо database.js: тот же набор функций, те же «сырые» строки,
// но хранение — в AsyncStorage (в браузере это localStorage).
// Репозитории и ViewModel об этой подмене не знают.
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@yorworde_db';

const emptyDb = () => ({
  dictionaries: [],
  words: [],
  profile: { about: null },
  nextDictionaryId: 1,
  nextWordId: 1,
});

async function read() {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : emptyDb();
}

async function write(data) {
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
}

const byIdDesc = (a, b) => b.id - a.id;

export async function initDatabase() {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) await write(emptyDb());
}

// ========== ОЧИСТКА ДАННЫХ ==========
export async function clearAllData() {
  const data = await read();
  await write({ ...emptyDb(), nextDictionaryId: data.nextDictionaryId, nextWordId: data.nextWordId });
}

// ========== СЛОВАРИ ==========
export async function addDictionary({ title, description, color, emoji }) {
  const data = await read();
  const id = data.nextDictionaryId++;
  data.dictionaries.push({
    id,
    title,
    description: description ?? '',
    color: color ?? '',
    emoji: emoji ?? '',
    created_at: Date.now(),
  });
  await write(data);
  return { lastInsertRowId: id, changes: 1 };
}

export async function getAllDictionaries() {
  const data = await read();
  return [...data.dictionaries].sort(byIdDesc);
}

export async function getAllDictionariesWithWordCount() {
  const data = await read();
  return [...data.dictionaries].sort(byIdDesc).map((d) => ({
    ...d,
    word_count: data.words.filter((w) => w.dictionary_id === d.id).length,
  }));
}

export async function deleteDictionary(id) {
  const data = await read();
  data.words = data.words.filter((w) => w.dictionary_id !== id);
  data.dictionaries = data.dictionaries.filter((d) => d.id !== id);
  await write(data);
  return { changes: 1 };
}

// ========== СЛОВА ==========
export async function addWord({ dictionary_id, word, category, description, example }) {
  const data = await read();
  const id = data.nextWordId++;
  data.words.push({
    id,
    dictionary_id,
    word,
    category: category ?? '',
    description: description ?? '',
    example: example ?? '',
    created_at: Date.now(),
  });
  await write(data);
  return { lastInsertRowId: id, changes: 1 };
}

export async function getWordsByDictionary(dictionary_id) {
  const data = await read();
  return data.words.filter((w) => w.dictionary_id === dictionary_id).sort(byIdDesc);
}

export async function deleteWord(id) {
  const data = await read();
  data.words = data.words.filter((w) => w.id !== id);
  await write(data);
  return { changes: 1 };
}

export async function getWordCountByDictionary(dictionary_id) {
  const data = await read();
  return data.words.filter((w) => w.dictionary_id === dictionary_id).length;
}

export async function getTotalWordCount() {
  return (await read()).words.length;
}

export async function getTotalDictionaryCount() {
  return (await read()).dictionaries.length;
}

// ========== ПРОФИЛЬ ==========
export async function getAboutText() {
  return (await read()).profile.about ?? null;
}

export async function saveAboutText(text) {
  const data = await read();
  data.profile.about = text;
  await write(data);
  return { changes: 1 };
}
