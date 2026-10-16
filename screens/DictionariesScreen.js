import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';

export default function DictionariesScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.center}>
        <Text style={styles.title}>Словари</Text>
        <Text style={styles.text}>
          Здесь будут публичные словари других пользователей.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 8 },
  text: { fontSize: 15, color: colors.textSecondary, textAlign: 'center' },
});