import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

/**
 * Нижняя шторка «Фото профиля»: галерея / камера / удалить.
 * Только отображение — что делать по нажатию, решает экран.
 */
export default function PhotoSourceSheet({ visible, hasPhoto, onGallery, onCamera, onRemove, onClose }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const Option = ({ icon, label, onPress, danger }) => (
    <TouchableOpacity style={styles.option} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.optionIcon}>{icon}</Text>
      <Text style={[styles.optionText, danger && { color: colors.error }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet}>
          <Text style={styles.title}>Фото профиля</Text>
          <Option icon="🖼" label="Выбрать из галереи" onPress={onGallery} />
          <Option icon="📷" label="Сделать фото" onPress={onCamera} />
          {hasPhoto && <Option icon="🗑" label="Удалить фото" onPress={onRemove} danger />}
          <TouchableOpacity style={styles.cancel} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.cancelText}>Отмена</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 32,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: 12,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    optionIcon: { fontSize: 22, width: 36 },
    optionText: { fontSize: 16, color: colors.textPrimary },
    cancel: { marginTop: 12, alignItems: 'center', paddingVertical: 12 },
    cancelText: { fontSize: 16, fontWeight: '600', color: colors.primary },
  });
