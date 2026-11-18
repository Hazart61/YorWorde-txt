import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  Image,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { useProfileViewModel } from '../../viewmodels/useProfileViewModel';
import ErrorView from '../components/ErrorView';
import PhotoSourceSheet from '../components/PhotoSourceSheet';
import { useAvatarViewModel } from '../../viewmodels/useAvatarViewModel';
import { PhotoSource, PickFailure } from '../../models/Permission';

const ICON_BELL = '🔔';
const ICON_PLUS = '➕';
const ICON_ARROW = '›';

export default function ProfileScreen({ userName, userEmail }) {
  const { isDark, colors } = useTheme();
  const vm = useProfileViewModel();
  const { load } = vm;
  // Видимость модального окна — чисто UI-состояние, остаётся во View.
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const openEditor = () => {
    vm.startEditAbout();
    setModalVisible(true);
  };

  const handleSaveAbout = async () => {
    const result = await vm.saveAbout();
    if (result.ok) {
      setModalVisible(false);
    } else {
      Alert.alert('Ошибка', result.error);
    }
  };

  // ---------- Фото профиля ----------
  const avatar = useAvatarViewModel();
  const [sheetVisible, setSheetVisible] = useState(false);

  const sourceName = (source) => (source === PhotoSource.CAMERA ? 'камере' : 'фото');

  /** Ветвления сценария разрешений: какой диалог показать по результату ViewModel. */
  const handlePickResult = (result) => {
    if (result.ok) return;

    switch (result.reason) {
      case PickFailure.CANCELED:
        return; // пользователь сам закрыл камеру/галерею

      case PickFailure.NEEDS_RATIONALE:
        // Ранее отказали — объясняем, зачем нужен доступ, и спрашиваем снова
        Alert.alert(
          result.source === PhotoSource.CAMERA ? 'Доступ к камере' : 'Доступ к фото',
          `Доступ к ${sourceName(result.source)} нужен, чтобы установить фото профиля.`,
          [
            { text: 'Отмена', style: 'cancel' },
            {
              text: 'Разрешить',
              onPress: async () => handlePickResult(await avatar.requestAndChoose(result.source)),
            },
          ]
        );
        return;

      case PickFailure.DENIED:
        if (result.source === PhotoSource.CAMERA) {
          // Камеру не дали — предлагаем альтернативу: галерею
          Alert.alert(
            'Доступ ограничен',
            'Без камеры не получится сделать снимок. Можно выбрать фото из галереи.',
            [
              { text: 'Отмена', style: 'cancel' },
              {
                text: 'В галерею',
                onPress: async () => handlePickResult(await avatar.choosePhoto(PhotoSource.GALLERY)),
              },
            ]
          );
        } else {
          Alert.alert('Доступ ограничен', 'Без доступа к фото нельзя выбрать аватар.');
        }
        return;

      case PickFailure.BLOCKED:
        // Отказ «навсегда» — повторный запрос не покажется, помогут только настройки
        Alert.alert(
          'Доступ запрещён',
          `Доступ к ${sourceName(result.source)} отключён. Включите его в настройках телефона.`,
          [
            { text: 'Отмена', style: 'cancel' },
            { text: 'Открыть настройки', onPress: () => Linking.openSettings() },
          ]
        );
        return;

      default:
        Alert.alert('Ошибка', result.error || 'Не удалось установить фото');
    }
  };

  const choose = async (source) => {
    setSheetVisible(false);
    handlePickResult(await avatar.choosePhoto(source));
  };

  const handleRemoveAvatar = async () => {
    setSheetVisible(false);
    const result = await avatar.removeAvatar();
    if (!result.ok) Alert.alert('Ошибка', result.error);
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => setSheetVisible(true)}
            activeOpacity={0.8}
            disabled={avatar.isBusy}
          >
            <View style={styles.avatar}>
              {avatar.avatarUri ? (
                <Image testID="avatar-image" source={{ uri: avatar.avatarUri }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>
                  {userName ? userName[0].toUpperCase() : '?'}
                </Text>
              )}
              {avatar.isBusy && (
                <View style={styles.avatarBusy}>
                  <ActivityIndicator color="#fff" />
                </View>
              )}
            </View>
            <View style={styles.avatarBadge}>
              <Text style={styles.avatarBadgeText}>📷</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.name}>{userName}</Text>
            {userEmail ? <Text style={styles.email}>{userEmail}</Text> : null}
            <Text style={styles.lastActive}>
              Был(а) в сети: Сегодня, 20:31
            </Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.subscribeBtn} activeOpacity={0.85}>
            <Text style={styles.subscribeText}>Подписаться</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Text style={styles.iconText}>{ICON_BELL}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Text style={styles.iconText}>{ICON_PLUS}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>О пользователе</Text>
            <TouchableOpacity
              onPress={openEditor}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.editLink}>Редактировать</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.aboutBox}>
            <Text style={styles.aboutText}>{vm.about}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Словари пользователя</Text>
          </View>

          {vm.isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 10 }} />
          ) : vm.isError ? (
            <ErrorView message={vm.error} onRetry={vm.load} />
          ) : vm.dictionaries.length === 0 ? (
            <Text style={styles.emptyText}>Словарей пока нет</Text>
          ) : (
            vm.dictionaries.map((dict) => (
              <TouchableOpacity
                key={dict.id}
                style={styles.dictionaryCard}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.dictIcon,
                    { backgroundColor: dict.color || colors.primary },
                  ]}
                >
                  <Text style={styles.dictEmoji}>{dict.emoji || '❐'}</Text>
                </View>
                <View style={styles.dictInfo}>
                  <Text style={styles.dictTitle}>{dict.title}</Text>
                  <Text style={styles.dictMeta}>{dict.wordCount} слов</Text>
                </View>
                <Text style={styles.chevron}>{ICON_ARROW}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>О пользователе</Text>
            <TextInput
              style={styles.modalInput}
              multiline
              textAlignVertical="top"
              value={vm.aboutDraft}
              onChangeText={vm.setAboutDraft}
              placeholder="Расскажите о себе..."
              placeholderTextColor={colors.textDisabled}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalSaveBtn, vm.isSavingAbout && { opacity: 0.6 }]}
                onPress={handleSaveAbout}
                disabled={vm.isSavingAbout}
              >
                <Text style={styles.modalSaveText}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <PhotoSourceSheet
        visible={sheetVisible}
        hasPhoto={avatar.hasAvatar}
        onGallery={() => choose(PhotoSource.GALLERY)}
        onCamera={() => choose(PhotoSource.CAMERA)}
        onRemove={handleRemoveAvatar}
        onClose={() => setSheetVisible(false)}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    marginBottom: 16,
  },
  avatarContainer: { marginRight: 16 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  avatarImage: { width: '100%', height: '100%', borderRadius: 40 },
  avatarBusy: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  avatarBadgeText: { fontSize: 14 },
  headerInfo: { flex: 1 },
  name: { fontSize: 24, fontWeight: 'bold', color: colors.textPrimary },
  email: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  lastActive: { fontSize: 12, color: colors.textDisabled, marginTop: 4 },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  subscribeBtn: {
    flex: 1,
    height: 44,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  subscribeText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  iconText: { fontSize: 20 },

  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  editLink: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  aboutBox: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
  },

  dictionaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 1,
  },
  dictIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dictEmoji: { fontSize: 20 },
  dictInfo: { flex: 1 },
  dictTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  dictMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  chevron: { fontSize: 22, color: colors.textDisabled },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.textPrimary,
    minHeight: 120,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtn: {
    backgroundColor: colors.inputBg,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalCancelText: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  modalSaveBtn: { backgroundColor: colors.primary },
  modalSaveText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});
