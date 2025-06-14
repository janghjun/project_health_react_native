// 개선된 즐겨찾기 목록 불러오기 추가 예시
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function FavoriteMedicationTab() {
  const navigation = useNavigation();
  const route = useRoute();
  const [favorites, setFavorites] = useState([]);
  const passedTimeSlot = route.params?.timeSlot || '';

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const stored = await AsyncStorage.getItem('favoriteMeds');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('❌ 즐겨찾기 데이터 파싱 오류:', e);
        setFavorites([]);
      }
    }
  };

  const removeFavorite = async (name: string) => {
    const updated = favorites.filter(item => item.ITEM_NAME !== name);
    setFavorites(updated);
    await AsyncStorage.setItem('favoriteMeds', JSON.stringify(updated));
  };

  const handleRegister = (item) => {
    navigation.navigate('MedicationRegister', {
      selectedMedication: {
        name: item.ITEM_NAME || '',
        dosage: item.CHART || '',
        usage: item.ETC_OTC_NAME || '',
      },
      timeSlot: passedTimeSlot,
    });
  };

  const handleRemove = (item) => {
    Alert.alert(
      '즐겨찾기 삭제',
      `${item.ITEM_NAME}을(를) 즐겨찾기에서 삭제할까요?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => removeFavorite(item.ITEM_NAME),
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>즐겨찾기된 약이 없습니다.</Text>
      ) : (
        favorites.map((item, idx) => (
          <View key={idx} style={styles.card}>
            <Text style={styles.title}>{item.ITEM_NAME}</Text>
            <Text style={styles.meta}>{item.ETC_OTC_NAME}</Text>
            <Text style={styles.meta}>{item.ITEM_INGR_NAME}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.registerBtn} onPress={() => handleRegister(item)}>
                <Text style={styles.btnText}>선택 등록</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleRemove(item)}>
                <Text style={styles.btnText}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    backgroundColor: '#fff7f4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F05636',
  },
  title: { fontSize: 16, fontWeight: 'bold', color: '#151515' },
  meta: { fontSize: 14, color: '#555', marginTop: 6 },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 14,
    justifyContent: 'space-between',
  },
  registerBtn: {
    backgroundColor: '#2678E4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  deleteBtn: {
    backgroundColor: '#F05636',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 14,
  },
});