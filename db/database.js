import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('yorworde.db');

export async function initDatabase() {
  try {
    let needsMigration = false;
    const tableInfo = await db.getAllAsync("PRAGMA table_info(words);");
    
    if (tableInfo.length > 0) {
      const hasDictionaryId = tableInfo.some(col => col.name === 'dictionary_id');
      if (!hasDictionaryId) needsMigration = true;
    }

    if (needsMigration) {
      await db.execAsync(`
        DROP TABLE IF EXISTS words;
        DROP TABLE IF EXISTS dictionaries;
      `);
    }

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS dictionaries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        color TEXT,
        emoji TEXT,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dictionary_id INTEGER NOT NULL,
        word TEXT NOT NULL,
        category TEXT,
        description TEXT,
        example TEXT,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (dictionary_id) REFERENCES dictionaries (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS profile (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        about TEXT
      );
    `);
  } catch (e) {
    console.warn('Ошибка инициализации БД:', e);
  }
}

// ========== ОЧИСТКА ДАННЫХ ==========
export async function clearAllData() {
  await db.execAsync(`
    DELETE FROM words;
    DELETE FROM dictionaries;
    DELETE FROM profile;
  `);
}

// ========== СЛОВАРИ ==========
export async function addDictionary({ title, description, color, emoji }) {
  const createdAt = Date.now();
  return await db.runAsync(
    'INSERT INTO dictionaries (title, description, color, emoji, created_at) VALUES (?, ?, ?, ?, ?);',
    [title, description ?? '', color ?? '', emoji ?? '', createdAt]
  );
}

export async function getAllDictionaries() {
  return await db.getAllAsync('SELECT * FROM dictionaries ORDER BY id DESC;');
}

export async function deleteDictionary(id) {
  await db.runAsync('DELETE FROM words WHERE dictionary_id = ?;', [id]);
  return await db.runAsync('DELETE FROM dictionaries WHERE id = ?;', [id]);
}

// ========== СЛОВА ==========
export async function addWord({ dictionary_id, word, category, description, example }) {
  const createdAt = Date.now();
  return await db.runAsync(
    'INSERT INTO words (dictionary_id, word, category, description, example, created_at) VALUES (?, ?, ?, ?, ?, ?);',
    [dictionary_id, word, category ?? '', description ?? '', example ?? '', createdAt]
  );
}

export async function getWordsByDictionary(dictionary_id) {
  return await db.getAllAsync(
    'SELECT * FROM words WHERE dictionary_id = ? ORDER BY id DESC;',
    [dictionary_id]
  );
}

export async function deleteWord(id) {
  return await db.runAsync('DELETE FROM words WHERE id = ?;', [id]);
}

export async function getWordCountByDictionary(dictionary_id) {
  const result = await db.getFirstAsync(
    'SELECT COUNT(*) as count FROM words WHERE dictionary_id = ?;',
    [dictionary_id]
  );
  return result?.count ?? 0;
}

export async function getTotalWordCount() {
  const result = await db.getFirstAsync('SELECT COUNT(*) as count FROM words;');
  return result?.count ?? 0;
}

export async function getTotalDictionaryCount() {
  const result = await db.getFirstAsync('SELECT COUNT(*) as count FROM dictionaries;');
  return result?.count ?? 0;
}

// ========== ПРОФИЛЬ ==========
export async function getAboutText() {
  const result = await db.getFirstAsync('SELECT about FROM profile WHERE id = 1;');
  return result?.about ?? 'Люблю изучать новые языки и программировать на Python. Здесь я собираю свои словари!';
}

export async function saveAboutText(text) {
  return await db.runAsync(
    'INSERT OR REPLACE INTO profile (id, about) VALUES (1, ?);',
    [text]
  );
}