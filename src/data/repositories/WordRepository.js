// Репозиторий слов. Источник данных — SQLite.
import * as db from '../local/database';
import { wordFromRow } from '../../models/Word';

export const WordRepository = {
  /** @returns {Promise<import('../../models/Word').Word[]>} */
  async getByDictionary(dictionaryId) {
    const rows = await db.getWordsByDictionary(dictionaryId);
    return rows.map(wordFromRow);
  },

  async add({ dictionaryId, word, category, description, example }) {
    await db.addWord({
      dictionary_id: dictionaryId,
      word,
      category,
      description,
      example,
    });
  },

  async remove(id) {
    await db.deleteWord(id);
  },
};
