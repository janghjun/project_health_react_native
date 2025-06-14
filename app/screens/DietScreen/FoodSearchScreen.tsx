import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import SearchFoodTab from './SearchFoodTab';
import FavoriteFoodTab from './FavoriteFoodTab';
import ManualFoodTab from './ManualFoodTab';

export default function FoodSearchScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const time = route.params?.time || '아침';
  const [tab, setTab] = useState<'search' | 'favorite' | 'manual'>('search');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color="#FB6B5B" />
            <Text style={styles.backText}>홈</Text>
          </TouchableOpacity>
        </View>

        {/* 탭 */}
        <View style={styles.tabGroup}>
          {[
            { key: 'search', label: '검색' },
            { key: 'favorite', label: '즐겨찾기' },
            { key: 'manual', label: '직접입력' },
          ].map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tabBtn, tab === t.key && styles.activeTabBtn]}
              onPress={() => setTab(t.key as typeof tab)}
            >
              <Text style={tab === t.key ? styles.activeTabText : styles.tabText}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 탭 화면 */}
        {tab === 'search' && <SearchFoodTab time={time} />}
        {tab === 'favorite' && <FavoriteFoodTab time={time} />}
        {tab === 'manual' && <ManualFoodTab time={time} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16, // ← 일관된 텍스트 크기 적용
    marginLeft: 4,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  tabGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#EDEDED',
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTabBtn: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 15,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});