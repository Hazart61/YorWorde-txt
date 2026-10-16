// db/database.js
// Модуль для работы с локальной БД SQLite (expo-sqlite, SDK 54 / API v15).
// Отвечает за инициализацию таблицы words и CRUD-операции над словами.

import * as SQLite from 'expo-sqlite';

// Открываем (или создаём) файл базы данных
const db = SQLite.openDatabaseSync('yorworde.db');

/**
 * Создаёт таблицу `words`, если её ещё нет.
 * Вызывать один раз при старте приложения (в App.js).
 */
export async function initDatabase() {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT NOT NULL,
      category TEXT,
      description TEXT,
      created_at INTEGER NOT NULL
    );
  `);
}

/**
 * Добавляет новое слово в словарь.
 * @param {{word: string, category?: string, description?: string}} payload
 */
export async function addWord({ word, category, description }) {
  const createdAt = Date.now();
  return await db.runAsync(
    'INSERT INTO words (word, category, description, created_at) VALUES (?, ?, ?, ?);',
    [word, category ?? '', description ?? '', createdAt]
  );
}

/**
 * Возвращает все слова, отсортированные по дате добавления (свежие сверху).
 */
export async function getAllWords() {
  return await db.getAllAsync('SELECT * FROM words ORDER BY id DESC;');
}

/**
 * Возвращает одно слово по id.
 */
export async function getWordById(id) {
  return await db.getFirstAsync('SELECT * FROM words WHERE id = ?;', [id]);
}

/**
 * Обновляет слово по id.
 */
export async function updateWord(id, { word, category, description }) {
  return await db.runAsync(
    'UPDATE words SET word = ?, category = ?, description = ? WHERE id = ?;',
    [word, category ?? '', description ?? '', id]
  );
}

/**
 * Удаляет слово по id.
 */
export async function deleteWord(id) {
  return await db.runAsync('DELETE FROM words WHERE id = ?;', [id]);
}

/**
 * Полностью очищает таблицу (полезно для отладки).
 */
export async function clearAllWords() {
  return await db.runAsync('DELETE FROM words;');
}