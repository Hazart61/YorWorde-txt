// View: галерея персонажей. Загрузка и пагинация — в useGalleryViewModel.
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { useGalleryViewModel } from '../../viewmodels/useGalleryViewModel';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 30;

export default function GalleryScreen({ navigation }) {
  const vm = useGalleryViewModel();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('CharacterDetail', { id: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardTextWrapper}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (vm.isLoading) return <LoadingView style={styles.loader} />;
    if (vm.isError) return <ErrorView message={vm.error} onRetry={vm.retry} />;
    return (
      <FlatList
        data={vm.characters}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Назад</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Галерея Rick & Morty</Text>
      </View>

      {renderContent()}

      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.pageBtn, !vm.canGoBack && styles.pageBtnDisabled]}
          onPress={vm.prevPage}
          disabled={!vm.canGoBack}
        >
          <Text style={styles.pageBtnText}>← Назад</Text>
        </TouchableOpacity>

        <Text style={styles.pageNumber}>Стр. {vm.page}</Text>

        <TouchableOpacity
          style={[styles.pageBtn, !vm.canGoForward && styles.pageBtnDisabled]}
          onPress={vm.nextPage}
          disabled={!vm.canGoForward}
        >
          <Text style={styles.pageBtnText}>Вперед →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backBtn: { marginBottom: 8 },
  backText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.textPrimary },
  
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 15, paddingBottom: 20 },
  row: { justifyContent: 'space-between', marginBottom: 15 },
  
  card: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  image: { width: '100%', height: cardWidth },
  cardTextWrapper: { padding: 10, alignItems: 'center' },
  name: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  pageBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  pageBtnDisabled: { backgroundColor: colors.textDisabled },
  pageBtnText: { color: '#fff', fontWeight: '600' },
  pageNumber: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary },
});