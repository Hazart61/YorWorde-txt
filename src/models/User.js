/**
 * @typedef {Object} User
 * @property {string} name
 * @property {string} email
 */

/** @returns {User} */
export function createUser({ name, email }) {
  return {
    name: (name ?? '').trim(),
    email: (email ?? '').trim(),
  };
}

export const GUEST = createUser({ name: 'Гость', email: '' });
