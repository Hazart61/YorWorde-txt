/**
 * Персонаж из Rick and Morty API.
 * @typedef {Object} Character
 * @property {number} id
 * @property {string} name
 * @property {string} image
 * @property {string} status
 * @property {string} species
 * @property {string} gender
 * @property {string} location
 */

/** Преобразует ответ API в сущность Character. */
export function characterFromApi(json) {
  return {
    id: json.id,
    name: json.name,
    image: json.image,
    status: json.status,
    species: json.species,
    gender: json.gender,
    location: json.location?.name ?? '—',
  };
}

/**
 * @typedef {Object} CharacterPage
 * @property {Character[]} items
 * @property {boolean} hasNext
 */
