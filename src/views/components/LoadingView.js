import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

/** Состояние Loading. */
export default function LoadingView({ size = 'large', style }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.box, style]} testID="loading-view">
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
});
