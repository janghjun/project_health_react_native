import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useExercise } from '../../context/ExerciseContext';

const checkbox_checked = require('../../assets/images/checkbox_checked.png');
const checkbox_unchecked = require('../../assets/images/checkbox_unchecked.png');
const star_filled = require('../../assets/images/star_filled.png');
const star_empty = require('../../assets/images/star_empty.png');

export default function ExerciseManualTab() {
  const navigation = useNavigation();
  const {
    manualExercises = [],
    favoriteExercises = [],
    setManualExercises,
    addFavoriteExercise,
    removeFavoriteExercise,
    addRecord,
  } = useExercise();

  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});

  const toggleSelect = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFavorite = (item: any) => {
    const isFavorite = favoriteExercises.some((f) => f.name === item.name);
    isFavorite ? removeFavoriteExercise(item.name) : addFavoriteExercise(item);
  };

  const handleRegisterSelected = async () => {
    const today = new Date().toISOString().split('T')[0];
    const selectedItems = manualExercises.filter((item) => selected[item.id]);
    if (selectedItems.length === 0) {
      Alert.alert('선택된 항목이 없습니다.');
      return;
    }

    try {
      for (const item of selectedItems) {
        await addRecord({
          id: Date.now().toString(),
          name: item.name,
          part: item.part,
          duration: item.duration,
          date: today,
        });
      }
      Alert.alert('등록 완료', `${selectedItems.length}개 항목이 오늘 운동으로 등록되었습니다.`);
      setSelected({});
    } catch (e) {
      console.error('등록 오류:', e);
      Alert.alert('오류', '운동 등록에 실패했습니다.');
    }
  };

  const handleDeleteSelected = () => {
    const selectedIds = Object.entries(selected)
      .filter(([_, v]) => v)
      .map(([id]) => id);

    if (selectedIds.length === 0) return;

    Alert.alert('삭제 확인', `${selectedIds.length}개의 항목을 삭제하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          const updated = manualExercises.filter((item) => !selected[item.id]);
          setManualExercises(updated);
          setSelected({});
        },
      },
    ]);
  };

  const selectedCount = Object.values(selected).filter(Boolean).length;

  const handleNavigate = () => {
    navigation.navigate('ExerciseRegisterScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>직접 입력한 운동을 선택해 바로 기록할 수 있어요.</Text>
      <TouchableOpacity style={styles.addBtn} onPress={handleNavigate}>
        <Text style={styles.addBtnText}>직접 등록하기</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {manualExercises.length === 0 ? (
          <Text style={styles.emptyText}>아직 등록된 운동이 없습니다.</Text>
        ) : (
          manualExercises.map((item) => {
            const isSelected = selected[item.id];
            const isFavorite = favoriteExercises.some((f) => f.name === item.name);
            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <TouchableOpacity onPress={() => toggleFavorite(item)}>
                    <Image source={isFavorite ? star_filled : star_empty} style={styles.starIcon} />
                  </TouchableOpacity>
                  <Text style={styles.exerciseName}>{item.name}</Text>
                  <TouchableOpacity onPress={() => toggleSelect(item.id)}>
                    <Image source={isSelected ? checkbox_checked : checkbox_unchecked} style={styles.checkboxIcon} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.detail}>운동 부위: <Text style={styles.bold}>{item.part}</Text></Text>
                <Text style={styles.detail}>추천 시간: {item.duration}분</Text>
              </View>
            );
          })
        )}
      </ScrollView>

      {selectedCount > 0 && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.registerBtn} onPress={handleRegisterSelected}>
            <Text style={styles.actionText}>선택한 운동 등록</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteSelected}>
            <Text style={styles.actionText}>선택한 운동 삭제</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },
  infoText: { fontSize: 15, color: '#555', textAlign: 'center', marginBottom: 20 },
  addBtn: {
    backgroundColor: '#2678E4', paddingVertical: 12, paddingHorizontal: 20,
    borderRadius: 8, alignSelf: 'center', marginBottom: 16,
  },
  addBtnText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  scrollContent: { paddingBottom: 100 },
  emptyText: { textAlign: 'center', fontSize: 14, color: '#999' },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    marginBottom: 14, borderWidth: 1, borderColor: '#ddd',
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8,
  },
  exerciseName: { fontSize: 16, fontWeight: 'bold', flex: 1, marginLeft: 6 },
  detail: { fontSize: 14, color: '#555', marginTop: 2 },
  bold: { fontWeight: 'bold', color: '#111' },
  checkboxIcon: { width: 22, height: 22 },
  starIcon: { width: 22, height: 22 },
  actionRow: {
    flexDirection: 'row', justifyContent: 'space-between', gap: 10,
    marginHorizontal: 10, marginTop: 10,
  },
  registerBtn: {
    flex: 1, backgroundColor: '#2563eb', padding: 14,
    borderRadius: 10, alignItems: 'center',
  },
  deleteBtn: {
    flex: 1, backgroundColor: '#F05636', padding: 14,
    borderRadius: 10, alignItems: 'center',
  },
  actionText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});