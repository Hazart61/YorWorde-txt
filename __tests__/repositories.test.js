// Тесты слоя Data: репозиторий превращает строки БД в сущности модели.
import { DictionaryRepository } from '../src/data/repositories/DictionaryRepository';
import { WordRepository } from '../src/data/repositories/WordRepository';
import * as db from '../src/data/local/database';

jest.mock('../src/data/local/database', () => ({
  getAllDictionariesWithWordCount: jest.fn(),
  addDictionary: jest.fn(),
  addWord: jest.fn(),
  getWordsByDictionary: jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

describe('DictionaryRepository', () => {
  it('маппит строки SQLite в сущности Dictionary', async () => {
    db.getAllDictionariesWithWordCount.mockResolvedValue([
      { id: 1, title: 'English', description: null, color: '#fff', emoji: '📘', created_at: 10, word_count: 4 },
    ]);

    const list = await DictionaryRepository.getAll();

    expect(list).toEqual([
      { id: 1, title: 'English', description: '', color: '#fff', emoji: '📘', createdAt: 10, wordCount: 4 },
    ]);
  });

  it('создаёт словарь вместе с первым словом', async () => {
    db.addDictionary.mockResolvedValue({ lastInsertRowId: 42 });

    const id = await DictionaryRepository.create({
      title: 'Python',
      description: '',
      color: '#000',
      firstWord: { word: 'list', description: 'список' },
    });

    expect(id).toBe(42);
    expect(db.addWord).toHaveBeenCalledWith(
      expect.objectContaining({ dictionary_id: 42, word: 'list', description: 'список' })
    );
  });

  it('не создаёт слово, если первое слово не указано', async () => {
    db.addDictionary.mockResolvedValue({ lastInsertRowId: 1 });
    await DictionaryRepository.create({ title: 'X', description: '', color: '', firstWord: null });
    expect(db.addWord).not.toHaveBeenCalled();
  });
});

describe('WordRepository', () => {
  it('маппит dictionary_id → dictionaryId', async () => {
    db.getWordsByDictionary.mockResolvedValue([
      { id: 5, dictionary_id: 2, word: 'cat', category: null, description: 'кот', example: null, created_at: 1 },
    ]);

    const [word] = await WordRepository.getByDictionary(2);

    expect(word).toEqual({
      id: 5, dictionaryId: 2, word: 'cat', category: '', description: 'кот', example: '', createdAt: 1,
    });
  });
});
