// Источник данных: сеть (Rick and Morty API).
const BASE_URL = 'https://rickandmortyapi.com/api';

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return await res.json();
}

/** @returns {Promise<{ info: { next: string | null }, results: object[] }>} */
export function fetchCharactersPage(page) {
  return request(`/character?page=${page}`);
}

export function fetchCharacterById(id) {
  return request(`/character/${id}`);
}
