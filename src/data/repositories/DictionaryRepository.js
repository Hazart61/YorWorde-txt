// Репозиторий словарей. Источник данных — SQLite.
import * as db from '../local/database';
import { dictionaryFromRow, DEFAULT_DICTIONARY_EMOJI } from '../../models/Dictionary';

export const DictionaryRepository = {
  /** @returns {Promise<import('../../models/Dictionary').Dictionary[]>} */
  async getAll() {
    const rows = await db.getAllDictionaries();
    const withCounts = await Promise.all(
      rows.map(async (row) => ({
        ...row,
        word_count: await db.getWordCountByDictionary(row.id),
      }))
    );
    return withCounts.map(dictionaryFromRow);
  },

  /**
   * Создаёт словарь и (необязательно) первое слово в нём.
   * @returns {Promise<number>} id нового словаря
   */
  async create({ title, description, color, emoji = DEFAULT_DICTIONARY_EMOJI, firstWord }) {
    const result = await db.addDictionary({ title, description, color, emoji });
    const dictionaryId = result.lastInsertRowId;

    if (firstWord?.word) {
      await db.addWord({
        dictionary_id: dictionaryId,
        word: firstWord.word,
        category: '',
        description: firstWord.description ?? '',
        example: '',
      });
    }
    return dictionaryId;
  },

  async remove(id) {
    await db.deleteDictionary(id);
  },

  /** Удаляет все словари, слова и профиль. */
  async clearAll() {
    await db.clearAllData();
  },
};
