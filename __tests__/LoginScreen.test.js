
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import LoginScreen from '../screens/LoginScreen';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('LoginScreen', () => {
  let mockOnLogin;
  let mockNavigation;

  beforeEach(() => {
    mockOnLogin = jest.fn(() => Promise.resolve());
    mockNavigation = { reset: jest.fn(), navigate: jest.fn() };
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  // TC-A1. Рендер ключевых элементов формы
  it('renders email, name, password inputs and submit button correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} onLogin={mockOnLogin} />
    );

    expect(getByPlaceholderText('example@mail.com')).toBeTruthy();
    expect(getByPlaceholderText('Временно, без системы аккаунта')).toBeTruthy();
    expect(getByPlaceholderText('••••••••')).toBeTruthy();
    expect(getByText('Войти')).toBeTruthy();
    expect(getByText('Зарегистрироваться')).toBeTruthy();
  });

  // TC-A2. Основной сценарий: валидный submit → onLogin вызван
  //        с корректным объектом { userName, email, password }
  it('renders inputs correctly and handles submit', async () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} onLogin={mockOnLogin} />
    );

    fireEvent.changeText(
      getByPlaceholderText('example@mail.com'),
      'user@example.com'
    );
    fireEvent.changeText(
      getByPlaceholderText('Временно, без системы аккаунта'),
      'Иван'
    );
    fireEvent.changeText(
      getByPlaceholderText('••••••••'),
      'P@ssword123'
    );
    fireEvent.press(getByText('Войти'));

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledTimes(1);
      expect(mockOnLogin).toHaveBeenCalledWith({
        userName: 'Иван',
        email: 'user@example.com',
        password: 'P@ssword123',
      });
    });
  });

  // TC-A3. Негатив: пустой Email → Alert, onLogin не вызван
  it('shows alert and does not call onLogin when email is empty', async () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} onLogin={mockOnLogin} />
    );

    fireEvent.press(getByText('Войти'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Ошибка', 'Введите email');
    });
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  // TC-A4. Негатив: пустое имя → Alert, onLogin не вызван
  it('shows alert "Введите имя" when name is empty', async () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} onLogin={mockOnLogin} />
    );

    fireEvent.changeText(
      getByPlaceholderText('example@mail.com'),
      'user@example.com'
    );
    fireEvent.press(getByText('Войти'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Ошибка', 'Введите имя');
    });
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  // TC-A5. Негатив: пустой пароль → Alert, onLogin не вызван
  it('shows alert "Введите пароль" when password is empty', async () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} onLogin={mockOnLogin} />
    );

    fireEvent.changeText(
      getByPlaceholderText('example@mail.com'),
      'user@example.com'
    );
    fireEvent.changeText(
      getByPlaceholderText('Временно, без системы аккаунта'),
      'Иван'
    );
    fireEvent.press(getByText('Войти'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Ошибка', 'Введите пароль');
    });
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  // TC-A6. Тримминг пробелов перед вызовом onLogin
  it('trims whitespace from inputs before calling onLogin', async () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} onLogin={mockOnLogin} />
    );

    fireEvent.changeText(
      getByPlaceholderText('example@mail.com'),
      '  user@example.com  '
    );
    fireEvent.changeText(
      getByPlaceholderText('Временно, без системы аккаунта'),
      '  Иван  '
    );
    fireEvent.changeText(
      getByPlaceholderText('••••••••'),
      '  P@ssword123  '
    );
    fireEvent.press(getByText('Войти'));

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith({
        userName: 'Иван',
        email: 'user@example.com',
        password: 'P@ssword123',
      });
    });
  });

  // TC-A7. Переход на экран регистрации по кнопке
  it('navigates to Register screen on secondary button press', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} onLogin={mockOnLogin} />
    );

    fireEvent.press(getByText('Зарегистрироваться'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
  });
});