// Тесты сценария разрешений для фото профиля (useAvatarViewModel).
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAvatarViewModel } from '../src/viewmodels/useAvatarViewModel';
import { MediaRepository } from '../src/data/repositories/MediaRepository';
import { AvatarRepository } from '../src/data/repositories/AvatarRepository';
import { PermissionState, PhotoSource, PickFailure, permissionFromExpo } from '../src/models/Permission';

jest.mock('../src/data/repositories/MediaRepository', () => ({
  MediaRepository: { checkPermission: jest.fn(), requestPermission: jest.fn(), pickImage: jest.fn() },
}));
jest.mock('../src/data/repositories/AvatarRepository', () => ({
  AvatarRepository: { getAvatar: jest.fn(), saveAvatar: jest.fn(), removeAvatar: jest.fn() },
}));

const { GALLERY, CAMERA } = PhotoSource;

async function setup() {
  const hook = renderHook(() => useAvatarViewModel());
  await waitFor(() => expect(AvatarRepository.getAvatar).toHaveBeenCalled());
  return hook;
}

async function run(fn) {
  let res;
  await act(async () => {
    res = await fn();
  });
  return res;
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  AvatarRepository.getAvatar.mockResolvedValue(null);
  AvatarRepository.saveAvatar.mockImplementation(async (uri) => `saved:${uri}`);
  MediaRepository.pickImage.mockResolvedValue('file:///tmp/photo.jpg');
});

afterEach(() => console.warn.mockRestore());

describe('permissionFromExpo', () => {
  it('сводит ответ Expo к 4 состояниям', () => {
    expect(permissionFromExpo({ status: 'granted', granted: true })).toBe(PermissionState.GRANTED);
    expect(permissionFromExpo({ status: 'undetermined', canAskAgain: true })).toBe(PermissionState.UNDETERMINED);
    expect(permissionFromExpo({ status: 'denied', canAskAgain: true })).toBe(PermissionState.DENIED);
    expect(permissionFromExpo({ status: 'denied', canAskAgain: false })).toBe(PermissionState.BLOCKED);
  });
});

describe('useAvatarViewModel', () => {
  it('загружает сохранённый аватар при старте', async () => {
    AvatarRepository.getAvatar.mockResolvedValue('file:///docs/avatar.jpg');
    const { result } = renderHook(() => useAvatarViewModel());
    await waitFor(() => expect(result.current.avatarUri).toBe('file:///docs/avatar.jpg'));
    expect(result.current.hasAvatar).toBe(true);
  });

  it('GRANTED: сразу открывает галерею и сохраняет фото', async () => {
    MediaRepository.checkPermission.mockResolvedValue(PermissionState.GRANTED);
    const { result } = await setup();

    const res = await run(() => result.current.choosePhoto(GALLERY));

    expect(MediaRepository.requestPermission).not.toHaveBeenCalled();
    expect(MediaRepository.pickImage).toHaveBeenCalledWith(GALLERY);
    expect(res.ok).toBe(true);
    expect(result.current.avatarUri).toBe('saved:file:///tmp/photo.jpg');
  });

  it('UNDETERMINED → пользователь разрешил: запрос и выбор фото', async () => {
    MediaRepository.checkPermission.mockResolvedValue(PermissionState.UNDETERMINED);
    MediaRepository.requestPermission.mockResolvedValue(PermissionState.GRANTED);
    const { result } = await setup();

    const res = await run(() => result.current.choosePhoto(CAMERA));

    expect(MediaRepository.requestPermission).toHaveBeenCalledWith(CAMERA);
    expect(MediaRepository.pickImage).toHaveBeenCalledWith(CAMERA);
    expect(res.ok).toBe(true);
  });

  it('UNDETERMINED → пользователь отказал: DENIED, камера не открывается', async () => {
    MediaRepository.checkPermission.mockResolvedValue(PermissionState.UNDETERMINED);
    MediaRepository.requestPermission.mockResolvedValue(PermissionState.DENIED);
    const { result } = await setup();

    const res = await run(() => result.current.choosePhoto(CAMERA));

    expect(res).toMatchObject({ ok: false, reason: PickFailure.DENIED, source: CAMERA });
    expect(MediaRepository.pickImage).not.toHaveBeenCalled();
  });

  it('DENIED ранее: просит показать пояснение, без системного запроса', async () => {
    MediaRepository.checkPermission.mockResolvedValue(PermissionState.DENIED);
    const { result } = await setup();

    const res = await run(() => result.current.choosePhoto(GALLERY));

    expect(res.reason).toBe(PickFailure.NEEDS_RATIONALE);
    expect(MediaRepository.requestPermission).not.toHaveBeenCalled();
  });

  it('после пояснения requestAndChoose запрашивает разрешение и выбирает фото', async () => {
    MediaRepository.requestPermission.mockResolvedValue(PermissionState.GRANTED);
    const { result } = await setup();

    const res = await run(() => result.current.requestAndChoose(GALLERY));

    expect(res.ok).toBe(true);
    expect(MediaRepository.pickImage).toHaveBeenCalledWith(GALLERY);
  });

  it('BLOCKED: предлагает настройки, ничего не открывает', async () => {
    MediaRepository.checkPermission.mockResolvedValue(PermissionState.BLOCKED);
    const { result } = await setup();

    const res = await run(() => result.current.choosePhoto(CAMERA));

    expect(res.reason).toBe(PickFailure.BLOCKED);
    expect(MediaRepository.pickImage).not.toHaveBeenCalled();
  });

  it('отмена выбора не меняет аватар', async () => {
    MediaRepository.checkPermission.mockResolvedValue(PermissionState.GRANTED);
    MediaRepository.pickImage.mockResolvedValue(null);
    const { result } = await setup();

    const res = await run(() => result.current.choosePhoto(GALLERY));

    expect(res.reason).toBe(PickFailure.CANCELED);
    expect(AvatarRepository.saveAvatar).not.toHaveBeenCalled();
    expect(result.current.avatarUri).toBeNull();
  });

  it('ошибка сохранения → ERROR и isBusy сбрасывается', async () => {
    MediaRepository.checkPermission.mockResolvedValue(PermissionState.GRANTED);
    AvatarRepository.saveAvatar.mockRejectedValue(new Error('disk full'));
    const { result } = await setup();

    const res = await run(() => result.current.choosePhoto(GALLERY));

    expect(res).toMatchObject({ ok: false, reason: PickFailure.ERROR });
    expect(result.current.isBusy).toBe(false);
  });

  it('удаляет аватар', async () => {
    AvatarRepository.getAvatar.mockResolvedValue('file:///docs/a.jpg');
    const { result } = renderHook(() => useAvatarViewModel());
    await waitFor(() => expect(result.current.hasAvatar).toBe(true));

    const res = await run(() => result.current.removeAvatar());

    expect(res.ok).toBe(true);
    expect(result.current.avatarUri).toBeNull();
  });
});
