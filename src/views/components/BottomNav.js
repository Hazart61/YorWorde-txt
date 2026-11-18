import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationBar } from 'expo-navigation-bar';
import { useTheme } from '../../theme/ThemeContext';

const ICONS = {
  my: '📚',
  all: '🔍',
  profile: '👤',
  settings: '⚙️',
};

export default function BottomNav({ tabs, activeKey, onTabPress }) {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();

  const styles = createStyles(colors, insets);

  return (
    <View style={styles.bar}>
      {/* Цвет кнопок системной панели навигации (Android).
          В expo-navigation-bar 57 нет setBackgroundColorAsync/setButtonStyleAsync —
          их вызов и давал «undefined is not a function». */}
      {Platform.OS === 'android' && <NavigationBar style={isDark ? 'dark' : 'light'} />}
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => onTabPress(tab.key)}
          >
            <Text style={[styles.icon, isActive && styles.iconActive]}>
              {ICONS[tab.key]}
            </Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (colors, insets) => StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 8,
    // Добавляем отступ снизу, чтобы контент не перекрывался системными кнопками
    paddingBottom: 8 + insets.bottom,
    paddingHorizontal: 4,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 22, marginBottom: 2, opacity: 0.45 },
  iconActive: { opacity: 1 },
  label: { fontSize: 11, color: colors.textSecondary },
  labelActive: { color: colors.primary, fontWeight: '600' },
});