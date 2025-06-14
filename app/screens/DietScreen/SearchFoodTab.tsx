// SearchFoodTab.tsx (개선 버전)
import React, { useState, useEffect } from 'react';
import {
  View, TextInput, TouchableOpacity, Text,
  StyleSheet, ScrollView, Alert, ActivityIndicator, Image, Modal
} from 'react-native';
import { useDiet } from '../../context/DietContext';

const API_KEY = '5cWyKWHQGpmhdcKtwApnKT2BrSjLht330TRzM7cFG42eWPEKdkB7b1Z04QGpmSYWUt5T3cOjG6dHSj9V9LH6JQ%3D%3D';
const END_POINT = 'http://api.data.go.kr/openapi/tn_pubr_public_nutri_process_info_api';

import checkbox_checked from '../../assets/images/checkbox_checked.png';
import checkbox_unchecked from '../../assets/images/checkbox_unchecked.png';
import star_filled from '../../assets/images/star_filled.png';
import star_empty from '../../assets/images/star_empty.png';

export default function SearchFoodTab({ route }) {
  const { addFood, favoriteFoods, addFavoriteFood, removeFavoriteFood } = useDiet();
  const time = route?.params?.time || '아침';
  const date = route?.params?.date || new Date().toISOString().split('T')[0];

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [favoritesMap, setFavoritesMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [lastTap, setLastTap] = useState(null);

  useEffect(() => {
    const favMap = {};
    favoriteFoods.forEach((item) => {
      favMap[item.name] = true;
    });
    setFavoritesMap(favMap);
  }, [favoriteFoods]);

  const searchFood = async () => {
    try {
      setLoading(true);
      const url = `${END_POINT}?serviceKey=${API_KEY}&type=json&pageNo=1&numOfRows=5&foodNm=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      const json = await res.json();
      const items = json?.response?.body?.items || [];
      setResults(items);
    } catch (e) {
      console.error('API 검색 오류:', e);
      Alert.alert('검색 오류', '데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (idx) => {
    setSelectedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleFavorite = (item) => {
    if (favoritesMap[item.foodNm]) {
      removeFavoriteFood(item.foodNm);
    } else {
      const food = {
        name: item.foodNm,
        weight: '1인분',
        kcal: parseFloat(item.enerc || 0),
        carb: parseFloat(item.chocdf || 0),
        protein: parseFloat(item.prot || 0),
        fat: parseFloat(item.fatce || 0),
        sodium: parseFloat(item.nat || 0),
      };
      addFavoriteFood(food);
    }
  };

  const handleCardPress = (item) => {
    const now = Date.now();
    if (lastTap && now - lastTap < 300) {
      setDetailItem(item);
    }
    setLastTap(now);
  };

  const handleSubmit = () => {
    const selected = results.filter((_, i) => selectedItems[i]);
    if (selected.length === 0) {
      Alert.alert('선택된 항목이 없습니다.');
      return;
    }

    for (const item of selected) {
      const food = {
        name: item.foodNm,
        weight: '1인분',
        kcal: parseFloat(item.enerc || 0),
        carb: parseFloat(item.chocdf || 0),
        protein: parseFloat(item.prot || 0),
        fat: parseFloat(item.fatce || 0),
        sodium: parseFloat(item.nat || 0),
      };
      addFood(date, time, food);
    }

    Alert.alert('등록 완료', `${selected.length}개의 항목이 등록되었습니다.`);
    setResults([]);
    setSelectedItems({});
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="음식명을 입력하세요"
          placeholderTextColor="#aaa"
          style={styles.input}
        />
        <TouchableOpacity onPress={searchFood} style={styles.button}>
          <Text style={styles.buttonText}>검색</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.counterText}>선택된 항목: {Object.values(selectedItems).filter(Boolean).length}개</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : (
        results.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#999' }}>
            검색 결과가 없습니다.
          </Text>
        ) : (
          <ScrollView>
            {results.map((item, idx) => (
              <TouchableOpacity key={idx} onPress={() => handleCardPress(item)}>
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TouchableOpacity onPress={() => toggleFavorite(item)}>
                        <Image
                          source={favoritesMap[item.foodNm] ? star_filled : star_empty}
                          style={styles.starIcon}
                        />
                      </TouchableOpacity>
                      <Text style={styles.foodName} numberOfLines={1}>{item.foodNm}</Text>
                    </View>
                    <TouchableOpacity onPress={() => toggleSelect(idx)}>
                      <Image
                        source={selectedItems[idx] ? checkbox_checked : checkbox_unchecked}
                        style={styles.checkboxIcon}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.detail}>칼로리: {item.enerc || '-'} kcal</Text>
                  <Text style={styles.detail}>탄수화물: {item.chocdf || '-'} g</Text>
                  <Text style={styles.detail}>단백질: {item.prot || '-'} g</Text>
                  <Text style={styles.detail}>지방: {item.fatce || '-'} g</Text>
                  <Text style={styles.detail}>나트륨: {item.nat || '-'} mg</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )
      )}

      {Object.values(selectedItems).some(Boolean) && (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>선택한 음식 등록</Text>
        </TouchableOpacity>
      )}

      <Modal visible={!!detailItem} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.foodName}>{detailItem?.foodNm}</Text>
            <Text style={styles.detail}>칼로리: {detailItem?.enerc || '-'} kcal</Text>
            <Text style={styles.detail}>탄수화물: {detailItem?.chocdf || '-'} g</Text>
            <Text style={styles.detail}>단백질: {detailItem?.prot || '-'} g</Text>
            <Text style={styles.detail}>지방: {detailItem?.fatce || '-'} g</Text>
            <Text style={styles.detail}>나트륨: {detailItem?.nat || '-'} mg</Text>
            <TouchableOpacity onPress={() => setDetailItem(null)} style={styles.closeBtn}>
              <Text style={styles.submitText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  searchRow: { flexDirection: 'row', marginBottom: 16 },
  input: {
    flex: 1, borderWidth: 1, borderColor: '#ccc',
    borderRadius: 8, paddingHorizontal: 12, height: 44, fontSize: 15,
  },
  button: {
    backgroundColor: '#2563eb', paddingHorizontal: 16,
    justifyContent: 'center', borderRadius: 8, marginLeft: 8
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  counterText: { marginBottom: 8, color: '#444', fontSize: 14 },
  card: {
    backgroundColor: '#f9f9f9', borderRadius: 10, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: '#ddd'
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 4
  },
  foodName: { fontSize: 16, fontWeight: 'bold', marginLeft: 6, maxWidth: '80%' },
  detail: { fontSize: 14, color: '#555', marginTop: 2 },
  submitButton: {
    backgroundColor: '#f05636', padding: 16, borderRadius: 10,
    alignItems: 'center', marginTop: 10
  },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  checkboxIcon: { width: 22, height: 22 },
  starIcon: { width: 22, height: 22 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 24, borderRadius: 12, width: '80%' },
  closeBtn: { backgroundColor: '#2563eb', padding: 12, marginTop: 16, borderRadius: 8, alignItems: 'center' },
});