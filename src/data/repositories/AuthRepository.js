// Репозиторий авторизации и сессии пользователя.
// Изолирует AsyncStorage: ViewModel не знает, где хранится сессия.
import * as userStorage from '../local/userStorage';
import { createUser } from '../../models/User';

export const AuthRepository = {
  /**
   * Вход. Пока без сервера: просто сохраняем сессию локально.
   * @returns {Promise<import('../../models/User').User>}
   */
  async login({ userName, email }) {
    const user = createUser({ name: userName, email });
    await saveSession(user);
    return user;
  },

  /** Регистрация. Сейчас совпадает со входом (нет бэкенда). */
  async register({ name, email }) {
    const user = createUser({ name, email });
    await saveSession(user);
    return user;
  },

  /** Текущий пользователь или null, если сессии нет. */
  async getCurrentUser() {
    const loggedIn = await userStorage.isLoggedIn();
    if (!loggedIn) return null;
    const [name, email] = await Promise.all([
      userStorage.getNick(),
      userStorage.getEmail(),
    ]);
    return createUser({ name, email });
  },

  async logout() {
    await userStorage.logout();
  },
};

async function saveSession(user) {
  await userStorage.saveNick(user.name);
  await userStorage.saveEmail(user.email);
  await userStorage.setLoggedIn(true);
}
