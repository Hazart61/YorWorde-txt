// Репозиторий персонажей. Источник данных — сеть.
import * as api from '../remote/rickAndMortyApi';
import { characterFromApi } from '../../models/Character';

export const CharacterRepository = {
  /** @returns {Promise<import('../../models/Character').CharacterPage>} */
  async getPage(page) {
    const json = await api.fetchCharactersPage(page);
    return {
      items: (json.results ?? []).map(characterFromApi),
      hasNext: Boolean(json.info?.next),
    };
  },

  /** @returns {Promise<import('../../models/Character').Character>} */
  async getById(id) {
    const json = await api.fetchCharacterById(id);
    return characterFromApi(json);
  },
};
