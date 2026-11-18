import { useState } from 'react';
import { AuthRepository } from '../data/repositories/AuthRepository';
import { createUser } from '../models/User';
import { ok, fail } from '../models/LoadState';

/**
 * ViewModel экрана входа.
 * @param {{ login?: (creds: {userName: string, email: string, password: string}) => Promise<any> }} deps
 *        login можно подменить (например, в тестах).
 */
export function useLoginViewModel({ login = AuthRepository.login } = {}) {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const validate = () => {
    if (!email.trim()) return 'Введите email';
    if (!userName.trim()) return 'Введите имя';
    if (!password.trim()) return 'Введите пароль';
    return null;
  };

  /** @returns {Promise<{ok: boolean, value: import('../models/User').User | null, error: string | null}>} */
  const submit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return fail(validationError);
    }

    const creds = {
      userName: userName.trim(),
      email: email.trim(),
      password: password.trim(),
    };

    setSubmitting(true);
    setError(null);
    try {
      const user = await login(creds);
      return ok(user ?? createUser({ name: creds.userName, email: creds.email }));
    } catch (e) {
      console.warn('Ошибка сохранения сессии:', e);
      const message = 'Не удалось сохранить данные входа';
      setError(message);
      return fail(message);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    userName,
    setUserName,
    password,
    setPassword,
    showPassword,
    toggleShowPassword: () => setShowPassword((v) => !v),
    isSubmitting,
    error,
    submit,
  };
}
