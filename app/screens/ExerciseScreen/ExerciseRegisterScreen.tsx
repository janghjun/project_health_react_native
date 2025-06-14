import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useExercise } from '../../context/ExerciseContext';
import { logNotification } from '../../utils/logNotification';
import uuid from 'react-native-uuid';

export default function ExerciseRegisterScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    addRecord,
    addFavoriteExercise,
    removeFavoriteExercise,
    favoriteExercises,
  } = useExercise();

  const [form, setForm] = useState({
    name: '',
    part: '가슴',
    sets: '',
    reps: '',
    weight: '',
    duration: '',
  });

  const partList = ['가슴', '등', '하체', '어깨', '복근', '유산소'];
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const selected = route.params?.prefill || route.params?.selectedExercise;
    if (selected) {
      setForm({
        name: selected.name || '',
        part: selected.part && partList.includes(selected.part) ? selected.part : '가슴',
        sets: selected.sets || '',
        reps: selected.reps || '',
        weight: selected.weight || '',
        duration: selected.duration?.toString() || '',
      });

      const isFav = favoriteExercises.some((f) => f.name === selected.name);
      setFavorite(isFav);
    }
  }, [route.params, favoriteExercises]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleFavorite = () => {
    if (!form.name.trim()) {
      Alert.alert('오류', '운동명을 입력한 후 즐겨찾기를 설정할 수 있습니다.');
      return;
    }

    if (favorite) {
      removeFavoriteExercise(form.name);
    } else {
      addFavoriteExercise({
        id: uuid.v4().toString(),
        name: form.name.trim(),
        part: form.part,
        duration: parseFloat(form.duration) || 0,
      });
    }

    setFavorite(!favorite);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.duration.trim()) {
      Alert.alert('입력 오류', '운동명과 시간을 모두 입력해주세요.');
      return;
    }

    const dateKey = new Date().toISOString().split('T')[0];
    const item = {
      id: uuid.v4().toString(),
      name: form.name.trim(),
      part: form.part,
      sets: form.sets,
      reps: form.reps,
      weight: form.weight,
      duration: parseFloat(form.duration),
      date: dateKey,
    };

    try {
      await addRecord(item);

      if (item.duration > 0) {
        await logNotification({
          title: `${item.name} 운동 알림`,
          date: dateKey,
          time: '18:00',
          type: '운동',
        });
      }

      Alert.alert('등록 완료', '운동이 등록되었습니다.');
      navigation.navigate('ExerciseHome');
    } catch (e) {
      console.error('등록 실패:', e);
      Alert.alert('오류', '등록에 실패했습니다.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>운동 기록 입력</Text>
          <TouchableOpacity onPress={toggleFavorite} style={{ marginLeft: 'auto' }}>
            <Image
              source={
                favorite
                  ? require('../../assets/images/star_filled.png')
                  : require('../../assets/images/star_empty.png')
              }
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        </View>

        {[
          { label: '운동명 *', key: 'name', placeholder: '예: 벤치프레스' },
          { label: '세트 수', key: 'sets', placeholder: '예: 3' },
          { label: '반복 수', key: 'reps', placeholder: '예: 10' },
          { label: '중량 (kg)', key: 'weight', placeholder: '예: 40' },
          { label: '운동 시간 (분) *', key: 'duration', placeholder: '예: 30' },
        ].map(({ label, key, placeholder }) => (
          <View key={key} style={styles.group}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={styles.input}
              value={form[key]}
              onChangeText={(v) => handleChange(key, v)}
              placeholder={placeholder}
              keyboardType={['sets', 'reps', 'weight', 'duration'].includes(key) ? 'numeric' : 'default'}
            />
          </View>
        ))}

        <View style={styles.group}>
          <Text style={styles.label}>운동 부위</Text>
          <View style={styles.row}>
            {partList.map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.chip, form.part === p && styles.chipSelected]}
                onPress={() => handleChange('part', p)}
              >
                <Text style={form.part === p ? styles.chipTextSelected : styles.chipText}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
          <Text style={styles.saveText}>저장하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backBtn: { fontSize: 22, marginRight: 12, color: '#2563eb' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold' },
  group: { marginBottom: 16 },
  label: { marginBottom: 4, fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: { backgroundColor: '#60a5fa' },
  chipText: { color: '#333' },
  chipTextSelected: { color: '#fff', fontWeight: 'bold' },
  saveBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});