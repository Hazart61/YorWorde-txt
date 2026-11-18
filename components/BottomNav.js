import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { useTheme } from '../styles/ThemeContext';

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

  // Меняем цвет системной панели навигации (только Android)
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Устанавливаем цвет фона панели в цвет нашей темы
      NavigationBar.setBackgroundColorAsync(colors.surface);
      
      // Устанавливаем цвет кнопок (темные на светлой теме, светлые на темной)
      NavigationBar.setButtonStyleAsync(isDark ? 'light' : 'dark');
    }
  }, [isDark, colors.surface]);

  return (
    <View style={styles.bar}>
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