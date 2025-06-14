import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDiet } from '../../context/DietContext';
import { logNotification } from '../../utils/logNotification';

export default function FoodRegisterScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { addFood } = useDiet();

  const { params } = useRoute();
  const preset = (params && 'food' in params) ? params.food : {};

  const [name, setName] = useState(preset.name || '');
  const [time, setTime] = useState(preset.time || '아침');
  const [weight, setWeight] = useState(preset.weight || '');
  const [kcal, setKcal] = useState(preset.kcal || '');
  const [carb, setCarb] = useState(preset.carb || '');
  const [protein, setProtein] = useState(preset.protein || '');
  const [fat, setFat] = useState(preset.fat || '');
  const [sodium, setSodium] = useState(preset.sodium || '');

  const timeOptions = ['아침', '점심', '저녁', '간식'];

  const handleSubmit = async () => {
    if (!name || !weight || !kcal) {
      ToastAndroid.show('이름/중량/칼로리는 필수입니다.', ToastAndroid.SHORT);
      return;
    }
    try {
      await addFood({ name, weight, kcal, carb, protein, fat, sodium, time });
      await logNotification({
        title: `${name} 식단 알림`,
        date: new Date().toISOString().split('T')[0],
        time,
        type: '식단',
      });
      ToastAndroid.show('음식이 저장되었습니다.', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (e) {
      ToastAndroid.show('저장에 실패했습니다.', ToastAndroid.SHORT);
    }
  };

  const inputProps = { keyboardType: 'numeric', style: [styles.input, styles.right] };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>음식 이름</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="예: 밥" />

      <Text style={styles.label}>시간대</Text>
      <View style={styles.row}>
        {timeOptions.map((t) => (
          <TouchableOpacity key={t} onPress={() => setTime(t)} style={[styles.option, time === t && styles.selected]}>
            <Text>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>중량 (g)</Text>
      <TextInput value={weight} onChangeText={setWeight} {...inputProps} placeholder="예: 210" />

      <Text style={styles.label}>칼로리 (kcal)</Text>
      <TextInput value={kcal} onChangeText={setKcal} {...inputProps} placeholder="예: 315" />

      <Text style={styles.label}>탄수화물 (g)</Text>
      <TextInput value={carb} onChangeText={setCarb} {...inputProps} />

      <Text style={styles.label}>단백질 (g)</Text>
      <TextInput value={protein} onChangeText={setProtein} {...inputProps} />

      <Text style={styles.label}>지방 (g)</Text>
      <TextInput value={fat} onChangeText={setFat} {...inputProps} />

      <Text style={styles.label}>나트륨 (mg)</Text>
      <TextInput value={sodium} onChangeText={setSodium} {...inputProps} />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>저장하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginTop: 5,
  },
  right: { textAlign: 'right' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    marginRight: 10,
    marginTop: 5,
  },
  selected: {
    backgroundColor: '#cdeffd',
    borderColor: '#57c',
  },
  button: {
    backgroundColor: '#57c',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});