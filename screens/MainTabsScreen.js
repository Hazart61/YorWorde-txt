import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import BottomNav from '../components/BottomNav';
import MyDictionariesScreen from './MyDictionariesScreen';
import DictionariesScreen from './DictionariesScreen';
import ProfileScreen from './ProfileScreen';
import SettingsScreen from './SettingsScreen';

const TABS = [
  { key: 'my', label: 'Мои словари' },
  { key: 'all', label: 'Словари' },
  { key: 'profile', label: 'Профиль' },
  { key: 'settings', label: 'Настройки' },
];

export default function MainTabsScreen({ route, navigation }) {
  const [activeTab, setActiveTab] = useState('my');

  const userName = route.params?.userName ?? 'Гость';
  const userEmail = route.params?.userEmail ?? '';

  const renderScreen = () => {
    switch (activeTab) {
      case 'my':
        return (
          <MyDictionariesScreen
            userName={userName}
            navigation={navigation}
            onLogout={() =>
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
            }
          />
        );
      case 'all':
        return <DictionariesScreen />;
      case 'profile':
        return <ProfileScreen userName={userName} userEmail={userEmail} />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>{renderScreen()}</View>
      <BottomNav tabs={TABS} activeKey={activeTab} onTabPress={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
