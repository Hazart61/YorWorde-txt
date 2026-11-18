import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

/** Состояние Error: сообщение и кнопка «Повторить». */
export default function ErrorView({ message, onRetry, style }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.box, style]} testID="error-view">
      <Text style={styles.emoji}>⚠️</Text>
      <Text style={[styles.text, { color: colors.textPrimary }]}>
        {message || 'Что-то пошло не так'}
      </Text>
      {onRetry ? (
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.primary }]}
          onPress={onRetry}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Повторить</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emoji: { fontSize: 36, marginBottom: 12 },
  text: { fontSize: 16, textAlign: 'center', marginBottom: 16 },
  btn: { paddingHorizontal: 24, height: 44, borderRadius: 12, justifyContent: 'center' },
  btnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
