import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useExercise } from '../../context/ExerciseContext';
import starEmpty from '../../assets/images/star_empty.png';
import starFilled from '../../assets/images/star_filled.png';

const API_URL =
  'https://api.odcloud.kr/api/15068730/v1/uddi:2dd1a2cb-6030-48a2-980d-c31f0cc18b6c';
const SERVICE_KEY =
  '5cWyKWHQGpmhdcKtwApnKT2BrSjLht330TRzM7cFG42eWPEKdkB7b1Z04QGpmSYWUt5T3cOjG6dHSj9V9LH6JQ==';

export default function ExerciseSearchTab() {
  const navigation = useNavigation();
  const {
    favoriteExercises,
    addFavoriteExercise,
    removeFavoriteExercise,
  } = useExercise();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}?page=1&perPage=300&serviceKey=${encodeURIComponent(SERVICE_KEY)}`
      );
      const data = await res.json();
      const filtered = data.data.filter((item) =>
        item['운동명']?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } catch (e) {
      console.error('운동 검색 오류:', e);
      Alert.alert('오류', '검색 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (item) => {
    const selectedExercise = {
      name: item['운동명'],
      description: item['운동설명'] || '',
      met: parseFloat(item['MET계수']) || 1,
      part: '기타',
      duration: 30,
    };
    navigation.navigate('ExerciseRegisterScreen', { selectedExercise });
  };

  const toggleFavorite = (item) => {
    const exists = favoriteExercises.find((f) => f.name === item['운동명']);
    const data = {
      id: item['운동명'],
      name: item['운동명'],
      part: '기타',
      duration: 30,
      met: parseFloat(item['MET계수']) || 1,
      description: item['운동설명'] || '',
    };
    exists
      ? removeFavoriteExercise(data.id)
      : addFavoriteExercise(data);
  };

  const highlightMatch = (text = '') => {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <Text style={styles.name}>{text}</Text>;
    return (
      <Text style={styles.name}>
        {text.slice(0, idx)}
        <Text style={styles.highlight}>{text.slice(idx, idx + query.length)}</Text>
        {text.slice(idx + query.length)}
      </Text>
    );
  };

  const renderItem = ({ item }) => {
    const isFavorite = favoriteExercises.some((f) => f.name === item['운동명']);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          {highlightMatch(item['운동명'])}
          <TouchableOpacity onPress={() => toggleFavorite(item)}>
            <Image source={isFavorite ? starFilled : starEmpty} style={styles.starIcon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.category}>MET 계수: {item['MET계수'] || 'N/A'}</Text>
        <Text style={styles.description}>
          {(item['운동설명'] || '설명 없음').slice(0, 60)}...
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={() => handleRegister(item)}>
          <Text style={styles.addButtonText}>+ 등록하기</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        placeholder="운동명을 입력하세요"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#3A70FF" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, idx) => `${item['운동명']}_${idx}`}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>검색 결과가 없습니다.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  input: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#e0f2fe',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  starIcon: {
    width: 20,
    height: 20,
    tintColor: '#fbbf24',
  },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  highlight: { backgroundColor: '#fef08a', fontWeight: 'bold' },
  category: { fontSize: 14, color: '#2563eb', marginBottom: 4 },
  description: { fontSize: 13, color: '#555' },
  addButton: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 15,
  },
});