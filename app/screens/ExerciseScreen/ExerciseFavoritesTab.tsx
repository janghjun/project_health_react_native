import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useExercise } from '../../context/ExerciseContext';

export default function ExerciseFavoritesTab() {
  const navigation = useNavigation();
  const {
    favoriteExercises,
    removeFavoriteExercise,
  } = useExercise();

  const handleNavigateToRegister = (item) => {
    if (!item.name || !item.part) {
      Alert.alert('이동 실패', '운동 정보가 불완전합니다.');
      return;
    }

    navigation.navigate('ExerciseRegisterScreen', {
      prefill: {
        name: item.name,
        part: item.part,
        sets: '',
        reps: '',
        weight: '',
        duration: item.duration?.toString() || '',
      },
    });
  };

  const handleDelete = (item) => {
    Alert.alert('즐겨찾기 삭제', `'${item.name}'을(를) 즐겨찾기에서 삭제할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => removeFavoriteExercise(item.id || item.name),
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name || '이름 없음'}</Text>
        <Text style={styles.detail}>부위: {item.part || '미정'}</Text>
        <Text style={styles.detail}>추천 시간: {item.duration || 0}분</Text>
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.addBtn} onPress={() => handleNavigateToRegister(item)}>
            <Text style={styles.btnText}>+ 등록</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.delBtn} onPress={() => handleDelete(item)}>
            <Text style={styles.btnText}>삭제</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {favoriteExercises.length === 0 ? (
        <Text style={styles.emptyText}>즐겨찾기한 운동이 없습니다</Text>
      ) : (
        <FlatList
          data={favoriteExercises}
          keyExtractor={(item) => item.id?.toString() || item.name}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FB',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: '#666',
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  addBtn: {
    backgroundColor: '#2678E4',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  delBtn: {
    backgroundColor: '#F05636',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  btnText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
    color: '#888',
  },
});