import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';

const ICONS = {
  my: '📚',
  all: '🔍',
  profile: '👤',
  settings: '⚙️',
};

export default function BottomNav({ tabs, activeKey, onTabPress }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: 8 + insets.bottom }]}>
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

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 22, marginBottom: 2, opacity: 0.45 },
  iconActive: { opacity: 1 },
  label: { fontSize: 11, color: colors.textSecondary },
  labelActive: { color: colors.primary, fontWeight: '600' },
});