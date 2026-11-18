/**
 * @typedef {Object} Word
 * @property {number} id
 * @property {number} dictionaryId
 * @property {string} word
 * @property {string} category
 * @property {string} description
 * @property {string} example
 * @property {number} createdAt
 */

/** Преобразует строку из SQLite в сущность Word. */
export function wordFromRow(row) {
  return {
    id: row.id,
    dictionaryId: row.dictionary_id,
    word: row.word,
    category: row.category ?? '',
    description: row.description ?? '',
    example: row.example ?? '',
    createdAt: row.created_at,
  };
}

/** Поиск по слову, категории и описанию. */
export function wordMatches(word, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [word.word, word.category, word.description].some((field) =>
    (field ?? '').toLowerCase().includes(q)
  );
}
