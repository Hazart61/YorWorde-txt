// Тест View: экран профиля показывает нужные диалоги по веткам разрешений.
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert, Linking } from 'react-native';
import ProfileScreen from '../src/views/screens/ProfileScreen';
import { MediaRepository } from '../src/data/repositories/MediaRepository';
import { PermissionState } from '../src/models/Permission';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('../src/data/local/database', () => ({}));
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (cb) => require('react').useEffect(cb, [cb]),
}));
jest.mock('../src/data/repositories/ProfileRepository', () => ({
  ProfileRepository: { getAbout: jest.fn(async () => 'О себе'), saveAbout: jest.fn() },
}));
jest.mock('../src/data/repositories/DictionaryRepository', () => ({
  DictionaryRepository: { getAll: jest.fn(async () => []) },
}));
jest.mock('../src/data/repositories/AvatarRepository', () => ({
  AvatarRepository: {
    getAvatar: jest.fn(async () => null),
    saveAvatar: jest.fn(async (uri) => uri),
    removeAvatar: jest.fn(),
  },
}));
jest.mock('../src/data/repositories/MediaRepository', () => ({
  MediaRepository: { checkPermission: jest.fn(), requestPermission: jest.fn(), pickImage: jest.fn() },
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

const openSheet = async () => {
  const screen = render(<ProfileScreen userName="Hazart" userEmail="a@b.c" />);
  await waitFor(() => screen.getByText('О себе'));
  fireEvent.press(screen.getByText('📷'));
  return screen;
};

it('нажатие на аватар открывает выбор источника', async () => {
  const screen = await openSheet();
  expect(screen.getByText('Выбрать из галереи')).toBeTruthy();
  expect(screen.getByText('Сделать фото')).toBeTruthy();
});

it('BLOCKED: диалог с кнопкой «Открыть настройки»', async () => {
  MediaRepository.checkPermission.mockResolvedValue(PermissionState.BLOCKED);
  const openSettings = jest.spyOn(Linking, 'openSettings').mockResolvedValue();
  const screen = await openSheet();

  fireEvent.press(screen.getByText('Сделать фото'));

  await waitFor(() => expect(Alert.alert).toHaveBeenCalled());
  const [title, , buttons] = Alert.alert.mock.calls[0];
  expect(title).toBe('Доступ запрещён');
  buttons.find((b) => b.text === 'Открыть настройки').onPress();
  expect(openSettings).toHaveBeenCalled();
});

it('отказ в камере: предлагает галерею', async () => {
  MediaRepository.checkPermission.mockResolvedValue(PermissionState.UNDETERMINED);
  MediaRepository.requestPermission.mockResolvedValue(PermissionState.DENIED);
  const screen = await openSheet();

  fireEvent.press(screen.getByText('Сделать фото'));

  await waitFor(() => expect(Alert.alert).toHaveBeenCalled());
  const [title, , buttons] = Alert.alert.mock.calls[0];
  expect(title).toBe('Доступ ограничен');
  expect(buttons.map((b) => b.text)).toContain('В галерею');
});

it('разрешено: фото появляется вместо буквы', async () => {
  MediaRepository.checkPermission.mockResolvedValue(PermissionState.GRANTED);
  MediaRepository.pickImage.mockResolvedValue('file:///docs/me.jpg');
  const screen = await openSheet();

  fireEvent.press(screen.getByText('Выбрать из галереи'));

  const image = await waitFor(() => screen.getByTestId('avatar-image'));
  expect(image.props.source).toEqual({ uri: 'file:///docs/me.jpg' });
  expect(screen.queryByText('H')).toBeNull();
  expect(Alert.alert).not.toHaveBeenCalled();
});
