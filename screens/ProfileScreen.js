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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../styles/colors';
import { getAllDictionaries, getWordCountByDictionary } from '../db/database';

const ICON_BELL = '🔔';
const ICON_PLUS = '➕';
const ICON_ARROW = '›';

export default function ProfileScreen({ userName, userEmail }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [aboutText, setAboutText] = useState(
    "Ну это пока что тестовый вариает, хз че тут можно написать"
  );

  const [dictionaries, setDictionaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      (async () => {
        try {
          const list = await getAllDictionaries();
          const withCounts = await Promise.all(
            list.map(async (dict) => ({
              ...dict,
              wordCount: await getWordCountByDictionary(dict.id),
            }))
          );
          if (active) setDictionaries(withCounts);
        } catch (e) {
          console.warn('Ошибка загрузки словарей профиля:', e);
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  const totalWords = dictionaries.reduce((sum, d) => sum + d.wordCount, 0);
  const totalDictionaries = dictionaries.length;

  const handleSaveAbout = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userName ? userName[0].toUpperCase() : '?'}
              </Text>
            </View>
          </View>

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
              onPress={() => setModalVisible(true)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.editLink}>Редактировать</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.aboutBox}>
            <Text style={styles.aboutText}>{aboutText}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Словари пользователя</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 10 }} />
          ) : dictionaries.length === 0 ? (
            <Text style={styles.emptyText}>Словарей пока нет</Text>
          ) : (
            dictionaries.map((dict) => (
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
              value={aboutText}
              onChangeText={setAboutText}
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
                style={[styles.modalBtn, styles.modalSaveBtn]}
                onPress={handleSaveAbout}
              >
                <Text style={styles.modalSaveText}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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

  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: colors.primary },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: colors.divider, marginVertical: 4 },

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