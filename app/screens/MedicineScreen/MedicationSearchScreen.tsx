import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SearchMedicationTab from './SearchMedicationTab';
import FavoriteMedicationTab from './FavoriteMedicationTab';
import ManualMedicationTab from './ManualMedicationTab';

type TabKey = 'search' | 'favorite' | 'manual';

export default function MedicationSearchScreen() {
  const navigation = useNavigation();
  const [tab, setTab] = useState<TabKey>('search');

  const renderTab = () => {
    switch (tab) {
      case 'search':
        return <SearchMedicationTab />;
      case 'favorite':
        return <FavoriteMedicationTab />;
      case 'manual':
        return <ManualMedicationTab />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>복약 검색</Text>
        <View style={{ width: 24 }} /> {/* 우측 여백용 (아이콘 있을 경우 대체) */}
      </View>

      {/* 탭 */}
      <View style={styles.tabs}>
        {(['search', 'favorite', 'manual'] as TabKey[]).map((key) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, tab === key && styles.tabActive]}
            onPress={() => setTab(key)}
          >
            <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>
              {key === 'search' ? '검색' : key === 'favorite' ? '즐겨찾기' : '직접 등록'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 본문 탭 영역 */}
      <View style={styles.body}>{renderTab()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  back: {
    fontSize: 22,
    color: '#F05636',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#151515',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderColor: '#F05636',
  },
  tabText: {
    fontSize: 15,
    color: '#888',
  },
  tabTextActive: {
    fontWeight: 'bold',
    color: '#F05636',
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 30,
    backgroundColor: '#fff',
  },
});