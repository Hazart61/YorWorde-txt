// Web-источник данных должен вести себя так же, как SQLite-версия.
import * as db from '../src/data/local/database.web';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('database.web (AsyncStorage)', () => {
  beforeEach(async () => {
    await db.initDatabase();
    await db.clearAllData();
  });

  it('создаёт словари и слова, считает слова, удаляет каскадно', async () => {
    const { lastInsertRowId: d1 } = await db.addDictionary({ title: 'English' });
    const { lastInsertRowId: d2 } = await db.addDictionary({ title: 'Python' });
    await db.addWord({ dictionary_id: d1, word: 'cat' });
    await db.addWord({ dictionary_id: d1, word: 'dog' });

    const list = await db.getAllDictionariesWithWordCount();
    expect(list.map((d) => [d.title, d.word_count])).toEqual([['Python', 0], ['English', 2]]);
    expect((await db.getWordsByDictionary(d1)).map((w) => w.word)).toEqual(['dog', 'cat']);

    await db.deleteDictionary(d1);
    expect(await db.getTotalWordCount()).toBe(0);
    expect((await db.getAllDictionaries()).map((d) => d.id)).toEqual([d2]);
  });

  it('сохраняет текст «О пользователе»', async () => {
    expect(await db.getAboutText()).toBeNull();
    await db.saveAboutText('Привет');
    expect(await db.getAboutText()).toBe('Привет');
  });
});
