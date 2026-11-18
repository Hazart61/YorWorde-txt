/**
 * @typedef {Object} Dictionary
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {string} color
 * @property {string} emoji
 * @property {number} createdAt
 * @property {number} wordCount
 */

/** Преобразует строку из SQLite в сущность Dictionary. */
export function dictionaryFromRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    color: row.color ?? '',
    emoji: row.emoji ?? '',
    createdAt: row.created_at,
    wordCount: row.word_count ?? 0,
  };
}

export const DEFAULT_DICTIONARY_EMOJI = '📘';
