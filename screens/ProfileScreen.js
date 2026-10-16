import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';

export default function ProfileScreen({ userName, userEmail }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.center}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userName ? userName[0].toUpperCase() : '?'}
          </Text>
        </View>
        <Text style={styles.name}>{userName}</Text>
        {userEmail ? <Text style={styles.email}>{userEmail}</Text> : null}
        <Text style={styles.hint}>Профиль будет дополнен в следующих работах.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
  name: { fontSize: 22, fontWeight: 'bold', color: colors.textPrimary },
  email: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  hint: { fontSize: 13, color: colors.textDisabled, marginTop: 24, textAlign: 'center' },
});