import { useState } from 'react';
import { AuthRepository } from '../data/repositories/AuthRepository';
import { ok, fail } from '../models/LoadState';

/** ViewModel экрана регистрации. */
export function useRegisterViewModel({ register = AuthRepository.register } = {}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const validate = () => {
    if (!name.trim()) return 'Введите логин';
    if (!email.trim()) return 'Введите email';
    if (password !== confirmPassword) return 'Пароли не совпадают';
    return null;
  };

  const submit = async () => {
    if (!agree) return fail(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return fail(validationError);
    }

    setSubmitting(true);
    setError(null);
    try {
      const user = await register({ name: name.trim(), email: email.trim(), password });
      return ok(user);
    } catch (e) {
      console.warn('Ошибка сохранения сессии:', e);
      const message = 'Не удалось сохранить данные';
      setError(message);
      return fail(message);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    toggleShowPassword: () => setShowPassword((v) => !v),
    showConfirm,
    toggleShowConfirm: () => setShowConfirm((v) => !v),
    agree,
    toggleAgree: () => setAgree((v) => !v),
    canSubmit: agree && !isSubmitting,
    isSubmitting,
    error,
    submit,
  };
}
